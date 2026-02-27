-- Step: Student hub live backend schema

create table if not exists public.student_universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  logo text not null default 'UNI',
  location text not null,
  recent_topics text[] not null default '{}'::text[],
  verified boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_university_memberships (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.student_universities(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (university_id, user_id)
);

create table if not exists public.student_events (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.student_universities(id) on delete set null,
  title text not null,
  event_date date not null,
  event_time text not null,
  location text not null,
  attending_count integer not null default 0,
  category text not null default 'Social',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_roommates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  name text not null,
  university_name text not null,
  country text not null,
  looking_for text not null,
  budget text,
  interests text[] not null default '{}'::text[],
  avatar text not null default 'U',
  verified boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_roommate_swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_user_id uuid not null references public.users(id) on delete cascade,
  profile_id uuid not null references public.student_roommates(id) on delete cascade,
  direction text not null check (direction in ('left', 'right')),
  created_at timestamptz not null default now(),
  unique (swiper_user_id, profile_id)
);

drop trigger if exists set_student_universities_updated_at on public.student_universities;
create trigger set_student_universities_updated_at
before update on public.student_universities
for each row execute function public.set_updated_at();

drop trigger if exists set_student_events_updated_at on public.student_events;
create trigger set_student_events_updated_at
before update on public.student_events
for each row execute function public.set_updated_at();

drop trigger if exists set_student_roommates_updated_at on public.student_roommates;
create trigger set_student_roommates_updated_at
before update on public.student_roommates
for each row execute function public.set_updated_at();

alter table public.student_universities enable row level security;
alter table public.student_university_memberships enable row level security;
alter table public.student_events enable row level security;
alter table public.student_roommates enable row level security;
alter table public.student_roommate_swipes enable row level security;

drop policy if exists public_read_student_universities on public.student_universities;
create policy public_read_student_universities
on public.student_universities
for select
using (active = true);

drop policy if exists public_read_student_events on public.student_events;
create policy public_read_student_events
on public.student_events
for select
using (active = true);

drop policy if exists public_read_student_roommates on public.student_roommates;
create policy public_read_student_roommates
on public.student_roommates
for select
using (active = true);

drop policy if exists student_memberships_self_all on public.student_university_memberships;
create policy student_memberships_self_all
on public.student_university_memberships
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());

drop policy if exists student_swipes_self_all on public.student_roommate_swipes;
create policy student_swipes_self_all
on public.student_roommate_swipes
for all
using (swiper_user_id = public.app_user_id())
with check (swiper_user_id = public.app_user_id());
