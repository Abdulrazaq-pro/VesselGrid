import { useState } from 'react'
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { Loader2, AlertCircle, Anchor } from 'lucide-react'
import { Logo } from '../components/Layout'
import { useAuth, useToast, errText, Loading } from '../lib/auth'
import { pricing } from '../data/company'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
const input = 'w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-signal'

function Shell({ title, sub, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <Logo />
        <div className="mx-auto my-auto w-full max-w-sm py-10">
          <h1 className="font-display text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-ink/60">{sub}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="chart-grid-dark hidden flex-col justify-end bg-ink p-12 text-paper lg:flex">
        <Anchor className="text-foam" />
        <p className="mt-4 max-w-md font-display text-3xl leading-snug">Plan berths, tugs and pilots around when ships will actually arrive.</p>
        <p className="mt-3 text-sm text-paper/55">Vesselgrid · port operations workspace</p>
      </div>
    </div>
  )
}

function Field({ id, label, error, ...p }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input id={id} className={input} aria-invalid={!!error} {...p} />
      {error && <p className="mt-1 text-xs text-signal">{error}</p>}
    </div>
  )
}

export function Signup() {
  const { user, loading, signup } = useAuth(); const nav = useNavigate(); const toast = useToast()
  const [params] = useSearchParams(); const plan = params.get('plan')
  const [v, setV] = useState({ name: '', email: '', password: '' })
  const [e, setE] = useState({}); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  if (loading && !busy) return <Loading />
  if (user && !busy) return <Navigate to={user.org ? '/dashboard' : '/onboarding'} replace />
  const submit = async (ev) => {
    ev.preventDefault(); const x = {}
    if (!v.name.trim()) x.name = 'Enter your full name.'
    if (!emailOk(v.email)) x.email = 'Enter a valid work email.'
    if (v.password.length < 8) x.password = 'Use at least 8 characters.'
    setE(x); if (Object.keys(x).length) return
    setBusy(true); setErr('')
    try { await signup(v); toast('Account created. Set up your terminal workspace.'); setBusy(false); nav(`/onboarding${plan ? `?plan=${plan}` : ''}`) }
    catch (er) { setErr(errText(er)); setBusy(false) }
  }
  const set = (k) => (ev) => setV({ ...v, [k]: ev.target.value })
  return (
    <Shell title="Create your workspace" sub={plan ? `Selected plan: ${pricing.find((p) => p.name.toLowerCase() === plan)?.name ?? plan}. You can change it later.` : 'Set up a Vesselgrid workspace for your terminal in under two minutes.'}>
      <form noValidate onSubmit={submit} className="space-y-4">
        <Field id="su-name" label="Full name" autoComplete="name" value={v.name} onChange={set('name')} error={e.name} />
        <Field id="su-email" label="Work email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={e.email} />
        <Field id="su-pw" label="Password" type="password" autoComplete="new-password" value={v.password} onChange={set('password')} error={e.password} />
        {err && <p role="alert" className="flex gap-2 rounded-lg bg-signal/10 p-3 text-sm text-signal"><AlertCircle size={16} className="mt-0.5 shrink-0" />{err}</p>}
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-signal py-3 font-semibold text-white hover:brightness-110 disabled:opacity-60">{busy && <Loader2 size={16} className="animate-spin" />}Create account</button>
        <p className="text-xs text-ink/50">By creating an account you agree to the <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.</p>
      </form>
      <p className="mt-6 text-sm text-ink/60">Already have an account? <Link to="/login" className="font-semibold text-signal">Sign in</Link></p>
    </Shell>
  )
}

