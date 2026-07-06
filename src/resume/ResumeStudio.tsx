import { useMemo, useState } from 'react';
import { buildResume, PRESETS } from './presets';

/**
 * Resume Studio — choose an audience, get a deterministic resume projected from the
 * living content model, print to PDF via the browser (ADR-006).
 */
export default function ResumeStudio() {
  const [presetId, setPresetId] = useState('startup');
  const resume = useMemo(() => buildResume(presetId), [presetId]);

  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Resume audience">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            role="radio"
            aria-checked={presetId === preset.id}
            onClick={() => setPresetId(preset.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              presetId === preset.id
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-line text-dim hover:text-ink'
            }`}
            title={preset.audience}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <p className="no-print terminal-text mb-4 text-[11px] text-dim">
        target: {resume.preset.audience}. Same verified facts, re-weighted per audience — nothing
        is generated, nothing is invented.
      </p>

      {/* No enter animation: axe scans must never catch this card at intermediate opacity. */}
      <article
        key={presetId}
        className="print-page rounded-xl border border-line bg-white p-6 text-neutral-900 shadow-2xl sm:p-10"
      >
        <header className="border-b-2 border-neutral-900 pb-3 text-center">
          <h3 className="text-2xl font-extrabold tracking-tight uppercase">{resume.name}</h3>
          <p className="mt-0.5 text-sm font-semibold text-neutral-700">{resume.headline}</p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {resume.contact.email} · {resume.contact.phone} · {resume.contact.location}
            <br />
            {resume.contact.github} · {resume.contact.linkedin}
          </p>
        </header>

        <section className="mt-4">
          <h4 className="text-xs font-bold tracking-widest text-neutral-800 uppercase">
            Professional Summary
          </h4>
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-800">{resume.summary}</p>
        </section>

        <section className="mt-4">
          <h4 className="text-xs font-bold tracking-widest text-neutral-800 uppercase">
            Professional Experience
          </h4>
          {resume.experiences.map(({ experience, bullets }) => (
            <div key={experience.id} className="mt-3">
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <strong className="text-[13px] text-neutral-900">
                  {experience.company} — {experience.tagline}
                </strong>
                <span className="text-[11px] text-neutral-500 italic">
                  {experience.period.from} – {experience.period.to ?? 'Present'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 italic">{experience.role}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[12px] leading-snug text-neutral-800">
                {bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-4">
          <h4 className="text-xs font-bold tracking-widest text-neutral-800 uppercase">
            Selected Technical Skills
          </h4>
          <table className="mt-1 w-full text-[12px]">
            <tbody>
              {resume.skillGroups.map((g) => (
                <tr key={g.label}>
                  <td className="w-36 py-0.5 align-top font-bold text-neutral-900">{g.label}:</td>
                  <td className="py-0.5 text-neutral-800">{g.items.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>

      <div className="no-print mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-void transition-transform hover:scale-105"
        >
          Export as PDF (print)
        </button>
        <a
          href={`mailto:${resume.contact.email}?subject=${encodeURIComponent('Opportunity — via Nexus Sandbox')}`}
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
        >
          Start a conversation
        </a>
      </div>
    </div>
  );
}
