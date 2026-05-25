# Way — Curriculum & Memorization Architecture

> **Handoff document.** This file is intended to be read by Claude Code in the terminal alongside `CLAUDE.md`. It captures design decisions made in a separate planning session and translates them into concrete build instructions. Read this end-to-end before writing any code.

---

## What this document covers

This document specifies three additions to Way:

1. **Curated topics** — anchor-and-orbit Scripture groupings (the "I AM" topic, and future topics) with a Christological design philosophy
2. **Personal library** — user-selected verses from API.Bible, with browse and search
3. **Revelation walk** — an optional, replayable contemplative experience around each curated topic, voiced by Rhema using pre-generated audio

The existing memorization flow (`MemorizationSession.js`, fading method, four stages) is unchanged. These additions feed verses *into* that flow.

---

## North star

Way is a premium Scripture memorization app. **That is the primary purpose.** Everything else serves it.

The Christological grouping of verses (curated topics) is a strategic enhancement — it deepens the memorization experience by showing connections between the OT and NT, so that when a user memorizes Jesus's words, they carry the weight of the whole canon. The inspiration is Luke 24:27 — Jesus on the road to Emmaus, "beginning with Moses and all the Prophets, he interpreted to them in all the Scriptures the things concerning himself."

When designing, the test is always: **does this make memorizing the anchor better?** Not: *does this teach the user more theology?*

---

## Two paths into memorization

The app has two ways for a user to arrive at the memorization flow:

```
                    ┌──────────────────┐
   Curated topics ──┤                  │
                    │  MemorizationSession  ← unchanged
   Personal library ┤  (fading method) │
                    └──────────────────┘
```

### Path 1 — Curated topics

User taps a topic (e.g. "I AM"). They land on the **topic screen** which presents the anchor verse with weight, and offers two entry points:

- **Revelation** — walk the orbit with Rhema. Contemplative. Replayable anytime. No memorization happens here. ~5 min.
- **Memorization** — fading method on the anchor. ~8-10 min. The existing flow.

The two are independent. Revelation has no completion gate. A user can replay it ten times. A user can skip it entirely and go straight to memorization.

### Path 2 — Personal library

User chooses any verse they want, then enters the memorization flow directly. No orbit, no revelation walk — those exist only for curated topics. Two ways to arrive:

- **Search bar** — for users who know the reference (e.g. "Philippians 4:13" or "빌립보서 4:13")
- **Browse** — book picker → chapter → verse selection

Both fetch from API.Bible (ESV for EN, NKRV 개역개정 for KO) and feed the verse into `MemorizationSession.js`.

---

## Schema — curated topics

```js
{
  id: "i-am",
  language: "en",                  // "en" | "ko" — parallel topic files
  title: "I AM",
  subtitle: "Before Abraham was, I am.",

  anchor: {
    ref: "John 8:58",
    text: "Jesus said to them, ...",
    speaker: "Jesus",
    opening: "Today we memorize...",        // Rhema's spoken intro (for the ear)
    openingAudio: "/audio/i-am/en/anchor-opening.mp3",  // pre-generated
  },

  orbit: [
    {
      ref: "Exodus 3:14",
      text: "God said to Moses, ...",
      textAudio: "/audio/i-am/en/exodus-3-14-text.mp3",  // Rhema reads the verse
      position: "origin",                    // origin | unfolding | moment | aftermath | consummation
      connection: "This is where it begins...",
      connectionAudio: "/audio/i-am/en/exodus-3-14-connection.mp3",
    },
    // ... 3-5 more orbit entries, in canonical order
  ],

  closing: "You now carry these words...",
  closingAudio: "/audio/i-am/en/closing.mp3",
}
```

### Why the position taxonomy

The orbit walks the canonical arc:
- **origin** — where the truth first appears (Torah)
- **unfolding** — how the prophets and writings deepened it
- **moment** — the immediate Gospel context where Jesus speaks the anchor
- **aftermath** — how the apostles understood it post-resurrection
- **consummation** — where it lands in Revelation

