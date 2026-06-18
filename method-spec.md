# method-spec.md — The Memorization Method

> Companion to CLAUDE.md, library-spec.md, DESIGN.md.
> **This supersedes the "Fading memorization method" (the 4-stage,
> watch-and-recite flow) described in CLAUDE.md.** The mechanic changes from
> *Rhema reads → you echo* to *self-tested silent recall against a fading cue
> ladder*. CLAUDE.md's method section and session-flow paragraph should be
> updated to match (see §9).

---

## 0. The telos (why the method is shaped this way)

A verse is memorized in Way so it can be **carried in the heart and brought to
mind by the Holy Spirit in prayer and intercession** — not performed verbatim,
not recited on a stage. The real-life retrieval is therefore *silent, internal,
unaided recall*. The method trains that exact muscle, and every design choice
below follows from it.

This single fact resolves a lot:
- **Verbatim precision is not the master.** Close recall that carries the verse
  is success; the app does not police exact wording (reinforces [[coaching-not-grading]]).
- **No speech recognition or exact-match typing is needed** in the core loop —
  the user judges their own recall.

---

## 1. Research foundation (the five levers)

1. **Testing effect / retrieval practice.** Producing a verse from memory builds
   retention far more than re-reading or re-hearing it. The core loop is retrieval,
   not exposure.
2. **Spacing / successive relearning.** Retrieve to one clean success, stop, return
   after an expanding gap, retrieve again. The most efficient durable-memory
   technique known — and it *is* the review-invitation engine in library-spec §3.
3. **Desirable difficulty / cue fading.** Make retrieval effortful but successful by
   thinning the cue gradually (the ladder, §3). The first-letter rung works because
   an initial is a strong cue that still forces generation.
4. **Generation, not recognition.** The mind must *produce* the word. This is why
   tap-from-a-word-bank is demoted to an optional early scaffold only (§5) — picking
   from given words is recognition, the weakest mode.
5. **Covert retrieval + transfer-appropriate processing.** Silent self-testing is
   nearly as strong as overt, and it matches the telos (bringing to mind in prayer).
   So silent recall is the core; speaking/typing are optional intensifiers.

---

## 2. The core loop

For each chunk, then the whole verse:

1. **Cue** — show the current rung of the ladder (§3).
2. **Attempt** — the user brings the rest to mind. Silently by default; they may
   whisper, speak, or type if they want a more active attempt. The app does **not**
   capture or evaluate this.
3. **Reveal** — show the full words so the user checks themselves.
4. **Self-check** — one gentle question: *did it come to mind?* Warm options:
   **Not yet · Almost · Yes.** This is the only signal the app records, and it
   feeds scheduling (§6), never a score.

The app shows a cue, reveals the truth, and trusts the user's self-assessment.
That trust matches Way's best-fit user and the whole posture of the app.

---

## 3. The cue ladder (replaces the 4 stages)

Six rungs, most support → least. The user climbs as recall firms; they may drop
back a rung anytime (never gated).

1. **Absorb** — full text. Read it; Rhema *may* read it aloud. Encoding only, no test.
2. **Trace** — full text; user recites/types it through once. Builds the trace.
3. **First letters** — every word collapses to its initial on the same ruled
   baseline. *The core retrieval rung.* Strong cue, real generation.
4. **Phrase anchors** — only the first word (or initial) of each phrase remains;
   reconstruct each clause.
5. **Shape only** — blanks mark word positions; content gone. Structure as last scaffold.
6. **Free recall** — blank. From the heart. This rung is the telos in miniature.

---

## 4. Chunking

Working memory holds ~4 units, so never learn a long verse whole.
- Split the verse into meaningful phrases (clause boundaries — the same tokenization
  the fade already uses).
- Climb the ladder **phrase by phrase**, then assemble phrases, then run the whole
  verse at rung 5–6.

---

## 5. Modality — switches, never gates

The core is silent self-judged recall. Everything else is an optional way to make
the attempt more active; the user picks per moment, and can switch freely.

