-- Step: AI Hub live persistence snapshots

create table if not exists public.ai_hub_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  module text not null check (
    module in ('forecast', 'matches', 'advice', 'coach', 'luck', 'shadow', 'student')
  ),
  snapshot jsonb not null default '{}'::jsonb,
  confidence integer check (confidence between 0 and 100),
  source text not null default 'expat-village-ai-hub',
  ttl_seconds integer not null default 1800,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module)
);

drop trigger if exists set_ai_hub_snapshots_updated_at on public.ai_hub_snapshots;
create trigger set_ai_hub_snapshots_updated_at
before update on public.ai_hub_snapshots
for each row execute function public.set_updated_at();

alter table public.ai_hub_snapshots enable row level security;

drop policy if exists ai_hub_snapshots_self_all on public.ai_hub_snapshots;
create policy ai_hub_snapshots_self_all
on public.ai_hub_snapshots
for all
using (user_id = public.app_user_id())
with check (user_id = public.app_user_id());

