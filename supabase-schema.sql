-- IBTSS Digital Passport Schema
-- Run this in your Supabase SQL editor

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz default now(),
  verified_at timestamptz
);

-- Safe to re-run against an existing database created before verification
-- was added.
alter table participants add column if not exists verified_at timestamptz;

create table if not exists stamps (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references participants(id) on delete cascade,
  station_id integer not null check (station_id in (1, 2, 3)),
  stamped_at timestamptz default now(),
  unique(participant_id, station_id)
);

-- View to check completion
create or replace view passport_progress as
select
  p.id,
  p.name,
  p.email,
  count(s.station_id) as stamps_collected,
  array_agg(s.station_id order by s.station_id) as stations_completed,
  count(s.station_id) = 3 as is_complete
from participants p
left join stamps s on s.participant_id = p.id
group by p.id, p.name, p.email;

-- Toolkit worksheet responses (one row per participant per toolkit section)
create table if not exists toolkit_responses (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references participants(id) on delete cascade,
  section_id text not null,
  responses jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  unique(participant_id, section_id)
);

-- Enable Row Level Security (open for demo; tighten for production)
alter table participants enable row level security;
alter table stamps enable row level security;
alter table toolkit_responses enable row level security;

drop policy if exists "Allow all" on participants;
drop policy if exists "Allow all" on stamps;
drop policy if exists "Allow all" on toolkit_responses;

create policy "Allow all" on participants for all using (true) with check (true);
create policy "Allow all" on stamps for all using (true) with check (true);
create policy "Allow all" on toolkit_responses for all using (true) with check (true);
