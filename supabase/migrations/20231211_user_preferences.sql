-- Create user preferences table
create table public.user_preferences (
  id uuid primary key references auth.users on delete cascade,
  theme text not null default 'dark',
  left_panel_width integer not null default 320,
  right_panel_width integer not null default 480,
  left_panel_collapsed boolean not null default false,
  right_panel_collapsed boolean not null default false,
  current_view text not null default 'navigator',
  last_opened_path text[] not null default array['root'],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- Create RLS policies
create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = id);

-- Create function to handle user creation
create or replace function public.handle_new_user_preferences()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_preferences (
    id,
    theme,
    left_panel_width,
    right_panel_width,
    left_panel_collapsed,
    right_panel_collapsed,
    current_view,
    last_opened_path
  ) values (
    new.id,
    'dark',
    320,
    480,
    false,
    false,
    'navigator',
    array['root']
  );
  return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created_preferences
  after insert on auth.users
  for each row execute procedure public.handle_new_user_preferences();

-- Create function to automatically update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create trigger for updated_at
create trigger set_updated_at
  before update on public.user_preferences
  for each row execute procedure public.handle_updated_at(); 