This is the shape Jesus walked on the road to Emmaus. It is not an arbitrary categorization. It gives Rhema structural cues for natural transitions ("Centuries later, the prophet Isaiah..." / "And finally, at the end of all things..."), but more importantly, it shapes the curriculum author's thinking when creating new topics. Every topic should walk this arc, even if it skips a position.

---

## Cost architecture — why pre-generated audio matters

**ElevenLabs at runtime, per user, per replay, does not scale.** At 10,000 paying users replaying revelation walks across 20 topics, naive runtime TTS would cost thousands per month.

**The insight:** Rhema's curriculum voice is entirely deterministic. The opening, orbit verse readings, orbit connections, and closing are fixed text per topic. They are *identical for every user, every replay*.

**The solution:** Pre-generate all curriculum audio at authoring time. Save as static MP3 files in `public/audio/`. Serve from Vercel's CDN. At runtime, the client plays from URL — zero ElevenLabs calls.

### Cost breakdown

| Use case | Approach | Cost |
|---|---|---|
| Revelation walks (curriculum) | Pre-generated, CDN-served | ~$0.013/topic × 20 topics × 2 langs = **~$5 one-time** |
| Memorization stage prompts (fixed per stage) | Pre-generated, CDN-served | **~$2 one-time** |
| Memorization coaching feedback (dynamic, depends on user recall) | Live ElevenLabs | ~$0.005/session × DAU |
| Personal library verse readings (any verse the user picks) | Live ElevenLabs OR cached after first generation | ~$0.002/verse, cacheable |

**At 10,000 DAU, total ongoing TTS cost: ~$50/day for memorization coaching.** Sustainable. Curriculum audio is essentially free.

### Why this also improves the product

1. **No latency.** Pre-generated audio plays instantly. No "Rhema is thinking" pause.
2. **No API failures during the contemplative moment.** ElevenLabs outage doesn't break revelation walks.
3. **Quality is locked in.** Every clip is auditioned before shipping. No bad takes ever reach users.
4. **Offline-capable.** Pre-generated audio caches in service workers — essential for the eventual React Native app.
5. **Curriculum is a versioned asset.** Each topic ships with `i-am-en-v1.mp3` files. Easy A/B testing of new readings without code changes.

---

## Build plan — what Claude Code needs to do

### Phase 1 — Curated topic data structures

**Create:**
- `src/data/curriculum/curriculum.js` — top-level entry, picks language
- `src/data/curriculum/en/index.js` — aggregates English topics
- `src/data/curriculum/en/i-am.js` — the I AM topic in English (text already drafted in a separate file, see `curriculum-seed.md`)
- `src/data/curriculum/ko/index.js` — aggregates Korean topics
- `src/data/curriculum/ko/i-am.js` — the I AM topic in Korean (text already drafted)

The existing `src/data/curriculum.js` (with `buildPassage()`) becomes the personal-library helper. Keep it. Rename to `src/data/personalLibrary.js` if clearer.

**Why a folder per language:** future topics will be added one at a time. A folder per language with one file per topic makes additions surgical and prevents merge conflicts.

### Phase 2 — Audio pre-generation script

**Create:** `scripts/generate-curriculum-audio.js`

A Node script that:
1. Loads every topic from `src/data/curriculum/`
2. For each topic, for each text field (`opening`, orbit `text`, orbit `connection`, `closing`):
   - Calls ElevenLabs with the canonical Anna Kim voice + locked settings
   - Saves output as MP3 to `public/audio/{topic-id}/{lang}/{field-id}.mp3`
   - Skips if file already exists (idempotent)
3. Logs total characters and estimated cost
4. Writes a manifest (`public/audio/manifest.json`) mapping topic+lang+field → URL

**Critical:** The script must use the same `_elevenlabs.js` helper that the runtime API does, with locked voice settings (`uyVNoMrnUku1dZyVEXwD`, stability 0.7, similarity_boost 0.8, style 0.0). Pre-generated audio must match runtime coaching audio so Rhema sounds like the same companion.

