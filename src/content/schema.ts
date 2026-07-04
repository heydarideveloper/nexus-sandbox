import { z } from 'zod';

/**
 * Living Content System schemas (ADR-004).
 *
 * Every entity carries `sourceRefs` — paths to the evidence files in `resume/` or `docs/` that
 * back its claims. Nothing without a sourceRef may be rendered as a fact.
 */

export const resumeFacetSchema = z.enum([
  'startup',
  'enterprise',
  'ai',
  'frontend',
  'system-design',
  'leadership',
]);
export type ResumeFacet = z.infer<typeof resumeFacetSchema>;

export const sourcedSchema = z.object({
  sourceRefs: z.array(z.string()).min(1),
});

export const statSchema = sourcedSchema.extend({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  suffix: z.string().default(''),
  context: z.string(),
});
export type Stat = z.infer<typeof statSchema>;

export const profileSchema = sourcedSchema.extend({
  name: z.string(),
  headline: z.string(),
  roles: z.array(z.string()).min(3),
  location: z.string(),
  email: z.email(),
  phone: z.string(),
  github: z.url(),
  githubHandle: z.string(),
  linkedin: z.url(),
  linkedinHandle: z.string(),
  summary: z.string(),
  identityStatement: z.string(),
  leadershipPhilosophy: z.string(),
  stats: z.array(statSchema).min(4),
});
export type Profile = z.infer<typeof profileSchema>;

export const bulletSchema = z.object({
  text: z.string(),
  facets: z.array(resumeFacetSchema).min(1),
});
export type Bullet = z.infer<typeof bulletSchema>;

export const domainThemeSchema = z.object({
  /** Hex accent color used by the station/scene theming. */
  accent: z.string(),
  /** Short description of the visual mood, from the spec's district themes. */
  mood: z.string(),
});

export const experienceSchema = sourcedSchema.extend({
  id: z.string(),
  company: z.string(),
  tagline: z.string(),
  role: z.string(),
  period: z.object({ from: z.number(), to: z.number().nullable() }),
  domain: z.string(),
  theme: domainThemeSchema,
  metrics: z.array(z.object({ label: z.string(), value: z.string() })),
  problems: z.array(z.string()),
  architecture: z.array(z.string()),
  bullets: z.array(bulletSchema).min(2),
  lessons: z.array(z.string()),
  tech: z.array(z.string()).min(2),
  liveUrl: z.url().optional(),
});
export type Experience = z.infer<typeof experienceSchema>;

export const projectSchema = sourcedSchema.extend({
  id: z.string(),
  name: z.string(),
  kind: z.enum(['product', 'platform', 'systems', 'mobile']),
  period: z.string(),
  role: z.string(),
  summary: z.string(),
  problems: z.array(z.string()).min(1),
  solutions: z.array(z.string()).min(1),
  architecture: z.array(z.string()),
  tech: z.array(z.string()).min(2),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })),
  lessons: z.array(z.string()),
  liveUrl: z.url().optional(),
  /** Which interactive demo the Innovation Lab renders for this project. */
  demo: z.enum(['slots', 'risk-engine', 'fsrs', 'none']).default('none'),
});
export type Project = z.infer<typeof projectSchema>;

export const skillStatusSchema = z.enum(['expert', 'advanced', 'working', 'learning']);
export type SkillStatus = z.infer<typeof skillStatusSchema>;

export const skillNodeSchema = sourcedSchema.extend({
  id: z.string(),
  label: z.string(),
  parent: z.string().nullable(),
  category: z.enum(['core', 'frontend', 'backend', 'data', 'realtime', 'ai', 'systems', 'human']),
  status: skillStatusSchema,
  /** 0–100, honest self-assessment backed by the evidence list. */
  level: z.number().min(0).max(100),
  description: z.string(),
  /** ids of experiences/projects proving this skill. */
  evidence: z.array(z.string()),
});
export type SkillNode = z.infer<typeof skillNodeSchema>;

export const learningItemSchema = sourcedSchema.extend({
  id: z.string(),
  label: z.string(),
  progress: z.number().min(0).max(100),
  why: z.string(),
  resources: z.array(z.string()),
  experiments: z.array(z.string()),
  futureIdeas: z.array(z.string()),
});
export type LearningItem = z.infer<typeof learningItemSchema>;

export const achievementSchema = sourcedSchema.extend({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  /** District id that unlocks it when visited, or 'power' milestones. */
  unlockedBy: z.string(),
  worldEffect: z.string(),
});
export type Achievement = z.infer<typeof achievementSchema>;

export const automationSchema = sourcedSchema.extend({
  id: z.string(),
  name: z.string(),
  origin: z.string(),
  description: z.string(),
  stages: z.array(z.string()).min(2),
  cadence: z.string(),
});
export type Automation = z.infer<typeof automationSchema>;

export const experimentSchema = sourcedSchema.extend({
  id: z.string(),
  title: z.string(),
  area: z.string(),
  problem: z.string(),
  hypothesis: z.string(),
  implementation: z.string(),
  results: z.string(),
  future: z.string(),
  status: z.enum(['shipped', 'in-progress', 'planned']),
});
export type Experiment = z.infer<typeof experimentSchema>;

export const engineeringNoteSchema = sourcedSchema.extend({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  kind: z.enum(['trade-off', 'mistake', 'lesson', 'philosophy', 'failure']),
});
export type EngineeringNote = z.infer<typeof engineeringNoteSchema>;

export const districtSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  /** Position of its portal on the hub plaza (x, z). */
  position: z.tuple([z.number(), z.number()]),
  accent: z.string(),
  /** Approximate seconds spent here on the guided tour. */
  guidedSeconds: z.number(),
});
export type District = z.infer<typeof districtSchema>;

export const contentSchema = z.object({
  profile: profileSchema,
  experiences: z.array(experienceSchema).min(5),
  projects: z.array(projectSchema).min(4),
  skills: z.array(skillNodeSchema).min(15),
  learning: z.array(learningItemSchema).min(3),
  achievements: z.array(achievementSchema).min(5),
  automations: z.array(automationSchema).min(3),
  experiments: z.array(experimentSchema).min(4),
  notes: z.array(engineeringNoteSchema).length(5),
  districts: z.array(districtSchema).min(8),
});
export type Content = z.infer<typeof contentSchema>;
