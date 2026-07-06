import { describe, expect, it } from 'vitest';
import { content } from '@/content';
import { buildResume, PRESETS } from './presets';

describe('resume generator', () => {
  it('exposes all six audience presets', () => {
    expect(PRESETS.map((p) => p.id).sort()).toEqual(
      ['ai', 'enterprise', 'frontend', 'leadership', 'startup', 'systems'].sort(),
    );
  });

  for (const preset of PRESETS) {
    describe(preset.id, () => {
      const resume = buildResume(preset.id);

      it('includes the identity header and contact facts', () => {
        expect(resume.name).toBe(content.profile.name);
        expect(resume.contact.email).toBe(content.profile.email);
        expect(resume.headline.length).toBeGreaterThan(5);
      });

      it('includes every experience (no employment gaps) with at least one bullet', () => {
        expect(resume.experiences.length).toBe(content.experiences.length);
        for (const e of resume.experiences) {
          expect(e.bullets.length).toBeGreaterThan(0);
          expect(e.bullets.length).toBeLessThanOrEqual(4);
        }
      });

      it('only emits bullets that exist verbatim in the content model', () => {
        const allBullets = new Set(
          content.experiences.flatMap((e) => e.bullets.map((b) => b.text)),
        );
        for (const e of resume.experiences) {
          for (const b of e.bullets) {
            expect(allBullets.has(b), `hallucinated bullet: ${b}`).toBe(true);
          }
        }
      });

      it('orders experiences newest first', () => {
        const ends = resume.experiences.map((e) => e.experience.period.to ?? 9999);
        expect([...ends].sort((a, b) => b - a)).toEqual(ends);
      });

      it('prioritizes bullets matching the preset facets', () => {
        const facetSet = new Set(preset.facets);
        const first = resume.experiences[0];
        const sourceExp = content.experiences.find((e) => e.id === first?.experience.id);
        const firstBullet = sourceExp?.bullets.find((b) => b.text === first?.bullets[0]);
        expect(firstBullet?.facets.some((f) => facetSet.has(f))).toBe(true);
      });
    });
  }

  it('throws on unknown preset', () => {
    expect(() => buildResume('nope')).toThrow(/Unknown resume preset/);
  });
});
