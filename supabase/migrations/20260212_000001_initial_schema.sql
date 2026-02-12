-- Step 2 baseline schema (compact)
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.app_user_id()
returns uuid language sql stable as $$ select auth.uid(); $$;

-- Identity
create table if not exists public.users (id uuid primary key references auth.users(id) on delete cascade, display_name text not null default 'Expat', tribe text, interest text, onboarding_completed boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.user_profiles (user_id uuid primary key references public.users(id) on delete cascade, level text not null default 'Newcomer', points integer not null default 0, streak integer not null default 0, completed_tasks integer not null default 0, total_tasks integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.user_preferences (user_id uuid primary key references public.users(id) on delete cascade, mood text, language text not null default 'en', notifications_enabled boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.user_progress (user_id uuid primary key references public.users(id) on delete cascade, level_name text not null default 'Newcomer', level_number integer not null default 1, xp integer not null default 0, next_level_xp integer not null default 100, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.badges (id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.user_badges (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, badge_id uuid not null references public.badges(id) on delete cascade, awarded_at timestamptz not null default now(), unique(user_id,badge_id));
create table if not exists public.journey_events (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, title text not null, body text, points integer not null default 0, event_date date not null default current_date, created_at timestamptz not null default now());

-- Home pulse feeds
create table if not exists public.weather_snapshots (id uuid primary key default gen_random_uuid(), city text not null default 'Warsaw', condition text not null, temperature_c numeric(5,2) not null, feels_like_c numeric(5,2), source_name text not null, source_url text, fetched_at timestamptz not null default now(), ttl_seconds integer not null default 1800, created_at timestamptz not null default now());
create table if not exists public.fx_rates (id uuid primary key default gen_random_uuid(), base_currency text not null, quote_currency text not null, rate numeric(18,8) not null, change_24h numeric(10,4) not null default 0, source_name text not null, source_url text, fetched_at timestamptz not null default now(), ttl_seconds integer not null default 1800, created_at timestamptz not null default now());
create table if not exists public.transit_disruptions (id uuid primary key default gen_random_uuid(), external_id text unique, title text not null, summary text not null, severity text not null default 'low', starts_at timestamptz, ends_at timestamptz, source_name text not null, source_url text, fetched_at timestamptz not null default now(), ttl_seconds integer not null default 900, created_at timestamptz not null default now());
create table if not exists public.immigration_updates (id uuid primary key default gen_random_uuid(), external_id text unique, title text not null, summary text not null, body_markdown text, severity text not null default 'medium', published_at timestamptz, source_name text not null, source_url text, fetched_at timestamptz not null default now(), ttl_seconds integer not null default 21600, created_at timestamptz not null default now());
create table if not exists public.legal_parliament_updates (id uuid primary key default gen_random_uuid(), external_id text unique, title text not null, summary text not null, body_markdown text, severity text not null default 'medium', published_at timestamptz, source_name text not null, source_url text, fetched_at timestamptz not null default now(), ttl_seconds integer not null default 21600, created_at timestamptz not null default now());
create table if not exists public.daily_briefings (id uuid primary key default gen_random_uuid(), briefing_date date not null, city text not null default 'Warsaw', title text not null, payload jsonb not null default '{}'::jsonb, source_name text not null default 'expat-village', fetched_at timestamptz not null default now(), ttl_seconds integer not null default 43200, created_at timestamptz not null default now(), unique(briefing_date,city));

-- Checklist
create table if not exists public.task_categories (id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, display_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.tasks (id uuid primary key default gen_random_uuid(), category_id uuid not null references public.task_categories(id), slug text not null unique, title text not null, description text, urgency text not null default 'normal', points integer not null default 0, active boolean not null default true, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.user_task_status (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, task_id uuid not null references public.tasks(id) on delete cascade, status text not null default 'todo', completed_at timestamptz, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id,task_id));

-- Guides
create table if not exists public.guides (id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, category text not null, summary text, body_markdown text, active boolean not null default true, source_name text, source_url text, fetched_at timestamptz, ttl_seconds integer, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.guide_updates (id uuid primary key default gen_random_uuid(), guide_id uuid not null references public.guides(id) on delete cascade, headline text not null, update_type text not null default 'content', source_name text, source_url text, fetched_at timestamptz, created_at timestamptz not null default now());
create table if not exists public.guide_votes (id uuid primary key default gen_random_uuid(), guide_id uuid not null references public.guides(id) on delete cascade, user_id uuid not null references public.users(id) on delete cascade, vote smallint not null check (vote in (-1,1)), created_at timestamptz not null default now(), unique(guide_id,user_id));

-- Directory + reviews
create table if not exists public.service_categories (id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.services (id uuid primary key default gen_random_uuid(), category_id uuid references public.service_categories(id), slug text not null unique, name text not null, district text, address text, verified boolean not null default false, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.service_checkins (id uuid primary key default gen_random_uuid(), service_id uuid not null references public.services(id) on delete cascade, user_id uuid not null references public.users(id) on delete cascade, checked_in_at timestamptz not null default now(), metadata jsonb not null default '{}'::jsonb);
create table if not exists public.service_reviews (id uuid primary key default gen_random_uuid(), service_id uuid not null references public.services(id) on delete cascade, user_id uuid not null references public.users(id) on delete cascade, rating smallint not null check (rating between 1 and 5), title text, body text not null, tags text[] not null default '{}'::text[], created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.review_prompts (id uuid primary key default gen_random_uuid(), checkin_id uuid not null references public.service_checkins(id) on delete cascade, user_id uuid not null references public.users(id) on delete cascade, service_id uuid not null references public.services(id) on delete cascade, prompt_status text not null default 'pending', due_at timestamptz, responded_at timestamptz, created_at timestamptz not null default now());

-- Community
create table if not exists public.community_topics (id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.community_posts (id uuid primary key default gen_random_uuid(), topic_id uuid references public.community_topics(id), user_id uuid not null references public.users(id) on delete cascade, title text not null, body text not null, has_voice boolean not null default false, is_hot boolean not null default false, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.community_comments (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.community_posts(id) on delete cascade, user_id uuid not null references public.users(id) on delete cascade, body text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.community_reactions (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.community_posts(id) on delete cascade, user_id uuid not null references public.users(id) on delete cascade, reaction text not null, created_at timestamptz not null default now(), unique(post_id,user_id,reaction));

-- AI tools
create table if not exists public.contract_analyses (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, document_name text, document_path text, risk_score integer not null check (risk_score between 0 and 100), risk_level text not null, ai_summary text, legal_framework text not null default 'PL', model_version text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.document_analyses (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, document_name text, document_type text, urgency text not null default 'medium', summary text, next_steps jsonb not null default '[]'::jsonb, model_version text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.lawyer_review_requests (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, contract_analysis_id uuid references public.contract_analyses(id) on delete set null, status text not null default 'requested', contact_email text, contact_phone text, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

-- Updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['users','user_profiles','user_preferences','user_progress','badges','task_categories','tasks','user_task_status','guides','service_categories','services','service_reviews','community_topics','community_posts','community_comments','contract_analyses','document_analyses','lawyer_review_requests']
  loop
    execute format('drop trigger if exists set_%1$s_updated_at on public.%1$s; create trigger set_%1$s_updated_at before update on public.%1$s for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- Baseline RLS posture
do $$
declare t text;
begin
  foreach t in array array['users','user_profiles','user_preferences','user_progress','user_badges','journey_events','user_task_status','guide_votes','service_checkins','service_reviews','review_prompts','community_posts','community_comments','community_reactions','contract_analyses','document_analyses','lawyer_review_requests']
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- Public read tables for app feeds/reference content
do $$
declare t text;
begin
  foreach t in array array['badges','weather_snapshots','fx_rates','transit_disruptions','immigration_updates','legal_parliament_updates','daily_briefings','task_categories','tasks','guides','guide_updates','service_categories','services','community_topics']
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for select using (true);', 'public_read_' || t, t);
  end loop;
end $$;

-- Owner policies for user-scoped tables
create policy users_self_select on public.users for select using (id = public.app_user_id());
create policy users_self_update on public.users for update using (id = public.app_user_id());
create policy user_profiles_self_all on public.user_profiles for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy user_preferences_self_all on public.user_preferences for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy user_progress_self_read on public.user_progress for select using (user_id = public.app_user_id());
create policy user_badges_self_read on public.user_badges for select using (user_id = public.app_user_id());
create policy journey_events_self_read on public.journey_events for select using (user_id = public.app_user_id());
create policy user_task_status_self_all on public.user_task_status for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy guide_votes_self_all on public.guide_votes for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy service_checkins_self_all on public.service_checkins for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy service_reviews_self_all on public.service_reviews for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy review_prompts_self_all on public.review_prompts for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy community_posts_self_all on public.community_posts for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy community_comments_self_all on public.community_comments for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy community_reactions_self_all on public.community_reactions for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy contract_analyses_self_all on public.contract_analyses for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy document_analyses_self_all on public.document_analyses for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
create policy lawyer_review_requests_self_all on public.lawyer_review_requests for all using (user_id = public.app_user_id()) with check (user_id = public.app_user_id());
