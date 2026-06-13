# CLAUDE.md — Way App Context

> This file is read automatically by Claude Code at the start of each new session. It contains everything a fresh Claude conversation needs to be immediately useful. Update it as priorities and architecture evolve.

---

## What Way is

Way is a premium Scripture memorization app for Korean and English speaking adults who want to take Scripture memorization seriously. The name comes from John 14:6 — "I am the way, the truth, and the life."

Way is a standalone product, separate from Wayve. It is a solo experience — no teacher layer, no groups. Just a user and the Word.

The theological foundation is denomination-neutral, with a focus on biblical theology that uses Scripture to interpret Scripture.

## Who the users are

- **Primary audience**: Korean and English speaking adults, high school age through 50s, who are personally motivated and proactive about Scripture memorization
- **Best-fit user**: someone who comes with intention — they know what they want to memorize and why
- **Tone preference**: warm, premium, spiritually serious. No childish gamification, no XP/levels, no leaderboards.
- **Language**: bilingual app — Korean (존댓말, no 님 on first names) and English
- **Default translations**: ESV (English), NKRV 개역개정 (Korean) — user-selectable

## Core experience (MVP — build this first)

**One thing, done excellently: a voice-coached Scripture memorization flow.**

### Rhema — the AI companion
Rhema (ῥῆμα) means "spoken word" in Greek — the living, spoken Word, delivered in the moment. Rhema is Way's AI voice companion, coaching users through memorization sessions with warmth and encouragement.

