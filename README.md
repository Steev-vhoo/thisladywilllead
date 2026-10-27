# Thisladywilllead

You are a senior full-stack engineer and UI/UX designer. Build a modern, high-converting, accessible web application for an NGO.
THIS LADY WILL
- **Mission**: Mentorship and leadership empowerment for young women becoming leaders.
- **Tone**: Bold, urgent, inspiring, celebratory, and community-driven.
- **Brand Colors**: 
  - Primary: Regal Royal Purple (`#4C1D95` or `#581C87`)
  - Accent: Radiant Warm Gold (`#D97706` or `#F59E0B`)
  - Backgrounds: Warm Ivory (`#FAFAF9`) and Crisp White (`#FFFFFF`)
- **Key Sections**:
  1. Hero: High-energy, bold typography, photo collage of young African women, dual CTAs ("Join the Cohort", "Partner / Donate").
  2. About & Leadership: Founder vision and team/mentor spotlight grid.
  3. Programs Overview: 3 core tracks (Mentorship Circles, Leadership Academy, Career Clarity) with "Apply Now" buttons.
  4. Program Application Modal/Page: Comprehensive intake form with fields for personal statement, education, and career aspirations.
  5. Event Calendar & Booking: Filterable list of upcoming workshops and Twitter/X Spaces with RSVP functionality.
  6. Impact Stories & Blog: Inspiring articles and testimonials from past cohort fellows.
  7. Donation Section: Preset MoMo donation tiers (Support a Sister's Mentorship: GHS 150/mo, Cohort Sponsor: GHS 1,000).
  8. Protected Member Portal: Supabase Auth login with access to downloadable guides, mentorship schedules, and private member directory.
  9. Footer: Social links, newsletter signup, contact form with location map placeholder.

---
### TECHNICAL & DATABASE SPECIFICATIONS (SUPABASE)
1. **Authentication**: Enable Supabase Email/Password and Magic Link Auth for the protected Member/Volunteer area.
2. **Database Tables**:
   - `profiles`: id, user_id, full_name, email, role (member, volunteer, admin), created_at
   - `donations`: id, donor_name, donor_email, amount, currency (GHS), payment_method (MoMo/Card), transaction_ref, status
   - `volunteers_or_applicants`: id, full_name, email, phone, location, program_or_track, statement, status
   - `impact_stories`: id, title, summary, content, image_url, category, created_at
   - `events`: id, title, date, location, virtual_link, max_attendees
3. **UI Stack**: React, Tailwind CSS, Lucide React icons, Radix UI / Shadcn components.
4. **Mobile Optimization**: Strict mobile-first design. The MoMo donation flow and application forms must be ultra-smooth on 360px–414px smartphone screens.
5. **Simulated Payment Modal**: Include an interactive Paystack-like pop-up modal simulating Mobile Money (MTN, Telecel, AT) payment confirmation with success feedback.
The logo has been uploaded.

Create the project and build the donation flow with secure Paystack transaction initialization, verification, and webhook handling.
Use a combination of any of these fonts: Playfair Display, Montserrat, Cormorant Garamond, Khula, Lora & Nunito.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://thisladywilllead.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/15caaf2b-11a0-4c1e-97fb-8f94b0342ef2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
