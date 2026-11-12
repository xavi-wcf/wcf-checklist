// Put this file at  api/catalogue.js  (next to your other functions).
// It serves the catalogue (the single wcf_data row) to the app, and lets Vercel's CDN keep a compressed copy close to
// each visitor for a minute: much faster than every device asking Supabase through the proxy, especially from far away.
// The app falls back to Supabase by itself if this isn't deployed or fails. The key below is the PUBLIC anon key the app
// already ships with (the catalogue is public to read); it is not a secret.
export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://odtcnomhpvxhgzbpaevh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AQN2HtfIBlrI8cmQYDZOuw_vaUyOL8u';

export default async function handler(request) {
  // ?t=... is used by the admin "Refresh" button to skip the cached copy
  const fresh = new URL(request.url).searchParams.has('t');
  try {
    const upstream = await fetch(`${SUPABASE_URL}/rest/v1/wcf_data?id=eq.main`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!upstream.ok) throw new Error('upstream ' + upstream.status);
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'content-type': 'application/json',
        // cached by the CDN for 60 s, then served while it refreshes in the background for up to 5 more minutes
        'cache-control': fresh ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'upstream' }), {
      status: 502,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
}
