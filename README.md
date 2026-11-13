# VesselGrid — website

Marketing site for **VesselGrid** (https://www.vesselgrid.site): AI vessel ETA prediction, berth scheduling and tug/pilot dispatch for terminal operators, port authorities and shipping lines. Stage: building initial product. The in-page demo uses fictional sample data.

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
| `VITE_FORM_ENDPOINT` | URL receiving JSON POSTs from the early-access and contact forms (e.g. a Formspree form endpoint). If empty, forms validate and then show an error asking visitors to email lanre@vesselgrid.site; they never fake success. |

No secrets live in frontend code.

## Deploy
Any static host. SPA fallback is included for Netlify (`public/_redirects`) and Vercel (`vercel.json`). For S3 + CloudFront, set the error document / 403-404 response to `/index.html` (200). Set `VITE_FORM_ENDPOINT` in the host's build env.

## SEO
Title, description, canonical, Open Graph/Twitter tags, JSON-LD (Organization + SoftwareApplication), `robots.txt`, `sitemap.xml`, `favicon.svg`, `og-image.svg` (convert to PNG for best social preview support). `index.html` contains a static crawlable summary of the page that React replaces on mount.

## AWS
The AWS section describes the **proposed** architecture (API Gateway, Lambda, S3, SageMaker, DynamoDB, Bedrock). None of it is deployed by this repo. Keep copy in `src/data/company.js` in sync if that changes.

## Pre-deployment checklist
- [ ] Confirm founder title, HQ city, pricing period, launch date, funding (see `/app` → Assumptions)
- [ ] Set `VITE_FORM_ENDPOINT` and submit one real test per form
- [ ] lanre@vesselgrid.site receives mail
- [ ] Deploy to www.vesselgrid.site with HTTPS; check `/`, `/privacy`, `/terms`, a 404 URL, `/app`
- [ ] Upload logo + banner to the LinkedIn page; paste tagline/overview/specialties from `/app`
- [ ] Browsers: current Chrome, Edge, Safari, Firefox (ES2020+)
