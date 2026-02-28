-- Step: Student hub live extensions (discounts, groups, university submissions)

create table if not exists public.student_discounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  discount_text text not null,
  category text not null,
  distance_text text,
  valid_until date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_group_memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.student_groups(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table if not exists public.student_university_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  short_name text not null,
  location text not null,
  website text,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_student_discounts_updated_at on public.student_discounts;
create trigger set_student_discounts_updated_at
before update on public.student_discounts
for each row execute function public.set_updated_at();

drop trigger if exists set_student_groups_updated_at on public.student_groups;
create trigger set_student_groups_updated_at
before update on public.student_groups
for each row execute function public.set_updated_at();

drop trigger if exists set_student_university_submissions_updated_at on public.student_university_submissions;
create trigger set_student_university_submissions_updated_at
before update on public.student_university_submissions
for each row execute function public.set_updated_at();

alter table public.student_discounts enable row level security;
alter table public.student_groups enable row level security;
alter table public.student_group_memberships enable row level security;
alter table public.student_university_submissions enable row level security;

drop policy if exists public_read_student_discounts on public.student_discounts;
create policy public_read_student_discounts
on public.student_discounts
for select
using (active = true);

drop policy if exists public_read_student_groups on public.student_groups;
create policy public_read_student_groups
on public.student_groups
for select
using (true);

drop policy if exists student_group_memberships_self_all on public.student_group_memberships;
create policy student_group_memberships_self_all
on public.student_group_memberships
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());

drop policy if exists student_university_submissions_self_all on public.student_university_submissions;
create policy student_university_submissions_self_all
on public.student_university_submissions
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());
