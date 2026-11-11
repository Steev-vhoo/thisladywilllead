-- Publishes the 12 First Cohort fellows to the Gallery, cropped from the cohort flyer.
-- The images ship with the site (public/gallery/first-cohort). Safe to re-run: it replaces
-- only these entries. Admins can remove photos later from /admin -> Gallery.

delete from public.gallery_items where image_path like '/gallery/first-cohort/%';

insert into public.gallery_items (image_path, caption, album, sort_order) values
  ('/gallery/first-cohort/01-afua-nhyira-owusu-mintah.jpg', 'Afua Nhyira Owusu-Mintah — University of Cape Coast, LLB', 'First Cohort', 1),
  ('/gallery/first-cohort/02-justina-laar.jpg', 'Justina Laar — Ghana School of Law, Professional Law Course', 'First Cohort', 2),
  ('/gallery/first-cohort/03-suguru-veila-farida-yakubu.jpg', 'Suguru-Veila Farida Yakubu — University of Ghana, LLB', 'First Cohort', 3),
  ('/gallery/first-cohort/04-mary-margaret-sarkodie-baffoe.jpg', 'Mary-Margaret Sarkodie Baffoe — UPSA, LLB', 'First Cohort', 4),
  ('/gallery/first-cohort/05-hariratah-ibrahim-doudu.jpg', 'Hariratah Ibrahim Doudu — Ghana School of Law, Professional Law Course', 'First Cohort', 5),
  ('/gallery/first-cohort/06-akonsi-theresah-vieltiwuni.jpg', 'Akonsi Theresah Vieltiwuni — Ghana School of Law, Professional Law Course', 'First Cohort', 6),
  ('/gallery/first-cohort/07-michaellina-nkeyasen.jpg', 'Michaellina Nkeyasen — UPSA, LLB', 'First Cohort', 7),
  ('/gallery/first-cohort/08-deborah-amissah.jpg', 'Deborah Amissah — Ghana School of Law, Professional Law Course', 'First Cohort', 8),
  ('/gallery/first-cohort/09-christiana-nketia-opoku.jpg', 'Christiana Nketia Opoku — Pentecost University, LLB', 'First Cohort', 9),
  ('/gallery/first-cohort/10-angela-ati.jpg', 'Angela Ati — KNUST, BSc Agricultural Biotechnology', 'First Cohort', 10),
  ('/gallery/first-cohort/11-ewuradjwoa-nhyira-walker.jpg', 'Ewuradjwoa Nhyira Walker — University of Kent, LLB (Hons)', 'First Cohort', 11),
  ('/gallery/first-cohort/12-mariama-mohammed-issah.jpg', 'Mariama Mohammed Issah — Central University, LLB', 'First Cohort', 12);
