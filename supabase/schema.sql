-- Ejecuta este archivo en Supabase > SQL Editor.
create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  category text not null,
  context text not null default 'Proyecto de ZR Software',
  year integer not null,
  technologies text[] not null default '{}',
  image_url text,
  accent text not null default 'green' check (accent in ('green', 'light', 'dark')),
  featured boolean not null default false,
  published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  project_type text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;

create policy "Public can read published projects"
  on public.projects for select
  using (published = true or public.is_admin());

create policy "Authenticated users can create projects"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

create policy "Authenticated users can update projects"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Authenticated users can delete projects"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

create policy "Anyone can submit contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can read messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

create policy "Authenticated users can update messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

create policy "Public can view project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Authenticated users can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

create policy "Authenticated users can update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());

create policy "Authenticated users can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());

-- Después de crear el usuario administrador en Authentication > Users,
-- reemplaza el UUID y ejecuta esta línea una sola vez:
-- insert into public.admin_users (user_id) values ('UUID-DEL-USUARIO');
