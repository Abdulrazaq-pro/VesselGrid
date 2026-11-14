import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Menu, X, Mail } from 'lucide-react'
import Linkedin from './LinkedinIcon'
import { company } from '../data/company'

export function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="VesselGrid home">
      <img src="/logo-mark.svg" alt="" width="32" height="32" className="rounded-lg" />
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-paper' : 'text-ink'}`}>Vessel<span className="text-signal">Grid</span></span>
    </Link>
  )
}

const nav = [['Platform', '/#features'], ['How it works', '/#how'], ['Demo', '/#demo'], ['AWS', '/#aws'], ['Pricing', '/#pricing'], ['Team', '/#team'], ['Contact', '/#contact']]

export function Header() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {nav.map(([l, h]) => <a key={l} href={h} className="text-sm font-medium text-ink/70 hover:text-ink">{l}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">{user ? <Link to="/dashboard" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-deep">Go to dashboard</Link> : <><Link to="/login" className="text-sm font-semibold text-ink/80 hover:text-ink">Sign in</Link><Link to="/signup" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-deep">Get started</Link></>}</div>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="border-t border-ink/10 bg-paper px-4 pb-5 lg:hidden" aria-label="Mobile">
          {nav.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="block border-b border-ink/5 py-3 font-medium">{l}</a>)}
          {user ? <Link to="/dashboard" className="mt-4 block rounded-full bg-ink py-3 text-center font-semibold text-paper">Go to dashboard</Link> : <div className="mt-4 grid grid-cols-2 gap-2"><Link to="/login" className="rounded-full border border-ink/20 py-3 text-center font-semibold">Sign in</Link><Link to="/signup" className="rounded-full bg-ink py-3 text-center font-semibold text-paper">Get started</Link></div>}
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-paper/60">AI vessel ETA prediction, berth scheduling and harbor dispatch for terminal operators, port authorities and shipping lines.</p>
          <div className="mt-5 flex gap-3">
            <a href={company.linkedin} target="_blank" rel="noreferrer" aria-label="VesselGrid on LinkedIn" className="rounded-full border border-paper/20 p-2 hover:bg-paper/10"><Linkedin size={18} /></a>
            <a href={`mailto:${company.email}`} aria-label="Email VesselGrid" className="rounded-full border border-paper/20 p-2 hover:bg-paper/10"><Mail size={18} /></a>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40">Company</p>
          {[['Product', '/#product'], ['Solutions', '/#segments'], ['Technology', '/#aws'], ['Team', '/#team'], ['Contact', '/#contact']].map(([l, h]) => <a key={l} href={h} className="mt-3 block text-paper/70 hover:text-paper">{l}</a>)}
        </div>
        <div className="text-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40">Legal</p>
          <Link to="/privacy" className="mt-3 block text-paper/70 hover:text-paper">Privacy Policy</Link>
          <Link to="/terms" className="mt-3 block text-paper/70 hover:text-paper">Terms of Service</Link>
          <Link to="/security" className="mt-3 block text-paper/70 hover:text-paper">Security</Link>
          <a href={`mailto:${company.email}`} className="mt-3 block text-paper/70 hover:text-paper">{company.email}</a>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/40">© 2026 VesselGrid. All rights reserved.</div>
    </footer>
  )
}

export function Page({ children }) {
  return <><Header /><main>{children}</main><Footer /></>
}
