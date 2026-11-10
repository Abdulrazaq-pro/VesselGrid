import { useMemo, useState } from 'react'
import { Anchor, CalendarRange, Ship, LifeBuoy, Sparkles, Search, X, Check, AlertTriangle, Clock } from 'lucide-react'
import { vessels, gantt, dispatch as dispatch0, exceptions as ex0, activity } from '../data/demo'

const tone = { 'At anchorage': 'bg-amber-100 text-amber-800', Inbound: 'bg-sky-100 text-sky-800', Scheduled: 'bg-emerald-100 text-emerald-800', Conflict: 'bg-red-100 text-red-700', Delayed: 'bg-orange-100 text-orange-800', Confirmed: 'bg-emerald-100 text-emerald-800', Proposed: 'bg-sky-100 text-sky-800', 'Needs review': 'bg-red-100 text-red-700' }
const barC = { signal: 'bg-signal text-white', ink: 'bg-ink text-paper', sea: 'bg-sea text-white', warn: 'bg-amber-400 text-ink' }
const Pill = ({ s }) => <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone[s] || 'bg-ink/10'}`}>{s}</span>

export function BerthGantt({ compact = false, onPick }) {
  const hours = 48
  return (
    <div className="font-mono text-[11px]">
      <div className="ml-10 flex justify-between text-ink/40"><span>11 Nov 00:00</span><span>12:00</span><span>12 Nov 00:00</span><span>12:00</span><span>24:00</span></div>
      <div className="relative mt-2 space-y-2">
        <div className="pointer-events-none absolute bottom-0 top-0 z-10 border-l-2 border-dashed border-signal" style={{ left: `calc(2.5rem + (100% - 2.5rem) * ${7 / hours})` }}><span className="absolute -top-4 -translate-x-1/2 text-signal">NOW</span></div>
        {gantt.map((row) => (
          <div key={row.berth} className="flex items-center gap-2">
            <span className="w-8 text-ink/50">{row.berth}</span>
            <div className={`relative flex-1 rounded-md bg-ink/[.04] ${compact ? 'h-7' : 'h-9'}`}>
              {row.items.map((it) => (
                <button key={it.v} type="button" onClick={() => onPick?.(it.v)} title={`${it.v}: ${it.d}h alongside`}
                  className={`absolute top-1 bottom-1 truncate rounded px-1.5 text-left font-semibold transition hover:brightness-110 ${barC[it.c]}`}
                  style={{ left: `${(it.s / hours) * 100}%`, width: `${(it.d / hours) * 100}%` }}>{it.v}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Demo() {
  const [tab, setTab] = useState('arrivals')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [sel, setSel] = useState(null)
  const [dispatch, setDispatch] = useState(dispatch0)
  const [exceptions, setExceptions] = useState(ex0.map((e) => ({ ...e, state: 'open' })))
  const [report, setReport] = useState(false)

  const rows = useMemo(() => vessels.filter((v) => (status === 'All' || v.status === status) && `${v.name} ${v.line} ${v.id}`.toLowerCase().includes(q.toLowerCase())), [q, status])
  const open = exceptions.filter((e) => e.state === 'open').length
  const pick = (name) => setSel(vessels.find((v) => v.name.includes(name)))

  const tabs = [['arrivals', 'Arrivals', Ship], ['berths', 'Berth plan', CalendarRange], ['dispatch', 'Tug & pilot', LifeBuoy], ['review', `Review (${open})`, AlertTriangle], ['insights', 'AI report', Sparkles]]

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/15 bg-white shadow-[0_30px_80px_-30px_rgba(11,29,42,.35)]">
      <div className="flex items-center justify-between border-b border-ink/10 bg-ink px-4 py-2.5 text-paper">
        <div className="flex items-center gap-2 text-sm"><Anchor size={15} className="text-foam" /><span className="font-semibold">Lekki Deep Quay</span><span className="hidden text-paper/50 sm:inline">· Terminal workspace</span></div>
        <span className="rounded border border-paper/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper/70">Sample data</span>
      </div>
      <div className="grid md:grid-cols-[180px_1fr]">
        <nav className="flex gap-1 overflow-x-auto border-b border-ink/10 bg-sand/40 p-2 md:flex-col md:border-b-0 md:border-r" aria-label="Demo sections">
          {tabs.map(([k, l, I]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${tab === k ? 'bg-white font-semibold shadow-sm' : 'text-ink/60 hover:bg-white/60'}`}><I size={15} />{l}</button>
          ))}
        </nav>
        <div className="min-w-0 p-4 sm:p-5">
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[['Vessels in window', vessels.length], ['At anchorage', vessels.filter((v) => v.status === 'At anchorage').length], ['Open conflicts', open], ['Avg ETA confidence', `${Math.round(vessels.reduce((a, v) => a + v.confidence, 0) / vessels.length)}%`]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-ink/10 p-3"><p className="text-[11px] text-ink/50">{l}</p><p className="font-display text-2xl font-semibold">{v}</p></div>
            ))}
          </div>

          {tab === 'arrivals' && (
            <>
              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <label className="relative flex-1"><span className="sr-only">Search vessels</span><Search size={15} className="absolute left-3 top-2.5 text-ink/40" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vessel, line or ID" className="w-full rounded-lg border border-ink/15 py-2 pl-9 pr-3 text-sm outline-none focus:border-signal" /></label>
                <label><span className="sr-only">Filter status</span>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">{['All', 'At anchorage', 'Inbound', 'Scheduled', 'Delayed', 'Conflict'].map((s) => <option key={s}>{s}</option>)}</select></label>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-ink/45"><tr><th className="py-2">Vessel</th><th>Declared ETA</th><th>Predicted ETA</th><th>Conf.</th><th>Berth</th><th>Status</th></tr></thead>
                  <tbody>
                    {rows.map((v) => (
                      <tr key={v.id} onClick={() => setSel(v)} className="cursor-pointer border-t border-ink/5 hover:bg-sand/40">
                        <td className="py-2.5"><button className="text-left font-semibold hover:underline">{v.name}</button><div className="text-[11px] text-ink/50">{v.id} · {v.type}</div></td>
                        <td className="font-mono text-xs text-ink/50 line-through decoration-ink/20">{v.declared}</td>
                        <td className="font-mono text-xs font-semibold">{v.predicted}</td>
                        <td><div className="h-1.5 w-14 rounded bg-ink/10"><div className="h-1.5 rounded bg-sea" style={{ width: `${v.confidence}%` }} /></div></td>
                        <td className="font-mono text-xs">{v.berth}</td><td><Pill s={v.status} /></td>
                      </tr>
                    ))}
                    {!rows.length && <tr><td colSpan={6} className="py-8 text-center text-ink/50">No vessels match this filter.</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'berths' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
              <div><p className="mb-3 text-sm text-ink/60">Select a vessel bar to open its call details.</p><BerthGantt onPick={pick} /></div>
              <div className="rounded-xl border border-ink/10 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/50">Activity</p>
                {activity.map(([t, k, m]) => <div key={t} className="border-t border-ink/5 py-2 text-xs"><span className="font-mono text-ink/40">{t}</span> <b>{k}</b><p className="text-ink/60">{m}</p></div>)}
              </div>
            </div>
          )}

          {tab === 'dispatch' && (
            <div className="space-y-2">
              {dispatch.map((d) => (
                <div key={d.id} className="flex flex-col gap-2 rounded-xl border border-ink/10 p-3 sm:flex-row sm:items-center">
                  <Clock size={16} className="hidden text-ink/40 sm:block" />
                  <div className="flex-1"><p className="text-sm font-semibold">{d.job} · {d.vessel}</p><p className="text-xs text-ink/55"><span className="font-mono">{d.when}</span> · {d.crew}</p></div>
                  <Pill s={d.state} />
                  {d.state !== 'Confirmed' && <button onClick={() => setDispatch(dispatch.map((x) => x.id === d.id ? { ...x, state: 'Confirmed' } : x))} className="rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold hover:bg-ink hover:text-paper">Confirm</button>}
                </div>
              ))}
            </div>
          )}

          {tab === 'review' && (
            <div className="space-y-3">
              {exceptions.map((e) => (
                <div key={e.id} className={`rounded-xl border p-4 ${e.state === 'open' ? 'border-signal/40 bg-signal/[.03]' : 'border-ink/10 opacity-60'}`}>
                  <div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold">{e.title}</p><span className="font-mono text-[11px] text-ink/40">{e.id}</span></div>
                  <p className="mt-2 text-sm"><b>Proposed:</b> {e.fix}</p>
                  <p className="mt-1 text-xs text-ink/60"><b>Why:</b> {e.reason}</p>
                  {e.state === 'open' ? (
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setExceptions(exceptions.map((x) => x.id === e.id ? { ...x, state: 'approved' } : x))} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper"><Check size={13} />Approve</button>
                      <button onClick={() => setExceptions(exceptions.map((x) => x.id === e.id ? { ...x, state: 'rejected' } : x))} className="rounded-full border border-ink/20 px-3 py-1.5 text-xs font-semibold">Reject</button>
                    </div>
                  ) : <p className="mt-3 text-xs font-semibold capitalize">{e.state}</p>}
                </div>
              ))}
              {open === 0 && <button onClick={() => setExceptions(ex0.map((e) => ({ ...e, state: 'open' })))} className="text-xs underline">Reset queue</button>}
            </div>
          )}

          {tab === 'insights' && (
            <div className="rounded-xl border border-ink/10 bg-sand/30 p-4">
              <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-semibold"><Sparkles size={15} className="text-signal" />Day-shift handover, 11 Nov</p>
                <button onClick={() => setReport(!report)} className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper">{report ? 'Collapse' : 'Generate summary'}</button></div>
              {report ? (
                <div className="mt-3 space-y-2 text-sm leading-relaxed">
                  <p>Eight calls in the 48-hour window. Kota Bahari is running 45 minutes early and has been brought forward on B3; pilot and two tugs are confirmed.</p>
                  <p>Two risks need attention: Delta Spirit has no tanker berth on arrival (proposal X-07 waiting) and MSC Lagos is now expected 6h40m late because of head seas, which frees B2 for most of 12 Nov afternoon.</p>
                  <p>CMA Benin should berth on the 19:40 high water rather than 18:10; draft margin at low water is insufficient.</p>
                </div>
              ) : <p className="mt-3 text-sm text-ink/60">Generates a plain-language shift summary from the current berth plan, dispatch jobs and open exceptions.</p>}
            </div>
          )}
        </div>
      </div>

      {sel && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" onClick={() => setSel(null)} role="dialog" aria-modal="true" aria-label={`${sel.name} details`}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between"><div><p className="font-mono text-xs text-ink/50">{sel.id} · Sample data</p><h4 className="font-display text-2xl font-semibold">{sel.name}</h4></div><button onClick={() => setSel(null)} aria-label="Close"><X /></button></div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[['Line', sel.line], ['Type', sel.type], ['LOA', `${sel.loa} m`], ['Draft', `${sel.draft} m`], ['Declared ETA', sel.declared], ['Predicted ETA', sel.predicted], ['Berth', sel.berth], ['Cargo', sel.cargo]].map(([k, v]) => <div key={k}><dt className="text-[11px] text-ink/50">{k}</dt><dd className="font-medium">{v}</dd></div>)}
            </dl>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-sand/50 p-3 text-sm"><span>ETA confidence</span><b>{sel.confidence}%</b></div>
            <div className="mt-3 flex items-center justify-between"><Pill s={sel.status} /><button onClick={() => setSel(null)} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">Done</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
