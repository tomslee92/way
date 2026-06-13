# SETUP.md — backend & environment status

**Status (2026-06-14): backend is WIRED.** Magic-link sign-in, the personal
library, reviews, and profile/onboarding work in production at
**https://wayverse.vercel.app**. Live Scripture (ESV) and Rhema's voice work.

Remaining (both optional / non-blocking):
- **OAuth providers** (Google / Apple / Kakao) — buttons show a graceful error until configured.
- **Korean curated text** — hand-verify the 개역개정 seed (no API to diff against).

> Secrets are server-only (no `VITE_` prefix) and read by `/api`. Only
> `VITE_SUPABASE_*` is client-exposed (safe by design). Vercel Production holds
> the source of truth; `vercel env pull` syncs them into `.env.local`.

---

## 1. Environment variables — DONE

In Vercel Production (and `.env.local`):

- [x] `VITE_SUPABASE_URL` — real project (`xbcsnshkuibsbwyyihwv.supabase.co`)
- [x] `VITE_SUPABASE_ANON_KEY` — Supabase **publishable** key (`sb_publishable_…`)
- [x] `ESV_API_KEY` — Crossway ESV (English Scripture), verified live via `/api/bible`
- [x] `ELEVENLABS_API_KEY` / `ELEVENLABS_VOICE_ID` — Rhema's voice (shares Wayve's key for now)
- [x] `API_BIBLE_KEY` — intentionally empty; Korean has no licensed API (curated-only)

`vercel env pull` brings the real values into `.env.local`.

---

## 2. Supabase — database — DONE

Both migrations applied; tables verified live (RLS enforced, anon → `[]`/200):

- [x] `supabase/migrations/0001_library_items.sql` — personal library + RLS
- [x] `supabase/migrations/0002_profiles.sql` — language profile + RLS

---

## 3. Supabase — auth

**URL Configuration — DONE**

- [x] **Site URL** = `https://wayverse.vercel.app`
- [x] **Redirect URLs** = `https://wayverse.vercel.app/**`, `http://localhost:5173/**`
- [x] **Magic link** (email auth) — on by default; verified enabled

**OAuth providers — PENDING (optional).** Each needs an app registered in the
provider's console, then client id/secret pasted into Supabase → Auth → Providers:

- [ ] **Google** — Google Cloud Console → OAuth client → enable in Supabase
- [ ] **Apple** — Apple Developer → Sign in with Apple → enable in Supabase
- [ ] **Kakao** — Kakao Developers → app + REST key → enable in Supabase

Until configured, those buttons show a graceful error; magic link covers sign-in fully.

---

## 4. Verify locally

- **App + auth UI:** `npm run dev` → http://localhost:5173 (serves `/api/tts` via Vite middleware)
- **`/api/bible` (Scripture lookup):** needs `vercel dev`, which does **not**
  auto-load `.env.local` — export first:
  ```bash
  set -a; . ./.env.local; set +a
  vercel dev
  ```

---

## 5. Content (not code) — PENDING

- [ ] Hand-verify the curated **개역개정** Korean seed text against an
      authoritative KBS/printed source — there is no Korean API to diff against,
      and people memorize exactly what's shown.

---

Live: https://wayverse.vercel.app · Deploy: `vercel deploy --prod` (project `way`).
