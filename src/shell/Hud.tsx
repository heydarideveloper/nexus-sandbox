import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { content } from '@/content';
import { TOUR_ORDER, useWorld, useWorldPower } from '@/state/world';
import { setAmbientPower, sfx, startAmbient, stopAmbient } from '@/audio/engine';

export function Hud() {
  const power = useWorldPower();
  const {
    mode,
    tourIndex,
    visited,
    unlockedAchievements,
    terminalsFound,
    audioOn,
    toggleAudio,
    setChatOpen,
    chatOpen,
    exitTour,
    openDistrict,
    setFlyTarget,
  } = useWorld();

  useEffect(() => {
    if (audioOn) startAmbient(power);
    else stopAmbient();
  }, [audioOn, power]);

  useEffect(() => {
    setAmbientPower(power);
  }, [power]);

  const tourStop = tourIndex >= 0 ? TOUR_ORDER[tourIndex] : null;
  const tourDistrict = tourStop ? content.districts.find((d) => d.id === tourStop) : null;

  return (
    <>
      {/* Top bar */}
      <div className="no-print pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex flex-col gap-2">
          <div className="glass flex items-center gap-3 rounded-xl px-4 py-2.5">
            <div>
              <div className="text-sm leading-tight font-bold text-ink">{content.profile.name}</div>
              <div className="terminal-text text-[10px] text-dim">NEXUS SANDBOX · digital twin</div>
            </div>
            <div className="ml-2 h-8 w-px bg-line" aria-hidden />
            <div>
              <div className="terminal-text text-[10px] text-dim uppercase">world power</div>
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-24 overflow-hidden rounded-full bg-line"
                  role="progressbar"
                  aria-valuenow={power}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="World power"
                >
                  <motion.div
                    className="h-full rounded-full bg-neon"
                    animate={{ width: `${power}%` }}
                    transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                  />
                </div>
                <span className="terminal-text text-xs text-neon">{power}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="hud-chip">
              🏆 {unlockedAchievements.length}/{content.achievements.length}
            </span>
            <span className="hud-chip">🖥 terminals {terminalsFound.length}/5</span>
            <span className="hud-chip">
              📍 {visited.length}/{content.districts.length} districts
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            className="glass rounded-xl px-3 py-2.5 text-sm text-dim transition-colors hover:text-neon"
            onClick={() => {
              toggleAudio();
              sfx.open();
            }}
            aria-pressed={audioOn}
            aria-label={audioOn ? 'Mute soundscape' : 'Enable soundscape'}
            title={audioOn ? 'Mute soundscape' : 'Enable soundscape'}
          >
            {audioOn ? '🔊' : '🔇'}
          </button>
          <button
            className="glass rounded-xl px-4 py-2.5 text-sm font-semibold text-neon transition-transform hover:-translate-y-0.5"
            onClick={() => setChatOpen(!chatOpen)}
          >
            Talk to my twin
          </button>
          <Link
            to="/os"
            className="glass terminal-text hidden rounded-xl px-3 py-2.5 text-xs text-dim transition-colors hover:text-ink sm:block"
            title="Accessible text view — same content, no WebGL"
          >
            /os
          </Link>
        </div>
      </div>

      {/* Quick travel dock */}
      <nav
        className="no-print pointer-events-auto absolute bottom-3 left-1/2 z-30 flex max-w-[96vw] -translate-x-1/2 gap-1 overflow-x-auto rounded-2xl p-1.5 glass"
        aria-label="District quick travel"
      >
        {content.districts.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setFlyTarget(d.position);
              openDistrict(d.id);
              sfx.open();
            }}
            onMouseEnter={() => sfx.hover()}
            className={`terminal-text rounded-xl px-3 py-2 text-[11px] whitespace-nowrap transition-colors ${
              visited.includes(d.id) ? 'text-ink' : 'text-dim'
            } hover:bg-line/60`}
            style={{ boxShadow: visited.includes(d.id) ? `inset 0 -2px 0 ${d.accent}` : undefined }}
          >
            {d.name}
          </button>
        ))}
      </nav>

      {/* Guided tour banner */}
      {mode === 'guided' && tourDistrict && (
        <div className="no-print absolute top-24 left-1/2 z-30 w-[min(92vw,30rem)] -translate-x-1/2 sm:top-20">
          <div className="glass flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <div>
              <div className="terminal-text text-[10px] text-neon uppercase">
                guided tour · stop {tourIndex + 1}/{TOUR_ORDER.length}
              </div>
              <div className="text-sm font-bold text-ink">{tourDistrict.name}</div>
              <div className="text-xs text-dim">{tourDistrict.tagline}</div>
            </div>
            <div className="flex shrink-0 flex-col gap-1.5">
              <button
                className="rounded-lg bg-neon px-3 py-1.5 text-xs font-bold text-void transition-transform hover:scale-105"
                onClick={() => {
                  openDistrict(tourDistrict.id);
                  sfx.open();
                }}
              >
                Enter
              </button>
              <button className="text-[10px] text-dim hover:text-ink" onClick={exitTour}>
                exit tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-district tour advance handled in overlay; hint bar */}
      {mode === 'explorer' && visited.length === 0 && (
        <div className="no-print terminal-text absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-full border border-line bg-panel/70 px-4 py-1.5 text-[11px] text-dim">
          drag to orbit · click a beacon to enter · WASD / arrows to fly the drone
        </div>
      )}
      {mode === 'guided' && tourIndex === 0 && visited.length === 0 && (
        <div className="no-print terminal-text absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-full border border-line bg-panel/70 px-4 py-1.5 text-[11px] text-dim">
          the drone is flying to your first stop — press Enter when it arrives
        </div>
      )}
    </>
  );
}

/** Tour continuation control shown inside district overlays while guided. */
export function TourAdvance() {
  const { mode, tourIndex, advanceTour, closeDistrict } = useWorld();
  if (mode !== 'guided' || tourIndex < 0) return null;
  const last = tourIndex >= TOUR_ORDER.length - 1;
  return (
    <button
      className="rounded-xl bg-neon px-4 py-2 text-sm font-bold text-void transition-transform hover:scale-105"
      onClick={() => {
        sfx.open();
        if (last) closeDistrict();
        advanceTour();
      }}
    >
      {last ? 'Finish tour' : 'Next stop →'}
    </button>
  );
}
