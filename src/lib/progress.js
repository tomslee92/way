import { supabase, isSupabaseConfigured } from './supabase.js';

// Curated-verse memorization progress — which curated memory verses the user has
// carried all the way through the cue ladder (the final from-memory rung, the
// session's genuine onComplete signal — never a score, never a grade).
//
// LOCAL-FIRST. localStorage is always the instant source the UI reads, so the
// curated experience works for EVERYONE with no sign-in (mirrors how
// `way:language` is kept). When the user IS signed in, progress also syncs to
// Supabase (table `curated_progress`): on sign-in we PULL remote rows and PUSH
// any progress collected anonymously — a union merge, never a demotion. Every
// remote call is best-effort and wrapped, so a missing table / offline / signed-
// out state simply leaves local as the source of truth.
//
// Reads stay synchronous (the local cache). Background syncs notify subscribers
// via subscribeProgress() so the curated screens re-render when remote data lands.

const KEY = 'way:memorized';
const TABLE = 'curated_progress';

// — local cache —

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
function splitKey(k) {
  const i = k.indexOf('/'); // ids carry no '/', but split on the first to be safe
  return [k.slice(0, i), k.slice(i + 1)];
}

// — change notification (so a background sync re-renders the curated screens) —

const listeners = new Set();
function emit() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* a bad listener never breaks the others */
    }
  });
}
export function subscribeProgress(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// — synchronous reads (the UI's source of truth) —

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

// Whether the user has any local progress at all (drives the sign-in nudge).
export function hasAnyProgress() {
  return Object.keys(read()).length > 0;
}

// — writes —

// Mark a curated verse memorized (idempotent; stamps the first completion only).
// Writes local immediately, notifies, then pushes to Supabase if signed in.
export function markMemorized(topicId, verseId) {
  if (!topicId || !verseId) return;
  const map = read();
  const k = keyOf(topicId, verseId);
  if (!map[k]) {
    map[k] = { at: new Date().toISOString() };
    write(map);
    emit();
  }
  pushRemote(topicId, verseId); // fire-and-forget; no-op when signed out
}

// — remote sync (best-effort; local stays authoritative) —

async function currentUserId() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data } = await supabase.auth.getSession(); // local read, no network
    return data?.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function pushRemote(topicId, verseId) {
  try {
    const uid = await currentUserId();
    if (!uid) return;
    await supabase
      .from(TABLE)
      .upsert(
        { user_id: uid, topic_id: topicId, verse_id: verseId },
        { onConflict: 'user_id,topic_id,verse_id', ignoreDuplicates: true }
      );
  } catch {
    /* best-effort — the verse is already saved locally */
  }
}

// On sign-in: PULL remote rows into the local cache (adding any we lack) and PUSH
// local-only rows up (merging anonymous progress). Union only — never removes.
// Safe to call repeatedly; notifies subscribers if anything changed locally.
export async function syncProgress() {
  try {
    const uid = await currentUserId();
    if (!uid) return;

    const { data, error } = await supabase
      .from(TABLE)
      .select('topic_id, verse_id, memorized_at');
    if (error) throw error;

    const map = read();
    const remoteKeys = new Set();
    let changed = false;
    for (const row of data || []) {
      const k = keyOf(row.topic_id, row.verse_id);
      remoteKeys.add(k);
      if (!map[k]) {
        map[k] = { at: row.memorized_at || new Date().toISOString() };
        changed = true;
      }
    }
    if (changed) write(map);

    // Push anything the browser has that the account doesn't yet.
    const localOnly = Object.keys(map).filter((k) => !remoteKeys.has(k));
    if (localOnly.length) {
      const rows = localOnly.map((k) => {
        const [topic_id, verse_id] = splitKey(k);
        return { user_id: uid, topic_id, verse_id, memorized_at: map[k]?.at };
      });
      await supabase
        .from(TABLE)
        .upsert(rows, { onConflict: 'user_id,topic_id,verse_id', ignoreDuplicates: true });
    }

    if (changed) emit();
  } catch {
    /* best-effort — offline / table not migrated yet / signed out: local wins */
  }
}
