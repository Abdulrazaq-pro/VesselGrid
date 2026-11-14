import { useState } from 'react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function LeadForm({ fields, formName, submitLabel = 'Submit', dark = false }) {
  const init = Object.fromEntries(fields.map((f) => [f.name, '']))
  const [values, setValues] = useState(init)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')
  const [msg, setMsg] = useState('')

  const validate = () => {
    const e = {}
    fields.forEach((f) => {
      const v = values[f.name].trim()
      if (f.required && !v) e[f.name] = `${f.label} is required.`
      else if (f.type === 'email' && v && !emailOk(v)) e[f.name] = 'Enter a valid email address.'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setState('loading')
    try {
      const clean = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim().slice(0, 4000)]))
      await Promise.race([new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)), addDoc(collection(db, 'leads'), { form: formName, ...clean, page: window.location.pathname, createdAt: serverTimestamp() })])
      setState('success'); setValues(init)
    } catch {
      setState('error'); setMsg('We could not send your message. Please try again or email nimot@vesselgrid.site.')
    }
  }

  if (state === 'success') return (
    <div role="status" className={`rounded-2xl border p-8 text-center ${dark ? 'border-paper/20' : 'border-ink/15 bg-white'}`}>
      <CheckCircle2 className="mx-auto text-foam" size={40} />
      <p className="mt-3 font-display text-2xl">Thanks, your message is in.</p>
      <p className="mt-2 text-sm opacity-70">The VesselGrid team will reply to the email you provided.</p>
      <button onClick={() => setState('idle')} className="mt-5 text-sm underline">Send another</button>
    </div>
  )

  const base = `w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-signal ${dark ? 'border-paper/20 bg-deep text-paper placeholder:text-paper/40' : 'border-ink/15 bg-white'}`
  return (
    <form noValidate onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
          <label htmlFor={`${formName}-${f.name}`} className="mb-1.5 block text-sm font-medium">{f.label}{f.required && <span className="text-signal"> *</span>}</label>
          {f.options ? (
            <select id={`${formName}-${f.name}`} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className={base} aria-invalid={!!errors[f.name]}>
              <option value="">Select…</option>
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : f.type === 'textarea' ? (
            <textarea id={`${formName}-${f.name}`} rows={4} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className={base} aria-invalid={!!errors[f.name]} />
          ) : (
            <input id={`${formName}-${f.name}`} type={f.type || 'text'} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className={base} aria-invalid={!!errors[f.name]} autoComplete={f.auto} />
          )}
          {errors[f.name] && <p className="mt-1 text-xs text-signal">{errors[f.name]}</p>}
        </div>
      ))}
      {state === 'error' && <p role="alert" className="flex items-start gap-2 rounded-lg bg-signal/10 p-3 text-sm text-signal sm:col-span-2"><AlertCircle size={16} className="mt-0.5 shrink-0" />{msg}</p>}
      <button disabled={state === 'loading'} className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
        {state === 'loading' && <Loader2 size={16} className="animate-spin" />}{state === 'loading' ? 'Sending…' : submitLabel}
      </button>
    </form>
  )
}
