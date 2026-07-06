import { content, type Experience, type ResumeFacet } from '@/content';

export interface ResumePreset {
  id: string;
  label: string;
  audience: string;
  headline: string;
  /** Facets that make a bullet relevant, in priority order. */
  facets: ResumeFacet[];
  /** Summary assembled from documented resume-variant language (never invented). */
  summary: string;
  skillGroups: { label: string; items: string[] }[];
}

export interface BuiltResume {
  preset: ResumePreset;
  name: string;
  headline: string;
  contact: { email: string; phone: string; github: string; linkedin: string; location: string };
  summary: string;
  experiences: { experience: Experience; bullets: string[] }[];
  skillGroups: { label: string; items: string[] }[];
}

const p = content.profile;

export const PRESETS: ResumePreset[] = [
  {
    id: 'startup',
    label: 'Startup',
    audience: 'Early-stage teams that need one engineer to own the whole product',
    headline: 'Senior Full-Stack Engineer | Product Builder',
    facets: ['startup', 'frontend', 'ai', 'system-design'],
    summary:
      'Full-stack engineer with 10+ years taking products from first commit to production scale — including two live self-directed products (VoKaN, Jackpot) built end-to-end: backend, protocol, frontend, and AI pipeline. Comfortable owning ambiguity from MVP to 540,000+ users.',
    skillGroups: [
      { label: 'Product Stack', items: ['React 19', 'React Native (Expo)', 'Next.js', 'TypeScript', 'Vite', 'Zustand'] },
      { label: 'Backend', items: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'WebSockets'] },
      { label: 'AI', items: ['OpenAI API', 'Structured outputs', 'LLM pipelines'] },
    ],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    audience: 'Organizations where scale, correctness, and process matter',
    headline: 'Senior Full-Stack Engineer & Technical Lead',
    facets: ['enterprise', 'system-design', 'leadership'],
    summary:
      'Full-Stack Engineer and Tech Lead with over 10 years building and scaling software across FinTech, Blockchain, SaaS, and Telemedicine — 540,000+ users at Portal.ir, 7,000+ concurrent sessions at Pezeshket. Focused on data consistency, system performance, and clear architecture.',
    skillGroups: [
      { label: 'Architecture', items: ['High-Level Design', 'Multi-tenant SaaS', 'SSR/ISR strategy', 'API contract design'] },
      { label: 'Systems', items: ['Node.js', 'Parallel processing', 'Concurrency control', 'Docker', 'GCP'] },
      { label: 'Data', items: ['PostgreSQL', 'Redis', 'TypeORM', 'Runtime validation'] },
    ],
  },
  {
    id: 'ai',
    label: 'AI Company',
    audience: 'AI-native teams shipping LLM-powered products',
    headline: 'Senior Full Stack Engineer | LLM Integration & Production Systems',
    facets: ['ai', 'startup', 'system-design'],
    summary:
      'Senior engineer with 10+ years of production web systems and hands-on LLM product work: OpenAI gpt-4o-mini with structured JSON outputs, LLM grammar evaluation, caching and fallback queues across 13+ languages at VoKaN. Treats models as unreliable microservices — validated, cached, and fenced at every boundary.',
    skillGroups: [
      { label: 'AI Engineering', items: ['OpenAI API', 'Structured outputs', 'LLM evaluation', 'RAG (learning, applied here)'] },
      { label: 'Delivery', items: ['React 19', 'React Native', 'Node.js', 'NestJS', 'TypeScript'] },
      { label: 'Data', items: ['PostgreSQL', 'SQLite (incl. WASM)', 'Redis'] },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    audience: 'Teams that need deep React/React Native architecture',
    headline: 'Senior Frontend Developer | React & React Native',
    facets: ['frontend', 'startup', 'ai'],
    summary:
      'Senior Frontend Engineer and Tech Lead with 10+ years building production client-side systems across FinTech, Blockchain, SaaS, and Telemedicine. Expert in React, React Native, and Next.js — complex state synchronization, real-time UI flows, and high-performance rendering from MVP to scale.',
    skillGroups: [
      { label: 'Frontend', items: ['React', 'React Native (New Architecture)', 'Next.js SSR/ISR', 'Electron', 'Vite'] },
      { label: 'State & Real-Time', items: ['Zustand', 'Custom state engines', 'WebSocket clients', 'API contract-driven UI'] },
      { label: 'Supporting', items: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis'] },
    ],
  },
  {
    id: 'systems',
    label: 'System Design',
    audience: 'Roles centered on distributed systems and architecture',
    headline: 'Senior Engineer | Systems & Real-Time Architecture',
    facets: ['system-design', 'enterprise'],
    summary:
      'Engineer who designs systems, not screens: a server-authoritative game engine with a custom binary WebSocket protocol verified at 10,000 concurrent connections; multi-tenant SaaS architecture serving 540,000+ users.',
    skillGroups: [
      { label: 'Systems', items: ['Distributed locking (Redis)', 'Binary protocols', 'Multi-tenant SaaS', 'Load testing'] },
      { label: 'Backend', items: ['Node.js', 'NestJS', 'WebSockets', 'TypeORM', 'PostgreSQL'] },
      { label: 'Practices', items: ['Load testing', 'Performance optimization', 'HLD', 'API contracts'] },
    ],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    audience: 'Team-lead and engineering-management-adjacent roles',
    headline: 'Frontend Lead / Senior Engineer | Team & Architecture Leadership',
    facets: ['leadership', 'enterprise', 'frontend'],
    summary:
      'Engineering lead across three organizations: Head of Frontend at Septa Pay, Technical Team Lead at Pezeshket, Frontend Team Lead at Portal.ir. Facilitates technical decision-making rather than dictating choices — defining boundaries and guiding architecture discovery with structured frameworks, while staying hands-on in code.',
    skillGroups: [
      { label: 'Leadership', items: ['Mentoring', 'Code review culture', 'Coding standards', 'Cross-team API contracts'] },
      { label: 'Hands-on', items: ['React', 'Next.js', 'Node.js', 'TypeScript'] },
      { label: 'Method', items: ['Structured decision frameworks', 'Quality metrics', 'MVP → scale delivery'] },
    ],
  },
];

const MAX_BULLETS_PER_EXPERIENCE = 4;
const MIN_EXPERIENCES = 3;

/** Pure preset → resume projection over the content model (ADR-006). Facts never change; selection does. */
export function buildResume(presetId: string): BuiltResume {
  const preset = PRESETS.find((x) => x.id === presetId);
  if (!preset) throw new Error(`Unknown resume preset: ${presetId}`);

  const experiences = content.experiences
    .map((experience) => {
      const scored = experience.bullets
        .map((b) => ({
          text: b.text,
          score: b.facets.reduce((acc, f) => {
            const idx = preset.facets.indexOf(f);
            return acc + (idx === -1 ? 0 : preset.facets.length - idx);
          }, 0),
        }))
        .sort((a, b) => b.score - a.score);
      const relevant = scored.filter((b) => b.score > 0).slice(0, MAX_BULLETS_PER_EXPERIENCE);
      // Guarantee at least one bullet so no employment gap appears on any variant.
      const bullets = (relevant.length > 0 ? relevant : scored.slice(0, 1)).map((b) => b.text);
      const relevance = scored.reduce((a, b) => a + b.score, 0);
      return { experience, bullets, relevance };
    })
    .sort(
      (a, b) =>
        (b.experience.period.to ?? 9999) - (a.experience.period.to ?? 9999) ||
        b.experience.period.from - a.experience.period.from,
    );

  return {
    preset,
    name: p.name,
    headline: preset.headline,
    contact: {
      email: p.email,
      phone: p.phone,
      github: p.github,
      linkedin: p.linkedin,
      location: p.location,
    },
    summary: preset.summary,
    experiences: experiences.slice(0, Math.max(MIN_EXPERIENCES, experiences.length)),
    skillGroups: preset.skillGroups,
  };
}
