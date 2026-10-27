-- Run after the person has signed up on the site (Login -> Sign up).
-- Replace the email, then run. Gives that account access to /admin.
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'thisladywill@gmail.com'
on conflict (user_id, role) do nothing;
