// Rhema's voice. Calls our own /api/tts proxy so the ElevenLabs API key stays
// server-side and never ships in the client bundle. The proxy runs as a Vercel
// Function in production and as Vite dev middleware locally (see vite.config.js).

/**
 * Synthesize speech for Rhema.
 * @param {string} text - what Rhema should say.
 * @param {object} [opts]
 * @param {'en'|'ko'|null} [opts.languageCode] - force a language; null = auto-detect
 *   (pure English → 'en', pure Korean → 'ko', mixed → null).
 * @returns {Promise<Blob>} audio blob (mpeg).
 */
export async function speak(text, opts = {}) {
  const { languageCode = null } = opts;

  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, languageCode }),
  });

  if (!res.ok) {
    throw new Error(`TTS request failed: ${res.status}`);
  }
  return res.blob();
}
