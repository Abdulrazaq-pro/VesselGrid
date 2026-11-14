# Vesselgrid — website

Marketing site for **Vesselgrid** (https://www.vesselgrid.site): AI vessel ETA prediction, berth scheduling and tug/pilot dispatch for terminal operators, port authorities and shipping lines. Stage: building initial product. The in-page demo uses fictional sample data.

Stack: Vite, React 19, JavaScript, Tailwind CSS v4, Lucide icons, React Router.

## Routes
- `/` home (all sections) · `/privacy` · `/terms` · `*` 404
- `/app` — internal application kit (logo + banner downloads, LinkedIn profile text, AWS Activate Q1–Q14 answers, assumptions, checklist). Not linked anywhere, `noindex`, disallowed in robots.txt.

## Setup
```bash
bun install        # or npm install
cp .env.example .env
bun run dev
bun run build      # outputs dist/
```

## Environment variables
| Var | Purpose |
| --- | --- |

No secrets live in frontend code.

## Deploy

## SEO
Title, description, canonical, Open Graph/Twitter tags, JSON-LD (Organization + SoftwareApplication), `robots.txt`, `sitemap.xml`, `favicon.svg`, `og-image.svg` (convert to PNG for best social preview support). `index.html` contains a static crawlable summary of the page that React replaces on mount.

## AWS
The AWS section describes the **proposed** architecture (API Gateway, Lambda, S3, SageMaker, DynamoDB, Bedrock). None of it is deployed by this repo. Keep copy in `src/data/company.js` in sync if that changes.

## Pre-deployment checklist
- [ ] Confirm founder title, HQ city, pricing period, launch date, funding (see `/app` → Assumptions)
- [ ] nimot@vesselgrid.site receives mail
- [ ] Deploy to www.vesselgrid.site with HTTPS; check `/`, `/privacy`, `/terms`, a 404 URL, `/app`
- [ ] Upload logo + banner to the LinkedIn page; paste tagline/overview/specialties from `/app`
- [ ] Browsers: current Chrome, Edge, Safari, Firefox (ES2020+)

## Backend: Firebase

Config is hard-coded in `src/lib/firebase.js` (Firebase web config is public by design; security comes from Auth + rules).

- **Firebase Authentication** (email/password, password reset email): `/signup`, `/login`, `/onboarding`.
- **Cloud Firestore**: `users/{uid}` (profile + workspace settings), `users/{uid}/calls/{id}` (port calls), `users/{uid}/log/{id}` (activity), `leads/{id}` (demo/contact form submissions, create-only).
- **Google Analytics for Firebase** (measurement ID in config).

### One-time Firebase console setup (required)
1. Authentication → Sign-in method → enable **Email/Password**.
2. Authentication → Settings → Authorized domains → add `vesselgrid.site` and `www.vesselgrid.site`.
3. Firestore → Rules → paste `firestore.rules` → **Publish** (or `firebase deploy --only firestore:rules`).
   Without this, every database write is refused and the app shows an error toast.

Dashboard: create/edit/delete port calls, search and status filter, CSV import/export, print-to-PDF, berth timeline with clash detection and re-sequencing, approve/reject queue, activity log, settings, real-time sync across devices.
