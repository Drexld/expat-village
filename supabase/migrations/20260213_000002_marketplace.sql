-- Step: Marketplace live backend schema

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  price numeric(12,2) not null check (price > 0),
  category text not null,
  condition text not null default 'Good',
  description text not null,
  distance_text text not null default 'Nearby',
  images_count integer not null default 1,
  escrow_available boolean not null default true,
  has_ar boolean not null default false,
  featured boolean not null default false,
  ai_scam_score integer not null default 10 check (ai_scam_score between 0 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_interests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  mode text not null default 'message_seller',
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

create table if not exists public.marketplace_reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_marketplace_listings_updated_at on public.marketplace_listings;
create trigger set_marketplace_listings_updated_at
before update on public.marketplace_listings
for each row execute function public.set_updated_at();

drop trigger if exists set_marketplace_reviews_updated_at on public.marketplace_reviews;
create trigger set_marketplace_reviews_updated_at
before update on public.marketplace_reviews
for each row execute function public.set_updated_at();

alter table public.marketplace_listings enable row level security;
alter table public.marketplace_interests enable row level security;
alter table public.marketplace_reviews enable row level security;

drop policy if exists public_read_marketplace_listings on public.marketplace_listings;
create policy public_read_marketplace_listings
on public.marketplace_listings
for select
using (active = true);

drop policy if exists public_read_marketplace_reviews on public.marketplace_reviews;
create policy public_read_marketplace_reviews
on public.marketplace_reviews
for select
using (true);

drop policy if exists marketplace_listings_self_all on public.marketplace_listings;
create policy marketplace_listings_self_all
on public.marketplace_listings
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());

drop policy if exists marketplace_interests_self_all on public.marketplace_interests;
create policy marketplace_interests_self_all
on public.marketplace_interests
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());

drop policy if exists marketplace_reviews_self_all on public.marketplace_reviews;
create policy marketplace_reviews_self_all
on public.marketplace_reviews
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());
