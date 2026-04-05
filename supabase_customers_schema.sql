-- ============================================================
-- Mezen Bijouterie — Supabase Customers Table
-- Run this SQL in your Supabase project → SQL Editor
-- ============================================================

create table if not exists customers (
  -- 🔢 Auto-increment integer ID: u1, u2, u3 …
  id         serial       primary key,

  -- 🌐 UUID for browser identification (stored in localStorage)
  uuid       uuid         not null unique default gen_random_uuid(),

  -- 📞 Phone as unique natural key (for upsert on returning users)
  phone      text         not null unique,

  prenom     text         not null,
  nom        text         not null,
  created_at timestamptz  not null default now(),
  updated_at timestamptz  not null default now()
);

-- ── Auto-update `updated_at` on every row update ─────────────────────────────
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_customers_updated_at on customers;
create trigger set_customers_updated_at
  before update on customers
  for each row execute procedure update_updated_at_column();

-- ── Row-Level Security ────────────────────────────────────────────────────────
-- Only the server (service_role) can read/write. Anon/browser cannot.
alter table customers enable row level security;

create policy "service_role_all" on customers
  for all using (auth.role() = 'service_role');

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists idx_customers_phone on customers (phone);
create index if not exists idx_customers_uuid  on customers (uuid);

-- ── Example result ────────────────────────────────────────────────────────────
-- | id | uuid                                 | phone          | prenom | nom    |
-- |----|--------------------------------------|----------------|--------|--------|
-- |  1 | 550e8400-e29b-41d4-a716-446655440000 | +212 6 00 ...  | Mohamed| Alami  |
-- |  2 | 6ba7b810-9dad-11d1-80b4-00c04fd430c8 | +212 6 11 ...  | Sara   | Benali |
