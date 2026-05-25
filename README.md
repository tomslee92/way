# Way

A premium, voice-coached Scripture memorization app for Korean and English
speaking adults. See [`Claude.md`](./Claude.md) for full product context.

> "I am the way, the truth, and the life." — John 14:6

## Stack

- **React 19** (plain `.js` files, `React.createElement` — no JSX)
- **Vite 6** dev server / bundler
- **Supabase** — auth, profiles, library, progress
- **ElevenLabs** — Rhema's text-to-speech voice
- **API.Bible** — Scripture lookup (ESV, NKRV 개역개정)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:5173
```

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the Vite dev server (HMR)   |
| `npm run build`   | Production build to `dist/`       |
| `npm run preview` | Preview the production build      |

## Environment

Keys live in `.env.local` (git-ignored). Secrets are **server-only** (no
`VITE_` prefix) and are read by the `/api` functions — never inlined into the
client bundle: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `API_BIBLE_KEY`.
Only `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are client-exposed, which is
safe by design. See `.env.example`. In Vercel, set the server-only keys per
environment (mark them Sensitive).

## API (serverless)

The browser never holds a third-party key. Client libs call same-origin proxies:

| Route            | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `POST /api/tts`  | ElevenLabs text-to-speech (Rhema's voice)|
| `GET /api/bible` | API.Bible passage lookup                 |

In production these run as Vercel Functions. Locally, `npm run dev` serves
`/api/tts` via Vite middleware; use `vercel dev` if you also need `/api/bible`.

## Deploy

Deployed on Vercel (project `way`) — production: **https://thewayapp.vercel.app**.
Redeploy with `vercel deploy --prod`.

## Project layout

```
api/
  tts.js                       POST /api/tts — ElevenLabs proxy
  bible.js                     GET  /api/bible — API.Bible proxy
  _elevenlabs.js               Shared TTS helper (+ dev middleware)
src/
  main.js                      App entry — mounts <App>
  App.js                       Landing screen (React.createElement)
  styles/index.css             Global theme (strict black & white)
  lib/
    supabase.js                Supabase client
    elevenlabs.js              Client → POST /api/tts
    bible.js                   Client → GET /api/bible
  features/
    memorization/              Session UI, hooks, fading method, scoring
  data/
    curriculum.js              Seed topic curricula
```
