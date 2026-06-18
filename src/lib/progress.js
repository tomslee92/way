// Curated-verse memorization progress — which curated memory verses the user has
// carried all the way through the cue ladder (the final from-memory rung, the
// session's genuine onComplete signal — never a score, never a grade).
//
// Stored in localStorage so it works for EVERYONE with no sign-in: the curated
// experience is open by design (this mirrors how `way:language` is kept). Keyed
// by `topicId/verseId`. Append-only — completing a verse marks it and the app
// never demotes (once carried, a verse stays acknowledged). If accounts later
// sync curated progress, this becomes the local cache.

const KEY = 'way:memorized';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function write(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore — private mode / quota; progress is best-effort, never blocking */
  }
}

const keyOf = (topicId, verseId) => `${topicId}/${verseId}`;

// Mark a curated verse memorized (idempotent; stamps the first completion only).
export function markMemorized(topicId, verseId) {
  if (!topicId || !verseId) return;
  const map = read();
  const k = keyOf(topicId, verseId);
  if (!map[k]) {
    map[k] = { at: new Date().toISOString() };
    write(map);
  }
}

// Whether a specific curated verse has been memorized.
export function isMemorized(topicId, verseId) {
  return Boolean(read()[keyOf(topicId, verseId)]);
}

// The set of memorized verseIds within a topic — for the list indicator and the
// topic's progress count.
export function memorizedVerseIds(topicId) {
  const prefix = `${topicId}/`;
  const ids = new Set();
  for (const k of Object.keys(read())) {
    if (k.startsWith(prefix)) ids.add(k.slice(prefix.length));
  }
  return ids;
}
