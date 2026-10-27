-- This Lady Will: full schema for a fresh Supabase project (the Vercel deployment).
-- Same tables, roles and row-level security as drizzle/migrations 0000-0002, minus their
-- sample events and testimonials, plus the hardening at the end of this file.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create type public.app_role as enum ('member','volunteer','admin');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Members can view directory" on public.profiles for select to authenticated using (true);
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = user_id);
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = user_id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'member');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null,
  donor_email text not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'GHS',
  payment_method text not null default 'MoMo',
  transaction_ref text not null unique,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
grant all on public.donations to service_role;
grant select on public.donations to authenticated;
alter table public.donations enable row level security;
create policy "Admins view donations" on public.donations for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.volunteers_or_applicants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  location text,
  program_or_track text not null,
  education text,
  career_aspirations text,
  statement text not null,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);
grant insert on public.volunteers_or_applicants to anon, authenticated;
grant select on public.volunteers_or_applicants to authenticated;
grant all on public.volunteers_or_applicants to service_role;
alter table public.volunteers_or_applicants enable row level security;
create policy "Anyone can apply" on public.volunteers_or_applicants for insert to anon, authenticated with check (status = 'submitted');
create policy "Admins view applicants" on public.volunteers_or_applicants for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.impact_stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  content text not null,
  image_url text,
  category text not null default 'Story',
  author text,
  created_at timestamptz not null default now()
);
grant select on public.impact_stories to anon, authenticated;
grant all on public.impact_stories to service_role;
alter table public.impact_stories enable row level security;
create policy "Stories are public" on public.impact_stories for select to anon, authenticated using (true);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null default 'Workshop',
  date timestamptz not null,
  location text,
  virtual_link text,
  max_attendees int not null default 50,
  created_at timestamptz not null default now()
);
grant select on public.events to anon, authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "Events are public" on public.events for select to anon, authenticated using (true);

create table public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique (event_id, email)
);
grant insert on public.event_rsvps to anon, authenticated;
grant all on public.event_rsvps to service_role;
alter table public.event_rsvps enable row level security;
create policy "Anyone can RSVP" on public.event_rsvps for insert to anon, authenticated with check (true);

create or replace function public.event_rsvp_count(_event_id uuid)
returns int language sql stable security definer set search_path = public
as $$ select count(*)::int from public.event_rsvps where event_id = _event_id $$;
grant execute on function public.event_rsvp_count(uuid) to anon, authenticated;

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, message text not null,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "Anyone can send message" on public.contact_messages for insert to anon, authenticated with check (true);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
grant insert on public.newsletter_subscribers to anon, authenticated;
grant all on public.newsletter_subscribers to service_role;
alter table public.newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_stories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT ON public.event_rsvps TO authenticated;
GRANT SELECT ON public.volunteers_or_applicants TO authenticated;
GRANT SELECT ON public.donations TO authenticated;
CREATE POLICY "Admins insert stories" ON public.impact_stories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update stories" ON public.impact_stories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete stories" ON public.impact_stories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update events" ON public.events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete events" ON public.events FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view rsvps" ON public.event_rsvps FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
ALTER TABLE public.event_rsvps DROP CONSTRAINT IF EXISTS event_rsvps_event_id_fkey;
ALTER TABLE public.event_rsvps ADD CONSTRAINT event_rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_rsvps ADD COLUMN IF NOT EXISTS questions text;

CREATE TABLE public.volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL, email text NOT NULL, phone text, track text NOT NULL,
  experience text, availability text, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.volunteer_applications TO anon, authenticated;
GRANT SELECT ON public.volunteer_applications TO authenticated;
GRANT ALL ON public.volunteer_applications TO service_role;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply to volunteer" ON public.volunteer_applications FOR INSERT TO anon, authenticated WITH CHECK (length(full_name) BETWEEN 2 AND 100 AND length(email) <= 255);
CREATE POLICY "Admins view volunteers" ON public.volunteer_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.story_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL, email text NOT NULL, cohort text, story text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.story_submissions TO anon, authenticated;
GRANT SELECT ON public.story_submissions TO authenticated;
GRANT ALL ON public.story_submissions TO service_role;
ALTER TABLE public.story_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can share a story" ON public.story_submissions FOR INSERT TO anon, authenticated WITH CHECK (length(story) BETWEEN 20 AND 5000 AND length(email) <= 255);
CREATE POLICY "Admins view story submissions" ON public.story_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.resource_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL, resource text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.resource_leads TO anon, authenticated;
GRANT SELECT ON public.resource_leads TO authenticated;
GRANT ALL ON public.resource_leads TO service_role;
ALTER TABLE public.resource_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a resource" ON public.resource_leads FOR INSERT TO anon, authenticated WITH CHECK (length(email) <= 255);
CREATE POLICY "Admins view resource leads" ON public.resource_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));


-- ---------------------------------------------------------------------------
-- Hardening (not in the Lovable migrations)
-- ---------------------------------------------------------------------------

-- Sign-up is open, so any signed-in user could read every member's email.
-- The portal directory only needs names, so signed-in users get those columns only.
-- Column grants apply to admins too; they see emails in the Supabase dashboard.
revoke select on public.profiles from authenticated;
grant select (id, user_id, full_name, created_at) on public.profiles to authenticated;

-- The RSVP form checks capacity in the browser; enforce it in the database too.
create or replace function public.enforce_event_capacity()
returns trigger language plpgsql security definer set search_path = public
as $$
declare cap int;
begin
  select max_attendees into cap from public.events where id = new.event_id for update;
  if (select count(*) from public.event_rsvps where event_id = new.event_id) >= cap then
    raise exception 'This event is full.' using errcode = 'P0001';
  end if;
  return new;
end; $$;
create trigger event_rsvps_capacity before insert on public.event_rsvps
  for each row execute function public.enforce_event_capacity();

-- Admins could not read these submissions before.
grant select on public.contact_messages, public.newsletter_subscribers to authenticated;
create policy "Admins view messages" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins view subscribers" on public.newsletter_subscribers for select to authenticated using (public.has_role(auth.uid(), 'admin'));
