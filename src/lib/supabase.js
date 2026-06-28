import { createClient } from '@supabase/supabase-js';

// Supabase client — auth, user profile (language), and the personal library.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Whether real Supabase credentials are present. The curated experience never
// touches Supabase, so it must work without them.
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[Way] Supabase not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
      'Sign-in and the personal library are unavailable; the curated experience still works.'
  );
}

// IMPORTANT: always construct the client with VALID arguments. createClient
// throws "supabaseUrl is required" on an empty URL — and since this module is
// imported app-wide, that would white-screen the entire app (curated included)
// whenever the env is missing. With placeholders, the client constructs fine;
// any actual network call simply fails and is handled by its caller, while
// local session reads return null.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key'
);
