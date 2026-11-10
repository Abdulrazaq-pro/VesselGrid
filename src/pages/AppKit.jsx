import { useEffect, useState } from 'react'
import { Copy, Check, Download, AlertTriangle } from 'lucide-react'
import { Logo } from '../components/Layout'
import { company, features, awsServices, pricing } from '../data/company'
import { bannerSvg, profileLogoSvg, wordmarkSvg, markSvg } from '../data/brand'

const svgUrl = (s) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`
function dl(href, name) { const a = document.createElement('a'); a.href = href; a.download = name; a.click() }
function dlPng(svg, w, h, name) {
  const img = new Image()
  img.onload = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h); dl(c.toDataURL('image/png'), name) }
  img.src = svgUrl(svg)
}

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false)
  return <button onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1400) }} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-ink/15 bg-white px-2 py-1 text-xs font-medium hover:bg-sand" aria-label="Copy">{ok ? <Check size={13} /> : <Copy size={13} />}{ok ? 'Copied' : 'Copy'}</button>
}
function Field({ label, value, count }) {
  return (
    <div className="border-t border-ink/10 py-3">
      <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-wider text-ink/50">{label}{count && <span className="ml-2 font-mono normal-case text-sea">{value.length} chars</span>}</p><CopyBtn text={value} /></div>
      <p className="mt-1 whitespace-pre-line text-sm">{value}</p>
    </div>
  )
}
const Card = ({ id, title, children }) => <section id={id} className="rounded-2xl border border-ink/15 bg-paper p-5 sm:p-7"><h2 className="font-display text-2xl font-semibold">{title}</h2><div className="mt-4">{children}</div></section>

const tagline = 'AI vessel ETA prediction and berth scheduling for terminal operators, port authorities and shipping lines.'
const overview = `VesselGrid is a B2B software company building an AI platform for port and terminal operations. We help terminal operators, port authorities, shipping lines and harbor service providers reduce vessel waiting time and plan berths around when ships will actually arrive.

Most berth plans are built from the arrival time an agent declared days earlier. Weather, slow steaming and delays at previous ports move that time by hours, and planners rebuild the sequence by hand. Ships wait at anchorage, cranes and labour sit idle, and tugs and pilots are called at short notice.

VesselGrid combines live AIS vessel positions, marine weather and historical port congestion to predict vessel arrival times. Those predictions drive a berth scheduler that sequences calls against berth length, draft, cargo type, crane availability and tide windows, and re-plans when an ETA changes.

Key capabilities:
• Predictive ETA engine
• Dynamic berth scheduler
• Congestion risk analytics with a 72-hour outlook
• Tug and pilot dispatch planning
• AI-written shift handover summaries and risk reports
• Exception review queue so planners approve every automated change

