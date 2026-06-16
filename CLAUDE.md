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
- **Voice — per language** (a single voice always accents one language, so Way uses two): English → **Sarah** (`EXAVITQu4vr4xnSDxMaL`, neutral American), Korean → **Anna Kim — Tender, Calm and Clear** (`uyVNoMrnUku1dZyVEXwD`, Korean-native). Picked by `voiceForLanguage()` in `api/_elevenlabs.js` from env `ELEVENLABS_VOICE_ID_EN` / `ELEVENLABS_VOICE_ID_KO` (legacy `ELEVENLABS_VOICE_ID` = fallback). Settings: stability 0.7, similarity_boost 0.8, style 0.0. Model `eleven_turbo_v2_5` (honors `language_code`, unlike multilingual_v2). See [[elevenlabs-setup]].
- **Bilingual**: speaks both English and Korean depending on user's language preference
- **Per-segment language_code forcing**: pure English → "en", pure Korean → "ko", mixed → auto-detect

### Memorization method — the cue ladder
The core mechanic: self-paced silent recall against an **eight-rung cue ladder**,
support thinning gradually until the user recites from memory. At each rung the
user recites the verse, then self-checks (Not yet / Almost / Yes — never graded,
never scored; "Almost" is the soft default and repeats the same rung; see
[[coaching-not-grading]]). The graduated fade avoids any jump from full text to
first-letters:
1. **Absorb** — full text, read it through
2. **Trace** — full text, recite through once
3. **A few hidden** — ~a third of the words fade to gaps
4. **Half hidden** — ~half are gaps
5. **Most hidden** — most gone; only a thin scaffold remains
6. **First letters** — every word collapses to its initial
7. **Phrase anchors** — only the first word of each phrase remains
8. **From memory** — blank; full recitation (the prompt makes clear all hints, even spacing, are gone)

Gaps spread evenly (golden-ratio low-discrepancy) and are monotonic (once gone,
stay gone). Logic in `fading.js` (`Rung`, `RUNGS`, `tokenizeRung`); orchestrated
by `MemorizationSession.js`; rendered by `ScriptureDisplay.js` (a word always
keeps its full width — no layout shift). No ASR; voice is offered ("Hear it"),
never imposed.

### Content types
- **Individual verses** — single verse, treated like a Wayve phrase
- **Longer passages** — multi-verse, coached through fading method in chunks

