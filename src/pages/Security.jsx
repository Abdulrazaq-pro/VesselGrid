import { Link } from 'react-router-dom'
import { Lock, KeyRound, HardDrive, ShieldCheck, Plug, Activity } from 'lucide-react'
import { Page } from '../components/Layout'
import { company } from '../data/company'

const now = [
  [Lock, 'Encryption in transit', 'The website and workspace are served only over HTTPS (TLS).'],
  [KeyRound, 'Password handling', 'Sign-in runs on Firebase Authentication. VesselGrid never receives or stores passwords, and password resets go by email.'],
  [HardDrive, 'Where your data lives', 'Workspace records are stored in Google Cloud Firestore, encrypted at rest by Google, and isolated per account by server-side security rules: one account cannot read another\'s data. Export to CSV at any time.'],
  [ShieldCheck, 'Human approval', 'Automated re-sequencing never publishes on its own: every berth plan change waits in the review queue for a planner to approve or reject, and is written to the activity log.'],
]
const integrations = [
  ['CSV import and export', 'Available', 'Port calls in and out of the workspace as CSV.'],
  ['Print / PDF schedule', 'Available', 'Print-ready port call schedule from the workspace.'],
  ['Real-time sync', 'Available', 'Changes appear instantly on every device signed in to your account.'],
  ['AIS position feed', 'In development', 'Live vessel positions through Amazon API Gateway.'],
  ['Marine weather feed', 'In development', 'Wind, swell and current inputs to ETA models.'],
  ['Terminal operating systems', 'On request', 'Two-way berth schedule sync, scoped per customer.'],
]
const tone = { Available: 'bg-emerald-100 text-emerald-800', 'In development': 'bg-sky-100 text-sky-800', 'On request': 'bg-ink/10 text-ink/70' }

export default function Security() {
  return (
    <Page>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-sea">Trust</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Security and integrations</h1>
        <p className="mt-4 text-ink/70">What protects your data today, how the hosted platform on AWS is designed, and the status of each integration.</p>
        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-5"><Activity className="text-sea" /><div><p className="font-semibold">Website and workspace: online</p><p className="text-sm text-ink/60">If anything looks wrong, email <a className="underline" href={`mailto:${company.email}`}>{company.email}</a>.</p></div></div>
        <h2 className="mt-12 font-display text-2xl font-semibold">Today</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{now.map(([I, t, d]) => <div key={t} className="rounded-2xl border border-ink/10 bg-white p-5"><I className="text-signal" size={20} /><p className="mt-3 font-semibold">{t}</p><p className="mt-1 text-sm text-ink/65">{d}</p></div>)}</div>
        <h2 className="mt-12 font-display text-2xl font-semibold">Hosted platform design on AWS</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-ink/75">
          <li>Per-customer access control with AWS Identity and Access Management roles and least-privilege policies.</li>
          <li>Encryption at rest for the Amazon S3 data lake and Amazon DynamoDB tables using AWS-managed keys.</li>
          <li>Authenticated, rate-limited ingestion through Amazon API Gateway.</li>
          <li>Audit logging of every berth plan change.</li>
        </ul>
        <p className="mt-4 text-sm text-ink/55">VesselGrid does not currently hold SOC 2, ISO 27001 or other third-party certifications. Customers with specific security requirements can contact us to review them.</p>
        <h2 className="mt-12 font-display text-2xl font-semibold">Integrations</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-ink/10 bg-white">{integrations.map(([n, s, d]) => <div key={n} className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 p-4 last:border-0"><div><p className="font-semibold">{n}</p><p className="text-sm text-ink/60">{d}</p></div><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone[s]}`}>{s}</span></div>)}</div>
        <p className="mt-10 text-sm text-ink/60">Read the <Link to="/privacy" className="underline">Privacy Policy</Link> and <Link to="/terms" className="underline">Terms of Service</Link>.</p>
      </article>
    </Page>
  )
}
