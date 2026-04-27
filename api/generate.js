// api/generate.js — Vercel Function (MVP version)
//
// Proxies frontend requests to Anthropic API, hiding the API key.
// Defense layers will be added incrementally:
//   ✓ Server-side proxy (key never reaches frontend)
//   - Rate limit via Upstash Redis (TODO: phase 6)
//   - Cloudflare Turnstile bot check (TODO: phase 7)
//   - Browser fingerprint (TODO: phase 6)
//
// Required environment variables (set in Vercel dashboard):
//   ANTHROPIC_API_KEY — your Anthropic key

export default async function handler(req, res) {
  // CORS for the frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system, max_tokens, model } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      console.error('ANTHROPIC_API_KEY not set in environment');
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
      return res.status(502).json({ error: 'upstream_failed', status: anthropicRes.status });
    }

    const data = await anthropicRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'internal', message: err.message });
  }
}