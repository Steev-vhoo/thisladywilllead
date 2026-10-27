-- Gallery photos, team/mentor profiles, and the public "media" storage bucket they use.
-- Run after 01_schema.sql.

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  caption text,
  album text not null default 'General',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;
grant all on public.gallery_items to service_role;
alter table public.gallery_items enable row level security;
create policy "Gallery is public" on public.gallery_items for select to anon, authenticated using (true);
create policy "Admins insert gallery" on public.gallery_items for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update gallery" on public.gallery_items for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete gallery" on public.gallery_items for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  group_name text not null default 'Mentor' check (group_name in ('Founder', 'Team', 'Mentor')),
  bio text,
  photo_path text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.team_members to anon, authenticated;
grant insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;
create policy "Team is public" on public.team_members for select to anon, authenticated using (true);
create policy "Admins insert team" on public.team_members for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update team" on public.team_members for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete team" on public.team_members for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Public bucket: anyone can view files by URL, only admins can change them. 5 MB images only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy "Admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

-- The founder is the only confirmed profile. With no photo_path, the site uses the bundled portrait.
insert into public.team_members (full_name, role, group_name, sort_order)
values ('Christine Opoku Onyinah Esq.', 'Founder & Convenor', 'Founder', 0);
