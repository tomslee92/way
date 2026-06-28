-- 0003_curated_progress.sql — per-user curated memorization progress.
-- Apply via the Supabase SQL editor or `supabase db push`.
--
-- Which curated memory verses a user has carried all the way through the cue
-- ladder (the session's from-memory finish). This is NOT a grade and NOT the
-- user's testimony — it is the app's own record that a from-memory recitation
-- happened, the curated counterpart to library_items.last_recalled_at. It stores
-- only the curated identity (topic_id / verse_id) — never verse TEXT.
--
-- Append-only by design: there is a SELECT and an INSERT policy but deliberately
-- NO update or delete policy, so the table structurally cannot demote a verse
-- (mirrors the app-wide "never demote" rule). Anonymous progress kept in the
-- browser's localStorage is merged up (union) on sign-in.

create table if not exists public.curated_progress (
  user_id      uuid not null default auth.uid()
                 references auth.users (id) on delete cascade,
  topic_id     text not null,                  -- e.g. 'crying-out'
  verse_id     text not null,                  -- e.g. 'crying-out-mercy'
  memorized_at timestamptz not null default now(),
  primary key (user_id, topic_id, verse_id)    -- one row per verse; idempotent upsert
);

create index if not exists curated_progress_user_idx
  on public.curated_progress (user_id);

-- Row-level security: a user owns their own rows only.
alter table public.curated_progress enable row level security;

drop policy if exists "curated_progress_select_own" on public.curated_progress;
create policy "curated_progress_select_own"
  on public.curated_progress for select
  using (auth.uid() = user_id);

drop policy if exists "curated_progress_insert_own" on public.curated_progress;
create policy "curated_progress_insert_own"
  on public.curated_progress for insert
  with check (auth.uid() = user_id);

-- (No update/delete policy — append-only. The app never demotes.)
