# DESIGN.md — Way Visual System

> Companion to CLAUDE.md and library-spec.md. The reference implementation
> of every token below is `docs/design/way-app.jsx`. This file is the
> source of truth for the look; the prototype is the proof of it.
> Production is plain `.js` + `React.createElement` + strict-B&W CSS —
> translate these tokens into CSS custom properties, do not copy JSX.

---

## 0. Thesis & what we refuse

Way is premium, spiritually serious, typography-led, strictly tonal black & white.
The danger with a B&W serif Scripture app is sliding into the default AI look:
warm cream paper + high-contrast fashion serif + a warm accent. We refuse all three.

- **Not cream — cool bone stock.** Paper leans neutral-cool, never butter-warm.
- **Not a Didone display — a humanist old-style serif.** EB Garamond reads like the
  printed Word and liturgy, not a magazine cover.
- **No accent color, ever.** Warmth comes from paper temperature, ink temperature,
  and the serif — not chroma.

**Spend boldness in two places, keep everything else silent:** the *fade* (§5.1)
and the *thread* (§5.2). Every other surface is quiet, generous, and disciplined.

---

## 1. Color (strict tonal — no chroma)

```css
--paper:     #F6F5F2;  /* cool bone — app background */
--raise:     #FCFCFB;  /* lifted card surface */
--ink:       #16181D;  /* blue-black — primary text, fills, buttons */
--secondary: #4A4D53;  /* body text on paper that must stay legible */
--muted:     #6E7178;  /* labels, refs, captions, secondary UI */
--faint:     #9A9CA1;  /* inactive UI, blank-rule strokes, placeholders */
--fill:      #E7E6E2;  /* ruled-blank background tint */
--hair:      rgba(22,24,29,0.14);  /* standard hairline */
--hair-soft: rgba(22,24,29,0.08);  /* whisper divider */
```

