-- Carlin Flix: esquema inicial Supabase
-- Execute no SQL Editor do seu projeto Supabase.
-- Use apenas vídeos, capas e links que você tem autorização para distribuir.

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'Outros',
  year integer,
  cover_path text,
  video_path text,
  stream_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.movies enable row level security;

-- Todos podem ler o catálogo. Só administradores autenticados podem alterar.
create policy "Anyone can read movies"
on public.movies for select
to anon, authenticated
using (true);

create policy "Admins can insert movies"
on public.movies for insert
to authenticated
with check (exists (
  select 1 from public.admins a where a.user_id = auth.uid()
));

create policy "Admins can update movies"
on public.movies for update
to authenticated
using (exists (
  select 1 from public.admins a where a.user_id = auth.uid()
))
with check (exists (
  select 1 from public.admins a where a.user_id = auth.uid()
));

create policy "Admins can delete movies"
on public.movies for delete
to authenticated
using (exists (
  select 1 from public.admins a where a.user_id = auth.uid()
));

-- Buckets públicos para reprodução simples no primeiro lançamento.
-- Atenção: arquivos públicos podem ser acessados por qualquer pessoa com a URL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('movie-covers', 'movie-covers', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('movie-videos', 'movie-videos', true, 1073741824, array['video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Todos podem ler os arquivos dos buckets públicos.
create policy "Public can read movie assets"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('movie-covers', 'movie-videos'));

-- Somente usuários cadastrados como admins podem enviar/alterar/excluir arquivos.
create policy "Admins can upload movie assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('movie-covers', 'movie-videos')
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

create policy "Admins can update movie assets"
on storage.objects for update
to authenticated
using (
  bucket_id in ('movie-covers', 'movie-videos')
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
)
with check (
  bucket_id in ('movie-covers', 'movie-videos')
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

create policy "Admins can delete movie assets"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('movie-covers', 'movie-videos')
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);
