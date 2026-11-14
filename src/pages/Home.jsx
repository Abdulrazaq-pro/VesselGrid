import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { ArrowRight, ArrowDownRight, Radar, CalendarRange, Waves, LifeBuoy, FileText, ListChecks, Satellite, Database, Cpu, Brain, Monitor, Check, Mail, Ship, Anchor, Compass, Building2 } from 'lucide-react'
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

const Tag = ({ children, light }) => <p className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.22em] ${light ? 'text-foam' : 'text-sea'}`}><span className="h-px w-6 bg-signal" />{children}</p>
const featIcons = [Radar, CalendarRange, Waves, LifeBuoy, FileText, ListChecks]
const segIcons = [Anchor, Building2, Ship, Compass]

const board = [
  ['MSC LAGOS', 'Declared 06:00', 'Predicted 09:40', 'B2', 'late'],
  ['KOTA BAHARI', 'Declared 11:00', 'Predicted 10:15', 'B3', 'early'],
  ['GRANDE TEMA', 'Declared 14:30', 'Predicted 14:50', 'B4', 'ok'],
  ['ONE CROWN', 'Declared 19:00', 'Predicted 23:20', 'B1', 'late'],
]

function ArrivalBoard() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % board.length), 2600); return () => clearInterval(t) }, [])
  return (
    <div className="rounded-2xl border border-paper/15 bg-deep/70 p-5 font-mono text-xs text-paper">
      <div className="flex items-center justify-between text-paper/50"><span>ARRIVALS · LEKKI DEEP QUAY</span><span className="rounded border border-paper/25 px-1.5 py-0.5 text-[10px]">PREVIEW</span></div>
      <div className="mt-4 space-y-1.5">
        {board.map(([v, d, p, b, s], k) => (
          <div key={v} className={`grid grid-cols-[1.3fr_1fr_1fr_.4fr] items-center gap-2 rounded-md px-2.5 py-2 transition ${k === i ? 'bg-paper/10' : ''}`}>
            <span className="truncate font-semibold">{v}</span>
            <span className="text-paper/40 line-through decoration-paper/30">{d.replace('Declared ', '')}</span>
            <span className={s === 'late' ? 'text-signal' : s === 'early' ? 'text-foam' : 'text-paper'}>{p.replace('Predicted ', '')}</span>
            <span className="text-right text-paper/60">{b}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-paper/10 pt-3 text-[11px] text-paper/60">Berth plan re-sequenced for {board[i][0]} · tug and pilot slots updated</div>
    </div>
  )
}

const steps = [
  ['Ingest', 'AIS positions, marine weather, port call history and terminal constraints arrive through one API.', Satellite],
  ['Predict', 'ETA models estimate arrival at the fairway buoy and at the berth, with a confidence window.', Brain],
  ['Plan', 'The scheduler sequences berths, cranes, tugs and pilots against length, draft, cargo and tide windows.', CalendarRange],
  ['Approve', 'Planners review the conflicts the system could not resolve, then publish the plan to lines and agents.', ListChecks],
]
const pipeline = [
  ['Data collection', 'Amazon API Gateway', Satellite], ['Secure storage', 'Amazon S3', Database], ['Processing', 'AWS Lambda', Cpu],
  ['AI intelligence', 'Amazon SageMaker · Amazon Bedrock', Brain], ['Application experience', 'Amazon DynamoDB', Monitor],
]

export default function Home() {
  useReveal()
  const { user } = useAuth()
  return (
    <Page>
      {/* HERO — dark, split: statement + live arrival board */}
      <section id="product" className="chart-grid-dark relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-24">
          <div>
            <Tag light>Port operations software</Tag>
            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">The declared ETA is a guess.<br /><span className="text-signal">Plan around the real one.</span></h1>
            <p className="mt-6 max-w-xl text-lg text-paper/70">VesselGrid predicts when each vessel will actually arrive from live AIS and weather data, then turns those predictions into a berth, tug and pilot plan that updates as ships move.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={user ? '/dashboard' : '/signup'} className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-semibold text-white hover:brightness-110">{user ? 'Go to dashboard' : 'Launch your workspace'} <ArrowRight size={18} /></Link>
              <a href="#access" className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-6 py-3 font-semibold hover:bg-paper/10">Book a demo</a>
            </div>
          </div>
          <ArrivalBoard />
        </div>
        <div className="border-t border-paper/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-paper/10 px-4 sm:px-6 md:grid-cols-4 md:divide-x">
            {[['72 h', 'congestion outlook window'], ['4', 'inputs per ETA: AIS, weather, route history, port state'], ['1 plan', 'for berths, cranes, tugs and pilots'], ['Every change', 'logged with a reason and approver']].map(([a, b]) => (
              <div key={a} className="py-6 md:px-6"><p className="font-display text-2xl text-foam">{a}</p><p className="mt-1 text-xs text-paper/55">{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM — editorial two column with numbered consequences */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="reveal lg:sticky lg:top-24 lg:self-start">
            <Tag>The problem</Tag>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">Berth plans are built on arrival times nobody trusts.</h2>
            <p className="mt-5 text-ink/70">Agents declare an ETA days ahead. Weather, slow steaming and delays at the previous port move it by hours. Planners rebuild the sequence by hand in spreadsheets and radio calls, and every rebuild ripples into cranes, gangs, tugs and pilots.</p>
          </div>
          <ol className="reveal space-y-4">
            {[['Ships wait at anchorage', 'A vessel that arrives early finds its berth still occupied; one that arrives late leaves a berth and crane gang idle.'],
              ['Fuel burns for nothing', 'Lines run at full speed to meet a berth window that was never going to be free, then drift for a day.'],
              ['Harbor services staff for the worst case', 'Tugs and pilots hear about jobs late, so crews are booked defensively and still miss tide windows.'],
              ['It doesn\'t scale', 'Each extra berth multiplies the combinations a planner has to juggle by hand on every schedule change.']].map(([t, d], k) => (
              <li key={t} className="flex gap-5 rounded-2xl border border-ink/10 bg-white p-6">
                <span className="font-display text-4xl text-signal/80">0{k + 1}</span>
                <div><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-ink/65">{d}</p></div>
              </li>
            ))}
            <li className="flex items-start gap-4 rounded-2xl bg-ink p-6 text-paper">
              <ArrowDownRight className="mt-1 shrink-0 text-foam" />
              <p className="text-sm text-paper/80"><strong className="text-paper">VesselGrid's answer:</strong> predict the real arrival, re-plan automatically when it moves, and send people only the decisions that need them.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* FEATURES — bento */}
      <section id="features" className="bg-sand/60 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-6">
            <div><Tag>Platform</Tag><h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">Six modules, one live plan.</h2></div>
            <p className="max-w-sm text-sm text-ink/65">Each module reads from and writes to the same berth plan, so a change in one ETA flows through berths, cranes and harbor services.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-6">
            <div className="reveal rounded-3xl bg-ink p-6 text-paper md:col-span-4 md:row-span-2">
              <div className="flex items-center gap-2 text-foam"><CalendarRange size={18} /><span className="font-mono text-xs uppercase tracking-widest">{features[1][0]}</span></div>
              <p className="mt-3 max-w-lg text-paper/75">{features[1][1]}</p>
              <div className="mt-6 rounded-xl bg-paper p-4 text-ink"><BerthGantt compact /></div>
              <p className="mt-4 text-sm text-foam">{features[1][2]}</p>
            </div>
            {[0, 2, 3, 4, 5].map((k) => {
              const I = featIcons[k]
              return (
                <div key={k} className={`reveal rounded-3xl border border-ink/10 bg-paper p-6 ${k === 0 ? 'md:col-span-2' : k === 2 ? 'md:col-span-2' : 'md:col-span-2'}`}>
                  <I size={22} className="text-signal" />
                  <h3 className="mt-4 font-display text-xl font-semibold">{features[k][0]}</h3>
                  <p className="mt-2 text-sm text-ink/65">{features[k][1]}</p>
                  <p className="mt-3 border-t border-ink/10 pt-3 text-sm font-medium text-sea">{features[k][2]}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — horizontal rail */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="reveal"><Tag>How it works</Tag><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">From a ping at sea to a published plan.</h2></div>
        <div className="relative mt-14 grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ink/15 md:block" />
          {steps.map(([t, d, I], k) => (
            <div key={t} className="reveal relative">
              <div className="relative grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-paper"><I size={20} className="text-signal" /></div>
              <p className="mt-5 font-mono text-xs text-ink/40">STEP {k + 1}</p>
              <h3 className="mt-1 font-display text-2xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-ink/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="chart-grid-dark bg-deep py-20 text-paper sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal mb-10 max-w-2xl"><Tag light>Interactive preview</Tag><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Try the terminal workspace.</h2>
            <p className="mt-4 text-paper/65">Search arrivals, open a vessel, confirm tug jobs, resolve review items and generate a shift report. Or create your own workspace and plan your berths.</p></div>
          <div className="reveal text-ink"><Demo /></div>
          <Link to={user ? '/dashboard' : '/signup'} className="mt-8 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-semibold text-white hover:brightness-110">{user ? 'Open your workspace' : 'Create your workspace'} <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* SEGMENTS — list rows */}
      <section id="segments" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="reveal"><Tag>Who it's for</Tag><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Built for everyone around the berth.</h2></div>
        <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {segments.map(([n, p, u], k) => {
            const I = segIcons[k]
            return (
              <div key={n} className="reveal grid gap-4 py-8 md:grid-cols-[.8fr_1fr_1fr]">
                <div className="flex items-center gap-3"><I className="text-signal" size={22} /><h3 className="font-display text-2xl font-semibold">{n}</h3></div>
                <p className="text-sm text-ink/60"><span className="block font-mono text-[11px] uppercase tracking-widest text-ink/40">Today</span>{p}</p>
                <p className="text-sm"><span className="block font-mono text-[11px] uppercase tracking-widest text-sea">With VesselGrid</span>{u}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* AWS */}
      <section id="aws" className="bg-ink py-20 text-paper sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal max-w-3xl"><Tag light>Technology</Tag><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">How We Use Amazon Web Services</h2>
            <p className="mt-5 text-paper/70">VesselGrid's proposed architecture on AWS follows the path a vessel signal takes: high-velocity AIS and weather data enter through a serverless API, land in an S3 data lake, are processed by Lambda, scored by SageMaker ETA models and summarised by Bedrock, and reach planners as live berth state held in DynamoDB.</p></div>
          <div className="mt-12 grid gap-3 md:grid-cols-5">
            {pipeline.map(([s, svc, I], k) => (
              <div key={s} className="reveal relative rounded-2xl border border-paper/15 p-5">
                <p className="font-mono text-[11px] text-paper/40">0{k + 1}</p>
                <I className="mt-3 text-foam" size={22} />
                <p className="mt-3 font-semibold">{s}</p>
                <p className="mt-1 text-xs text-signal">{svc}</p>
                {k < 4 && <ArrowRight size={16} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-paper/30 md:block" />}
              </div>
            ))}
          </div>
          <ul className="mt-12 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {awsServices.map(([n, d]) => <li key={n} className="reveal border-t border-paper/10 pt-4 text-sm text-paper/75"><strong className="text-paper">{n}:</strong> {d}</li>)}
          </ul>
        </div>
      </section>

      {/* PRICING */}
      <Pricing />

      {/* EARLY ACCESS */}
      <section id="access" className="bg-sand/60 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="reveal">
            <Tag>Book a demo</Tag><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">See VesselGrid on your own berths.</h2>
            <p className="mt-5 text-ink/70">Book a walkthrough with the team. We'll set up the berth plan around your terminal layout and talk through how your arrival data and existing systems connect.</p>
            <ul className="mt-6 space-y-2 text-sm">{['Walkthrough of the berth plan with your terminal layout', 'Input on integrations with your existing systems', 'Onboarding support for your planners'].map((t) => <li key={t} className="flex gap-2"><Check size={16} className="mt-0.5 text-sea" />{t}</li>)}</ul>
          </div>
          <div className="reveal rounded-3xl border border-ink/15 bg-white p-6 sm:p-8">
            <LeadForm formName="demo-request" submitLabel="Book a demo" fields={[
              { name: 'name', label: 'Full name', required: true, auto: 'name' },
              { name: 'email', label: 'Business email', type: 'email', required: true, auto: 'email' },
              { name: 'company', label: 'Company', required: true, auto: 'organization' },
              { name: 'size', label: 'Company size', required: true, options: ['1-10', '11-50', '51-200', '201-1,000', '1,000+'] },
              { name: 'useCase', label: 'Primary use case', required: true, full: true, options: ['Berth scheduling', 'Vessel ETA prediction', 'Congestion risk', 'Tug & pilot dispatch', 'Shift reporting', 'Other'] },
              { name: 'message', label: 'Message', type: 'textarea', full: true },
            ]} />
          </div>
        </div>
      </section>

      {/* TEAM + CONTACT */}
      <section id="team" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="reveal">
            <Tag>Team</Tag><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">The Team Behind VesselGrid</h2>
            <div className="mt-8 flex items-center gap-5 rounded-3xl border border-ink/15 bg-white p-6">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-ink font-display text-2xl text-paper">NL</div>
              <div><h3 className="font-display text-2xl font-semibold">{company.founder.name}</h3><p className="text-sm text-signal">{company.founder.title}</p>
                <p className="mt-2 text-sm text-ink/65">Founded VesselGrid in 2026 to give terminals and shipping lines a berth plan built on where ships actually are. Leads product, engineering and customer partnerships.</p></div>
            </div>
          </div>
          <div id="contact" className="reveal">
            <Tag>Contact</Tag><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Talk to the team.</h2>
            <div className="mt-4 flex flex-wrap gap-5 text-sm font-semibold">
              <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-signal"><Mail size={16} />{company.email}</a>
              <a href={company.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-signal"><Linkedin size={16} />LinkedIn</a>
            </div>
            <div className="mt-6 rounded-3xl border border-ink/15 bg-white p-6">
              <LeadForm formName="contact" submitLabel="Send message" fields={[
                { name: 'name', label: 'Full name', required: true, auto: 'name' },
                { name: 'email', label: 'Email', type: 'email', required: true, auto: 'email' },
                { name: 'topic', label: 'Inquiry type', required: true, full: true, options: ['Product demo', 'Account & billing', 'Partnership', 'Integration question', 'Press', 'Other'] },
                { name: 'message', label: 'Message', type: 'textarea', required: true, full: true },
              ]} />
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

function Pricing() {
  const { user } = useAuth(); const nav = useNavigate()
  const [annual, setAnnual] = useState(false)
  const [pick, setPick] = useState(null)
  const num = (p) => +p.price.replace(/[^\d]/g, '')
  const show = (p) => annual ? `$${(num(p) * 12).toLocaleString()}` : p.price
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="reveal text-center"><Tag>Pricing</Tag><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Plans for one berth or a whole port.</h2>
        <div className="mt-6 inline-flex rounded-full border border-ink/15 bg-white p-1 text-sm" role="group" aria-label="Billing period">
          {[['Monthly', false], ['Annual', true]].map(([l, v]) => <button key={l} onClick={() => setAnnual(v)} aria-pressed={annual === v} className={`rounded-full px-4 py-1.5 font-semibold ${annual === v ? 'bg-ink text-paper' : 'text-ink/60'}`}>{l}</button>)}
        </div></div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {pricing.map((p) => (
          <div key={p.name} className={`reveal flex flex-col rounded-3xl p-7 ${p.featured ? 'bg-ink text-paper' : 'border border-ink/15 bg-white'}`}>
            <p className="font-mono text-xs uppercase tracking-widest text-signal">{p.name}</p>
            <p className="mt-4 font-display text-5xl font-semibold">{show(p)}<span className="font-sans text-base font-normal opacity-60"> /{annual ? 'year' : 'month'}</span></p>
            <p className="mt-3 text-sm opacity-70">{p.for}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">{p.items.map((i) => <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-foam" />{i}</li>)}</ul>
            <button onClick={() => setPick(p)} className={`mt-8 rounded-full py-3 text-center font-semibold ${p.featured ? 'bg-signal text-white' : 'border border-ink/20 hover:bg-sand'}`}>Choose {p.name}</button>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-ink/55">Prices in US dollars, per workspace. Annual billing is 12 months paid up front.</p>
      {pick && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => setPick(null)}>
          <div role="dialog" aria-modal="true" aria-label={`${pick.name} plan`} className="w-full max-w-md rounded-3xl bg-paper p-7" onClick={(e) => e.stopPropagation()}>
            <p className="font-mono text-xs uppercase tracking-widest text-signal">{pick.name} plan</p>
            <p className="mt-2 font-display text-4xl font-semibold">{show(pick)}<span className="font-sans text-base font-normal opacity-60"> /{annual ? 'year' : 'month'}</span></p>
            <ul className="mt-4 space-y-1.5 text-sm">{pick.items.map((i) => <li key={i} className="flex gap-2"><Check size={15} className="mt-0.5 text-sea" />{i}</li>)}</ul>
            <p className="mt-5 text-sm text-ink/60">Create your workspace on this plan now. Our team contacts you at your account email to arrange invoicing before the first billing period.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => nav(user ? '/dashboard' : `/signup?plan=${pick.name.toLowerCase()}`)} className="rounded-full bg-signal px-5 py-2.5 font-semibold text-white">{user ? 'Go to dashboard' : `Continue with ${pick.name}`}</button>
              <a href="#access" onClick={() => setPick(null)} className="rounded-full border border-ink/20 px-5 py-2.5 font-semibold">Talk to sales</a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
