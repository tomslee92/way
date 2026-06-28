import { supabase } from './supabase.js';

// Personal library — CRUD + the three status transitions (library-spec §5).
//
// The library holds the verses a user chooses to carry. Verse TEXT is never
// stored here; it is re-fetched/verified via /api/bible against passage_id
// (people memorize exactly what's shown). There is no score anywhere.
//
// Two rules live in this module, not just in the UI:
//   1. Status is the user's testimony. A session NEVER flips it. The only
//      functions that change `status` are setMemorizing() and
//      declareMemorized(), and both are user-initiated. There is deliberately
//      no generic setStatus() escape hatch.
//   2. The app never demotes. A review records time via markRecalled(), which
//      touches last_recalled_at ONLY and structurally cannot change status.
//
// Every function requires an authenticated Supabase session (RLS). They throw
// on error so callers can handle failure explicitly.

const TABLE = 'library_items';

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

// — Reads —

// List the user's verses, newest first. Optionally filter to one status.
export async function listLibrary({ status } = {}) {
  let query = supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  return unwrap(await query);
}

// A single library item by id.
export async function getVerse(id) {
  return unwrap(await supabase.from(TABLE).select('*').eq('id', id).single());
}

// — Create / delete —

// Add a verse to the library. Always enters as 'saved' (the create = →saved
// transition). user_id defaults to auth.uid() in the DB, so we never pass it.
export async function addVerse({ passageId, refDisplay, translation }) {
  return unwrap(
    await supabase
      .from(TABLE)
      .insert({
        passage_id: passageId,
        ref_display: refDisplay,
        translation,
        status: 'saved',
      })
      .select()
      .single()
  );
}

// Remove a verse from the library.
export async function removeVerse(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

// — The three status transitions (all user-initiated) —

// → 'memorizing'. Backs both "Begin memorizing" (saved → memorizing) and the
// no-demotion move-back offer (memorized → memorizing, §2) — one DB transition,
// the UI labels carry the two intents. Clears the declaration timestamp, since
// the verse is no longer in the 'memorized' state.
export async function setMemorizing(id) {
  return unwrap(
    await supabase
      .from(TABLE)
      .update({ status: 'memorizing', declared_memorized_at: null })
      .eq('id', id)
      .select()
      .single()
  );
}

// → 'memorized'. The user's testimony that they know it — never a session
// outcome. Records when the declaration was made.
export async function declareMemorized(id) {
  return unwrap(
    await supabase
      .from(TABLE)
      .update({ status: 'memorized', declared_memorized_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  );
}

// — Time signal (not a status change) —

// Record that a review happened. Touches last_recalled_at ONLY — never status.
// This is the single time signal that drives review invitations (§3); it is not
// a grade and cannot demote a verse. The session/review flow calls this.
export async function markRecalled(id) {
  return unwrap(
    await supabase
      .from(TABLE)
      .update({ last_recalled_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  );
}
