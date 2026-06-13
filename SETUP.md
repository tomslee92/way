# SETUP.md — backend & environment checklist

What the codebase needs to go from "builds & renders" to "actually works."
The **curated memorization experience works with no setup**; everything below
unlocks the **personal library, reviews, auth, and live Scripture/voice**.

> Secrets are server-only (no `VITE_` prefix) and read by `/api`. Only
> `VITE_SUPABASE_*` is client-exposed (safe by design). Set the same values in
> Vercel (Production + Preview) as in `.env.local`.

---

## 1. Environment variables (`.env.local`)

Local `.env.local` currently holds **placeholders** for Supabase. Real values
live in Vercel Production — pull them down:

```bash
vercel env pull        # writes real values into .env.local
```

- [ ] `VITE_SUPABASE_URL` — real project URL (placeholder today)
- [ ] `VITE_SUPABASE_ANON_KEY` — real anon key (placeholder today)
- [x] `ESV_API_KEY` — Crossway ESV (English Scripture). Set locally; **also add to Vercel.**
- [x] `ELEVENLABS_API_KEY` / `ELEVENLABS_VOICE_ID` — Rhema's voice (shares Wayve's key for now)
- [ ] `API_BIBLE_KEY` — **leave empty.** Korean has no licensed API; Korean is curated-only.

---

## 2. Supabase — database

Apply both migrations (SQL editor, or `supabase db push`):

- [ ] `supabase/migrations/0001_library_items.sql` — personal library + RLS
- [ ] `supabase/migrations/0002_profiles.sql` — language profile + RLS

---

## 3. Supabase — auth

**Auth → URL Configuration**

- [ ] Add **Redirect URLs**: your local origin (`http://localhost:5173`) and
      production (`https://thewayapp.vercel.app`)

**Magic link** — email auth is on by default; no extra config.

**OAuth providers** (Auth → Providers) — each needs an app registered in the
provider's console, then client id/secret pasted into Supabase:

- [ ] **Google** — Google Cloud Console → OAuth client → enable in Supabase
- [ ] **Apple** — Apple Developer → Sign in with Apple → enable in Supabase
- [ ] **Kakao** — Kakao Developers → app + REST key → enable in Supabase

Until a provider is configured, its button returns a graceful error.

---

## 4. Verify locally

- **App + magic link / OAuth UI:** `npm run dev` → http://localhost:5173
  (serves `/api/tts` via Vite middleware)
- **`/api/bible` (Scripture lookup):** needs `vercel dev`. It does **not**
  auto-load `.env.local`, so export first:
  ```bash
  set -a; . ./.env.local; set +a
  vercel dev
  ```

---

## 5. Content (not code)

- [ ] Hand-verify the curated **개역개정** Korean seed text against an
      authoritative KBS/printed source — there is no Korean API to diff against,
      and people memorize exactly what's shown.

---

Deploy: `vercel deploy --prod` (project `way`).
