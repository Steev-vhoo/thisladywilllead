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

insert into public.events (title, description, type, date, location, virtual_link, max_attendees) values
('Leading Out Loud: Public Speaking Lab','Hands-on session to find your voice and own the room.','Workshop', now() + interval '7 days','Accra Digital Centre, Accra',null,40),
('X Space: Breaking Into Tech as a Young Woman','Live conversation with women building Ghana''s tech scene.','X Space', now() + interval '10 days','Online','https://x.com/i/spaces',500),
('Career Clarity Bootcamp','A full day mapping your purpose, strengths and next career move.','Workshop', now() + interval '18 days','Kumasi, KNUST Campus',null,60),
('X Space: Money, Mindset & Ambition','Financial confidence for the woman who plans to lead.','X Space', now() + interval '24 days','Online','https://x.com/i/spaces',500),
('Mentorship Circle Mixer','Meet your mentors and sisters in the new cohort.','Networking', now() + interval '32 days','Takoradi Hub, Takoradi',null,30);

insert into public.impact_stories (title, summary, content, category, author) values
('From Shy Student to Student Body President','Akosua joined our first Mentorship Circle unsure of her voice. Two semesters later, she won.','When Akosua walked into her first circle, she barely spoke. Her mentor gave her one challenge a week: ask one question, then lead one discussion, then run one meeting. By the end of the cohort she had a campaign team and a plan. She now leads 4,000 students.','Testimonial','Akosua M., Cohort 1'),
('Why Ghana Needs More Women at the Table','Our founder on the leadership gap, and what we are doing about it.','Women make up half of Ghana''s population, but a fraction of its boardrooms and parliament. The gap is not about ability. It is about access: to mentors, to networks, to someone saying "you can". This Lady Will exists to close that gap, one sister at a time.','Blog','The Founder'),
('Landing My First Role in Fintech','Career Clarity helped Efua turn a vague dream into a job offer.','Efua knew she loved numbers but had no idea where to start. Through Career Clarity she mapped her strengths, rebuilt her CV and practised interviews with a mentor in banking. Three months later she signed her first offer at a Accra fintech startup.','Testimonial','Efua A., Cohort 2'),
('5 Leadership Habits You Can Start Today','Small daily actions that build the leader in you.','1. Speak first in one meeting a week. 2. Keep a wins journal. 3. Ask for feedback, not approval. 4. Mentor someone younger. 5. Protect your rest. Leadership is a practice, not a title.','Blog','Leadership Academy Team');