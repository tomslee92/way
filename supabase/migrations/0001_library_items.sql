-- 0001_library_items.sql — personal library (library-spec §5).
-- Apply via the Supabase SQL editor or `supabase db push`.
--
-- The personal library holds the verses a user chooses to carry. It stores a
-- reference and translation only — never the verse TEXT (people memorize
-- exactly what's shown, so text is always re-fetched/verified via /api/bible
-- against passage_id). There is deliberately NO score/accuracy/threshold
-- column: status is the user's testimony, never a session outcome
-- (library-spec §2, coaching-not-grading).

create table if not exists public.library_items (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null default auth.uid()
                          references auth.users (id) on delete cascade,
  passage_id            text not null,          -- API.Bible reference, for re-fetch/verify
  ref_display           text not null,          -- e.g. "John 8:58" / "요한복음 8:58"
  translation           text not null,          -- ESV | NKRV (from profile default, overridable)
  status                text not null default 'saved'
                          check (status in ('saved', 'memorizing', 'memorized')),
  declared_memorized_at timestamptz,            -- set ONLY when the user declares (never by a session)
  last_recalled_at      timestamptz,            -- the only time signal; records that a review happened, NOT a grade
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Filter the library view by status; schedule review invitations by recall time (§3).
create index if not exists library_items_user_status_idx
  on public.library_items (user_id, status);
create index if not exists library_items_user_recalled_idx
  on public.library_items (user_id, last_recalled_at);

-- Keep updated_at honest on every mutation. Self-contained — no extension needed.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_library_items_updated_at on public.library_items;
create trigger set_library_items_updated_at
  before update on public.library_items
  for each row execute function public.set_updated_at();

-- Row-level security: a user owns their own rows only (§5).
alter table public.library_items enable row level security;

drop policy if exists "library_items_select_own" on public.library_items;
create policy "library_items_select_own"
  on public.library_items for select
  using (auth.uid() = user_id);

drop policy if exists "library_items_insert_own" on public.library_items;
create policy "library_items_insert_own"
  on public.library_items for insert
  with check (auth.uid() = user_id);

drop policy if exists "library_items_update_own" on public.library_items;
create policy "library_items_update_own"
  on public.library_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "library_items_delete_own" on public.library_items;
create policy "library_items_delete_own"
  on public.library_items for delete
  using (auth.uid() = user_id);
