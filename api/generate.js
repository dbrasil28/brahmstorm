// api/generate.js — Vercel Function
// 
// All requests from the frontend go through here. This file:
//   1. Verifies Cloudflare Turnstile token (blocks bots)
//   2. Validates browser fingerprint
//   3. Rate-limits per IP+fingerprint via Upstash Redis (5/day)
//   4. Proxies the request to Anthropic API with the secret key
//   5. Returns response to frontend
//
// Required environment variables (set in Vercel dashboard):
//   ANTHROPIC_API_KEY        — your Anthropic key (NEVER expose to frontend)
//   UPSTASH_REDIS_REST_URL   — Upstash Redis URL
//   UPSTASH_REDIS_REST_TOKEN — Upstash Redis token
//   TURNSTILE_SECRET_KEY     — Cloudflare Turnstile secret
//   DAILY_LIMIT              — number of generations per day (default 5)

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || '5', 10);

// Helper: get client IP from various proxy headers Vercel forwards
function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    'unknown'
  );
}

// Helper: get current UTC date as YYYY-MM-DD (for daily reset at midnight UTC)
function getUTCDateKey() {
  return new Date().toISOString().slice(0, 10);
}

// Helper: verify Cloudflare Turnstile token
async function verifyTurnstile(token, ip) {
  if (!token) return { success: false, reason: 'missing-token' };
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('TURNSTILE_SECRET_KEY not set — skipping verification');
    return { success: true }; // graceful degradation in dev
  }
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return { success: !!data.success, reason: data['error-codes']?.[0] };
  } catch (e) {
    return { success: false, reason: 'verify-failed' };
  }
}

// Main handler
export default async function handler(req, res) {
  // CORS for the frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system, max_tokens, model, turnstileToken, fingerprint } = req.body || {};

    // ─── DEFENSE 1: Turnstile (block automated bots) ───
    const ip = getClientIP(req);
    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.success) {
      return res.status(403).json({ error: 'verification_failed', reason: turnstile.reason });
    }

    // ─── DEFENSE 2: Combined IP + fingerprint identifier ───
    // Fingerprint helps when many users share an IP (carrier-grade NAT, public wifi).
    // IP alone is too coarse, fingerprint alone is too forgiving — combined they're harder to rotate.
    const fp = (fingerprint || '').slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, '');
    const identityKey = fp ? `${ip}:${fp}` : ip;
    const dateKey = getUTCDateKey();
    const counterKey = `bs:gen:${dateKey}:${identityKey}`;

    // ─── DEFENSE 3: Rate limit via Upstash Redis ───
    const count = await redis.incr(counterKey);
    if (count === 1) {
      // First hit today — set expiry to ~25h to ensure midnight UTC rollover
      await redis.expire(counterKey, 25 * 60 * 60);
    }
    if (count > DAILY_LIMIT) {
      return res.status(429).json({
        error: 'daily_limit',
        limit: DAILY_LIMIT,
        used: count,
        message: `Daily limit reached (${DAILY_LIMIT}/day). Resets at midnight UTC.`,
      });
    }

    // ─── DEFENSE 4: Audit log (for spotting abuse later) ───
    const auditKey = `bs:audit:${dateKey}`;
    redis.hincrby(auditKey, identityKey, 1).catch(() => {}); // fire and forget
    redis.expire(auditKey, 7 * 24 * 60 * 60).catch(() => {}); // keep audit for 7 days

    // ─── Proxy to Anthropic ───
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return res.status(500).json({ error: 'server_misconfigured' });
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 1024,
        system,
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic error:', anthropicRes.status, errText);
      // Refund the counter — user shouldn't be charged for our failure
      await redis.decr(counterKey).catch(() => {});
      return res.status(502).json({ error: 'upstream_failed', status: anthropicRes.status });
    }

    const data = await anthropicRes.json();
    return res.status(200).json({
      ...data,
      _quota: { used: count, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - count },
    });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'internal', message: err.message });
  }
}
