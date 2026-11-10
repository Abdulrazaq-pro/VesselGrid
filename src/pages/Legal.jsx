import { Page } from '../components/Layout'
export default function Legal({ title, sections }) {
  return (
    <Page>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-sea">Legal</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-ink/50">Last updated 10 November 2026</p>
        {sections.map(([h, ...ps]) => (
          <section key={h} className="mt-10"><h2 className="font-display text-2xl font-semibold">{h}</h2>{ps.map((p, i) => <p key={i} className="mt-3 leading-relaxed text-ink/75">{p}</p>)}</section>
        ))}
      </article>
    </Page>
  )
}
