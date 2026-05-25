// Coaching, not grading — but adaptive. We don't show scores or "fail" states;
// instead we read how much of the passage came back so the session can decide
// whether to advance or to loop the current stage with help (Rhema re-reads it,
// you try again). A stage only advances once recall is solid, so the verse gets
// nailed down before the text fades further. A safety cap (in the session) and
// a Skip keep the learner from ever being trapped.

const MASTER_RECALL = 0.6;

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[“”‘’"'.,;:!?()[\]—–-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// Length of the longest common subsequence of two word arrays (order-aware).
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
 * Read how much of the passage came back.
 * @returns {{ recall: number, mastered: boolean }}
 *   `mastered` true → advance to the next stage; false → loop with help.
 *   The threshold is forgiving so speech-recognition noise doesn't block a
 *   faithful recitation, but high enough that the stage is genuinely held.
 */
export function assessRecall(transcript, expected) {
  const said = normalize(transcript);
  const target = normalize(expected);
  if (target.length === 0) return { recall: 0, mastered: false };

  const recall = lcsLength(said, target) / target.length;
  return { recall, mastered: recall >= MASTER_RECALL };
}

export { MASTER_RECALL };
