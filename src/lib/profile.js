import { supabase } from './supabase.js';

// User profile — preferred language. Thin wrappers over the `profiles` table.
// RLS scopes every query to the signed-in user's own row, so reads don't need a
// where clause. Requires an authenticated session.

// The current user's profile, or null if none exists yet (first sign-in).
export async function getProfile() {
  const { data, error } = await supabase.from('profiles').select('language').maybeSingle();
  if (error) throw error;
  return data; // { language } | null
}

// Create or update the profile's language (set at onboarding, and on every
// later toggle change while signed in).
export async function saveLanguage(language) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return; // not signed in — nothing to persist server-side
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, language }, { onConflict: 'id' });
  if (error) throw error;
}