**Contrast rule:** `--muted` (#6E7178) is for labels/refs/captions only — it is borderline
for body copy. Any sentence the user must read uses `--ink` or `--secondary`. Never set
running body text in `--faint`.

---

## 2. Typography

Two families do all the work. A third (KR serif) mirrors the first for Korean.

```css
--serif: 'EB Garamond', 'Noto Serif KR', Georgia, serif;  /* Scripture + display */
--serif-kr: 'Noto Serif KR', 'EB Garamond', serif;        /* KO scripture */
--sans:  'Inter', system-ui, sans-serif;                  /* all UI chrome */
```

### Type scale

| Role | Family | Size (EN / KO) | Weight | Line | Tracking | Color | Case |
|---|---|---|---|---|---|---|---|
| Hero (home) | serif | 44 / 40 | 400 | 1.45 | +0.005em / 0 | ink | — |
| Anchor verse | serif | 40 / 36 | 400 | 1.50 | +0.005em / 0 | ink | — |
| Session verse | serif | 34 / 30 | 400 | 1.62 | +0.005em / 0 | ink | — |
| Verse (orbit/library) | serif | 21 / 20 | 400 | 1.55 | 0 | ink | — |
| Section title | serif | 30 / 28 | 500 | 1.3 | +0.01em | ink | — |
| Wordmark "Way" | serif | 26 | 500 | 1 | +0.02em | ink | — |
| Eyebrow | sans | 11 | 600 | 1.2 | +0.22em | muted | UPPER |
| Reference | sans | 12.5 | 400 | 1.3 | +0.05–0.12em | muted | — |
| Body / secondary | sans | 13.5–14.5 | 400 | 1.5 | 0 | secondary | — |
| Coaching line | sans | 13.5 | 400 | 1.5 | 0 | muted | — |
| Button — primary | sans | 13 | 500 | 1 | +0.06em | paper | UPPER |
| Button — quiet | sans | 12 | 500 | 1 | +0.08em | muted→ink | UPPER |

### Korean handling
- Scripture uses `--serif-kr`; weight 400 (300 acceptable for very large display).
- Set KO tracking to **0** everywhere — letter-spacing harms Hangul.
- Step display sizes down ~4px vs EN (see column above).
- UI chrome (eyebrows, buttons) stays Inter; Korean glyphs fall back gracefully.

---

## 3. Spacing & layout

8px-based rhythm with a few editorial half-steps:

```
--s1:4  --s2:8  --s3:12  --s4:16  --s5:22  --s6:30  --s7:44  --s8:64  --s9:76
```

- **Page:** centered column, `max-width: 680px`, horizontal padding `28px`
  (→ `20px` below 480px).
- **Reading measure for Scripture:** cap the verse block at `540–560px` even inside
  the 680 column — long lines kill the literary feel.
- **Vertical rhythm:** generous. Hero block `76px` top. Section gaps `40–64px`.
  Whitespace is the premium signal — when unsure, add space, not ornament.
- **Border-radius:** `0` everywhere. This is letterpress, not soft UI.
- **Alignment:** Scripture left-aligned in sessions/lists (readability); centered only
  for hero and anchor display moments.

---

## 4. Elevation & dividers

- Default separation is a **hairline**, not a shadow. Use `--hair` for structural
  dividers, `--hair-soft` for whisper separations between list rows.
- Cards (`--raise`) carry a 1px `--hair` border and lift only on hover:
  `translateY(-2px)`, border → `rgba(22,24,29,0.28)`, shadow
  `0 10px 30px -18px rgba(22,24,29,0.4)`. No resting shadows.

---

## 5. The two signatures

### 5.1 The fade (the hero mechanic)
Memorization is light receding — not text deleting.

- A hidden word becomes `color: transparent` with a `1.5px solid var(--faint)`
  bottom rule; a visible word is `color: var(--ink)` with a transparent bottom rule.
  This keeps the verse's exact shape and line-wrapping intact while words "go quiet."
- Transition: `color .55s ease, border-color .55s ease`. The dissolve must read as
  *recollection*, never a flicker.
- Four stages: I full · II key words quiet · III openings only (first word of each
  clause) · IV blank, from memory. Clause boundaries = commas/semicolons/colons.

### 5.2 The thread (the revelation walk)
The orbit is a true canonical sequence (origin → unfolding → moment → aftermath →
consummation), so it earns a literal vertical thread.

- A 1px `--hair` line runs top-to-bottom; each station is a 6px `--ink` dot on the line.
- Station = small eyebrow label + reference + the verse in serif. Tapping lets Rhema
  read it (orb appears) — never a memorize action.
- Collapsed by default, opens beneath a hairline, labeled "optional," footed by
  Luke 24:27 in italic serif. It is a door, never a hallway (see library-spec §1).

Do not invent a third signature. Everything else stays quiet.

---

## 6. Components

- **Rhema orb.** Two layers: a solid `--ink` core inset ~16%, and a 1px `--ink` ring.
  Idle = static. Speaking = core `breathe` (scale 1→1.06, 4.6s) + ring expands
  (scale 1→1.5, opacity .5→0, 4.6s). The orb is Rhema's only avatar — no face, no waveform.
- **Status dots (library).** Saved = hollow 8px ring in `--faint`. Memorizing = ring in
  `--ink`. Memorized = filled `--ink`. The dot is the entire status indicator; pair with
  a tiny eyebrow label, nothing heavier.
- **Stage rail (session).** Roman numerals I–IV in serif, 15px; current = `--ink` with a
  1.5px underline, past = `--muted`, future = `--faint`; joined by 22px hairline segments.
- **Buttons.** Primary = solid `--ink`, `--paper` text, `16px 30px` padding, lift on hover.
  Quiet = text-only, `--muted`→`--ink` on hover. Max one primary per view.
- **Eyebrow + reference** are the universal labeling pair: eyebrow names the *kind*
  (ANCHOR, ORIGIN, MEMORIZING), reference names the *place* (John 8:58). Never merge them.

---

## 7. Motion

```css
--ease: cubic-bezier(0.4, 0.0, 0.2, 1);  /* or plain ease */
--fade-word: 550ms;   /* dissolve */
--view-in: 500ms;     /* per-view fade+rise: opacity 0→1, translateY 6px→0 */
--hover: 200ms;       /* lifts, color shifts */
--orb: 4600ms;        /* breathe/ring loop */
```

- Animate only: word dissolve, view entrance, hover lift, orb. Nothing else moves.
- Motion serves meaning (recollection, presence) — never decoration.
- **`prefers-reduced-motion: reduce` kills orb, view-in, and word transitions.** Required.

---

## 8. Quality floor (non-negotiable)

- **Responsive:** column fluid to 100% under 680; page padding → 20px under 480;
  step Scripture sizes down one notch on narrow (hero 44→32, session 34→26).
- **Focus:** every interactive element shows `:focus-visible` outline —
  `2px solid var(--ink)`, `offset 2px`. Do not remove outlines.
- **Touch targets:** ≥ 44×44px effective hit area, even for text buttons.
- **Contrast:** body copy ink/secondary only (§1). Verify ≥ 4.5:1.
- **No layout shift** when words dissolve — transparent text preserves width (§5.1).

---

## 9. Copy & voice

Words are design material (frontend-design skill). Bring the same care as to spacing.

- **Rhema** is warm, encouraging, never grading. Korean is native 존댓말 / 해요체 rhythm —
  written, not translated. She invites; she never judges or gates.
- **Label vocabulary, fixed and active:** Begin memorizing · Memorize · Recite ·
  Saved · Memorizing · Memorized · Add a verse · Read it in context · Revisit · Again · Done.
  A control names exactly what happens and keeps that word through the flow.
- **Empty states are invitations,** not status reports ("Verses you choose to carry
  will live here. Add your first.").
- **Errors speak in the interface's voice,** plainly, never apologizing, always saying
  what to do next.
- Sentence case for sentences; UPPERCASE only for eyebrows and buttons.

---

## 10. Build checklist (paste into review)

- [ ] Paper is cool bone, not cream; ink is blue-black; zero chroma.
- [ ] Scripture in EB Garamond / Noto Serif KR; UI in Inter; KO tracking = 0.
- [ ] Verse measure capped ~540px; radius 0; hairlines over shadows.
- [ ] Fade preserves verse shape; dissolve 550ms; no layout shift.
- [ ] Thread renders only for curated orbit; never for personal verses.
- [ ] One primary button per view; depth affordances are quiet and off to the side.
- [ ] Focus-visible outlines present; reduced-motion respected; targets ≥44px.
- [ ] Every label uses the fixed active vocabulary (§9).
