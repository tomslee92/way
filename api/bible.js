// GET /api/bible?bibleId=...&passageId=...  -> API.Bible passage JSON
//
// Keeps the API.Bible key server-side: set API_BIBLE_KEY in the environment
// (NOT VITE_-prefixed). Not yet wired into the app (passages are seeded), but
// kept symmetrical with /api/tts so the key never lands in the client bundle.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.API_BIBLE_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'API.Bible not configured' });
    return;
  }

  const { bibleId, passageId } = req.query || {};
  if (!bibleId || !passageId) {
    res.status(400).json({ error: 'Missing bibleId or passageId' });
    return;
  }

  try {
    const url =
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}` +
      '?content-type=text&include-verse-numbers=false';
    const upstream = await fetch(url, { headers: { 'api-key': apiKey } });
    if (!upstream.ok) {
      res.status(502).json({ error: `API.Bible request failed: ${upstream.status}` });
      return;
    }
    const json = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).json(json.data);
  } catch (err) {
    console.error('[api/bible]', err.message);
    res.status(502).json({ error: 'Bible lookup failed' });
  }
}
