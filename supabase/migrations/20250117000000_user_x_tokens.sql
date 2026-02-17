-- Store X (Twitter) OAuth access token per user so API routes can use it
-- when the session/cookie don't have it (e.g. after refresh).
-- Run this in Supabase Dashboard → SQL Editor.

create table if not exists public.user_x_tokens (
  user_id uuid primary key references auth.users(id) on delete cascade,
  x_access_token text not null,
  updated_at timestamptz default now()
);

alter table public.user_x_tokens enable row level security;

-- Users can only read their own token (for API routes with user session)
create policy "Users can read own x token"
  on public.user_x_tokens for select
  using (auth.uid() = user_id);

-- Service role (used in auth callback) can insert/update; no policy needed for that.
comment on table public.user_x_tokens is 'Stores X (Twitter) OAuth access token for API use when session/cookie lack it';
