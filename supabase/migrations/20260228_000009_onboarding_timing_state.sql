-- Step 16: Persist onboarding + modal timing state

alter table public.user_preferences
add column if not exists morning_briefing_seen_on date;

alter table public.user_preferences
add column if not exists mood_check_seen_on date;
