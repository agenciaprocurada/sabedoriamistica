-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  name       text,
  email      text not null,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Usuário lê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Cria perfil automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- DREAMS
-- ============================================================
create table if not exists public.dreams (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade not null,
  description   text not null,
  free_analysis text,
  paid_analysis text,
  is_paid       boolean default false,
  payment_id    uuid,
  status        text default 'pending' check (status in ('pending', 'analyzed', 'paid_analyzed')),
  created_at    timestamptz default now()
);

alter table public.dreams enable row level security;

create policy "Usuário lê os próprios sonhos"
  on public.dreams for select
  using (auth.uid() = user_id);

create policy "Usuário insere os próprios sonhos"
  on public.dreams for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza os próprios sonhos"
  on public.dreams for update
  using (auth.uid() = user_id);

create policy "Usuário deleta os próprios sonhos"
  on public.dreams for delete
  using (auth.uid() = user_id);


-- ============================================================
-- PAYMENTS
-- ============================================================
create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references public.profiles(id) on delete cascade not null,
  dream_id          uuid references public.dreams(id) on delete set null,
  stripe_session_id text,
  amount            integer not null,
  status            text default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at        timestamptz default now(),
  completed_at      timestamptz
);

alter table public.payments enable row level security;

create policy "Usuário lê os próprios pagamentos"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Usuário insere os próprios pagamentos"
  on public.payments for insert
  with check (auth.uid() = user_id);
