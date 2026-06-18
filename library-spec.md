# library-spec.md — Personal Library & Tracking

> Companion to CLAUDE.md and curriculum-seed.md. Read after CLAUDE.md.
> This spec covers the **personal library** (user-added verses), the
> **memorization tracking** model, and the **teaching philosophy** that
> governs both. Curated topics (anchor-and-orbit) are specified elsewhere;
> this file is about everything the user brings themselves.

---

## 0. The governing principle

**The app asserts only the connections Toms has personally authored. Everywhere else it offers method and context — never conclusions.**

This single line resolves most design questions below.

- **Curated topics** teach by *demonstration*: a hand-verified anchor + orbit, Christ at the center, canonical order. Safe because it was authored and verified.
- **Personal library** teaches by *method*: the same biblical-theological questions Rhema models in curated walks, now applied by the user to their own verse. The app never generates cross-references or thematic links for user verses — doing so would make the app the interpretive authority and risk the exact decontextualized proof-texting we exist to cure (see §4).

The needle, not the thread: curated topics show the user the finished threading; the personal library hands the user the needle and forms the instinct.

---

## 1. The spine and the limbs (mandatory vs optional)

Way is **one thing done excellently**: the voice-coached fading memorization flow with Rhema. Everything else is an open door, never a hallway.

- **Mandatory core** — the memorization session. It must feel complete and premium even if the user never taps a single insight. A user who only ever memorizes and ignores every connection should still feel they are using a serious, beautiful tool.
- **Optional limbs** — revelation walks, the "read it in context" nudge, Rhema's method questions, and any future insights. All opt-in, all non-gating, consistent with revelation walks already being optional/replayable with no completion gate (see [[coaching-not-grading]]).

**Optional must be enforced spatially, not just logically.** A suggestion that is the first thing the user sees is not optional — it is merely dismissable. The default path for a personal verse is **save → memorize**, with depth offered as a quiet affordance off to the side. This is a hard UI rule, not a preference.

---

## 2. The three states

A library verse is always in exactly one of three states. The dot styling below matches the prototype (`way-app.jsx`).

| State | Meaning | Set by | Dot |
|---|---|---|---|
| **Saved** | In the library, not yet started | User adds it | hollow (faint ring) |
| **Memorizing** | User has begun, or moved it here | User (starts a session, or moves it) | ink ring |
| **Memorized** | User declares they know it | **User only** | filled |

### Rules

- **The user's testimony sets the status.** A session outcome *never* flips a status. No Stage-4 completion auto-marks "memorized." This is the line that keeps `scoring.js` from resurrecting through the back door (see [[coaching-not-grading]]).
- **The app never demotes.** If recall falters during a review, Rhema responds exactly as in any session — warmly, coaching, never gating — and at most *offers*: "Want to move this back to memorizing for a few days?" The status change is always user-initiated.
- Three honest states; one line summary for the user: *"A verse becomes 'memorized' when you say so. Rhema may invite you back over time — but never moves it for you."*

---

## 3. Rhema review invitations

Memorization is proven by time, so the "memorized" shelf must not become quietly dishonest. Rhema surfaces truth by **invitation**, never judgment.

- After a verse is declared memorized, Rhema periodically *invites* review over **growing intervals** (e.g. 3d → 1w → 2w → 1m → quarterly — tune later).
- A review session is simply **Stage 4 of the existing fading flow** pointed at a memorized verse. No new mode to build — reuse `MemorizationSession`.
- The invitation is warm and optional ("Shall we revisit John 8:58? It's been two weeks"). Declining costs nothing and changes nothing.
- **Cost note:** review prompts are dynamic ("it's been two weeks since…"), so they are **live TTS**, not pre-generated. This is consistent with the existing split — only dynamic coaching hits ElevenLabs live; deterministic curriculum audio stays pre-generated (see [[elevenlabs-setup]]). Watch this line as the library grows.

---

## 4. The "read it in context" door (personal verses)

The only safe form of depth for an arbitrary user verse.

- **Do not suggest other verses.** Suggesting *what connects* to a user verse requires something (an LLM) to assert an interpretation Toms never vouched for. Prohibited for personal verses.
- **Do suggest context.** The non-interpretive, zero-claim move: *"Before you memorize this, read it in its own paragraph."* Show the surrounding verses via /api/bible. This alone cures most decontextualization and asserts nothing.
- Pair it with the method questions Rhema models in curated walks: *Who is speaking? To whom? What came just before? Where does this land in Christ?* The user does the connecting.
- If cross-references on personal verses are ever wanted (much later), source them from a **trusted public-domain apparatus**, never generate them, and frame as "explore," never "this connects to." Out of scope for now.

---

## 5. Data model (Supabase)

Keep it minimal — no scoring, no thresholds.

```
library_items
  id                uuid pk
  user_id           uuid fk -> auth.users
  passage_id        text         -- API.Bible reference for re-fetch/verify
  ref_display       text         -- e.g. "John 8:58" / "요한복음 8:58"
  translation       text         -- ESV | NKRV (from profile default, overridable)
  status            text         -- 'saved' | 'memorizing' | 'memorized'
  declared_memorized_at  timestamptz null   -- set only when user declares
  last_recalled_at  timestamptz null         -- drives review invitations; NOT a grade
  created_at        timestamptz default now()
  updated_at        timestamptz
```

- Verse *text* is fetched/verified via /api/bible against `passage_id` — do not store hand-entered text users will memorize (people memorize exactly what's shown).
- `last_recalled_at` is the only time signal needed for §3 scheduling. It records that a review happened, not how "well" it went. There is no score column, by design.
- RLS: user owns their own rows only.

---

## 6. Adding a verse

Two entry paths into the same memorization flow (no orbit, no revelation walk):

1. **Search bar** — free-text reference or keyword → /api/bible lookup.
2. **Browse** — book → chapter → verse picker.

Both land on the verse with **Memorize** as the default primary action and **Read it in context** as the quiet optional door (§4).

---

## 7. Build sequencing

1. **Finish Phase 2** — audio pre-generation script for curated curriculum (review before any ElevenLabs calls execute). *Unchanged priority.*
2. **Library + three states** — `library_items` table, add-via-search/browse, save → memorize default path, status set by user only, no-demotion rule. Reuses `MemorizationSession`.
3. **Review invitations** — Rhema's spaced, warm, non-gating prompts driven by `last_recalled_at`. Valuable but separable; ships after the library is solid.

---

## 8. Design language (ties to `way-app.jsx` prototype)

Strict tonal B&W, typography-led, per CLAUDE.md. The prototype deliberately steps away from the default cream/serif/terracotta look:

- **Paper** `#F6F5F2` (cool bone, not warm cream) · **Ink** `#16181D` (blue-black) · **Muted** `#6E7178` · **Hairline** `rgba(22,24,29,.14)` · **Blank-rule fill** `#E7E6E2`
- **Scripture/display:** EB Garamond (+ Noto Serif KR) — humanist old-style serif, the register of the printed Word, not a fashion headline.
- **UI/eyebrows:** Inter, small, tracked, uppercase.
- **Two signature moments, everything else quiet:** (1) the *fade* — words go transparent over a faint ruled line, keeping the verse's shape while light recedes; (2) the *thread* — the revelation walk as a vertical line running OT→NT through the anchor (honest sequence, not decoration).
- Note: prototype is JSX + inline styles for fidelity; repo convention is plain `.js` + `React.createElement`, strict B&W. Translate accordingly.
