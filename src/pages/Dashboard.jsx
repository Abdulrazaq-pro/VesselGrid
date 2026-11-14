import { useEffect, useMemo, useRef, useState } from 'react'
import { collection, doc, onSnapshot, writeBatch, addDoc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Navigate, Link } from 'react-router-dom'
import { Ship, CalendarRange, ListChecks, Activity, Settings, Search, Plus, Upload, Download, Printer, Pencil, Trash2, X, Check, AlertTriangle, LogOut, Menu, Anchor, Clock } from 'lucide-react'
import { useAuth, useToast, Loading, errText, withTimeout } from '../lib/auth'
import { pricing } from '../data/company'

const STATUSES = ['Inbound', 'At anchorage', 'Scheduled', 'Alongside', 'Departed']
const TYPES = ['Container', 'Ro-Ro', 'Tanker', 'General cargo', 'Bulk']
const tone = { Inbound: 'bg-sky-100 text-sky-800', 'At anchorage': 'bg-amber-100 text-amber-800', Scheduled: 'bg-emerald-100 text-emerald-800', Alongside: 'bg-ink text-paper', Departed: 'bg-ink/10 text-ink/60', Pending: 'bg-amber-100 text-amber-800', Approved: 'bg-emerald-100 text-emerald-800', Rejected: 'bg-red-100 text-red-700' }
const Pill = ({ s }) => <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone[s] || 'bg-ink/10'}`}>{s}</span>
const input = 'w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-signal'

const iso = (d) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 16) }
const fmt = (s) => s ? new Date(s).toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'
const hrs = (a, b) => (new Date(b) - new Date(a)) / 36e5
const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

function seed() {
  const t0 = new Date(); t0.setMinutes(0, 0, 0)
  const at = (h) => iso(new Date(t0.getTime() + h * 36e5))
  const rows = [
    ['MV Atlantic Dawn', '9734512', 'Meridian Lines', 'Container', 294, 12.8, '2,140 TEU discharge', 'B1', 2, 5.5, 22, 'At anchorage', 'Approved'],
    ['Kota Bahari', '9612044', 'Straits Feeder Co.', 'Container', 260, 11.9, '1,310 TEU mixed', 'B3', 4, 3.25, 16, 'Inbound', 'Approved'],
    ['Grande Tema', '9488301', 'Gulf Ro-Ro', 'Ro-Ro', 214, 9.4, '1,800 vehicles', 'B4', 9, 11.5, 12, 'Inbound', 'Pending'],
    ['CMA Benin', '9811270', 'Meridian Lines', 'Container', 300, 13.5, '2,600 TEU discharge', 'B2', 13, 13.3, 20, 'Inbound', 'Pending'],
    ['Delta Spirit', '9550918', 'Coastal Energy', 'Tanker', 183, 10.1, 'Clean petroleum products', 'B3', 19, 22.8, 18, 'Scheduled', 'Pending'],
    ['ONE Crown', '9867403', 'Oceanic Network', 'Container', 336, 14.2, '3,050 TEU discharge', 'B1', 26, 26.5, 14, 'Scheduled', 'Approved'],
    ['Bight Trader', '9301456', 'West Coast Shipping', 'General cargo', 145, 8.2, 'Steel coils', 'B4', 30, 29.2, 11, 'Scheduled', 'Approved'],
    ['MSC Lagos', '9765129', 'Oceanic Network', 'Container', 299, 13.1, '2,450 TEU discharge', 'B2', 34, 40.7, 18, 'Inbound', 'Pending'],
  ]
  return rows.map(([vessel, imo, line, type, loa, draft, cargo, berth, e, p, d, status, approval], i) => ({ id: `PC-${2041 + i}`, vessel, imo, line, type, loa, draft, cargo, berth, eta: at(e), planned: at(p), duration: d, status, approval }))
}

function conflicts(calls) {
  const out = []; const active = calls.filter((c) => c.status !== 'Departed' && c.berth && c.berth !== 'Unassigned')
  for (let i = 0; i < active.length; i++) for (let j = i + 1; j < active.length; j++) {
    const a = active[i], b = active[j]; if (a.berth !== b.berth) continue
    const aS = new Date(a.planned), aE = new Date(aS.getTime() + a.duration * 36e5), bS = new Date(b.planned), bE = new Date(bS.getTime() + b.duration * 36e5)
    if (aS < bE && bS < aE) out.push({ id: `${a.id}|${b.id}`, berth: a.berth, a, b, overlap: Math.min(aE, bE) - Math.max(aS, bS) })
  }
  return out
}

function toCSV(rows) {
  const cols = ['id', 'vessel', 'imo', 'line', 'type', 'loa', 'draft', 'cargo', 'berth', 'eta', 'planned', 'duration', 'status', 'approval']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
}
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/); const split = (l) => (l.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || []).map((x) => x.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')).slice(0, -1)
  const head = split(lines[0]).map((h) => h.trim().toLowerCase())
  return lines.slice(1).filter(Boolean).map((l) => Object.fromEntries(split(l).map((v, i) => [head[i], v])))
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">{title}</h2><button onClick={onClose} aria-label="Close"><X /></button></div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

function CallForm({ initial, berths, onSave, onCancel }) {
  const [v, setV] = useState(initial); const [e, setE] = useState({})
  const set = (k) => (ev) => setV({ ...v, [k]: ev.target.value })
  const submit = (ev) => {
    ev.preventDefault(); const x = {}
    if (!v.vessel.trim()) x.vessel = 'Required'
    if (!/^\d{7}$/.test(v.imo)) x.imo = 'IMO is 7 digits'
    if (!v.eta) x.eta = 'Required'
    if (!(+v.loa > 0)) x.loa = 'Required'
    if (!(+v.draft > 0)) x.draft = 'Required'
    if (!(+v.duration > 0)) x.duration = 'Required'
    setE(x); if (Object.keys(x).length) return
    onSave({ ...v, loa: +v.loa, draft: +v.draft, duration: +v.duration, planned: v.planned || v.eta })
  }
  const F = ({ k, label, type = 'text', ...p }) => (<div><label className="mb-1 block text-xs font-medium text-ink/70" htmlFor={`cf-${k}`}>{label}</label><input id={`cf-${k}`} type={type} className={input} value={v[k]} onChange={set(k)} {...p} />{e[k] && <p className="mt-0.5 text-xs text-signal">{e[k]}</p>}</div>)
  const S = ({ k, label, opts }) => (<div><label className="mb-1 block text-xs font-medium text-ink/70" htmlFor={`cf-${k}`}>{label}</label><select id={`cf-${k}`} className={input} value={v[k]} onChange={set(k)}>{opts.map((o) => <option key={o}>{o}</option>)}</select></div>)
  return (
    <form noValidate onSubmit={submit} className="grid grid-cols-2 gap-3">
      <div className="col-span-2">{F({ k: 'vessel', label: 'Vessel name' })}</div>
      {F({ k: 'imo', label: 'IMO number', inputMode: 'numeric' })}
      {S({ k: 'type', label: 'Vessel type', opts: TYPES })}
      <div className="col-span-2">{F({ k: 'line', label: 'Shipping line' })}</div>
      {F({ k: 'loa', label: 'LOA (m)', type: 'number' })}
      {F({ k: 'draft', label: 'Draft (m)', type: 'number', step: '0.1' })}
      <div className="col-span-2">{F({ k: 'cargo', label: 'Cargo' })}</div>
      {F({ k: 'eta', label: 'Declared ETA', type: 'datetime-local' })}
      {F({ k: 'planned', label: 'Planned berthing', type: 'datetime-local' })}
      {S({ k: 'berth', label: 'Berth', opts: ['Unassigned', ...berths] })}
      {F({ k: 'duration', label: 'Hours alongside', type: 'number' })}
      {S({ k: 'status', label: 'Status', opts: STATUSES })}
      {S({ k: 'approval', label: 'Plan approval', opts: ['Pending', 'Approved', 'Rejected'] })}
      <div className="col-span-2 mt-3 flex gap-2"><button className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white">Save port call</button><button type="button" onClick={onCancel} className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold">Cancel</button></div>
    </form>
  )
}


function useWorkspace(uid, toast) {
  const [calls, setRaw] = useState(null)
  const [log, setLogRaw] = useState([])
  const ref = useRef([])
  useEffect(() => {
    if (!uid) return
    const u1 = onSnapshot(collection(db, 'users', uid, 'calls'), (s) => { const xs = s.docs.map((d) => d.data()); ref.current = xs; setRaw(xs) }, (e) => { toast(errText(e), 'err'); setRaw([]) })
    const u2 = onSnapshot(query(collection(db, 'users', uid, 'log'), orderBy('t', 'desc'), limit(200)), (s) => setLogRaw(s.docs.map((d) => d.data())), () => {})
    return () => { u1(); u2() }
  }, [uid, toast])
  // Diff the next list against the current one and write only what changed, in one batch.
  const setCalls = async (next) => {
    const prev = ref.current; const list = typeof next === 'function' ? next(prev) : next
    const byId = Object.fromEntries(prev.map((c) => [c.id, c])); const keep = new Set(list.map((c) => c.id))
    const b = writeBatch(db); let n = 0
    list.forEach((c) => { if (JSON.stringify(byId[c.id]) !== JSON.stringify(c)) { b.set(doc(db, 'users', uid, 'calls', c.id), c); n++ } })
    prev.forEach((c) => { if (!keep.has(c.id)) { b.delete(doc(db, 'users', uid, 'calls', c.id)); n++ } })
    if (!n) return
    try { await withTimeout(b.commit()) } catch (e) { toast(errText(e), 'err') }
  }
  const addLog = (m) => addDoc(collection(db, 'users', uid, 'log'), { t: new Date().toISOString(), m }).catch(() => {})
  return { calls, log, setCalls, addLog }
}

export default function Dashboard() {
  const { user, loading, logout, updateUser } = useAuth(); const toast = useToast()
  const ws = useWorkspace(user?.uid, toast)
  const calls = ws.calls || []; const log = ws.log; const setCalls = ws.setCalls; const addLog = ws.addLog
  const seeding = useRef(false)
  useEffect(() => {
    if (!user?.org || user.org.seeded || ws.calls === null || seeding.current) return
    seeding.current = true
    ;(async () => {
      try {
        if (user.org.seed && !ws.calls.length) await setCalls(seed())
        await addLog(`Workspace created for ${user.org.terminal}`)
        await updateUser({ org: { seeded: true } })
      } catch (e) { toast(errText(e), 'err') }
    })()
  }, [user, ws.calls])
  const [tab, setTab] = useState('calls'); const [nav, setNav] = useState(false)
  const [q, setQ] = useState(''); const [status, setStatus] = useState('All')
  const [edit, setEdit] = useState(null); const [confirmDel, setConfirmDel] = useState(null)
  const fileRef = useRef()
  const [settings, setSettings] = useState(user?.org || {})
  useEffect(() => { if (user?.org) setSettings((x) => (x.name ? x : user.org)) }, [user?.org])

  const berths = useMemo(() => Array.from({ length: user?.org?.berths || 4 }, (_, i) => `B${i + 1}`), [user?.org?.berths])
  const clashes = useMemo(() => conflicts(calls), [calls])
  const rows = useMemo(() => calls.filter((c) => (status === 'All' || c.status === status) && `${c.vessel} ${c.line} ${c.id} ${c.imo}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => new Date(a.planned) - new Date(b.planned)), [calls, q, status])

  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (!user.org) return <Navigate to="/onboarding" replace />
  if (ws.calls === null) return <Loading />

  const save = (c) => {
    if (c.id) { setCalls((xs) => xs.map((x) => (x.id === c.id ? c : x))); addLog(`Updated ${c.vessel}`); toast(`${c.vessel} updated.`) }
    else { const n = { ...c, id: uid('PC') }; setCalls((xs) => [...xs, n]); addLog(`Added port call ${n.vessel} (${n.id})`); toast(`${n.vessel} added to the schedule.`) }
    setEdit(null)
  }
  const remove = (c) => { setCalls((xs) => xs.filter((x) => x.id !== c.id)); addLog(`Removed ${c.vessel}`); toast(`${c.vessel} removed.`); setConfirmDel(null) }
  const decide = (c, approval) => { setCalls((xs) => xs.map((x) => (x.id === c.id ? { ...x, approval } : x))); addLog(`${approval} berth plan for ${c.vessel}`); toast(`${c.vessel}: plan ${approval.toLowerCase()}.`, approval === 'Rejected' ? 'err' : 'ok') }
  const resolve = (k) => {
    const later = new Date(k.a.planned) > new Date(k.b.planned) ? k.a : k.b, first = later === k.a ? k.b : k.a
    const free = new Date(new Date(first.planned).getTime() + first.duration * 36e5 + 36e5)
    setCalls((xs) => xs.map((x) => (x.id === later.id ? { ...x, planned: iso(free), approval: 'Pending' } : x)))
    addLog(`Moved ${later.vessel} to ${fmt(iso(free))} on ${k.berth} after ${first.vessel}`); toast(`${later.vessel} re-sequenced on ${k.berth}.`)
  }
  const exportCSV = () => {
    const blob = new Blob([toCSV(rows)], { type: 'text/csv' }); const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = `vesselgrid-port-calls-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(a.href)
    toast(`Exported ${rows.length} port calls to CSV.`)
  }
  const importCSV = async (f) => {
    try {
      const recs = parseCSV(await f.text()).filter((r) => r.vessel)
      if (!recs.length) throw new Error()
      const added = recs.map((r) => ({ id: uid('PC'), vessel: r.vessel, imo: r.imo || '', line: r.line || '', type: TYPES.includes(r.type) ? r.type : 'Container', loa: +r.loa || 0, draft: +r.draft || 0, cargo: r.cargo || '', berth: r.berth || 'Unassigned', eta: r.eta || iso(new Date()), planned: r.planned || r.eta || iso(new Date()), duration: +r.duration || 12, status: STATUSES.includes(r.status) ? r.status : 'Inbound', approval: 'Pending' }))
      setCalls((xs) => [...xs, ...added]); addLog(`Imported ${added.length} port calls from ${f.name}`); toast(`Imported ${added.length} port calls from ${f.name}.`)
    } catch { toast('Could not read that file. Use a CSV with a header row including "vessel".', 'err') }
    fileRef.current.value = ''
  }
  const blank = { vessel: '', imo: '', line: '', type: 'Container', loa: '', draft: '', cargo: '', berth: 'Unassigned', eta: iso(new Date(Date.now() + 6 * 36e5)), planned: '', duration: 12, status: 'Inbound', approval: 'Pending' }
  const pending = calls.filter((c) => c.approval === 'Pending')
  const late = calls.filter((c) => hrs(c.eta, c.planned) > 2)

  const tabs = [['calls', 'Port calls', Ship], ['plan', 'Berth plan', CalendarRange], ['review', `Review (${pending.length + clashes.length})`, ListChecks], ['activity', 'Activity', Activity], ['settings', 'Settings', Settings]]

  return (
    <div className="min-h-screen bg-sand/40 print:bg-white">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink/10 bg-ink px-4 text-paper print:hidden">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setNav(!nav)} aria-label="Toggle navigation"><Menu size={20} /></button>
          <Link to="/" className="flex items-center gap-2"><img src="/logo-mark.svg" alt="" width="26" height="26" className="rounded-md" /><span className="font-display font-bold">Vessel<span className="text-signal">grid</span></span></Link>
          <span className="hidden text-sm text-paper/50 sm:inline">/ {user.org.terminal}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-paper/60 sm:inline">{user.name}</span>
          <button onClick={() => { logout(); toast('Signed out.') }} className="flex items-center gap-1 rounded-full border border-paper/20 px-3 py-1 hover:bg-paper/10"><LogOut size={14} />Sign out</button>
        </div>
      </header>
      <div className="md:grid md:grid-cols-[210px_1fr]">
        <nav className={`${nav ? 'block' : 'hidden'} border-b border-ink/10 bg-paper p-3 md:sticky md:top-14 md:block md:h-[calc(100vh-3.5rem)] md:border-b-0 md:border-r print:hidden`} aria-label="Workspace">
          <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-widest text-ink/40">{user.org.name}</p>
          {tabs.map(([k, l, I]) => <button key={k} onClick={() => { setTab(k); setNav(false) }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${tab === k ? 'bg-white font-semibold shadow-sm' : 'text-ink/60 hover:bg-white/60'}`}><I size={15} />{l}</button>)}
        </nav>

        <main className="min-w-0 p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 print:hidden">
            {[['Port calls', calls.filter((c) => c.status !== 'Departed').length, Ship], ['Awaiting approval', pending.length, ListChecks], ['Berth clashes', clashes.length, AlertTriangle], ['Running 2h+ late', late.length, Clock]].map(([l, n, I]) => (
              <div key={l} className="rounded-xl border border-ink/10 bg-white p-4"><div className="flex items-center justify-between text-xs text-ink/50">{l}<I size={15} /></div><p className={`mt-2 font-display text-3xl ${l === 'Berth clashes' && n ? 'text-signal' : ''}`}>{n}</p></div>
            ))}
          </div>

          {tab === 'calls' && (
            <section className="mt-6 rounded-xl border border-ink/10 bg-white">
              <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 p-3 print:hidden">
                <div className="relative min-w-[180px] flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" /><input aria-label="Search port calls" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vessel, line, IMO" className={`${input} pl-9`} /></div>
                <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} w-auto`}><option>All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                <button onClick={() => setEdit(blank)} className="flex items-center gap-1 rounded-full bg-signal px-4 py-2 text-sm font-semibold text-white"><Plus size={15} />New port call</button>
                <button onClick={() => fileRef.current.click()} className="flex items-center gap-1 rounded-full border border-ink/20 px-3 py-2 text-sm font-medium"><Upload size={15} />Import CSV</button>
                <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={(e) => e.target.files[0] && importCSV(e.target.files[0])} />
                <button onClick={exportCSV} className="flex items-center gap-1 rounded-full border border-ink/20 px-3 py-2 text-sm font-medium"><Download size={15} />CSV</button>
                <button onClick={() => window.print()} className="flex items-center gap-1 rounded-full border border-ink/20 px-3 py-2 text-sm font-medium"><Printer size={15} />PDF</button>
              </div>
              <h2 className="hidden p-3 font-display text-2xl print:block">{user.org.terminal} · port calls · {new Date().toLocaleDateString()}</h2>
              {rows.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-sm">
                    <thead className="bg-sand/50 text-left text-xs text-ink/50"><tr>{['Vessel', 'Line', 'LOA / draft', 'Declared ETA', 'Planned', 'Berth', 'Status', 'Plan', ''].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
                    <tbody>{rows.map((c) => {
                      const d = hrs(c.eta, c.planned)
                      return (
                        <tr key={c.id} className="border-t border-ink/5 hover:bg-sand/30">
                          <td className="px-3 py-2.5"><p className="font-semibold">{c.vessel}</p><p className="font-mono text-[11px] text-ink/40">{c.id} · IMO {c.imo}</p></td>
                          <td className="px-3 py-2.5 text-ink/70">{c.line}</td>
                          <td className="px-3 py-2.5 font-mono text-xs">{c.loa} m / {c.draft} m</td>
                          <td className="px-3 py-2.5 font-mono text-xs">{fmt(c.eta)}</td>
                          <td className="px-3 py-2.5 font-mono text-xs">{fmt(c.planned)}{Math.abs(d) >= 0.5 && <span className={`ml-1 ${d > 0 ? 'text-signal' : 'text-sea'}`}>{d > 0 ? '+' : ''}{d.toFixed(1)}h</span>}</td>
                          <td className="px-3 py-2.5 font-mono text-xs">{c.berth}</td>
                          <td className="px-3 py-2.5"><Pill s={c.status} /></td>
                          <td className="px-3 py-2.5"><Pill s={c.approval} /></td>
                          <td className="px-3 py-2.5 print:hidden"><div className="flex gap-1">
                            <button onClick={() => setEdit(c)} aria-label={`Edit ${c.vessel}`} className="rounded p-1.5 hover:bg-sand"><Pencil size={15} /></button>
                            <button onClick={() => setConfirmDel(c)} aria-label={`Delete ${c.vessel}`} className="rounded p-1.5 text-signal hover:bg-signal/10"><Trash2 size={15} /></button>
                          </div></td>
                        </tr>)
                    })}</tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center"><Anchor className="mx-auto text-ink/30" /><p className="mt-3 font-semibold">{calls.length ? 'No port calls match your filters.' : 'No port calls yet.'}</p><p className="mt-1 text-sm text-ink/60">{calls.length ? 'Clear the search or status filter.' : 'Add a port call or import a CSV to build your schedule.'}</p></div>
              )}
            </section>
          )}

          {tab === 'plan' && (() => {
            const active = calls.filter((c) => c.status !== 'Departed')
            const start = active.length ? Math.min(...active.map((c) => new Date(c.planned))) : Date.now()
            const span = 72
            return (
              <section className="mt-6 rounded-xl border border-ink/10 bg-white p-4">
                <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Berth plan · next {span} hours</h2><span className="text-xs text-ink/50">Click a vessel to edit · red outline = clash</span></div>
                <div className="mt-4 overflow-x-auto"><div className="min-w-[640px] space-y-2 font-mono text-[11px]">
                  <div className="ml-12 flex justify-between text-ink/40">{[0, 24, 48, 72].map((h) => <span key={h}>{fmt(iso(new Date(start + h * 36e5)))}</span>)}</div>
                  {berths.map((b) => (
                    <div key={b} className="flex items-center gap-2"><span className="w-10 text-ink/50">{b}</span>
                      <div className="relative h-9 flex-1 rounded-md bg-ink/[.04]">
                        {active.filter((c) => c.berth === b).map((c) => {
                          const l = (hrs(iso(new Date(start)), c.planned) / span) * 100, w = (c.duration / span) * 100
                          const clash = clashes.some((k) => k.a.id === c.id || k.b.id === c.id)
                          if (l > 100 || l + w < 0) return null
                          return <button key={c.id} onClick={() => setEdit(c)} title={`${c.vessel} · ${fmt(c.planned)} · ${c.duration}h`} className={`absolute bottom-1 top-1 truncate rounded px-1.5 text-left font-semibold ${c.approval === 'Approved' ? 'bg-sea text-white' : 'bg-ink text-paper'} ${clash ? 'ring-2 ring-signal' : ''}`} style={{ left: `${Math.max(l, 0)}%`, width: `${Math.min(w, 100 - Math.max(l, 0))}%` }}>{c.vessel}</button>
                        })}
                      </div></div>
                  ))}
                  {active.some((c) => c.berth === 'Unassigned') && <p className="pt-2 text-ink/60">Unassigned: {active.filter((c) => c.berth === 'Unassigned').map((c) => c.vessel).join(', ')}</p>}
                </div></div>
              </section>
            )
          })()}

          {tab === 'review' && (
            <section className="mt-6 space-y-4">
              {clashes.map((k) => (
                <div key={k.id} className="rounded-xl border border-signal/30 bg-white p-4">
                  <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} className="text-signal" />{k.a.vessel} and {k.b.vessel} overlap on {k.berth} by {(k.overlap / 36e5).toFixed(1)}h</p>
                  <p className="mt-1 text-sm text-ink/60">Suggested fix: move the later vessel to one hour after the earlier one leaves the berth.</p>
                  <button onClick={() => resolve(k)} className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">Apply re-sequence</button>
                </div>
              ))}
              <div className="rounded-xl border border-ink/10 bg-white">
                <h2 className="border-b border-ink/10 p-4 font-semibold">Berth plans awaiting approval ({pending.length})</h2>
                {pending.length ? pending.map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 p-4 last:border-0">
                    <div><p className="font-semibold">{c.vessel} → {c.berth}</p><p className="text-xs text-ink/60">{fmt(c.planned)} · {c.duration}h alongside · {c.cargo}</p></div>
                    <div className="flex gap-2"><button onClick={() => decide(c, 'Approved')} className="flex items-center gap-1 rounded-full bg-sea px-3 py-1.5 text-sm font-semibold text-white"><Check size={14} />Approve</button><button onClick={() => decide(c, 'Rejected')} className="flex items-center gap-1 rounded-full border border-signal/40 px-3 py-1.5 text-sm font-semibold text-signal"><X size={14} />Reject</button></div>
                  </div>)) : <p className="p-4 text-sm text-ink/60">Nothing waiting. Every plan has a decision.</p>}
              </div>
            </section>
          )}

          {tab === 'activity' && (
            <section className="mt-6 rounded-xl border border-ink/10 bg-white p-4">
              <h2 className="font-display text-xl font-semibold">Activity log</h2>
              <ol className="mt-4 space-y-3 border-l border-ink/10 pl-4">{!log.length && <li className="text-sm text-ink/60">No activity yet.</li>}{log.map((l, i) => <li key={i} className="text-sm"><span className="font-mono text-xs text-ink/40">{new Date(l.t).toLocaleString()}</span><p>{l.m}</p></li>)}</ol>
            </section>
          )}

          {tab === 'settings' && (
            <section className="mt-6 max-w-xl rounded-xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-xl font-semibold">Workspace settings</h2>
              <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); if (!settings.name?.trim() || !settings.terminal?.trim() || !(+settings.berths >= 1 && +settings.berths <= 20)) { toast('Name, terminal and 1–20 berths are required.', 'err'); return } updateUser({ org: { ...settings, berths: +settings.berths } }).then(() => { addLog('Workspace settings updated'); toast('Settings saved.') }).catch((er) => toast(errText(er), 'err')) }}>
                {[['name', 'Organisation'], ['terminal', 'Terminal or port']].map(([k, l]) => <div key={k}><label className="mb-1 block text-xs font-medium text-ink/70" htmlFor={`st-${k}`}>{l}</label><input id={`st-${k}`} className={input} value={settings[k] || ''} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} /></div>)}
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="mb-1 block text-xs font-medium text-ink/70" htmlFor="st-b">Berths</label><input id="st-b" type="number" min="1" max="20" className={input} value={settings.berths || ''} onChange={(e) => setSettings({ ...settings, berths: e.target.value })} /></div>
                  <div><label className="mb-1 block text-xs font-medium text-ink/70" htmlFor="st-p">Plan</label><select id="st-p" className={input} value={settings.plan} onChange={(e) => setSettings({ ...settings, plan: e.target.value })}>{pricing.map((p) => <option key={p.name} value={p.name.toLowerCase()}>{p.name} · {p.price}/mo</option>)}</select></div>
                </div>
                <button className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper">Save settings</button>
              </form>
              <div className="mt-8 border-t border-ink/10 pt-5">
                <h3 className="font-semibold">Data</h3>
                <p className="mt-1 text-sm text-ink/60">Workspace records are stored in your account and sync in real time across every device you sign in on.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => { setCalls([]); addLog('Cleared all port calls'); toast('All port calls cleared.') }} className="rounded-full border border-signal/40 px-4 py-2 text-sm font-semibold text-signal">Clear port calls</button>
                  <button onClick={() => { setCalls(seed()); addLog('Loaded example port calls'); toast('Example port calls loaded.') }} className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold">Load example port calls</button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {edit && <Modal title={edit.id ? `Edit ${edit.vessel}` : 'New port call'} onClose={() => setEdit(null)}><CallForm initial={edit} berths={berths} onSave={save} onCancel={() => setEdit(null)} /></Modal>}
      {confirmDel && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => setConfirmDel(null)}>
          <div role="alertdialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-paper p-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-xl font-semibold">Remove {confirmDel.vessel}?</p><p className="mt-2 text-sm text-ink/60">This deletes the port call from the schedule.</p>
            <div className="mt-5 flex gap-2"><button onClick={() => remove(confirmDel)} className="rounded-full bg-signal px-4 py-2 text-sm font-semibold text-white">Remove</button><button onClick={() => setConfirmDel(null)} className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
