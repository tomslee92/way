// Shared server-side ElevenLabs call. Used by both the Vercel Function
// (api/tts.js) in production and the Vite dev middleware (vite.config.js)
// locally, so the API key only ever lives server-side — never in the client
// bundle. Files in /api prefixed with "_" are not turned into routes by Vercel.

export const RHEMA_VOICE_SETTINGS = {
  stability: 0.7,
  similarity_boost: 0.8,
  style: 0.0,
};

export async function synthesizeSpeech({ text, languageCode, apiKey, voiceId }) {
  if (!apiKey || !voiceId) {
    const err = new Error('ElevenLabs not configured (missing key or voice id)');
    err.status = 500;
    throw err;
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        // turbo_v2_5 (unlike multilingual_v2) honors language_code, so forcing
        // 'en'/'ko' actually sticks — otherwise the Korean-native voice leaks
        // Korean pronunciations into English text.
        model_id: 'eleven_turbo_v2_5',
        voice_settings: RHEMA_VOICE_SETTINGS,
        // Force the language when known; null = auto-detect (mixed segments).
        ...(languageCode ? { language_code: languageCode } : {}),
      }),
    }
  );

  if (!res.ok) {
    const err = new Error(`ElevenLabs TTS failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return Buffer.from(await res.arrayBuffer());
}
