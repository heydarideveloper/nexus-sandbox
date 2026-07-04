import { describe, expect, it } from 'vitest';
import { content } from './index';
import { contentSchema } from './schema';

describe('Living Content System', () => {
  it('validates against the full schema', () => {
    expect(() => contentSchema.parse(content)).not.toThrow();
  });

  it('every entity carries evidence source references', () => {
    const sourced = [
      ...content.experiences,
      ...content.projects,
      ...content.skills,
      ...content.learning,
      ...content.achievements,
      ...content.automations,
      ...content.experiments,
      ...content.notes,
    ];
    for (const entity of sourced) {
      expect(entity.sourceRefs.length).toBeGreaterThan(0);
    }
  });

  it('skill evidence ids resolve to real experiences or projects', () => {
    const ids = new Set([
      ...content.experiences.map((e) => e.id),
      ...content.projects.map((p) => p.id),
    ]);
    for (const skill of content.skills) {
      for (const ref of skill.evidence) {
        expect(ids.has(ref), `skill ${skill.id} references unknown evidence ${ref}`).toBe(true);
      }
    }
  });

  it('skill parents resolve to real skill nodes', () => {
    const ids = new Set(content.skills.map((s) => s.id));
    for (const skill of content.skills) {
      if (skill.parent) {
        expect(ids.has(skill.parent), `skill ${skill.id} has unknown parent`).toBe(true);
      }
    }
  });

  it('learning items stay honest: no learning skill above 60%', () => {
    for (const skill of content.skills.filter((s) => s.status === 'learning')) {
      expect(skill.level).toBeLessThanOrEqual(60);
    }
  });

  it('achievements unlock via real district ids or power milestones', () => {
    const districtIds = new Set(content.districts.map((d) => d.id));
    for (const a of content.achievements) {
      const valid = districtIds.has(a.unlockedBy) || a.unlockedBy.startsWith('power-');
      expect(valid, `achievement ${a.id} unlockedBy ${a.unlockedBy}`).toBe(true);
    }
  });

  it('has exactly 5 hidden-terminal engineering notes', () => {
    expect(content.notes).toHaveLength(5);
  });

  it('career timeline is continuous from 2015 to present', () => {
    const sorted = [...content.experiences].sort((a, b) => a.period.from - b.period.from);
    expect(sorted[0]?.period.from).toBe(2015);
    expect(sorted.at(-1)?.period.to).toBeNull();
  });

  it('every resume facet is used by at least one bullet', () => {
    const used = new Set(content.experiences.flatMap((e) => e.bullets.flatMap((b) => b.facets)));
    for (const facet of [
      'startup',
      'enterprise',
      'ai',
      'frontend',
      'system-design',
      'leadership',
    ]) {
      expect(used.has(facet as never), `facet ${facet} unused`).toBe(true);
    }
  });
});
