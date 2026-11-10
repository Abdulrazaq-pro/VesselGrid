import { useEffect } from 'react'
import { ArrowRight, Radar, CalendarRange, Waves, LifeBuoy, FileText, ListChecks, Satellite, Database, Cpu, Brain, Monitor, Check, Mail, Building2, Ship, Anchor, Compass } from 'lucide-react'
import { Page } from '../components/Layout'
import Linkedin from '../components/LinkedinIcon'
import Demo, { BerthGantt } from '../components/Demo'
import LeadForm from '../components/LeadForm'
import { company, features, segments, pricing, awsServices } from '../data/company'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const Label = ({ n, children, light }) => <p className={`font-mono text-xs uppercase tracking-[.2em] ${light ? 'text-foam' : 'text-sea'}`}><span className="text-signal">{n}</span> — {children}</p>
const H2 = ({ children, light }) => <h2 className={`mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl ${light ? 'text-paper' : ''}`}>{children}</h2>

const featIcons = [Radar, CalendarRange, Waves, LifeBuoy, FileText, ListChecks]

export default function Home() {
  useReveal()
  return (
    <Page>
      {/* HERO */}
      <section id="product" className="chart-grid relative overflow-hidden border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:pt-20">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-ink/60">
            <span className="rounded-full border border-ink/20 bg-paper px-3 py-1">Lat 6.42°N · Port operations software</span>
            <span className="rounded-full bg-signal/10 px-3 py-1 text-signal">Early access open</span>
          </div>
          <h1 className="mt-6 max-w-5xl font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.5rem]">
            Berth plans that move <em className="font-normal italic text-sea">with the ships.</em>
          </h1>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-end">
            <div>
              <p className="text-lg leading-relaxed text-ink/75">VesselGrid predicts when each vessel will really arrive, from live AIS positions, marine weather and past port congestion, then sequences berths, cranes, tugs and pilots around that prediction. When a ship slows down, the plan changes before the quay does.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#demo" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:bg-deep">Explore the demo <ArrowRight size={17} /></a>
                <a href="#access" className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 font-semibold hover:bg-ink/5">Request early access</a>
              </div>
            </div>
            <div className="rounded-2xl border border-ink/15 bg-paper/95 p-4 shadow-[0_20px_60px_-30px_rgba(11,29,42,.4)] sm:p-5">
              <div className="mb-4 flex items-center justify-between text-xs"><span className="font-semibold">Berth plan · next 48 hours</span><span className="font-mono text-ink/40">SAMPLE DATA</span></div>
              <BerthGantt compact />
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink/10 pt-3 text-xs">
                <div><p className="text-ink/50">Kota Bahari</p><p className="font-mono font-semibold text-sea">−45 min early</p></div>
                <div><p className="text-ink/50">MSC Lagos</p><p className="font-mono font-semibold text-signal">+6h40 late</p></div>
                <div><p className="text-ink/50">Delta Spirit</p><p className="font-mono font-semibold text-signal">Needs berth</p></div>
              </div>
            </div>
          </div>
        </div>
        {/* capability strip */}
        <div className="border-t border-ink/10 bg-ink text-paper">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-paper/10 px-4 sm:px-6 lg:grid-cols-4">
            {[['ETA', 'Predicted, not declared, arrival times'], ['72 h', 'Congestion outlook horizon'], ['1 plan', 'Berths, cranes, tugs and pilots together'], ['Human review', 'Every automated change can be approved']].map(([a, b]) => (
              <div key={a} className="px-4 py-5 first:pl-0"><p className="font-display text-2xl text-foam">{a}</p><p className="text-xs text-paper/60">{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM — port call timeline */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="reveal grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <Label n="01">The problem</Label>
            <H2>Ports plan around the ETA on the notice. Ships don't keep it.</H2>
            <p className="mt-5 text-ink/70">Berth plans in many terminals still live in spreadsheets and radio calls, built from the arrival time an agent declared days earlier. Weather, slow steaming and delays at the previous port shift that time by hours. Each shift breaks the sequence, and planners rebuild it by hand.</p>
            <p className="mt-4 text-ink/70">The cost lands everywhere: ships idle at anchorage burning fuel and charter time, quay cranes and labour gangs wait for vessels that are not alongside, and tugs and pilots are called at short notice. More calls means more reshuffles, so the manual approach gets worse as a port gets busier.</p>
          </div>
          <ol className="relative border-l-2 border-dashed border-ink/20 pl-8">
            {[['T−72h', 'Agent declares ETA 06:00 Tuesday', 'Berth 1 is reserved and a crane gang is booked.'],
              ['T−18h', 'Head seas slow the vessel to 9 knots', 'Nobody on the quay sees it; the plan still says 06:00.'],
              ['06:00', 'Crane gang and berth sit idle', 'A second vessel waits at anchorage for a berth that is empty.'],
              ['09:40', 'Ship arrives, the day is rebuilt by phone', 'Tugs, pilots and the next three calls are shuffled manually.']].map(([t, a, b], i) => (
              <li key={t} className="relative pb-8 last:pb-0">
                <span className={`absolute -left-[41px] grid h-5 w-5 place-items-center rounded-full border-2 ${i === 3 ? 'border-signal bg-signal' : 'border-ink bg-paper'}`} />
                <p className="font-mono text-xs text-signal">{t}</p><p className="mt-1 font-semibold">{a}</p><p className="text-sm text-ink/60">{b}</p>
              </li>
            ))}
            <li className="mt-6 rounded-xl bg-sea p-5 text-white"><p className="font-mono text-xs uppercase tracking-widest text-white/70">With VesselGrid</p><p className="mt-1">The slowdown at T−18h updates the predicted ETA, the scheduler moves the waiting vessel onto Berth 1, and the crane gang, pilot and tugs are re-planned before anyone is left waiting.</p></li>
          </ol>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-ink text-paper chart-grid-dark">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="reveal max-w-3xl"><Label n="02" light>The platform</Label><H2 light>Six tools, one live plan of the quay.</H2>
            <p className="mt-4 text-paper/65">Each capability feeds the next: predictions drive the berth plan, the berth plan drives dispatch, and anything the scheduler can't settle goes to a person.</p></div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([t, d, b], i) => { const I = featIcons[i]; return (
              <article key={t} className="reveal bg-ink p-7 transition hover:bg-deep">
                <div className="flex items-center justify-between"><I className="text-foam" size={22} /><span className="font-mono text-xs text-paper/30">0{i + 1}</span></div>
                <h3 className="mt-6 font-display text-xl font-semibold">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">{d}</p>
                <p className="mt-4 border-t border-paper/10 pt-4 text-sm text-foam">{b}</p>
              </article>) })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="reveal"><Label n="03">How it works</Label><H2>From a dot on the AIS map to a confirmed berth.</H2></div>
        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {[[Satellite, 'Connect', 'AIS feeds, weather data and the terminal\'s berth and crane constraints are connected to a workspace.'],
            [Radar, 'Predict', 'ETA models score each inbound vessel and refresh the prediction as new positions arrive.'],
            [CalendarRange, 'Plan', 'The scheduler sequences berths, cranes, tugs and pilots against length, draft, cargo and tide.'],
            [ListChecks, 'Review & publish', 'Planners approve exceptions and share the updated plan with lines, agents and harbor services.']].map(([I, t, d], i) => (
            <div key={t} className="reveal relative rounded-2xl border border-ink/15 bg-white p-6">
              <span className="font-mono text-xs text-signal">STEP {i + 1}</span>
              <I className="mt-4 text-sea" size={26} />
              <h3 className="mt-4 font-display text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-ink/65">{d}</p>
              {i < 3 && <ArrowRight className="absolute -right-5 top-1/2 hidden text-ink/25 md:block" />}
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="border-y border-ink/10 bg-sand/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="reveal mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div><Label n="04">Product preview</Label><H2>Try a terminal workspace.</H2></div>
            <p className="max-w-md text-sm text-ink/65">An interactive preview of the VesselGrid workspace using a fictional terminal and sample vessels. Search arrivals, open a call, confirm tug jobs, approve the scheduler's proposals and generate a shift summary.</p>
          </div>
          <Demo />
        </div>
      </section>

      {/* SEGMENTS */}
      <section id="segments" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="reveal"><Label n="05">Who it's for</Label><H2>Built for everyone who touches a port call.</H2></div>
        <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {segments.map(([t, p, u], i) => { const I = [Building2, Compass, Ship, Anchor][i]; return (
            <div key={t} className="reveal grid gap-4 py-8 md:grid-cols-[260px_1fr_1fr] md:gap-10">
              <h3 className="flex items-center gap-3 font-display text-2xl font-semibold"><I className="shrink-0 text-signal" size={22} />{t}</h3>
              <div><p className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Today</p><p className="mt-1 text-ink/70">{p}</p></div>
              <div><p className="font-mono text-[11px] uppercase tracking-widest text-sea">With VesselGrid</p><p className="mt-1">{u}</p></div>
            </div>) })}
        </div>
      </section>

      {/* AWS */}
      <section id="aws" className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="reveal max-w-3xl"><Label n="06" light>Technology</Label><H2 light>How We Use Amazon Web Services</H2>
            <p className="mt-5 text-paper/70">VesselGrid's architecture is designed as a serverless pipeline on AWS: vessel telemetry and terminal updates enter through one API, are stored in a historical data lake, scored by machine-learning ETA models and written to a low-latency operational store that the berth plan reads from. Generative AI turns that operational state into shift reports people can act on.</p></div>
          <div className="mt-12 grid gap-3 md:grid-cols-5">
            {[[Satellite, 'Data collection', 'API Gateway + Lambda', 'AIS, weather and terminal events are ingested and normalised.'],
              [Database, 'Secure storage', 'Amazon S3', 'Historical tracks and port calls kept for model training.'],
              [Cpu, 'Processing', 'AWS Lambda', 'Conflict checks and re-planning run on each ETA change.'],
              [Brain, 'AI intelligence', 'SageMaker + Bedrock', 'ETA and congestion models; plain-language reports.'],
              [Monitor, 'Application', 'Amazon DynamoDB', 'Live berth, crane and dispatch state served to the web app.']].map(([I, t, s, d], i) => (
              <div key={t} className="reveal relative rounded-xl border border-paper/15 bg-deep p-5">
                <span className="font-mono text-[10px] text-paper/40">STAGE {i + 1}</span>
                <I className="mt-3 text-foam" size={22} />
                <p className="mt-3 font-semibold">{t}</p><p className="font-mono text-xs text-signal">{s}</p>
                <p className="mt-2 text-xs text-paper/60">{d}</p>
              </div>
            ))}
          </div>
          <ul className="mt-12 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {awsServices.map(([n, d]) => <li key={n} className="border-t border-paper/10 pt-4 text-sm text-paper/75"><b className="text-paper">{n}:</b> {d}</li>)}
          </ul>
        </div>
      </section>

      {/* EARLY ACCESS */}
      <section id="access" className="chart-grid border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[.8fr_1.2fr]">
          <div className="reveal">
            <Label n="07">Progress & early access</Label><H2>Help shape the first release.</H2>
            <p className="mt-5 text-ink/70">VesselGrid was founded in 2026 and the platform is in active development. We are working with a small group of terminals, shipping lines and harbor service providers to test predictions and the berth scheduler against their real operations.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {['Product design and interactive workspace preview complete', 'ETA and berth scheduling engine in development', 'AWS serverless architecture defined', 'Early-access partners being onboarded'].map((t) => <li key={t} className="flex gap-2"><Check size={17} className="mt-0.5 shrink-0 text-sea" />{t}</li>)}
            </ul>
          </div>
          <div className="reveal rounded-2xl border border-ink/15 bg-paper p-6 sm:p-8">
            <LeadForm formName="early-access" submitLabel="Request early access" fields={[
              { name: 'name', label: 'Full name', required: true, auto: 'name' },
              { name: 'email', label: 'Business email', type: 'email', required: true, auto: 'email' },
              { name: 'company', label: 'Company', required: true, auto: 'organization' },
              { name: 'size', label: 'Company size', required: true, options: ['1–10', '11–50', '51–200', '201–1,000', '1,000+'] },
              { name: 'useCase', label: 'Primary use case', required: true, full: true, options: ['Berth scheduling', 'Vessel ETA prediction', 'Congestion planning', 'Tug and pilot dispatch', 'Shift reporting', 'Other'] },
              { name: 'message', label: 'Message', type: 'textarea', full: true },
            ]} />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="reveal text-center"><Label n="08">Pricing</Label><H2>Plans per terminal workspace, billed monthly.</H2></div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pricing.map((p) => (
            <div key={p.name} className={`reveal flex flex-col rounded-2xl border p-7 ${p.featured ? 'border-ink bg-ink text-paper' : 'border-ink/15 bg-white'}`}>
              <p className="font-mono text-xs uppercase tracking-widest text-signal">{p.name}</p>
              <p className="mt-4 font-display text-5xl font-semibold">{p.price}<span className="font-sans text-base font-normal opacity-60"> /month</span></p>
              <p className={`mt-3 text-sm ${p.featured ? 'text-paper/65' : 'text-ink/60'}`}>{p.for}</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">{p.items.map((i) => <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-foam" />{i}</li>)}</ul>
              <a href="#access" className={`mt-7 rounded-full py-3 text-center font-semibold ${p.featured ? 'bg-signal text-white' : 'border border-ink/25 hover:bg-ink/5'}`}>Request early access</a>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="border-y border-ink/10 bg-sand/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="reveal"><Label n="09">Team</Label><H2>The Team Behind VesselGrid</H2></div>
          <div className="reveal flex items-center gap-5 rounded-2xl border border-ink/15 bg-white p-6">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-ink font-display text-2xl text-paper">LB</div>
            <div><h3 className="font-display text-2xl font-semibold">{company.founder.name}</h3><p className="text-sm text-signal">{company.founder.title}</p>
              <p className="mt-2 text-sm text-ink/65">Founded VesselGrid in 2026 to give terminals and shipping lines a berth plan built on where ships actually are. Leads product, engineering and early-access partnerships.</p></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[.8fr_1.2fr]">
        <div className="reveal">
          <Label n="10">Contact</Label><H2>Talk to the team.</H2>
          <p className="mt-5 text-ink/70">Questions about the product, partnerships or integrating your terminal systems.</p>
          <a href={`mailto:${company.email}`} className="mt-6 flex items-center gap-3 font-semibold hover:text-signal"><Mail size={18} />{company.email}</a>
          <a href={company.linkedin} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-3 font-semibold hover:text-signal"><Linkedin size={18} />VesselGrid on LinkedIn</a>
        </div>
        <div className="reveal rounded-2xl border border-ink/15 bg-white p-6 sm:p-8">
          <LeadForm formName="contact" submitLabel="Send message" fields={[
            { name: 'name', label: 'Full name', required: true, auto: 'name' },
            { name: 'email', label: 'Email', type: 'email', required: true, auto: 'email' },
            { name: 'topic', label: 'Inquiry type', required: true, full: true, options: ['Product demo', 'Early access', 'Partnership', 'Integration question', 'Press', 'Other'] },
            { name: 'message', label: 'Message', type: 'textarea', required: true, full: true },
          ]} />
        </div>
      </section>
    </Page>
  )
}
