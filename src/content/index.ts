import { contentSchema, type Content } from './schema';
import { profile } from './profile';
import { experiences } from './experience';
import { projects } from './projects';
import { skills } from './skills';
import { learning } from './learning';
import { achievements } from './achievements';
import { automations } from './automations';
import { experiments } from './experiments';
import { engineeringNotes } from './notes';
import { districts } from './districts';

/**
 * The Living Content System (ADR-004). Validated once at module load — a schema violation is a
 * build/test failure, never a runtime surprise for visitors.
 */
export const content: Content = contentSchema.parse({
  profile,
  experiences,
  projects,
  skills,
  learning,
  achievements,
  automations,
  experiments,
  notes: engineeringNotes,
  districts,
});

export type {
  Content,
  Profile,
  Experience,
  Project,
  SkillNode,
  SkillStatus,
  LearningItem,
  Achievement,
  Automation,
  Experiment,
  EngineeringNote,
  District,
  ResumeFacet,
  Stat,
  Bullet,
} from './schema';
