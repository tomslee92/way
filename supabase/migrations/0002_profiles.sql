-- 0002_profiles.sql — user profile (preferred language). Apply via the Supabase
-- SQL editor or `supabase db push`, alongside 0001.
--
-- Minimal by design: one row per user, holding the language preference set at
-- onboarding (and updated whenever they change the EN/한국어 toggle). A
-- translation column is intentionally omitted for now — the personal library is
-- English-only and curated content carries its own bilingual data, so there is
-- nothing for it to drive yet.

create table if not exists public.profiles (
  id          uuid primary key default auth.uid()
                references auth.users (id) on delete cascade,
  language    text not null default 'en' check (language in ('en', 'ko')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Keep updated_at honest (function is shared with 0001; redefined idempotently
-- so this migration is self-contained).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Row-level security: a user owns their own profile only.
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
