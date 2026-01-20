-- 1. Create the lab_models table if it does not exist
create table if not exists lab_models (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  exam_type text not null, -- e.g., 'imat', 'cents'
  subject text not null,   -- e.g., 'biology', 'physics'
  topic_title text,        -- Optional grouping topic
  model_title text not null, -- Display name
  component_id text,       -- Internal React component ID (e.g., 'DNAHelix')
  embed_code text,         -- HTML iframe code for external models
  description text,        -- Short description for the sidebar
  concepts text[]          -- Array of strings for tags
);

-- 2. SAFETY UPDATE: Check for missing columns and add them if the table already existed
do $$
begin
  -- Add embed_code if missing
  if not exists (select 1 from information_schema.columns where table_name = 'lab_models' and column_name = 'embed_code') then
    alter table lab_models add column embed_code text;
  end if;

  -- Add topic_title if missing
  if not exists (select 1 from information_schema.columns where table_name = 'lab_models' and column_name = 'topic_title') then
    alter table lab_models add column topic_title text;
  end if;
end $$;

-- 3. Turn on Row Level Security
alter table lab_models enable row level security;

-- 4. POLICIES
-- Drop existing policies to ensure clean updates if re-running
drop policy if exists "Enable read access for all lab_models" on lab_models;
drop policy if exists "Enable insert for authenticated users" on lab_models;
drop policy if exists "Enable update for authenticated users" on lab_models;
drop policy if exists "Enable delete for authenticated users" on lab_models;

-- Read: Everyone can see the models (public practice)
create policy "Enable read access for all lab_models" 
on lab_models for select 
using (true);

-- Write: Only authenticated users (admins/consultants) can Create/Update/Delete
create policy "Enable insert for authenticated users" 
on lab_models for insert 
with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users" 
on lab_models for update 
using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users" 
on lab_models for delete 
using (auth.role() = 'authenticated');
