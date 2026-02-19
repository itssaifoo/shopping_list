-- Create a table for items
create table items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  category text,
  aisle text,
  status text default 'needed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for shopping history
create table history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  purchased jsonb default '[]'::jsonb,
  missed jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table items enable row level security;
alter table history enable row level security;

create policy "Users can delete their own items." on items for delete using (auth.uid() = user_id);
create policy "Users can insert their own items." on items for insert with check (auth.uid() = user_id);
create policy "Users can select their own items." on items for select using (auth.uid() = user_id);
create policy "Users can update their own items." on items for update using (auth.uid() = user_id);

create policy "Users can delete their own history." on history for delete using (auth.uid() = user_id);
create policy "Users can insert their own history." on history for insert with check (auth.uid() = user_id);
create policy "Users can select their own history." on history for select using (auth.uid() = user_id);
create policy "Users can update their own history." on history for update using (auth.uid() = user_id);
