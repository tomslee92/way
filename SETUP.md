# SETUP.md — backend & environment status

**Status (2026-06-14): backend is WIRED.** Magic-link sign-in, the personal
library, reviews, and profile/onboarding work in production at
**https://wayverse.vercel.app**. Live Scripture (ESV) and Rhema's voice work.

Remaining (optional / non-blocking):
- **Curated-progress migration** (`0003`) — apply for per-user memorized-progress
  sync; runs local-only until then (§2).
- **OAuth providers** (Google / Apple / Kakao) — UI is built; needs dashboard
  config per provider (§3). Buttons show a graceful error until configured.
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

## 2. Supabase — database

Applied; tables verified live (RLS enforced, anon → `[]`/200):

- [x] `supabase/migrations/0001_library_items.sql` — personal library + RLS
- [x] `supabase/migrations/0002_profiles.sql` — language profile + RLS
- [ ] `supabase/migrations/0003_curated_progress.sql` — per-user curated
      memorization progress + RLS (append-only). Apply via SQL Editor (paste the
      file's **contents**, not its path) or `supabase db push`. Until applied,
      curated progress runs **local-only** (no errors); after, it syncs per-user
      and merges anonymous progress on sign-in.

---

## 3. Supabase — auth

**URL Configuration — DONE**

- [x] **Site URL** = `https://wayverse.vercel.app`
- [x] **Redirect URLs** = `https://wayverse.vercel.app/**`, `http://localhost:5173/**`
- [x] **Magic link** (email auth) — on by default; verified enabled

**OAuth providers — PENDING (optional).** The sign-in UI (buttons, marks,
bilingual labels, redirect handling) is fully built — this is **dashboard config
only**. Each provider needs an app registered in its console, then the client
id/secret pasted into **Supabase → Authentication → Providers**.

> **The one callback URL every provider needs** (register it as the provider's
> redirect/callback URI):
> ```
> https://xbcsnshkuibsbwyyihwv.supabase.co/auth/v1/callback
> ```
> The app itself returns to `https://wayverse.vercel.app` (already allowlisted in
> URL Configuration above — same as magic link), so no extra redirect setup.

- [ ] **Google** — Google Cloud Console → *APIs & Services → Credentials* →
      *Create OAuth client ID* → **Web application**. Add the callback URL above
      under *Authorized redirect URIs*. (Configure the OAuth consent screen if
      prompted.) Copy the **Client ID + Client secret** → Supabase → Providers →
      Google → enable + paste. *(Easiest — start here.)*
- [ ] **Kakao** — [Kakao Developers](https://developers.kakao.com) → create an
      app → **App Keys → REST API key** is the client id; *Security → generate a
      Client secret*. *Product → Kakao Login*: turn it **on**, add the callback
      URL above as the Redirect URI, and enable the **email** consent item. Paste
      REST key + secret → Supabase → Providers → Kakao. *(Important for Korean
      users.)*
- [ ] **Apple** — [Apple Developer](https://developer.apple.com) (paid account) →
      create an **App ID**, then a **Services ID** (this becomes the OAuth client
      id) with *Sign in with Apple* enabled and the callback URL above as the
      return URL → create a **Key** for Sign in with Apple. Supabase → Providers →
      Apple needs the **Services ID, Team ID, Key ID, and the private key**.
      *(Most involved — do last.)*

**Roll out incrementally.** Set `VITE_OAUTH_PROVIDERS` (Vercel env, client-safe)
to the comma-separated list of providers you've actually configured, so users
never see a button that errors — e.g. `google,kakao` while Apple is still pending.
Unset shows all three; empty shows magic link only. Redeploy after changing it.

Until a provider is configured, its button shows a graceful error; magic link
covers sign-in fully.

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