**Run command:** `node scripts/generate-curriculum-audio.js`

**When to run:**
- New topic added → run once
- Existing topic text edited → delete that topic's `public/audio/{topic-id}/` folder, re-run
- Voice settings changed → delete `public/audio/`, re-run all

The audio files are committed to the repo (or stored in object storage referenced by the manifest — implementer's call). Either way they ship with the deploy.

### Phase 3 — Topic-level orchestrator

**Create:** `src/features/memorization/TopicSession.js`

State machine with three modes:
- `"intro"` — topic screen with anchor + two entry points (Revelation / Memorization)
- `"revelation"` — `RevelationSession` mounted
- `"memorization"` — existing `MemorizationSession` mounted with `verse = topic.anchor`

When either child session signals `onDone`, return to `"intro"`.

**Visual treatment:**
- Topic label, title, subtitle at the top
- Anchor verse displayed prominently as the gravitational center
- Two buttons below: Revelation (left), Memorization (right)
- Strict B&W, typography-led, matches existing session styling

### Phase 4 — Revelation session

**Create:** `src/features/memorization/RevelationSession.js`

Linear walk through the topic:

1. **Opening** — Rhema speaks `anchor.opening`. Anchor verse displayed on screen.
2. **Orbit, one verse at a time** — for each `orbit[i]`:
   - Display verse reference and text
   - Rhema reads verse aloud (`textAudio`)
   - Brief pause
   - Rhema speaks connection (`connectionAudio`)
   - Brief pause
   - Auto-advance to next orbit verse, OR allow user to tap to advance manually
3. **Closing** — Anchor verse displayed again. Rhema speaks `closing`.
4. Auto-return to topic intro after closing finishes.

**Critical UX rules:**
- User can pause at any time. The "Emmaus walk" should not feel rushed.
- User can replay any segment. Each orbit verse has a small replay icon.
- User can exit at any time without losing anything — there is no progress to save in revelation, by design.
- Visual transitions between orbit verses are slow and meditative. No swipe animations. Just a gentle fade.
- The `position` field can optionally drive a small visual cue (e.g., a quiet label "Origin" / "Unfolding" / "Moment" / "Aftermath" / "Consummation"). Test this in design — it might be too much. When in doubt, omit.

**Audio playback:**
- Uses `useRhema` hook, but in a new mode that plays from a URL instead of streaming `/api/tts`
- Falls back gracefully: if audio fails to load, display text only and let the user advance manually
- Uses the `manifest.json` from Phase 2 to resolve audio URLs

### Phase 5 — Personal library

**Create:** `src/features/library/`
- `LibraryPicker.js` — search bar + book browse
- `BookList.js` — list of 66 books in canonical order, localized
- `ChapterList.js` — chapters for selected book
- `VerseList.js` — verses for selected chapter, with checkbox multi-select for ranges
- `library.css` — styles matching the rest of the app

**Flow:**
1. User taps "My Library" from landing screen
2. Sees search bar at top + book grouped list below ("Old Testament" / "New Testament" headers — or in Korean "구약" / "신약")
3. Search bar accepts free text: "Philippians 4:13", "빌립보서 4:13", "John 3", "Psalm 23"
4. Browse path: tap book → see chapters → tap chapter → see verses → tap verse (or select range) → confirm
5. App fetches verse text from API.Bible
6. App passes verse into `MemorizationSession` with no orbit

**Search parsing:**
- Accept both English ("Philippians") and Korean ("빌립보서") book names
- Accept abbreviations ("Phil 4:13", "빌 4:13")
- Accept ranges ("John 3:16-17")
- If ambiguous, show suggestions rather than guessing

**API.Bible integration:**
- Reuse the existing `src/lib/bible.js` client
- Server route `/api/bible` handles the actual API call (key stays server-side per existing pattern)
- Cache fetched verses in localStorage so users don't re-fetch the same verse every session
- If user is offline and verse isn't cached, show a clear "Connect to the internet to load this verse" message rather than failing silently

**Save to personal library:**
- After a user memorizes a personal verse, offer to save it to their library
- Stored in Supabase under their profile
- Library appears at the top of the picker on future visits
- Tapping a saved verse takes them straight into memorization (no need to re-pick)

### Phase 6 — Landing screen restructure

The current landing flow per CLAUDE.md is: landing → picker (lang + topic) → session.

This becomes:

```
landing
  ├─ Language toggle (EN / 한국어)
  ├─ Curated Topics  →  TopicPicker  →  TopicSession  →  Revelation | Memorization
  └─ My Library      →  LibraryPicker →  MemorizationSession
```

**Update:**
- `App.js` — landing screen with two primary CTAs ("Curated Topics" / "My Library") + language toggle
- `TopicPicker.js` — list of curated topics for the selected language (just "I AM" for now)
- Wire `TopicSession.js` as the destination for curated topic taps
- Wire `LibraryPicker.js` as the destination for "My Library"

---

## Implementation order

Recommended sequence — each step is independently testable:

1. **Curriculum data** (Phase 1) — Pure data, no UI. Can be diffed against API.Bible to verify text accuracy.
2. **Audio pre-generation** (Phase 2) — Run the script, audition the MP3s, regenerate any that don't land right. **Do this before building the UI** — it surfaces voice problems early.
3. **TopicSession scaffolding** (Phase 3) — Just the intro screen. No revelation yet. Tap "Memorization" → existing flow works.
4. **RevelationSession** (Phase 4) — Wire up the pre-generated audio. The Emmaus walk goes live.
5. **Personal library** (Phase 5) — Whole new flow. Can be built in parallel with Phase 4 if helpful.
6. **Landing restructure** (Phase 6) — Tie it all together.

---

## What stays unchanged

- `MemorizationSession.js` — the fading method orchestrator works as-is
- `ScriptureDisplay.js`, `RhemaIndicator.js`, `fading.js`, `coaching.js` — all unchanged
- `useRhema.js` — extended with a "play from URL" mode for pre-generated audio, but the existing streaming mode for dynamic coaching remains
- `useSpeechRecognition.js` — unchanged
- `rhemaScript.js` — extended with topic-level prompts but existing memorization prompts stay
- `/api/tts.js` — unchanged, still used for runtime coaching
- `/api/bible.js` — unchanged
- Supabase auth/profile/progress code — unchanged, just gains new tables for `topic_progress` and `library_verses`

The architectural promise: **the existing premium memorization flow is preserved exactly. New paths feed into it. New experiences sit alongside it.**

---

## Open questions for Claude Code to resolve during implementation

These are not blockers — Claude Code should make reasonable judgments and flag what it chose:

1. **Manifest format** — JSON manifest of audio URLs vs. computed URLs from topic id. Pick whichever is easier to maintain.
2. **Audio storage location** — `public/audio/` (committed to repo) vs. Supabase Storage vs. Vercel Blob. Recommend `public/audio/` for now (simplest, free up to Vercel's bandwidth limits, easy to inspect). Move to Blob later if repo size becomes a problem.
3. **Library save UI** — bottom sheet "Save to library?" prompt vs. heart icon during memorization vs. post-session screen. Pick what matches existing Way patterns.
4. **Topic progress tracking** — what does it mean to "complete" the I AM topic? Recommendation: there is no completion. There is only "last practiced" and "currently at stage N." No badges. No streaks. No completion checkmarks. This matches the "no childish gamification" rule in CLAUDE.md.
5. **Offline behavior for library** — sync verses on save? Pre-cache the user's library on app open? Defer to Phase 2 of the library work.

---

## A note on the design philosophy

Way is not a Bible study app with memorization features. It is a memorization app where verses sometimes arrive in meaningful groups.

The orbit serves the anchor. The connection serves the memorization. Revelation serves Memorization. Every layer exists to make the moment a user recites "before Abraham was, I am" from memory more weighted, more resonant, more theirs.

When in doubt during implementation, ask: *would a person who takes Scripture memorization seriously find this distracting or helpful?* If the answer is anything but clearly helpful — cut it.
