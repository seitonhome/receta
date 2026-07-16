-- Phase 3 (MVP): authentication + Hotmart access.
--
-- Login itself is handled entirely by Supabase Auth (magic link email, no
-- password). What this migration adds is the bridge between "has a Supabase
-- session" and "is allowed to see the paid content": a `purchases` table the
-- Hotmart webhook writes to, looked up by email at request time.

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user, created automatically on signup.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'buyer' check (role in ('buyer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are updatable by their owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- purchases: written by the Hotmart webhook (service role, bypasses RLS).
-- Looked up by buyer email at request time to grant access -- see
-- src/lib/access/purchase-status.ts. `user_id` is filled in lazily the first
-- time the buyer logs in with the same email, purely for admin/audit
-- convenience; access checks never require it to be set.
-- ---------------------------------------------------------------------------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_email text not null,
  user_id uuid references auth.users (id) on delete set null,
  hotmart_transaction_id text unique,
  product_id text not null default 'comidas-que-te-cuidan',
  status text not null default 'active'
    check (status in ('active', 'refunded', 'cancelled', 'chargeback')),
  purchased_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  raw_payload jsonb,
  constraint purchases_buyer_email_lower check (buyer_email = lower(buyer_email))
);

create index if not exists purchases_buyer_email_idx on public.purchases (buyer_email);

alter table public.purchases enable row level security;

-- Buyers can see their own purchase history; nothing else is exposed.
-- Writes only ever happen through the service-role client in the webhook
-- and admin panel, so there are no insert/update policies here.
create policy "purchases are readable by their buyer"
  on public.purchases for select
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = buyer_email);

-- Keep updated_at accurate without relying on application code.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists purchases_set_updated_at on public.purchases;
create trigger purchases_set_updated_at
  before update on public.purchases
  for each row execute function public.set_updated_at();
