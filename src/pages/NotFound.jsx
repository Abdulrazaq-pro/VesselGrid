import { Link } from 'react-router-dom'
import { Page } from '../components/Layout'
export default function NotFound() {
  return (
    <Page>
      <section className="chart-grid grid min-h-[60vh] place-items-center px-4 text-center">
        <div><p className="font-mono text-sm text-signal">404 · OFF CHART</p><h1 className="mt-3 font-display text-5xl font-semibold">This berth is empty.</h1>
          <p className="mt-3 text-ink/60">The page you were looking for doesn't exist.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-paper">Back to home</Link></div>
      </section>
    </Page>
  )
}
