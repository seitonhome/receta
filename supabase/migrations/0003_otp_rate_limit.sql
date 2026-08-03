-- Rate limiting for one-time-code sign-in requests. Without this, anyone
-- could spam access codes to an arbitrary email address by repeatedly
-- submitting the sign-in form -- this table lets the server action count
-- recent requests per email before calling Supabase's signInWithOtp.
--
-- No RLS policies on purpose: only the service-role client (used from the
-- requestMagicLink server action) ever touches this table, so it should
-- stay fully inaccessible to anon/authenticated roles.
create table if not exists public.otp_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  requested_at timestamptz not null default now()
);

create index if not exists otp_requests_email_time_idx
  on public.otp_requests (email, requested_at);

alter table public.otp_requests enable row level security;

-- Housekeeping: drop rows older than a day so this table doesn't grow
-- forever. Run manually or wire up to a scheduled job later; not required
-- for the rate limit itself to work.
-- delete from public.otp_requests where requested_at < now() - interval '1 day';
