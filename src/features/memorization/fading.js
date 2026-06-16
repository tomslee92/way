// The fading memorization method — Way's core mechanic.
// Progressive removal of text across four stages until the user recites from
// memory. This module is the pure logic; the session UI/voice loop builds on it.

export const FadingStage = {
  FULL: 1, // Full text visible. Rhema reads it, user repeats.
  GAPS: 2, // Key words removed. User fills in the gaps.
  FIRST_WORD: 3, // Only the first word of each line. User reconstructs.
  BLANK: 4, // Blank. Full recitation from memory.
};

// Stage metadata for the UI. Labels describe the task without gamifying it.
export const STAGES = [
  { stage: FadingStage.FULL, label: { en: 'Read', ko: '읽기' } },
  { stage: FadingStage.GAPS, label: { en: 'Fill the gaps', ko: '빈칸 채우기' } },
  { stage: FadingStage.FIRST_WORD, label: { en: 'First words', ko: '첫 단어' } },
  { stage: FadingStage.BLANK, label: { en: 'From memory', ko: '암송' } },
];

// Whether a word is hidden at a given stage. `clauseStart` marks a clause
// opening — the first word of a line, or the first word after a comma /
// semicolon / colon. Stage III ("openings only") keeps exactly those (§5.1).
function isHidden(index, clauseStart, stage) {
  switch (stage) {
    case FadingStage.FULL:
      return false;
    case FadingStage.GAPS:
      // Key words quiet. TODO (unchanged): replace this naive every-other pass
      // with content-word selection, tuned separately for Korean and English.
      return index % 2 === 1;
    case FadingStage.FIRST_WORD:
      return !clauseStart;
    case FadingStage.BLANK:
      return true;
    default:
      throw new Error(`Unknown fading stage: ${stage}`);
  }
}

/**
 * Tokenize a passage for display at a given fading stage.
 * @param {string} text - the passage (lines separated by '\n').
 * @param {number} stage - a FadingStage value.
 * @returns {Array<Array<{ text: string, hidden: boolean, clauseStart: boolean }>>} lines of tokens.
 */
export function tokenizeStage(text, stage) {
  return text.split('\n').map((line) => {
    const words = line.split(/\s+/).filter(Boolean);
    return words.map((word, i) => {
      // A clause opening: first word of the line, or the first word after a
      // clause boundary (comma / semicolon / colon) on the previous word.
      const clauseStart = i === 0 || /[,;:]$/.test(words[i - 1]);
      return { text: word, clauseStart, hidden: isHidden(i, clauseStart, stage) };
    });
  });
}

/**
 * Render a passage at a given fading stage as a plain string (blanks as
 * underscores). Useful for non-visual contexts; the UI uses tokenizeStage.
 */
export function renderStage(text, stage) {
  return tokenizeStage(text, stage)
    .map((tokens) =>
      tokens
        .map((t) => (t.hidden ? '_'.repeat(Math.max(2, t.text.length)) : t.text))
        .join(' ')
    )
    .join('\n');
}

// — The cue ladder (method-spec §3) — eight rungs, most support → least. The user
// climbs as recall firms, reciting at each step. The fade is GRADUATED: after two
// full reads, words drop out a third at a time (FADE_1→2→3) so support thins
// gently before the first-letter scaffold — no abrupt jump from full text to
// initials. Each rung maps every word to a render mode; the word always keeps its
// full width in the DOM (no layout shift, §8).

export const Rung = {
  ABSORB: 1, // full text, no test (encoding)
  TRACE: 2, // full text, recite through once (encoding)
  FADE_1: 3, // ~a third of the words fade to gaps — recite, filling them
  FADE_2: 4, // ~half the words are gaps
  FADE_3: 5, // most words gone; only a thin scaffold remains
  FIRST_LETTERS: 6, // every word collapses to its initial
  PHRASE_ANCHORS: 7, // only the first word of each phrase remains
  FREE_RECALL: 8, // blank — from the heart (the telos in miniature)
};

export const RUNGS = [
  { rung: Rung.ABSORB, key: 'absorb', label: { en: 'Absorb', ko: '익히기' } },
  { rung: Rung.TRACE, key: 'trace', label: { en: 'Trace', ko: '따라 읽기' } },
  { rung: Rung.FADE_1, key: 'fade-1', label: { en: 'A few hidden', ko: '조금 가림' } },
  { rung: Rung.FADE_2, key: 'fade-2', label: { en: 'Half hidden', ko: '절반 가림' } },
  { rung: Rung.FADE_3, key: 'fade-3', label: { en: 'Most hidden', ko: '대부분 가림' } },
  { rung: Rung.FIRST_LETTERS, key: 'first-letters', label: { en: 'First letters', ko: '첫 글자' } },
  { rung: Rung.PHRASE_ANCHORS, key: 'phrase-anchors', label: { en: 'Phrase anchors', ko: '구절 단서' } },
  { rung: Rung.FREE_RECALL, key: 'free-recall', label: { en: 'From memory', ko: '암송' } },
];

// Progressive fade: a deterministic low-discrepancy (golden-ratio) score spreads
// the gaps evenly across the verse, and a rising threshold hides monotonically
// more — so a word, once gone, stays gone as you climb. `gi` is the word's index
// across the whole passage.
function faded(gi, threshold) {
  const score = ((gi + 1) * 0.6180339887498949) % 1;
  return score < threshold;
}

// The render mode for one word at a given rung. `clauseStart` marks a phrase
// opening (first word, or first after a comma/semicolon/colon); `gi` is the
// passage-wide word index (for the graduated fade).
//   full    — visible word, no rule
//   initial — first character shown, rest transparent, on a faint ruled baseline
//   shape   — blank: transparent word over a faint ruled baseline (a gap to fill)
//   gone    — transparent word, no rule (free recall)
function wordMode(clauseStart, rung, gi) {
  switch (rung) {
    case Rung.ABSORB:
    case Rung.TRACE:
      return 'full';
    case Rung.FADE_1:
      return faded(gi, 0.3) ? 'shape' : 'full';
    case Rung.FADE_2:
      return faded(gi, 0.55) ? 'shape' : 'full';
    case Rung.FADE_3:
      return faded(gi, 0.78) ? 'shape' : 'full';
    case Rung.FIRST_LETTERS:
      return 'initial';
    case Rung.PHRASE_ANCHORS:
      return clauseStart ? 'full' : 'shape';
    case Rung.FREE_RECALL:
      return 'gone';
    default:
      throw new Error(`Unknown rung: ${rung}`);
  }
}

/**
 * Tokenize a passage for display at a given cue-ladder rung. Each word carries
 * its initial + the rest separately so the renderer can show just the initial
 * while preserving the word's full width. `gi` runs across the whole passage so
 * the graduated fade spreads evenly over every line.
 * @returns {Array<Array<{ text, initial, rest, clauseStart, mode }>>}
 */
export function tokenizeRung(text, rung) {
  let gi = 0;
  return text.split('\n').map((line) => {
    const words = line.split(/\s+/).filter(Boolean);
    return words.map((word, i) => {
      const clauseStart = i === 0 || /[,;:]$/.test(words[i - 1]);
      const chars = Array.from(word); // unicode-safe (handles Hangul syllables)
      const initial = chars[0] || '';
      const rest = chars.slice(1).join('');
      const mode = wordMode(clauseStart, rung, gi);
      gi += 1;
      return { text: word, initial, rest, clauseStart, mode };
    });
  });
}
