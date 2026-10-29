-- Adds an image (flyer/banner) to events and sets the flyer for the 14 Nov conference.
-- Run after 04_gallery_team.sql. Uploads go to the existing "media" bucket under events/.

alter table public.events add column if not exists image_path text;

-- Paths starting with "/" are images shipped with the site; others are files in the media bucket.
update public.events
set image_path = '/events/womens-mentorship-conference-2026.jpg'
where title like 'Women''s Mentorship Conference 2026%';
