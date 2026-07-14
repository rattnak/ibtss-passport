# IBTSS 2026 AI Learning Passport

A digital passport web app for the **IBTSS 2026 Pre-Conference Workshop — AI in Higher Education: From Challenge to Opportunity** at Fort Hays State University.

Participants register, visit three AI workshop stations, scan QR codes to collect stamps, receive resources by email, and share a completion passport to LinkedIn.

---

## Functionalities

### Participant Registration
- Participants enter their name and email at the landing page
- A unique passport is created in the database and linked to their email
- They are redirected to their personal passport URL (`/passport/[uuid]`) which is persistent and shareable

### QR Code Stamp Collection
- Each of the 3 workshop stations has a dedicated QR code displayed at `/admin/station/[1|2|3]`
- Scanning the QR code takes participants to `/stamp/[stationId]`
- Participants enter their email to record their visit
- Stamps are deduplicated — scanning the same station twice is handled gracefully with an "Already Collected" state
- Each station is color-coded with its own ink stamp design (teal, orange, purple)

### Automatic Email Delivery
- On each new stamp, a resource email is sent to the participant containing links and materials for that station
- On completing all 3 stations, a separate completion email is sent
- Emails are sent via Resend from `onboarding@resend.dev` (sandbox) or a verified domain in production

### Passport View
- Each participant has a personal passport page at `/passport/[uuid]`
- Displays a navy passport cover with gold SVG emblem and the participant's name
- Inside pages show all 3 stamp slots: empty (dashed circle) or stamped (colored ink circle with animation)
- A progress bar tracks how many stations have been completed
- A completion banner appears with a direct link to the Share tab once all 3 are collected

### LinkedIn Share Flow
- The Share tab unlocks only after all 3 stamps are collected
- Shows a summary card of the completed passport with station names and dates
- Participants can add a personal reflection that gets prepended to the post
- A post preview renders in real time before sharing
- Uses LinkedIn's `shareArticle` API with pre-filled title and summary text
- A "Copy shareable link" button copies the participant's unique passport URL

### Resources Tab
- Lists workshop materials, AI tool links, and references organized by group
- Available at any time during the event

### Admin QR Display
- Facilitators open `/admin/station/[1|2|3]` on a tablet or laptop at each station
- Shows the station's QR code on a styled card, ready to be scanned
- Includes a Print button for physical backup copies
- **Access-restricted** — see [Admin Authentication](#admin-authentication) below

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Email | Resend API |
| QR Generation | `qrcode` npm package |
| Icons | `lucide-react` |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Styling | Tailwind CSS + CSS custom properties |
| Deployment | Vercel |

---

## Stations

| Station | Audience | Tool |
|---|---|---|
| 1 | Faculty | NotebookLM |
| 2 | Administrators & Staff | gethouston.ai |
| 3 | Students | Claude + Perplexity |

---

## Admin Authentication

Station QR code pages (`/admin`, `/admin/station/[1|2|3]`) are restricted to
authorized facilitators via email + magic link — no shared password, no
third-party auth provider.

**How it works:**
1. Visit `/admin` (or any `/admin/*` page) while signed out → redirected to `/admin/login`
2. Enter your email → if it's on the allowlist, a one-time sign-in link is emailed via Resend (expires in 15 minutes)
3. Clicking the link sets an `httpOnly` session cookie (valid 8 hours) and redirects into `/admin`
4. `src/middleware.ts` guards every `/admin/*` route (except the login/verify routes themselves) and redirects unauthenticated requests back to `/admin/login`

**Who's authorized:** set `ADMIN_ALLOWED_EMAILS` as a comma-separated list, e.g.:

```env
ADMIN_ALLOWED_EMAILS=jeni.mcray@fhsu.edu,magdalene.moy@fhsu.edu
```

**Secret:** `ADMIN_TOKEN_SECRET` signs the magic-link and session tokens (HMAC-SHA256, no extra dependency, no database table required). Set it to a long random string — e.g. generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

If unset, it falls back to `SUPABASE_SERVICE_ROLE_KEY`, but setting a dedicated secret is recommended.

**Notes:**
- The request-link endpoint returns the same response whether or not the email is on the allowlist, so it can't be used to enumerate authorized facilitators.
- Links are valid for any use within their 15-minute window (not single-use/consumed on first click) — acceptable for this low-stakes, short-lived, allowlisted use case.
- Sign out from `/admin` clears the session cookie via `POST /api/admin/logout`.

---

## Local Development

```bash
npm install
cp .env.local.example .env.local   # fill in your keys
npm run dev
# or if next isn't in PATH:
./node_modules/.bin/next dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin auth (station QR pages) — see "Admin Authentication" below
ADMIN_ALLOWED_EMAILS=
ADMIN_TOKEN_SECRET=
```

### Database Setup

Run `supabase-schema.sql` in your Supabase project's SQL Editor. This creates:
- `participants` table
- `stamps` table (unique constraint on `participant_id + station_id`)
- `passport_progress` view (aggregates stamp count and completion status per participant)

---

## Deployment

1. Push to GitHub
2. Import into [Vercel](https://vercel.com) — auto-detects Next.js, zero config
3. Add all environment variables in Vercel dashboard (Settings → Environment Variables)
4. Update `NEXT_PUBLIC_BASE_URL` to your Vercel deployment URL
5. Redeploy
6. Print QR pages from `/admin/station/1`, `/admin/station/2`, `/admin/station/3`

### Before the Event
- Verify `fhsu.edu` domain in [Resend](https://resend.com) so emails reach all participants (not just your own address)
- Update the `from` address in `src/lib/email.ts` from `onboarding@resend.dev` to `noreply@fhsu.edu`

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Registration
│   ├── passport/[id]/page.tsx            # Passport view
│   ├── stamp/[stationId]/page.tsx        # QR stamp landing
│   ├── admin/station/[stationId]/page.tsx # Admin QR display
│   └── api/
│       ├── register/route.ts
│       ├── stamp/route.ts
│       ├── passport/[id]/route.ts
│       └── participant-by-email/route.ts
└── lib/
    ├── stations.ts   # Station definitions (single source of truth)
    ├── supabase.ts   # Supabase anon + service role clients
    └── email.ts      # Resend email templates
```


---

## Post-Workshop Resources — Time Gate & Preview Bypass

The **Post-Workshop Resources** section (`/toolkit/post-workshop`) is locked until the
session ends: **Aug 5, 2026, 5:00 PM ICT** (defined as `WORKSHOP_END` in `src/lib/agenda.ts`).
Before that time, the Toolkit page shows a locked card and the page itself shows a
"Not yet" screen.

### Preview bypass (facilitators)

To preview the section before the unlock time, append `?preview=1` to the URL:

```
http://localhost:3000/toolkit/post-workshop?preview=1
https://<your-deployment>/toolkit/post-workshop?preview=1
```

Notes:
- The gate is a client-side courtesy curtain, not a security control — the content
  ships with the app either way.
- To unlock for everyone early (e.g., during the closing walkthrough), edit the
  single `WORKSHOP_END` timestamp in `src/lib/agenda.ts` and redeploy.

---

Maintained by [Chanrattnak Mong](https://github.com/rattnak) — FHSU Technology and Innovation in Learning and Teaching (TILT)