### Curriculum structure
- **Curated topics** — eight topics, fully bilingual (EN + KO): **I AM, The
  Kingdom of God, Love, Obedience, Prayer, Crying Out (부르짖는 기도), Praying in
  the Spirit (성령으로 드리는 기도), Faith.** Each topic is a **cluster of
  red-letter memory verses** (the words must be Jesus's own). Every verse carries
  an optional **revelation walk** — an OT→NT image-thread (origin → unfolding →
  moment → aftermath → consummation) that sheds light on Jesus's words, Scripture
  interpreting Scripture, footed by a tappable Luke 24:27 (the Emmaus shape). Each
  thread station carries a `connection` line (the "why this is here" narration,
  shown and read aloud). Verses without their own thread fall back to the topic
  spine. **Governing rule: the app asserts only Toms-vouched connections.**
- **Personal library** — user-added passages via Bible API integration (English
  only — see Bible API below).

### Bible API
- **Personal library is English-only**: live lookups use the **Crossway ESV API**
  (api.esv.org), proxied by `/api/bible`. 개역개정 has **no licensed API source**
  (Korean Bible Society copyright), so personal Korean lookups are not offered.
- **English curated text is fetched LIVE** (ESV via `/api/bible`) and never
  stored — the ESV API license forbids storing verse text (matches our rule:
  never persist Scripture, always re-fetch live).
- **Korean curated text is stored** (no Korean API), pulled **verbatim from
  대한성서공회 (bskorea.or.kr, `version=GAE` = 개역개정)** — the copyright holder's
  own site, version label + reference confirmed on every verse. A copy-from-source
  pipeline, NOT model-generated; see [[korean-scripture-source]]. **KBS licensing
  to display 개역개정 in Way is still to be secured before public launch**
  (fetching proves accuracy, not permission).

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
    │       ├── MemorizationSession.js  # session orchestrator (the 8-rung cue ladder)
    │       ├── ScriptureDisplay.js     # the verse, faded per rung — the visual hero
    │       ├── RhemaIndicator.js       # speaking/listening/processing orb
    │       ├── useRhema.js             # Rhema voice: unlocked <audio> + browser fallback
    │       ├── useSpeechRecognition.js # Web Speech API voice input
    │       ├── rhemaScript.js          # Rhema's bilingual prompts/feedback
    │       ├── coaching.js             # reads recall for tone only (never gates progress)
    │       ├── fading.js               # the cue ladder (Rung / RUNGS / tokenizeRung)
    │       └── session.css             # strict B&W session styles
    ├── features/curriculum/
    │   ├── TopicPicker.js       # language toggle + topic list (the 8 topics)
    │   ├── CuratedTopic.js      # a topic's memory-verse cluster
    │   ├── VerseLanding.js      # one verse + its revelation walk (thread)
    │   ├── RevelationWalk.js    # the OT→NT thread — tap a station / play the whole thread
    │   └── picker.css           # picker, curated & walk styles (strict B&W)
    └── data/
        └── curriculum/          # curated topics — one file per topic per language
            ├── curriculum.js    #   getTopics(lang) / getTopic(id, lang) / audioPath()
            ├── en/              #   English topics (text fetched LIVE via ESV)
            └── ko/              #   Korean topics (stored 개역개정 from KBS)
```

Flow: landing → **picker** (choose EN / 한국어, pick a topic) → **topic**
(`CuratedTopic` — the topic's cluster of memory verses) → **verse**
(`VerseLanding` — the verse + its optional **revelation walk**) → **session**
(`MemorizationSession` — the cue ladder) → back. The revelation walk
(`RevelationWalk`, "See how it connects") is collapsed by default; expanded, the
memory verse heads the thread and each station is tappable (Rhema reads the verse,
then speaks its connection), with a **"play the whole thread"** one-flow that
auto-scrolls to keep the station being read centered. Self-check drives the rung
(Yes climbs, Almost repeats, Not yet drops) — progress never gated (see
[[coaching-not-grading]]). Voice degrades gracefully: ElevenLabs (via /api/tts) →
browser speechSynthesis. Palette is strict black & white, typography-led; the one
softened element is the primary CTA (an Apple-style capsule).

Curated verse text — people memorize exactly what's shown, so accuracy is
absolute. **English is fetched LIVE** from ESV (`/api/bible`), never stored.
**Korean is stored**, pulled verbatim from 대한성서공회 (KBS, `version=GAE` =
개역개정). The per-station `connection` narration (EN + KO) is Way-authored and is
Toms's to vouch before launch.

Secrets are SERVER-ONLY (no `VITE_` prefix): `ELEVENLABS_API_KEY`,
`ELEVENLABS_VOICE_ID_EN` / `ELEVENLABS_VOICE_ID_KO` (per-language Rhema voices;
legacy `ELEVENLABS_VOICE_ID` is the fallback), and `ESV_API_KEY` are read by the
`/api` functions (and the Vite dev middleware), never inlined into the client
bundle. (`API_BIBLE_KEY` is reserved/unused — no licensed Korean API.) Only
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
profile/onboarding work in production. See `SETUP.md` for the full state.

**Curriculum built bilingual (2026-06):** all 8 topics live in EN + KO with
red-letter clusters, per-verse revelation-walk threads, and connection narration
(Korean 개역개정 pulled verbatim from KBS). **Still pending before public launch:**
(1) Toms's vouch of the draft connection lines (EN + KO); (2) **KBS license** to
display 개역개정; (3) OAuth providers (Google/Apple/Kakao — optional). Keep the app
private/pre-launch (not just unlisted) until the 개역개정 license is in hand.

Server-only keys live in the Vercel Production environment; add them to Preview
too (with a git branch) before relying on preview deploys. Redeploy with
`vercel deploy --prod`.