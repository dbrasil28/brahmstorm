// api/generate.js — Vercel Function with Redis rate limit + owner bypass
//
// Defense layers:
//   ✓ Server-side proxy (key never reaches frontend)
//   ✓ Rate limit per IP via Upstash Redis (5/day, resets at midnight UTC)
//   ✓ Owner token bypass (your personal account skips the limit)

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || '5', 10);

function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    'unknown'
  );
}

function getUTCDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system, max_tokens, model, ownerToken } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const expectedOwnerToken = process.env.OWNER_TOKEN;
    const isOwner = expectedOwnerToken && ownerToken &&
      ownerToken.length === expectedOwnerToken.length &&
      ownerToken === expectedOwnerToken;

    let count = 0;
    const ip = getClientIP(req);
    const dateKey = getUTCDateKey();
    const counterKey = `bs:gen:${dateKey}:${ip}`;

    if (!isOwner) {
      count = await redis.incr(counterKey);
      if (count === 1) {
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
    }

    const auditKey = `bs:audit:${dateKey}`;
    const auditIp = isOwner ? `owner:${ip}` : ip;
    redis.hincrby(auditKey, auditIp, 1).catch(() => {});
    redis.expire(auditKey, 7 * 24 * 60 * 60).catch(() => {});

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      console.error('ANTHROPIC_API_KEY not set');
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
        model: model || 'claude-sonnet-4-5',
        max_tokens: max_tokens || 1024,
        system,
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic error:', anthropicRes.status, errText);
      if (!isOwner) {
        await redis.decr(counterKey).catch(() => {});
      }
      return res.status(502).json({ error: 'upstream_failed', status: anthropicRes.status });
    }

    const data = await anthropicRes.json();
    return res.status(200).json({
      ...data,
      _quota: isOwner
        ? { used: 0, limit: DAILY_LIMIT, remaining: DAILY_LIMIT, owner: true }
        : { used: count, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - count },
    });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'internal', message: err.message });
  }
}
