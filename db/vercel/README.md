# Supabase for the Vercel deployment

The Lovable site uses a Supabase project managed by Lovable Cloud. The Vercel
deployment gets its own project, owned by This Lady Will. The app code does not
change: it reads the project from environment variables.

These files are plain SQL, run by hand in the Supabase dashboard. They live
outside `supabase/migrations` on purpose, so Lovable never tries to apply them
to its own database.

| File | What it does |
|---|---|
| `01_schema.sql` | All tables, roles, row-level security and functions from `drizzle/migrations`, without the sample events and testimonials, plus hardening (members can't read each other's emails, RSVP capacity enforced in the database, admins can read contact messages and subscribers) |
| `02_seed.sql` | Real content only: the Women's Mentorship Conference, 14 Nov 2026 |
| `03_make_admin.sql` | Makes a signed-up account an admin |
| `04_gallery_team.sql` | Gallery photos, team/mentor profiles (with the founder) and the public `media` storage bucket. Admins manage both from `/admin` |
| `05_event_images.sql` | Adds a flyer/image to events (managed in `/admin` → Events) and sets the 14 Nov conference flyer |

## 1. Create the project

1. Sign in at https://supabase.com with an account the organisation controls
   (for example thisladywill@gmail.com), and create an organisation for
   This Lady Will.
2. **New project**. Name: `thisladywill`. Pick a European region (London or
   Frankfurt are closest to Ghana). Save the database password in a password
   manager.

## 2. Create the database

In the project: **SQL Editor -> New query**. Paste `01_schema.sql`, click
**Run**. Then do the same with `02_seed.sql`, `04_gallery_team.sql` and `05_event_images.sql`.

Before running the seed, confirm the conference seat capacity with the client
and change `100` if needed.

## 3. Set up sign-in

**Authentication -> URL Configuration**

- Site URL: the live address, e.g. `https://thisladywill.org` (or the
  `*.vercel.app` address until the domain is connected)
- Redirect URLs: add `https://<your-vercel-domain>/**` and
  `https://*-<your-vercel-team>.vercel.app/**` for preview deployments

**Authentication -> Emails -> SMTP Settings**: Supabase's built-in email
service only sends a few emails per hour and is not meant for production.
Connect a sender such as Resend before launch, otherwise sign-up and
magic-link emails will stop arriving.

## 4. Connect Vercel

In Supabase, **Project Settings -> API Keys** (and **Data API** for the URL).
In Vercel, **Project -> Settings -> Environment Variables**, add for
Production and Preview:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_...`) |
| `VITE_SUPABASE_PROJECT_ID` | Project ref (the subdomain of the URL) |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key (`sb_secret_...`). Never share or commit it |
| `PAYSTACK_SECRET_KEY` | From Paystack, when ready |

These override the Lovable values in the committed `.env`. Redeploy after
adding them.

## 5. Make the first admin

1. On the deployed site, go to **Login -> Sign up** and create the account.
2. In the SQL Editor, put that email into `03_make_admin.sql` and run it.
3. Sign in again and open `/admin`.

## 6. Paystack webhook

In the Paystack dashboard, set the webhook URL to
`https://<your-domain>/api/public/paystack-webhook`.
