-- Step 13: Flavor Days live schema and seed data

create table if not exists public.flavor_days (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null check (day_of_week between 0 and 6),
  cuisine text not null,
  emoji text not null default 'FD',
  vibe text not null,
  fun_fact text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (day_of_week)
);

create table if not exists public.flavor_restaurants (
  id uuid primary key default gen_random_uuid(),
  day_id uuid references public.flavor_days(id) on delete set null,
  cuisine text,
  name text not null,
  district text not null,
  rating numeric(3,2) not null default 4.5,
  expat_score numeric(3,1) not null default 8.0,
  discount text not null default '10% with Expat ID',
  verified boolean not null default false,
  distance_km numeric(5,2) not null default 1.0,
  photo_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flavor_activity_feed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  actor_name text not null,
  actor_avatar text not null default 'E',
  action_text text not null,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.flavor_challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  reward_points integer not null default 10,
  total_steps integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flavor_user_challenge_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  challenge_id uuid not null references public.flavor_challenges(id) on delete cascade,
  progress integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, challenge_id)
);

create table if not exists public.flavor_leaderboard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete set null,
  display_name text not null,
  avatar text not null default 'E',
  points integer not null default 0,
  badges integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flavor_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  restaurant_id uuid not null references public.flavor_restaurants(id) on delete cascade,
  reward_points integer not null default 10,
  created_at timestamptz not null default now(),
  unique (user_id, restaurant_id)
);

drop trigger if exists set_flavor_days_updated_at on public.flavor_days;
create trigger set_flavor_days_updated_at
before update on public.flavor_days
for each row execute function public.set_updated_at();

drop trigger if exists set_flavor_restaurants_updated_at on public.flavor_restaurants;
create trigger set_flavor_restaurants_updated_at
before update on public.flavor_restaurants
for each row execute function public.set_updated_at();

drop trigger if exists set_flavor_challenges_updated_at on public.flavor_challenges;
create trigger set_flavor_challenges_updated_at
before update on public.flavor_challenges
for each row execute function public.set_updated_at();

drop trigger if exists set_flavor_user_challenge_progress_updated_at on public.flavor_user_challenge_progress;
create trigger set_flavor_user_challenge_progress_updated_at
before update on public.flavor_user_challenge_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_flavor_leaderboard_updated_at on public.flavor_leaderboard;
create trigger set_flavor_leaderboard_updated_at
before update on public.flavor_leaderboard
for each row execute function public.set_updated_at();

alter table public.flavor_days enable row level security;
alter table public.flavor_restaurants enable row level security;
alter table public.flavor_activity_feed enable row level security;
alter table public.flavor_challenges enable row level security;
alter table public.flavor_user_challenge_progress enable row level security;
alter table public.flavor_leaderboard enable row level security;
alter table public.flavor_checkins enable row level security;

drop policy if exists public_read_flavor_days on public.flavor_days;
create policy public_read_flavor_days on public.flavor_days for select using (active = true);

drop policy if exists public_read_flavor_restaurants on public.flavor_restaurants;
create policy public_read_flavor_restaurants on public.flavor_restaurants for select using (active = true);

drop policy if exists public_read_flavor_activity_feed on public.flavor_activity_feed;
create policy public_read_flavor_activity_feed on public.flavor_activity_feed for select using (true);

drop policy if exists public_read_flavor_challenges on public.flavor_challenges;
create policy public_read_flavor_challenges on public.flavor_challenges for select using (active = true);

drop policy if exists public_read_flavor_leaderboard on public.flavor_leaderboard;
create policy public_read_flavor_leaderboard on public.flavor_leaderboard for select using (true);

drop policy if exists flavor_progress_self_all on public.flavor_user_challenge_progress;
create policy flavor_progress_self_all
on public.flavor_user_challenge_progress
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());

drop policy if exists flavor_checkins_self_all on public.flavor_checkins;
create policy flavor_checkins_self_all
on public.flavor_checkins
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());

drop policy if exists flavor_leaderboard_self_all on public.flavor_leaderboard;
create policy flavor_leaderboard_self_all
on public.flavor_leaderboard
for all
using (user_id = public.app_user_id() or user_id is null)
with check (user_id = public.app_user_id() or user_id is null);

insert into public.flavor_days (day_of_week, cuisine, emoji, vibe, fun_fact, active)
values
  (0, 'Polish Comfort', 'PL', 'Warm, classic, and social', 'Warsaw has hundreds of family-owned milk bars and comfort kitchens.', true),
  (1, 'Italian Street', 'IT', 'Fast, casual, and lively', 'Italy-inspired street food is one of the fastest growing categories in Warsaw.', true),
  (2, 'Japanese Bento', 'JP', 'Precise, calm, and fresh', 'Lunch bento specials are common near business and university districts.', true),
  (3, 'Mexican Fiesta', 'MX', 'Bold, colorful, energetic', 'International food halls frequently rotate Latin menus on mid-week evenings.', true),
  (4, 'Korean Mix', 'KR', 'Modern, spicy, trendy', 'Korean barbecue and ramen bars are concentrated near student hubs.', true),
  (5, 'Middle Eastern', 'ME', 'Shared plates and late chats', 'Shared-plate restaurants are top picks for expat social nights.', true),
  (6, 'Vegan Discovery', 'VG', 'Healthy, bright, experimental', 'Plant-forward menus have expanded rapidly in Warsaw since 2022.', true)
on conflict (day_of_week) do update
set cuisine = excluded.cuisine,
    emoji = excluded.emoji,
    vibe = excluded.vibe,
    fun_fact = excluded.fun_fact,
    active = excluded.active;

insert into public.flavor_restaurants (day_id, cuisine, name, district, rating, expat_score, discount, verified, distance_km, photo_url, active)
values
  ((select id from public.flavor_days where day_of_week = 0), 'Polish Comfort', 'Karma Kitchen', 'Mokotow', 4.8, 9.2, '15% off with Expat ID', true, 1.2, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', true),
  ((select id from public.flavor_days where day_of_week = 0), 'Polish Comfort', 'Relaks Table', 'Srodmiescie', 4.7, 8.9, 'Free drink after 18:00', true, 2.1, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop', true),
  ((select id from public.flavor_days where day_of_week = 0), 'Polish Comfort', 'Praga Plates', 'Praga', 4.6, 8.7, '10% food passport bonus', false, 3.4, 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&h=400&fit=crop', true);

insert into public.flavor_challenges (slug, title, description, reward_points, total_steps, active)
values
  ('taste-passport-3-stamps', 'Taste Passport: 3 Stamps', 'Visit 3 verified restaurants this week.', 40, 3, true),
  ('community-reviewer', 'Community Reviewer', 'Post 2 short reviews with practical expat tips.', 25, 2, true),
  ('bring-a-buddy', 'Bring a Buddy', 'Join one dining group event and check in.', 30, 1, true)
on conflict (slug) do update
set title = excluded.title,
    description = excluded.description,
    reward_points = excluded.reward_points,
    total_steps = excluded.total_steps,
    active = excluded.active;

insert into public.flavor_activity_feed (actor_name, actor_avatar, action_text, points)
values
  ('Sarah M.', 'S', 'posted a Flavor Day photo in Town Hall', 12),
  ('Luca R.', 'L', 'checked in at Karma Kitchen', 10),
  ('Priya K.', 'P', 'completed the 3-stamp challenge', 25);

insert into public.flavor_leaderboard (display_name, avatar, points, badges)
values
  ('Maya T.', 'M', 560, 9),
  ('Alex', 'A', 492, 7),
  ('Daniel P.', 'D', 471, 6);

