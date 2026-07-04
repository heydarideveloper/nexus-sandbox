import { Suspense, lazy, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { content } from '@/content';
import { usePrefersReducedMotion } from '@/lib/motion';

const ResumeStudio = lazy(() => import('@/resume/ResumeStudio'));

const STATUS_LABEL: Record<string, string> = {
  expert: '████████ expert',
  advanced: '██████░░ advanced',
  working: '████░░░░ working',
  learning: '██░░░░░░ learning',
};

/**
 * The accessible OS view: every fact in the world, as semantic scrolling HTML.
 * Serves screen readers, crawlers, low-end devices, and anyone who just wants the text.
 */
export default function OsPage() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.title = 'Mohammad Heydari — Nexus OS (text view)';
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, [reduced]);

  const { profile } = content;

  return (
    <div data-scroll-page className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <a
        href="#identity"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-neon focus:px-3 focus:py-1 focus:text-void"
      >
        Skip to content
      </a>

      <header className="mb-12">
        <p className="terminal-text text-xs tracking-[0.3em] text-neon uppercase">
          nexus os · text view
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{profile.name}</h1>
        <p className="mt-1 text-lg text-dim">{profile.headline}</p>
        <p className="terminal-text mt-2 text-xs text-dim">
          {profile.location} ·{' '}
          <a className="text-neon underline underline-offset-4" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>{' '}
          ·{' '}
          <a
            className="text-neon underline underline-offset-4"
            href={profile.github}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>{' '}
          ·{' '}
          <a
            className="text-neon underline underline-offset-4"
            href={profile.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink/90">{profile.summary}</p>
        <p className="mt-3 text-sm text-dim italic">“{profile.identityStatement}”</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/"
            className="rounded-lg bg-neon px-4 py-2 text-sm font-bold text-void transition-transform hover:scale-105"
          >
            Enter the 3D world →
          </Link>
          <a
            href="#resume"
            className="rounded-lg border border-line px-4 py-2 text-sm text-ink hover:border-neon"
          >
            Generate a resume
          </a>
        </div>
      </header>

      <nav
        aria-label="Sections"
        className="terminal-text mb-12 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dim"
      >
        {[
          ['identity', 'identity'],
          ['skills', 'brain'],
          ['career', 'career'],
          ['projects', 'projects'],
          ['learning', 'learning'],
          ['automation', 'automation'],
          ['experiments', 'experiments'],
          ['notes', 'engineering notes'],
          ['achievements', 'achievements'],
          ['resume', 'resume + contact'],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="inline-block px-1 py-2 hover:text-neon">
            /{label}
          </a>
        ))}
      </nav>

      <main>
        {/* Identity */}
        <section id="identity" className="mb-14">
          <h2 className="mb-4 text-2xl font-bold text-neon">Identity</h2>
          <ul className="mb-5 flex flex-wrap gap-2">
            {profile.roles.map((r) => (
              <li key={r} className="hud-chip">
                {r}
              </li>
            ))}
          </ul>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {profile.stats.map((s) => (
              <div key={s.id} className="glass rounded-xl p-4">
                <dt className="terminal-text text-[11px] text-dim">{s.label}</dt>
                <dd className="text-2xl font-extrabold text-ink">
                  {s.value.toLocaleString()}
                  {s.suffix}
                </dd>
                <dd className="mt-1 text-xs text-dim">{s.context}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Skills */}
        <section id="skills" className="mb-14">
          <h2 className="mb-1 text-2xl font-bold text-violet">The Brain — Knowledge Graph</h2>
          <p className="mb-4 text-sm text-dim">
            Every level is an honest self-assessment; every node lists its evidence.
          </p>
          <ul className="space-y-3">
            {content.skills.map((s) => (
              <li key={s.id} className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-ink">{s.label}</span>
                  <span className="terminal-text text-xs text-dim">{STATUS_LABEL[s.status]}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
                  <div className="h-full rounded-full bg-violet" style={{ width: `${s.level}%` }} />
                </div>
                <p className="mt-2 text-sm text-dim">{s.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Career */}
        <section id="career" className="mb-14">
          <h2 className="mb-4 text-2xl font-bold text-azure">Career Line</h2>
          <ol className="space-y-6 border-l-2 border-line pl-5">
            {content.experiences.map((e) => (
              <li key={e.id} className="relative">
                <span
                  className="absolute top-1.5 -left-[27px] h-3 w-3 rounded-full"
                  style={{ background: e.theme.accent }}
                  aria-hidden
                />
                <h3 className="text-lg font-bold text-ink">
                  {e.company} <span className="text-sm font-normal text-dim">— {e.tagline}</span>
                </h3>
                <p className="terminal-text text-xs text-dim">
                  {e.role} · {e.period.from}–{e.period.to ?? 'present'} · {e.domain}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {e.metrics.map((m) => (
                    <li key={m.label} className="hud-chip">
                      {m.label}: {m.value}
                    </li>
                  ))}
                </ul>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-ink/90">
                  {e.bullets.map((b) => (
                    <li key={b.text}>{b.text}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-dim">
                  <strong>Lessons:</strong> {e.lessons.join(' ')}
                </p>
                {e.liveUrl && (
                  <a
                    href={e.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-xs text-neon underline underline-offset-4"
                  >
                    Live: {e.liveUrl}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Projects */}
        <section id="projects" className="mb-14">
          <h2 className="mb-4 text-2xl font-bold text-amber">Innovation Lab</h2>
          <div className="space-y-5">
            {content.projects.map((p) => (
              <article key={p.id} className="glass rounded-xl p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold text-ink">{p.name}</h3>
                  <span className="terminal-text text-xs text-dim">{p.period}</span>
                </div>
                <p className="terminal-text text-xs text-dim">{p.role}</p>
                <p className="mt-2 text-sm text-ink/90">{p.summary}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <h4 className="terminal-text text-[11px] text-rose uppercase">problems</h4>
                    <ul className="mt-1 list-disc pl-4 text-xs text-dim">
                      {p.problems.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="terminal-text text-[11px] text-emerald uppercase">solutions</h4>
                    <ul className="mt-1 list-disc pl-4 text-xs text-dim">
                      {p.solutions.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="terminal-text mt-3 text-xs text-dim">{p.tech.join(' · ')}</p>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-xs text-neon underline underline-offset-4"
                  >
                    Live demo ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Learning */}
        <section id="learning" className="mb-14">
          <h2 className="mb-1 text-2xl font-bold text-emerald">Learning Observatory</h2>
          <p className="mb-4 text-sm text-dim">
            Currently learning — honest progress, real experiments.
          </p>
          <ul className="space-y-4">
            {content.learning.map((l) => (
              <li key={l.id} className="glass rounded-xl p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-ink">{l.label}</span>
                  <span className="terminal-text text-xs text-emerald">{l.progress}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
                  <div
                    className="h-full rounded-full bg-emerald"
                    style={{ width: `${l.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-dim">
                  <strong className="text-ink/90">Why:</strong> {l.why}
                </p>
                <p className="mt-1 text-xs text-dim">
                  <strong>Experiments:</strong> {l.experiments.join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Automations */}
        <section id="automation" className="mb-14">
          <h2 className="mb-4 text-2xl font-bold text-rose">Automation Center</h2>
          <ul className="space-y-4">
            {content.automations.map((a) => (
              <li key={a.id} className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-ink">{a.name}</span>
                  <span className="terminal-text text-xs text-dim">
                    {a.origin} · {a.cadence}
                  </span>
                </div>
                <p className="mt-1 text-sm text-dim">{a.description}</p>
                <p className="terminal-text mt-2 text-xs text-dim">{a.stages.join(' → ')}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Experiments */}
        <section id="experiments" className="mb-14">
          <h2 className="mb-4 text-2xl font-bold text-indigo">Research Lab</h2>
          <ul className="space-y-4">
            {content.experiments.map((x) => (
              <li key={x.id} className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-ink">{x.title}</span>
                  <span className="hud-chip">{x.status}</span>
                </div>
                <dl className="mt-2 space-y-1 text-sm">
                  <div>
                    <dt className="terminal-text inline text-[11px] text-rose uppercase">
                      problem:{' '}
                    </dt>
                    <dd className="inline text-dim">{x.problem}</dd>
                  </div>
                  <div>
                    <dt className="terminal-text inline text-[11px] text-neon uppercase">
                      hypothesis:{' '}
                    </dt>
                    <dd className="inline text-dim">{x.hypothesis}</dd>
                  </div>
                  <div>
                    <dt className="terminal-text inline text-[11px] text-emerald uppercase">
                      result:{' '}
                    </dt>
                    <dd className="inline text-dim">{x.results}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        {/* Engineering notes */}
        <section id="notes" className="mb-14">
          <h2 className="mb-1 text-2xl font-bold text-gold">Engineering Notes</h2>
          <p className="mb-4 text-sm text-dim">
            In the world these hide in five terminals. Here they are in the open — trade-offs,
            mistakes, and lessons.
          </p>
          <ul className="space-y-4">
            {content.notes.map((n) => (
              <li key={n.id} className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-ink">{n.title}</span>
                  <span className="hud-chip">{n.kind}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-dim">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Achievements */}
        <section id="achievements" className="mb-14">
          <h2 className="mb-4 text-2xl font-bold text-neon">Achievements</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.achievements.map((a) => (
              <li key={a.id} className="glass rounded-xl p-4">
                <div className="font-bold text-ink">🏆 {a.title}</div>
                <p className="mt-1 text-xs text-dim">{a.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Resume + contact */}
        <section id="resume" className="mb-20">
          <h2 className="mb-4 text-2xl font-bold text-gold">Mission Control — Resume & Contact</h2>
          <Suspense
            fallback={<p className="terminal-text text-sm text-dim">loading resume studio…</p>}
          >
            <ResumeStudio />
          </Suspense>
        </section>
      </main>

      <footer className="terminal-text border-t border-line pt-6 text-xs text-dim">
        <p>
          Built by {profile.name} as a living digital twin. Every fact traces to a source document —
          no generated claims.{' '}
          <Link to="/" className="text-neon underline underline-offset-4">
            Enter the world →
          </Link>
        </p>
      </footer>
    </div>
  );
}