- **Personality**: warm, energetic, encouraging — similar starting point to Wavi (Wayve's companion). Personality refinement comes after voice testing.
- **Voice**: ElevenLabs TTS. Rhema's canonical voice is **Anna Kim — Tender, Calm and Clear** (`uyVNoMrnUku1dZyVEXwD`). Voice settings: stability 0.7, similarity_boost 0.8, style 0.0 (carried over from Wavi as a starting point). Refine from there.
- **Bilingual**: speaks both English and Korean depending on user's language preference
- **Per-segment language_code forcing**: pure English → "en", pure Korean → "ko", mixed → auto-detect

### Fading memorization method
The core mechanic. Progressive removal of text until the user is reciting from memory:
1. **Stage 1** — Full text visible. Rhema reads it, user repeats.
2. **Stage 2** — Key words removed. User fills in gaps.
3. **Stage 3** — Only first word of each line shown. User reconstructs.
4. **Stage 4** — Blank. Full recitation from memory.

### Content types
- **Individual verses** — single verse, treated like a Wayve phrase
- **Longer passages** — multi-verse, coached through fading method in chunks

### Curriculum structure
- **Fixed topic curricula** — manually curated sets of verses and passages organized by topic (e.g. Love, Overcoming Fear). Curated from trusted biblical sources using Scripture-interprets-Scripture approach.
- **Personal library** — user-added passages via Bible API integration

### Bible API
- **Personal library is English-only**: live lookups use the **Crossway ESV API**
  (api.esv.org), proxied by `/api/bible`. 개역개정 has **no licensed API source**
  (Korean Bible Society copyright), so personal Korean lookups are not offered.
- **Korean Scripture** is served from the **curated curriculum** as verified
  **개역개정** seed text (hand-entered, not fetched). 개역개정 stays the Korean
  translation for curated content — most-used and readable for Korean users.
- The ESV API license **forbids storing verse text**, which matches our rule:
  never persist Scripture, always re-fetch live.

## What comes after MVP (do not build yet)
- Devotionals and insights tied to memorized passages
- React Native migration for App Store distribution
- Expanded curriculum from external trusted sources

## NOT building
- Teacher dashboard
- Group / cohort features
- Childish gamification (XP, levels, badges, leaderboards)
- Denomination-specific content

## Project structure

React 19 + Vite 6 SPA. Source files are plain `.js` using `React.createElement`
(no JSX), so Vite applies no JSX transform — keep new components in this style.

```
Way/
├── index.html                  # Vite entry HTML (mounts #root)
├── vite.config.js              # Vite + React plugin (HMR)
├── package.json                # scripts: dev / build / preview
├── .env.local                  # secrets (git-ignored)
├── .env.example                # env template + security notes
├── api/                        # serverless functions (Vercel) — keep keys server-side
│   ├── tts.js                  # POST /api/tts  — ElevenLabs proxy (Rhema voice)
│   ├── bible.js                # GET  /api/bible — Crossway ESV API proxy (English-only)
│   └── _elevenlabs.js          # shared TTS helper (also used by dev middleware)
└── src/
    ├── main.js                 # entry — createRoot + <App>
    ├── App.js                  # landing screen
    ├── styles/index.css        # global theme
    ├── lib/
    │   ├── supabase.js         # auth, profiles, library, progress
    │   ├── elevenlabs.js       # client → POST /api/tts (no key client-side)
    │   └── bible.js            # client → GET /api/bible (no key client-side)
    ├── features/
    │   └── memorization/
    │       ├── MemorizationSession.js  # session orchestrator (4-stage flow)
    │       ├── ScriptureDisplay.js     # faded text — the visual hero
    │       ├── RhemaIndicator.js       # speaking/listening/processing orb
    │       ├── useRhema.js             # Rhema voice: unlocked <audio> + browser fallback
    │       ├── useSpeechRecognition.js # Web Speech API voice input
    │       ├── rhemaScript.js          # Rhema's bilingual prompts/feedback
    │       ├── coaching.js             # reads recall for tone only (never gates progress)
    │       ├── fading.js               # fading method (tokenize/render)
    │       └── session.css             # strict B&W session styles
    ├── features/curriculum/
    │   ├── TopicPicker.js       # language toggle + topic/verse picker
    │   └── picker.css           # picker styles (strict B&W)
    └── data/
        └── curriculum.js       # seed verses EN(~ESV)+KO(~개역개정, verify!) + buildPassage()
```

Flow: landing → picker (choose EN / 한국어 + a topic/verse) → hands-free session
→ back to picker. Per stage, Rhema speaks the prompt (and reads the verse on
stage 1), then listening auto-starts; a pause ends the turn and Rhema coaches
warmly and advances — progress is never gated (see [[coaching-not-grading]]).
The selected language drives both the verse text and Rhema's spoken
instructions. Voice degrades gracefully: ElevenLabs (via /api/tts) → browser
speechSynthesis; no Web Speech → manual advance. Palette is strict black &
white — typography led.

Curriculum verse text (EN ~ESV, KO ~개역개정) is hand-entered seed data and must
be verified before real use — people memorize exactly what's shown. English
curated text can be checked against /api/bible (ESV); Korean 개역개정 has no API,
so it must be verified by hand against an authoritative printed/KBS source.

Secrets are SERVER-ONLY (no `VITE_` prefix): `ELEVENLABS_API_KEY`,
`ELEVENLABS_VOICE_ID`, and `ESV_API_KEY` are read by the `/api` functions (and
the Vite dev middleware), never inlined into the client bundle. (`API_BIBLE_KEY`
is reserved/unused — no licensed Korean API.) Only
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are client-exposed (safe by
design). The TTS key currently reused from Wayve — see [[elevenlabs-setup]].

Run locally: `npm install` → `cp .env.example .env.local` (fill keys) →
`npm run dev` (http://localhost:5173). `npm run dev` serves `/api/tts` via Vite
middleware; for `/api/bible` locally use `vercel dev`.

Deployed on Vercel (project `way`): **production at https://wayverse.vercel.app**.

**Backend wired (2026-06-14):** Supabase project configured (`VITE_SUPABASE_URL`
+ publishable key in Vercel Production), migrations `0001`+`0002` applied, auth
redirect URLs allowlisted (magic link works); `ESV_API_KEY` set in Vercel
(English Scripture live). Magic-link sign-in + personal library + reviews +
profile/onboarding work in production. Still pending: OAuth providers
(Google/Apple/Kakao — optional) and hand-verification of the curated 개역개정
Korean seed text. See `SETUP.md` for the full state.

Server-only keys live in the Vercel Production environment; add them to Preview
too (with a git branch) before relying on preview deploys. Redeploy with
`vercel deploy --prod`.