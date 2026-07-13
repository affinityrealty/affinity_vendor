-- Affinity Realty Vendor Directory — schema + RLS
-- Run this once in the Supabase SQL editor for your project.

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  units text,
  floors text,
  policy text,
  created_at timestamptz not null default now()
);

create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  service text not null,
  company text not null,
  phone text,
  alt_phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists vendors_property_id_idx on vendors(property_id);

create table if not exists trustees (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  email text,
  home text,
  cell text,
  created_at timestamptz not null default now()
);
create index if not exists trustees_property_id_idx on trustees(property_id);

-- RLS: only authenticated users (your team, logged in via Supabase Auth) can
-- read or write anything. No anon policies exist, so the API is unreachable
-- without a session — this is what keeps the directory private.
alter table properties enable row level security;
alter table vendors enable row level security;
alter table trustees enable row level security;

create policy "authenticated full access" on properties
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on vendors
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on trustees
  for all to authenticated using (true) with check (true);
