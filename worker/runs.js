// Cloudflare Worker: receives match runs from Glass & Gilt and stores them in D1 for analysis.
// Deploy: wrangler d1 create bk-runs; wrangler d1 execute bk-runs --file=worker/schema.sql; wrangler deploy
// Then set RUN_ENDPOINT in index.html to the worker URL.
const CORS = {'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type'};
export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, {headers: CORS});
    if (req.method !== 'POST') return new Response('POST only', {status: 405, headers: CORS});
    const text = await req.text();
    if (text.length > 400000) return new Response('too large', {status: 413, headers: CORS});
    let m; try { m = JSON.parse(text); } catch (e) { return new Response('bad json', {status: 400, headers: CORS}); }
    if (!m || typeof m.id !== 'string' || m.id.length > 64) return new Response('bad run', {status: 400, headers: CORS});
    await env.DB.prepare('INSERT OR REPLACE INTO runs (id, uid, handle, ver, winner, rounds, t, body) VALUES (?,?,?,?,?,?,?,?)')
      .bind(m.id, m.uid || null, String(m.handle || '').slice(0, 14), m.ver | 0, m.end ? m.end.winner : null, m.end ? m.end.rounds : null, Date.now(), text).run();
    return new Response('ok', {headers: CORS});
  }
};
