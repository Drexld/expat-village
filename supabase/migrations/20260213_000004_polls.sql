-- Step: Village vibes polls live backend schema

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('song', 'series')),
  period text not null check (period in ('daily', 'monthly')),
  question text not null,
  ends_at timestamptz not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  title text not null,
  artist text,
  year text,
  preview text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

drop trigger if exists set_polls_updated_at on public.polls;
create trigger set_polls_updated_at
before update on public.polls
for each row execute function public.set_updated_at();

drop trigger if exists set_poll_options_updated_at on public.poll_options;
create trigger set_poll_options_updated_at
before update on public.poll_options
for each row execute function public.set_updated_at();

alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;

drop policy if exists public_read_polls on public.polls;
create policy public_read_polls
on public.polls
for select
using (active = true);

drop policy if exists public_read_poll_options on public.poll_options;
create policy public_read_poll_options
on public.poll_options
for select
using (true);

drop policy if exists poll_votes_self_all on public.poll_votes;
create policy poll_votes_self_all
on public.poll_votes
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());
