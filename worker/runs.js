// Cloudflare Worker: the Glass & Gilt run log. Every finished match (web or Claude artifact) is POSTed here and kept in D1 for tuning.
// Write-only by design: nothing can be read back over HTTP. Analysis queries D1 directly (Cloudflare dashboard, wrangler or the D1 API).
// Deploy: Workers & Pages > Create > Import a repository > this repo, root directory "worker". The D1 binding comes from wrangler.toml.
const ORIGINS = ['https://mcgillpreston-glitch.github.io', 'https://claude.ai', 'https://www.claude.ai'];
const cors = req => {
  const o = req.headers.get('origin') || '';
  const ok = ORIGINS.includes(o) || /^https:\/\/[a-z0-9-]+\.claudeusercontent\.com$/.test(o) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o) || o === 'null';
  return {'access-control-allow-origin': ok ? (o || '*') : 'https://mcgillpreston-glitch.github.io', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type', 'vary': 'origin'};
};
const str = (v, n) => v == null ? null : String(v).slice(0, n);
export default {
  async fetch(req, env) {
    const H = cors(req);
    if (req.method === 'OPTIONS') return new Response(null, {headers: H});
    if (req.method !== 'POST') return new Response('Glass & Gilt run log: POST finished matches here.', {status: 405, headers: H});
    const text = await req.text();
    if (text.length > 400000) return new Response('too large', {status: 413, headers: H});
    let m; try { m = JSON.parse(text); } catch (e) { return new Response('bad json', {status: 400, headers: H}); }
    if (!m || typeof m.id !== 'string' || !/^[a-z0-9]{3,16}$/i.test(m.id)) return new Response('bad run', {status: 400, headers: H});
    if (!m.end || !Array.isArray(m.rounds) || !m.rounds.length) return new Response('only finished matches are logged', {status: 422, headers: H});
    // one row per match per device: the run id plus the device id keeps two players' copies of the same online match apart
    const key = str(m.dev || m.uid || 'anon', 40) + ':' + m.id;
    await env.DB.prepare('INSERT OR REPLACE INTO runs (id, uid, handle, ver, build, mode, diff, winner, side, rounds, src, t, body) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .bind(key, str(m.uid, 64), str(m.handle, 14), m.ver | 0, str(m.build, 32), str(m.mode, 12), str(m.diff, 8), Number.isInteger(m.end.winner) ? m.end.winner : null, m.side | 0, m.end.rounds | 0, str(m.src, 12), Date.now(), text).run();
    return new Response('ok', {headers: H});
  }
};