- **Silent** (default) — think it, then reveal. Works anywhere, matches the telos.
- **Speak** — say/whisper it before revealing. Good in a quiet room; no ASR needed —
  it is still the user who self-checks.
- **Type** — type it before revealing. Good for focus; feels like writing it on the heart.
- **Tap-to-place** — arrange words from a bank. **Recognition, not recall** — allow only
  as a gentle scaffold at rungs 1–2 for a brand-new verse; never the core mechanism.

No modality is required to advance. None is graded.

---

## 6. The spacing engine (self-check → schedule)

The self-check (§2.4) drives spaced successive relearning — the same machinery as
the library review invitations (library-spec §3).

- A verse is practiced to one clean **Yes** at rung 6, then the session ends. Do not
  mass-drill in one sitting.
- The next review is scheduled at an expanding interval; the self-check tunes it:
  **Not yet** → sooner; **Almost** → standard; **Yes** → longer.
- This updates `last_recalled_at` (library-spec §5) and triggers Rhema's warm
  invitation when due. It is scheduling, **not a score** — there is no accuracy
  column, ever.
- Adaptive focus: re-test the phrases the user marked **Not yet / Almost**, not the
  whole verse. Recording *which* phrase needs work is adaptivity, not grading.
- Starter intervals to tune: same-day → next-day → 3d → 1w → 2w → 1m → quarterly.

---

## 7. Rhema's revised role

Rhema shifts from **quizmaster to companion**. She is no longer a channel the user
must perform through (this dissolves the "speaking-only feels not ideal" problem).
- Reads the Absorb rung if the user wants to hear it.
- Encourages between attempts and celebrates a clean recall — warmly, never grading.
- Voices the review invitation when a verse is due.
- Stays silent if the user is practicing silently. Voice is offered, never imposed.

---

## 8. Build implications

- **No answer capture in the core loop.** The app shows cue → reveal → self-check;
  it does not transcribe speech or diff typed text to run the experience. Big
  simplification vs. the old flow. (Optional active modalities may capture input for
  the user's own benefit, but never to gate or grade.)
- **Reuse, don't rebuild.** The ladder reuses the existing tokenizer/fade renderer;
  rungs 3–5 are cue states of the same component.
- **No Web Speech dependency** for the core path — graceful by default, since silence
  is the baseline. ASR, if offered for the Speak modality, is purely for the user and
  failure-tolerant.

---

## 9. Design notes (ties to DESIGN.md)

- The **first-letter rung is the visual hero**: words don't vanish, they *collapse to
  an initial* on the same ruled baseline as the fade (DESIGN §5.1). Same dissolve
  timing (550ms). This is a more elegant and more useful intermediate than blanking.
- **Reveal** is a gentle fade-in of the full words over the cue, not a flash.
- **Self-check** uses the fixed label vocabulary; Not yet / Almost / Yes are quiet,
  equal-weight choices — no red/green, no scoring affect (strict tonal B&W holds).
- Rung indicator replaces the old I–IV stage rail; same restrained treatment.

---

## 10. CLAUDE.md edits required

- Replace the "Fading memorization method" section (Stages 1–4, "Rhema reads it,
  user repeats") with the cue ladder (§3) and core loop (§2).
- Update the Flow paragraph: the session is self-paced silent recall with optional
  voice, not hands-free auto-listening. Remove the implication that a pause ends the
  turn and Rhema auto-advances; advance is user-driven via the self-check.
- Keep: bilingual EN/KO, ESV + 개역개정, coaching-not-grading, voice degradation order
  (now: voice is optional throughout, so degradation only affects the Speak modality
  and the Absorb read-aloud).

## 11. To tune

- Interval schedule (§6) — shapes how present Rhema feels; decide deliberately.
- Chunk-size threshold — at what verse length to force phrase-by-phrase vs. whole.
- What **Almost** does precisely to the next interval.
- Whether rung 6 self-checked **Yes** is the user's cue to declare "memorized"
  (library-spec §2), or whether that stays fully separate.
