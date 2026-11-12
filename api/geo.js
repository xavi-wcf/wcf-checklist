// Put this file at  api/geo.js  (next to your other functions).
// It only tells the browser which country the request comes from, as worked out by Vercel from the IP address.
// The IP is not read, logged or stored. Nothing is saved here: the app sends the 2-letter code to Supabase itself.
export const config = { runtime: 'edge' };

export default function handler(request) {
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();
  return new Response(JSON.stringify({ country }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      // never cache it: it differs for every visitor
      'cache-control': 'no-store, max-age=0',
    },
  });
}
