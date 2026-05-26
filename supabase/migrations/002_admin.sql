-- profiles: user role & active status
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz default now() not null
);

alter table profiles enable row level security;

create policy "admin_all" on profiles
  for all using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- is_public flag on travel_plans
alter table travel_plans add column is_public boolean not null default false;

-- payments table
create table payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  amount integer not null,
  currency text not null default 'KRW',
  status text not null default 'completed' check (status in ('completed', 'refunded', 'pending')),
  description text,
  created_at timestamptz default now() not null
);

alter table payments enable row level security;
-- users see own payments
create policy "users_own_payments" on payments
  for select using (auth.uid() = user_id);
