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