Founded in 2026, VesselGrid is building its initial product and onboarding early-access partners. Learn more at www.vesselgrid.site.`
const specialties = ['Berth scheduling', 'Vessel ETA prediction', 'Port operations software', 'Terminal operating systems', 'Maritime logistics', 'AIS data analytics', 'Port congestion analytics', 'Tug and pilot dispatch', 'Harbor logistics', 'Shipping line operations', 'Machine learning', 'Generative AI reporting', 'B2B SaaS', 'Supply chain visibility', 'Quay crane planning', 'Maritime weather analytics', 'Container terminal planning', 'Port call optimisation', 'Serverless architecture', 'Operational decision support']
const q9 = 'VesselGrid is a web platform for port terminal operators and shipping lines that predicts vessel arrivals and automates berth, tug and pilot scheduling to cut waiting time. Built with React on AWS SageMaker, Bedrock, Lambda and DynamoDB.'

const activate = [
  ['Q1', 'Top 3 ways AWS can help you', 'Launching products faster; Building scalable architecture; Reducing burn rate', 'Pre-launch product: these match the build stage and are things AWS credits and architecture guidance directly help with.'],
  ['Q2', 'AWS services to learn more about (20)', 'Amazon SageMaker; Amazon Bedrock; AWS Lambda; Amazon API Gateway; Amazon DynamoDB; Amazon S3; Amazon Kinesis; Amazon Cognito; Amazon Cloudwatch; AWS Identity & Access; Amazon VPC; AWS Route 53; Amazon SNS; Amazon SQS; Amazon Simple Email Service; AWS Step Functions; Amazon Athena; AWS CloudFormation; AWS Budgets; AWS Cost Explorer', 'Core six from the architecture plus streaming AIS (Kinesis), auth, alerts, security, IaC and cost control.'],
  ['Q3', 'AWS tech topics to follow', 'AI & machine learning; Serverless; Big data/Analytics; Security; AWS cost management', 'ML ETA models, serverless pipeline, AIS telemetry data volumes, plus security and cost for an early startup.'],
  ['Q4', 'Customer industry / category', 'Supply Chain / Logistics Tech; Shipping; Logistics; Transportation; SaaS; Machine Learning (ML)', 'Most specific maritime/logistics categories, delivery model (SaaS) and ML because predictions are central.'],
  ['Q5', 'Primary target customers', 'Businesses', 'Terminal operators, shipping lines and harbor service providers pay for and use the product.'],
  ['Q6', 'Current product stage', 'Ideating/building initial product', 'Platform is in development; the website shows an interactive preview with sample data only.'],
  ['Q7', 'How customers interact with the product', 'Web browser; API', 'Web workspace plus an ingestion API for AIS and terminal systems being built. (API: assumed — untick if not in current build.)'],
  ['Q8', 'Does your product use AI/ML?', "Yes, we're using AI/ML to improve our products", 'Product is port-operations software with ML predictions and generative reports inside it, not an AI model/infrastructure vendor.'],
  ['Q9', 'What are you building?', q9, `Plain description of product, customers, benefit and AWS stack. ${q9.length} characters (limit 30–250).`],
  ['Q10', 'Planned product launch date', 'March 2, 2027', 'Assumed: no launch date supplied; set ~4 months out within the 3–6 month guidance.'],
  ['Q11', 'Most recent funding round', 'No Funding (leave month/year blank)', 'Assumed: no funding was supplied in the business details.'],
  ['Q12', 'Latest valuation', 'No Valuation', 'No priced round.'],
  ['Q13', 'Percentage of spend on AWS', '75 - 99%', 'Entire planned backend runs on AWS; domain/email/form services sit outside.'],
  ['Q14', 'Annual marketing spend', '< $250,000', 'Bootstrapped early-stage company.'],
]

const details = [
  ['Company name and website', 'VesselGrid — https://www.vesselgrid.site'],
  ['One-sentence description', 'VesselGrid predicts vessel arrival times from AIS and weather data and automatically plans berths, tugs and pilots for port terminals.'],
  ['Customers', 'Businesses — terminal operators, port authorities, shipping lines, harbor service providers (maritime logistics).'],
  ['Product stage', 'Idea / building'],
  ['Planned launch date', 'March 2, 2027 (assumed)'],
  ['How customers use it', 'Web browser; API (integration)'],
  ['AI/ML', 'Used to improve the product (ETA models, generative shift reports)'],
  ['Funding', 'None (assumed)'],
  ['Valuation', 'None'],
  ['Tech stack & AWS', 'React (Vite, Tailwind) web app; proposed AWS: API Gateway, Lambda, S3, SageMaker, DynamoDB, Bedrock'],
  ['Share of infra on AWS', '75–99%'],
  ['Marketing spend', '< $250,000'],
  ['Team size and country', '1 founder (2–10 company-size band on LinkedIn); Nigeria (assumed from naira pricing)'],
  ['6–12 month goals', 'Ship the ETA engine and berth scheduler MVP, onboard first early-access terminals, validate prediction accuracy against real port calls.'],
]

const assumed = [
  'Founder title shown as "Founder" — confirm Lanre Bola\'s exact title.',
  'Headquarters / country: Nigeria inferred from naira pricing — confirm city before adding to LinkedIn.',
  'Pricing ₦4,000 / ₦10,000 / ₦20,000 shown as monthly per workspace — confirm billing period and tier names.',
  'Launch date March 2, 2027 (Q10) — replace with your real target.',
  'Funding = No Funding, Valuation = No Valuation (Q11–Q12).',
  'API ticked in Q7 — untick if no API is being built yet.',
  'Team size 2–10 on LinkedIn is a size band; only one person (founder) is named on the site.',
  'Founder personal LinkedIn not supplied, so no personal link is published.',
  'VITE_FORM_ENDPOINT must be set in hosting env vars, otherwise forms show an "email us" error (never fake success).',
]

export default function AppKit() {
  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex, nofollow'; document.head.appendChild(m)
    return () => m.remove()
  }, [])
  return (
    <div className="min-h-screen bg-sand/40">
      <header className="border-b border-ink/10 bg-paper"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"><Logo /><span className="font-mono text-xs text-ink/50">Application kit · internal</span></div></header>
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <div>
          <h1 className="font-display text-4xl font-semibold">VesselGrid application kit</h1>
          <p className="mt-2 text-ink/60">Everything needed for LinkedIn and the AWS Activate application, from one business record. Not linked from the public site.</p>
          <nav className="mt-4 flex flex-wrap gap-2 text-sm">{[['brand', 'Logo'], ['banner', 'Banner'], ['linkedin', 'LinkedIn profile'], ['activate', 'AWS Activate Q1–Q14'], ['details', 'Business details'], ['check', 'Assumptions & checklist']].map(([h, l]) => <a key={h} href={`#${h}`} className="rounded-full border border-ink/15 bg-white px-3 py-1 hover:bg-sand">{l}</a>)}</nav>
        </div>

        <Card id="brand" title="Logo">
          <div className="grid gap-4 sm:grid-cols-3">
            {[['LinkedIn profile logo (400×400)', profileLogoSvg, 400, 400, 'vesselgrid-logo-400'], ['Wordmark', wordmarkSvg, 1120, 256, 'vesselgrid-wordmark'], ['Mark / favicon', markSvg(512), 512, 512, 'vesselgrid-mark']].map(([l, s, w, h, n]) => (
              <div key={n} className="rounded-xl border border-ink/10 bg-white p-4">
                <div className="grid h-40 place-items-center"><img src={svgUrl(s)} alt={l} className="max-h-36 max-w-full" /></div>
                <p className="mt-2 text-sm font-medium">{l}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => dlPng(s, w, h, `${n}.png`)} className="inline-flex items-center gap-1 rounded-md bg-ink px-2.5 py-1.5 text-xs font-semibold text-paper"><Download size={13} />PNG</button>
                  <button onClick={() => dl(svgUrl(s), `${n}.svg`)} className="inline-flex items-center gap-1 rounded-md border border-ink/20 px-2.5 py-1.5 text-xs font-semibold"><Download size={13} />SVG</button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink/60">Colours: Ink #0B1D2A · Paper #F3EFE6 · Signal #E8562A · Sea #1F7A7A · Foam #4FB3A9. Type: Fraunces (display), IBM Plex Sans (text), IBM Plex Mono (data).</p>
        </Card>

        <Card id="banner" title="LinkedIn banner (1584 × 396)">
          <img src={svgUrl(bannerSvg)} alt="VesselGrid LinkedIn banner" className="w-full rounded-lg border border-ink/10" />
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => dlPng(bannerSvg, 1584, 396, 'vesselgrid-linkedin-banner.png')} className="inline-flex items-center gap-1 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-paper"><Download size={15} />Download PNG (1584×396)</button>
            <button onClick={() => dl(svgUrl(bannerSvg), 'vesselgrid-linkedin-banner.svg')} className="inline-flex items-center gap-1 rounded-md border border-ink/20 px-3 py-2 text-sm font-semibold"><Download size={15} />SVG</button>
          </div>
          <p className="mt-3 text-sm text-ink/60">Left ~430 px kept clear for the profile logo overlay; text sits in the centre band, berth-plan graphic on the right. Upload the PNG in LinkedIn → Edit page → Header image.</p>
        </Card>

        <Card id="linkedin" title="LinkedIn company profile">
          <Field label="Name" value="VesselGrid" />
          <Field label="Public URL" value={company.linkedin} />
          <Field label="Website" value={company.url} />
          <Field label="Industry" value="Software Development" />
          <Field label="Company size" value="2-10 employees" />
          <Field label="Company type" value="Privately Held" />
          <Field label="Founded" value="2026" />
          <Field label="Headquarters" value="Nigeria (confirm city before saving)" />
          <Field label="Tagline (max 120)" value={tagline} count />
          <Field label="Overview (max 2,000)" value={overview} count />
          <Field label={`Specialties (${specialties.length})`} value={specialties.join(', ')} />
          <Field label="Contact email" value={company.email} />
        </Card>

        <Card id="activate" title="AWS Activate answers">
          <ol className="space-y-1">
            {activate.map(([n, f, a, r]) => (
              <li key={n} className="border-t border-ink/10 py-3">
                <div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold"><span className="font-mono text-signal">{n}.</span> {f}</p><CopyBtn text={a} /></div>
                <p className="mt-1 rounded-md bg-white px-3 py-2 text-sm font-medium">{a}</p>
                <p className="mt-1 text-xs text-ink/60">{r}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card id="details" title="Business details (single source of truth)">
          {details.map(([l, v]) => <Field key={l} label={l} value={v} />)}
          <Field label="Core features" value={features.map((f) => f[0]).join(' · ')} />
          <Field label="AWS architecture (proposed)" value={awsServices.map(([n, d]) => `${n}: ${d}`).join('\n')} />
          <Field label="Pricing" value={pricing.map((p) => `${p.name}: ${p.price}/month`).join(' · ')} />
        </Card>

        <Card id="check" title="Assumptions to confirm & pre-deployment checklist">
          <ul className="space-y-2 text-sm">{assumed.map((a) => <li key={a} className="flex gap-2"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-signal" />{a}</li>)}</ul>
          <h3 className="mt-6 font-semibold">Before submitting</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink/75">
            <li>Deploy to www.vesselgrid.site with HTTPS and confirm / , /privacy, /terms and an unknown URL (404) load.</li>
            <li>Set VITE_FORM_ENDPOINT (e.g. Formspree) and send one real test through each form.</li>
            <li>Make sure lanre@vesselgrid.site receives mail (AWS checks the business email domain matches the website).</li>
            <li>Upload logo + banner to the LinkedIn page and paste tagline, overview and specialties above.</li>
            <li>Apply via HubSpot for Startups with the same company name, domain, email and stage.</li>
          </ul>
        </Card>
      </main>
    </div>
  )
}
