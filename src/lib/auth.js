import { supabase } from './supabase.js';

// Auth — thin wrappers over Supabase Auth so components never touch the raw
// client. Passwordless magic-link sign-in. The Supabase client uses default
// options (persistSession, autoRefreshToken, detectSessionInUrl), so a session
// from a clicked magic link is established automatically when the app loads.

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

// Subscribe to auth changes; returns an unsubscribe function.
export function onAuthChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session ?? null));
  return () => data.subscription.unsubscribe();
}

// Send a passwordless sign-in link. The link returns to this app's origin,
// where the client detects the session in the URL. NOTE: the origin must be
// allowlisted in Supabase → Auth → URL Configuration → Redirect URLs.
export async function sendMagicLink(email) {
  const emailRedirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
