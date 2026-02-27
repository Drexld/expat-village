-- Step: Add profile bio support

alter table public.users
add column if not exists bio text;
