import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { synthesizeSpeech, voiceForLanguage } from './api/_elevenlabs.js';

// App.js and friends use React.createElement (no JSX), so .js files need no JSX
// transform. The React plugin is kept for Fast Refresh / HMR during dev.
//
// The dev-tts-proxy plugin mirrors the production /api/tts Vercel Function so
// `npm run dev` gets the real ElevenLabs voice without ever putting the API key
// in the client bundle. (For /api/bible locally, run `vercel dev`.)
export default defineConfig(({ mode }) => {
  // Load all vars (empty prefix), including the server-only, non-VITE_ secrets.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'dev-tts-proxy',
        configureServer(server) {
          server.middlewares.use('/api/tts', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method not allowed');
              return;
            }
            try {
              let body = '';
              for await (const chunk of req) body += chunk;
              const { text, languageCode = null } = JSON.parse(body || '{}');
              const audio = await synthesizeSpeech({
                text,
                languageCode,
                apiKey: env.ELEVENLABS_API_KEY,
                voiceId: voiceForLanguage(languageCode, env),
              });
              res.setHeader('Content-Type', 'audio/mpeg');
              res.end(audio);
            } catch (err) {
              res.statusCode = err.status && err.status >= 400 ? 502 : 500;
              res.end(JSON.stringify({ error: 'TTS error' }));
            }
          });
        },
      },
    ],
    server: {
      port: 5173,
      open: true,
    },
  };
});
