import { Component, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import NotFound from './pages/NotFound.jsx'
import AppKit from './pages/AppKit.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Security from './pages/Security.jsx'
import { Login, Signup, Onboarding } from './pages/Auth.jsx'
import { AuthProvider, ToastProvider } from './lib/auth'

class ErrorBoundary extends Component {
  state = { err: null }
  static getDerivedStateFromError(err) { return { err } }
  render() {
    if (this.state.err) return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div><h1 className="font-display text-3xl">Something went wrong.</h1>
        <p className="mt-2">Reload the page or email <a className="underline" href="mailto:nimot@vesselgrid.site">nimot@vesselgrid.site</a>.</p></div>
      </div>)
    return this.props.children
  }
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  return null
}

const titles = { '/privacy': 'Privacy Policy | Vesselgrid', '/terms': 'Terms of Service | Vesselgrid', '/app': 'Application Kit | Vesselgrid', '/login': 'Sign in | Vesselgrid', '/signup': 'Create account | Vesselgrid', '/onboarding': 'Set up workspace | Vesselgrid', '/dashboard': 'Workspace | Vesselgrid', '/security': 'Security | Vesselgrid' }

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { document.title = titles[pathname] || 'Vesselgrid | AI berth scheduling and vessel ETA prediction for ports' }, [pathname])
  return (
    <ErrorBoundary><AuthProvider><ToastProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/app" element={<AppKit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/security" element={<Security />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider></AuthProvider></ErrorBoundary>
  )
}
