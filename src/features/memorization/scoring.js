// Lightweight recitation scoring. Compares what the user said against the
// expected passage by word overlap (longest common subsequence, order-aware).
//
// This is intentionally simple for the MVP scaffold. A later version may hand
// the transcript and reference to Rhema (an LLM) for a more forgiving,
// meaning-aware judgment — especially for Korean spacing and homophones.

// Forgiving on purpose: speech recognition drops words and mishears, and we
// never want a faithful recitation to read as a miss.
export const PASS_THRESHOLD = 0.55;

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[“”‘’"'.,;:!?()[\]—–-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// Length of the longest common subsequence of two word arrays.
function lcsLength(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/**
 * Score a recitation against the expected passage.
 * @param {string} transcript - what the user said (from speech recognition).
 * @param {string} expected - the full passage text.
 * @returns {{ accuracy: number, matched: number, total: number, passed: boolean }}
 */
export function scoreRecitation(transcript, expected) {
  const said = normalize(transcript);
  const target = normalize(expected);
  if (target.length === 0) {
    return { accuracy: 0, matched: 0, total: 0, passed: false };
  }
  const matched = lcsLength(said, target);
  const accuracy = matched / target.length;
  return { accuracy, matched, total: target.length, passed: accuracy >= PASS_THRESHOLD };
}
