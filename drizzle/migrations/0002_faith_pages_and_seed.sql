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

INSERT INTO public.events (title, description, type, date, location, virtual_link, max_attendees) VALUES
('Quarterly Sisterhood Circle: Stepping Into Boldness', 'An evening of worship, honest conversation and sisterhood as we step boldly into our God-given calling.', 'Sisterhood Circle', '2026-11-21 16:00:00+00', 'Virtual / Hybrid · Accra', 'https://x.com', 120),
('Executive Mentorship Roundtable: Navigating Career Transitions', 'Senior women leaders share practical wisdom on changing roles, industries and seasons with clarity.', 'Roundtable', '2026-12-05 14:00:00+00', 'Accra', NULL, 40),
('Faith & Work: Finding Your Calling in Corporate Leadership', 'Integrating faith, integrity and excellence in the workplace — a workshop for young professionals.', 'Workshop', '2027-01-16 10:00:00+00', 'Virtual', 'https://x.com', 200);

INSERT INTO public.impact_stories (title, summary, content, category, author) VALUES
('I found my voice — and my calling', '"Mentorship Circles helped me see myself the way God sees me. I walked in shy; I walked out whole."', 'Before joining Mentorship Circles, I doubted every idea I had. My mentor prayed with me, challenged me and walked with me week after week. Today I lead a student fellowship of 60 young women and I am no longer afraid to speak truth boldly.', 'Testimonial', 'Abena, Mentorship Circles fellow'),
('From intern to team lead in one year', '"Career Clarity gave me a roadmap. Within a year I moved from intern to leading my own team."', 'I had a degree but no direction. Career Clarity helped me name my strengths, build my CV and practise interviews. The sisterhood kept me accountable. Within twelve months I was promoted to team lead at a fintech in Accra.', 'Testimonial', 'Efua, Career Clarity fellow'),
('Leading with boldness in public life', '"Leadership Academy taught me governance and courage. I now serve on my district youth council."', 'Leadership Academy stretched me — public speaking, governance, policy. More than skills, it grounded my leadership in character and faith. I now serve on my district youth council and mentor younger girls in my community.', 'Testimonial', 'Akosua, Leadership Academy fellow'),
('Five habits of leaders who lead from wholeness', 'Rest, reflection and rhythm: why emotional wholeness is a leadership skill.', 'Leadership that lasts flows from wholeness. Build rhythms of rest, honest community, prayer and reflection, healthy boundaries, and celebration. Each one guards your heart so you can pour out without running dry.', 'Emotional Wholeness', 'This Lady Will Team'),
('Truth and boldness at work', 'How faith shapes integrity, courage and excellence in your career.', 'Boldness is not loudness. It is the courage to tell the truth, to own your work with excellence, and to stand for what is right when it costs you. Here is how to practise it daily in your workplace.', 'Faith', 'This Lady Will Team'),
('Your first 90 days as a new leader', 'A practical guide to professional excellence in a new role.', 'Listen first, learn the culture, build trust with quick wins, and set clear expectations. Your first 90 days set the tone for everything that follows.', 'Professional Excellence', 'This Lady Will Team');