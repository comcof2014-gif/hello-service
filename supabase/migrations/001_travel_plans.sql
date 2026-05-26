create table travel_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  messages jsonb not null default '[]',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table travel_plans enable row level security;

create policy "users_own_plans" on travel_plans
  for all using (auth.uid() = user_id);
/c