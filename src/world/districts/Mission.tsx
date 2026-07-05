import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { content } from '@/content';
import { useWorld, useWorldPower } from '@/state/world';
import { Card, DistrictBody, Section } from './ui';

const ResumeStudio = lazy(() => import('@/resume/ResumeStudio'));

/** Mission Control — the earned finale: achievements, resume generation, contact. */
export default function Mission() {
  const power = useWorldPower();
  const unlocked = useWorld((s) => s.unlockedAchievements);
  const terminals = useWorld((s) => s.terminalsFound.length);
  const { profile } = content;

  return (
    <DistrictBody>
      <div className="glass mb-8 rounded-2xl p-6 text-center">
        <p className="terminal-text text-[11px] tracking-[0.3em] text-gold uppercase">
          mission status
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Stat label="world power" value={`${power}%`} />
          <Stat label="achievements" value={`${unlocked.length}/${content.achievements.length}`} />
          <Stat label="hidden terminals" value={`${terminals}/5`} />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-sm text-dim">
          {power >= 100
            ? 'Full power. You have seen the whole system — now take a resume built for your team, or start a conversation.'
            : 'You can finish the mission any time — but the world still has unexplored districts. Either way, the terminal below is yours.'}
        </p>
      </div>

      <Section title="unlocked achievements" accent="#facc15">
        <div className="grid gap-3 sm:grid-cols-2">
          {content.achievements.map((a, i) => {
            const isUnlocked = unlocked.includes(a.id);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card accent={isUnlocked ? '#facc15' : undefined}>
                  <div className="flex items-center gap-2">
                    <span className={isUnlocked ? '' : 'opacity-30 grayscale'} aria-hidden>
                      🏆
                    </span>
                    <span className={`text-sm font-bold ${isUnlocked ? 'text-gold' : 'text-dim'}`}>
                      {isUnlocked ? 'Unlocked — ' : 'Locked — '}
                      {a.title}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-dim">
                    {isUnlocked ? a.description : 'Keep exploring the world to unlock.'}
                  </p>
                  {isUnlocked && (
                    <p className="terminal-text mt-1 text-[10px] text-gold/80">{a.worldEffect}</p>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section title="resume terminal — generated, not attached" accent="#facc15" index={1}>
        <Suspense
          fallback={<p className="terminal-text text-sm text-dim">initializing resume terminal…</p>}
        >
          <ResumeStudio />
        </Suspense>
      </Section>

      <Section title="direct channels" accent="#22d3ee" index={2}>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent('Mission: interview request')}`}
            className="glass rounded-xl p-4 transition-transform hover:-translate-y-1"
          >
            <div className="text-sm font-bold text-ink">📡 Send Mission</div>
            <p className="terminal-text mt-1 text-xs text-dim">{profile.email}</p>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-xl p-4 transition-transform hover:-translate-y-1"
          >
            <div className="text-sm font-bold text-ink">🛰 Book Interview</div>
            <p className="terminal-text mt-1 text-xs text-dim">
              LinkedIn · {profile.linkedinHandle}
            </p>
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-xl p-4 transition-transform hover:-translate-y-1"
          >
            <div className="text-sm font-bold text-ink">⌥ Inspect the Code</div>
            <p className="terminal-text mt-1 text-xs text-dim">GitHub · {profile.githubHandle}</p>
          </a>
          <div className="glass rounded-xl p-4">
            <div className="text-sm font-bold text-ink">📍 Base of Operations</div>
            <p className="terminal-text mt-1 text-xs text-dim">
              {profile.location} · {profile.phone}
            </p>
          </div>
        </div>
      </Section>
    </DistrictBody>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-gold">{value}</div>
      <div className="terminal-text text-[10px] text-dim uppercase">{label}</div>
    </div>
  );
}
