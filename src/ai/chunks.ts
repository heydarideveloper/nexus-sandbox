// Relative import (not the @ alias) so the Vercel edge function can bundle this module too.
import { content } from '../content/index';

export interface Chunk {
  id: string;
  kind:
    | 'profile'
    | 'experience'
    | 'project'
    | 'skill'
    | 'learning'
    | 'achievement'
    | 'automation'
    | 'experiment'
    | 'note';
  title: string;
  text: string;
  sourceRefs: string[];
}

/**
 * Deterministic flattening of the living content model into retrieval chunks (ADR-005).
 * One content edit → new chunks → new retrieval results → new AI answers. No second source of truth.
 */
export function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  const p = content.profile;

  chunks.push({
    id: 'profile',
    kind: 'profile',
    title: `${p.name} — ${p.headline}`,
    text: [
      `${p.name} is a ${p.headline} based in ${p.location}.`,
      `Roles: ${p.roles.join(', ')}.`,
      p.summary,
      `Identity statement: ${p.identityStatement}`,
      `Leadership philosophy: ${p.leadershipPhilosophy}`,
      `Key numbers: ${p.stats.map((s) => `${s.label}: ${s.value.toLocaleString()}${s.suffix} (${s.context})`).join(' | ')}`,
      `Contact: ${p.email}, GitHub ${p.githubHandle}, LinkedIn ${p.linkedinHandle}.`,
    ].join('\n'),
    sourceRefs: p.sourceRefs,
  });

  for (const e of content.experiences) {
    chunks.push({
      id: `experience:${e.id}`,
      kind: 'experience',
      title: `${e.company} — ${e.tagline} (${e.period.from}–${e.period.to ?? 'present'})`,
      text: [
        `${e.company} — ${e.tagline}. Role: ${e.role}. Domain: ${e.domain}. Period: ${e.period.from} to ${e.period.to ?? 'present'}.`,
        `Metrics: ${e.metrics.map((m) => `${m.label}: ${m.value}`).join('; ')}.`,
        `Problems solved: ${e.problems.join(' ')}`,
        `Architecture: ${e.architecture.join(' ')}`,
        `Work: ${e.bullets.map((b) => b.text).join(' ')}`,
        `Lessons learned: ${e.lessons.join(' ')}`,
        `Technologies: ${e.tech.join(', ')}.`,
        e.liveUrl ? `Live at ${e.liveUrl}` : '',
      ].join('\n'),
      sourceRefs: e.sourceRefs,
    });
  }

  for (const pr of content.projects) {
    chunks.push({
      id: `project:${pr.id}`,
      kind: 'project',
      title: `${pr.name} (${pr.period})`,
      text: [
        `${pr.name} — ${pr.summary} Role: ${pr.role}. Period: ${pr.period}.`,
        `Problems: ${pr.problems.join(' ')}`,
        `Solutions: ${pr.solutions.join(' ')}`,
        `Architecture: ${pr.architecture.join(' ')}`,
        `Metrics: ${pr.metrics.map((m) => `${m.label}: ${m.value}`).join('; ')}.`,
        `Lessons: ${pr.lessons.join(' ')}`,
        `Technologies: ${pr.tech.join(', ')}.`,
        pr.liveUrl ? `Live at ${pr.liveUrl}` : '',
      ].join('\n'),
      sourceRefs: pr.sourceRefs,
    });
  }

  for (const s of content.skills) {
    chunks.push({
      id: `skill:${s.id}`,
      kind: 'skill',
      title: `Skill: ${s.label}`,
      text: `${s.label} — status: ${s.status}, honest level ${s.level}/100. ${s.description} Evidence: ${s.evidence.join(', ')}.`,
      sourceRefs: s.sourceRefs,
    });
  }

  for (const l of content.learning) {
    chunks.push({
      id: `learning:${l.id}`,
      kind: 'learning',
      title: `Currently learning: ${l.label}`,
      text: `${l.label} — progress ${l.progress}%. Why: ${l.why} Experiments: ${l.experiments.join(' ')} Future ideas: ${l.futureIdeas.join(' ')}`,
      sourceRefs: l.sourceRefs,
    });
  }

  for (const a of content.achievements) {
    chunks.push({
      id: `achievement:${a.id}`,
      kind: 'achievement',
      title: `Achievement: ${a.title}`,
      text: `${a.title} — ${a.description}`,
      sourceRefs: a.sourceRefs,
    });
  }

  for (const a of content.automations) {
    chunks.push({
      id: `automation:${a.id}`,
      kind: 'automation',
      title: `Automation: ${a.name}`,
      text: `${a.name} (built for ${a.origin}) — ${a.description} Pipeline stages: ${a.stages.join(' → ')}. Cadence: ${a.cadence}.`,
      sourceRefs: a.sourceRefs,
    });
  }

  for (const x of content.experiments) {
    chunks.push({
      id: `experiment:${x.id}`,
      kind: 'experiment',
      title: `Experiment: ${x.title}`,
      text: `${x.title} (${x.area}, ${x.status}). Problem: ${x.problem} Hypothesis: ${x.hypothesis} Implementation: ${x.implementation} Results: ${x.results} Future: ${x.future}`,
      sourceRefs: x.sourceRefs,
    });
  }

  for (const n of content.notes) {
    chunks.push({
      id: `note:${n.id}`,
      kind: 'note',
      title: `Engineering note: ${n.title}`,
      text: `${n.title} (${n.kind}). ${n.body}`,
      sourceRefs: n.sourceRefs,
    });
  }

  return chunks;
}

export const chunks = buildChunks();