export function Login() {
  const { user, loading, login, resetPassword } = useAuth(); const nav = useNavigate(); const toast = useToast()
  const [v, setV] = useState({ email: '', password: '' }); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  if (loading && !busy) return <Loading />
  if (user && !busy) return <Navigate to={user.org ? '/dashboard' : '/onboarding'} replace />
  const submit = async (ev) => {
    ev.preventDefault()
    if (!emailOk(v.email) || !v.password) { setErr('Enter your email and password.'); return }
    setBusy(true); setErr('')
    try { const u = await login(v); toast(`Welcome back${u.name ? `, ${u.name.split(' ')[0]}` : ''}.`); setBusy(false); nav(u.org ? '/dashboard' : '/onboarding') }
    catch (er) { setErr(errText(er)); setBusy(false) }
  }
  return (
    <Shell title="Sign in" sub="Open your terminal workspace.">
      <form noValidate onSubmit={submit} className="space-y-4">
        <Field id="li-email" label="Work email" type="email" autoComplete="email" value={v.email} onChange={(ev) => setV({ ...v, email: ev.target.value })} />
        <Field id="li-pw" label="Password" type="password" autoComplete="current-password" value={v.password} onChange={(ev) => setV({ ...v, password: ev.target.value })} />
        {err && <p role="alert" className="flex gap-2 rounded-lg bg-signal/10 p-3 text-sm text-signal"><AlertCircle size={16} className="mt-0.5 shrink-0" />{err}</p>}
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 font-semibold text-paper hover:bg-deep disabled:opacity-60">{busy && <Loader2 size={16} className="animate-spin" />}Sign in</button>
      </form>
      <button type="button" onClick={async () => { if (!emailOk(v.email)) { setErr('Enter your email above, then click "Forgot password".'); return } try { await resetPassword(v.email); toast(`Password reset link sent to ${v.email}.`) } catch (er) { setErr(errText(er)) } }} className="mt-4 text-sm font-medium text-ink/60 underline">Forgot password?</button>
      <p className="mt-6 text-sm text-ink/60">New to Vesselgrid? <Link to="/signup" className="font-semibold text-signal">Create a workspace</Link></p>
    </Shell>
  )
}

export function Onboarding() {
  const { user, loading, updateUser } = useAuth(); const nav = useNavigate(); const toast = useToast()
  const [params] = useSearchParams()
  const [v, setV] = useState({ org: '', terminal: '', role: '', berths: '4', plan: params.get('plan') || 'growth', seed: true })
  const [e, setE] = useState({}); const [busy, setBusy] = useState(false)
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  const submit = async (ev) => {
    ev.preventDefault(); const x = {}
    if (!v.org.trim()) x.org = 'Enter your organisation name.'
    if (!v.terminal.trim()) x.terminal = 'Enter the terminal or port name.'
    if (!(+v.berths >= 1 && +v.berths <= 20)) x.berths = 'Between 1 and 20 berths.'
    setE(x); if (Object.keys(x).length) return
    setBusy(true)
    try {
      await updateUser({ org: { name: v.org.trim(), terminal: v.terminal.trim(), role: v.role, berths: +v.berths, plan: v.plan, seed: v.seed, seeded: false } })
      toast(`${v.terminal.trim()} workspace is ready.`); nav('/dashboard')
    } catch (er) { toast(errText(er), 'err'); setBusy(false) }
  }
  const set = (k) => (ev) => setV({ ...v, [k]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value })
  return (
    <Shell title={`Welcome, ${user.name.split(' ')[0]}`} sub="Tell us about your terminal so we can lay out your berths.">
      <form noValidate onSubmit={submit} className="space-y-4">
        <Field id="ob-org" label="Organisation" value={v.org} onChange={set('org')} error={e.org} autoComplete="organization" />
        <Field id="ob-term" label="Terminal or port" value={v.terminal} onChange={set('terminal')} error={e.terminal} />
        <div className="grid grid-cols-2 gap-3">
          <Field id="ob-berths" label="Number of berths" type="number" min="1" max="20" value={v.berths} onChange={set('berths')} error={e.berths} />
          <div><label htmlFor="ob-role" className="mb-1.5 block text-sm font-medium">Your role</label>
            <select id="ob-role" className={input} value={v.role} onChange={set('role')}><option value="">Select…</option>{['Berth planner', 'Terminal manager', 'Harbor master', 'Shipping line ops', 'Tug / pilot dispatch', 'Other'].map((o) => <option key={o}>{o}</option>)}</select></div>
        </div>
        <div><label htmlFor="ob-plan" className="mb-1.5 block text-sm font-medium">Plan</label>
          <select id="ob-plan" className={input} value={v.plan} onChange={set('plan')}>{pricing.map((p) => <option key={p.name} value={p.name.toLowerCase()}>{p.name} · {p.price}/month</option>)}</select></div>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={v.seed} onChange={set('seed')} className="mt-1 accent-signal" />Start with example port calls I can edit or clear</label>
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-signal py-3 font-semibold text-white hover:brightness-110 disabled:opacity-60">{busy && <Loader2 size={16} className="animate-spin" />}Launch workspace</button>
      </form>
    </Shell>
  )
}
