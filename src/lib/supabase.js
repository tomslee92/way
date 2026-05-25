import { createClient } from '@supabase/supabase-js';

// Supabase client — auth, user profiles (preferred translation, language),
// personal library, and memorization progress.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    '[Way] Supabase env vars missing. Set VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY in .env.local.'
  );
}

export const supabase = createClient(url ?? '', anonKey ?? '');
