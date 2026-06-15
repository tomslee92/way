import { synthesizeSpeech, voiceForLanguage } from './_elevenlabs.js';

// POST /api/tts  { text, languageCode } -> audio/mpeg
//
// Rhema's voice proxy. The ElevenLabs key stays server-side: set
// ELEVENLABS_API_KEY plus ELEVENLABS_VOICE_ID_EN / ELEVENLABS_VOICE_ID_KO (the
// per-language voices; legacy ELEVENLABS_VOICE_ID is the fallback) in the
// environment (NOT VITE_-prefixed, so they never reach the browser).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { text, languageCode = null } = req.body || {};
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Missing "text"' });
      return;
    }

    const audio = await synthesizeSpeech({
      text,
      languageCode,
      apiKey: process.env.ELEVENLABS_API_KEY,
      voiceId: voiceForLanguage(languageCode, process.env),
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(audio);
  } catch (err) {
    console.error('[api/tts]', err.message);
    res.status(502).json({ error: 'Text-to-speech failed' });
  }
}
