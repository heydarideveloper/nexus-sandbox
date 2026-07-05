import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { content } from '@/content';
import { TOUR_ORDER, useWorld, useWorldPower } from '@/state/world';
import { useCoarsePointer, useQuality, type QualityTier } from '@/engine/quality';
import { setAmbientPower, sfx, startAmbient, stopAmbient } from '@/audio/engine';
import { QuickTravelDock } from './QuickTravelDock';

const TIER_LABELS: QualityTier[] = ['ultra', 'high', 'medium', 'low', 'battery'];

export function Hud() {
  const power = useWorldPower();
  const coarse = useCoarsePointer();
  const init = useQuality((s) => s.init);
  const flags = useQuality((s) => s.flags);
  const setManualTier = useQuality((s) => s.setManualTier);
  const setBatterySaver = useQuality((s) => s.setBatterySaver);
  const profile = useQuality((s) => s.profile);
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
  } = useWorld();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (audioOn) startAmbient(power);
    else stopAmbient();
  }, [audioOn, power]);

  useEffect(() => {
    setAmbientPower(power);
  }, [power]);

  const tourStop = tourIndex >= 0 ? TOUR_ORDER[tourIndex] : null;
  const tourDistrict = tourStop ? content.districts.find((d) => d.id === tourStop) : null;

  const hintCopy = coarse
    ? 'tap ground to fly · use the joystick · tap a beacon to enter'
    : 'click a beacon to enter · WASD / arrows to fly the drone';

  return (
    <>
      <div className="no-print pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 safe-top safe-x sm:gap-3 sm:p-4 p-2">
        <div className="pointer-events-auto flex min-w-0 flex-1 flex-col gap-2">
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
            <div className="min-w-0 sm:hidden">
              <div className="truncate text-xs font-bold text-ink">{content.profile.name}</div>
              <div className="terminal-text text-[9px] text-dim">NEXUS · {power}% power</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm leading-tight font-bold text-ink">{content.profile.name}</div>
              <div className="terminal-text text-[10px] text-dim">NEXUS SANDBOX · digital twin</div>
            </div>
            <div className="ml-auto hidden h-8 w-px bg-line sm:block" aria-hidden />
            <div className="hidden sm:block">
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
            <div
              className="h-1.5 w-16 overflow-hidden rounded-full bg-line sm:hidden"
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
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="hud-chip text-[10px] sm:text-[0.72rem]">
              🏆 {unlockedAchievements.length}/{content.achievements.length}
            </span>
            <span className="hud-chip text-[10px] sm:text-[0.72rem]">
              🖥 {terminalsFound.length}/5
            </span>
            <span className="hud-chip text-[10px] sm:text-[0.72rem]">
              📍 {visited.length}/{content.districts.length}
            </span>
            <span className="hud-chip hidden text-[10px] lg:inline-flex">{flags.tier} tier</span>
          </div>
        </div>

        <div className="pointer-events-auto flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          <div className="hidden items-center gap-1 sm:flex">
            <select
              className="glass terminal-text touch-target rounded-xl px-2 text-[10px] text-dim"
              aria-label="Graphics quality"
              value={flags.tier}
              onChange={(e) => setManualTier(e.target.value as QualityTier)}
            >
              {TIER_LABELS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              className={`glass touch-target rounded-xl px-2 text-[10px] ${profile.batterySaver ? 'text-neon' : 'text-dim'}`}
              onClick={() => setBatterySaver(!profile.batterySaver)}
              aria-pressed={profile.batterySaver}
            >
              🔋
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="glass touch-target rounded-xl px-3 py-2.5 text-sm text-dim transition-colors hover:text-neon"
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
              className="glass touch-target rounded-xl px-4 py-2.5 text-sm font-semibold text-neon transition-transform hover:-translate-y-0.5"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <span className="hidden sm:inline">Talk to my twin</span>
              <span className="sm:hidden">Chat</span>
            </button>
            <Link
              to="/os"
              className="glass terminal-text touch-target rounded-xl px-3 py-2.5 text-xs text-dim transition-colors hover:text-ink"
              title="Accessible text view — same content, no WebGL"
            >
              /os
            </Link>
          </div>
        </div>
      </div>

      <QuickTravelDock />

      {mode === 'guided' && tourDistrict && (
        <div className="no-print absolute top-[calc(4.5rem+env(safe-area-inset-top))] left-1/2 z-30 w-[min(92vw,30rem)] -translate-x-1/2 sm:top-20">
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
                className="touch-target rounded-lg bg-neon px-3 py-1.5 text-xs font-bold text-void transition-transform hover:scale-105"
                onClick={() => {
                  openDistrict(tourDistrict.id);
                  sfx.open();
                }}
              >
                Enter
              </button>
              <button className="touch-target text-[10px] text-dim hover:text-ink" onClick={exitTour}>
                exit tour
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'explorer' && visited.length === 0 && (
        <div className="no-print terminal-text pointer-events-none absolute left-1/2 z-20 max-w-[92vw] -translate-x-1/2 rounded-full border border-line bg-panel/70 px-4 py-1.5 text-center text-[10px] text-dim sm:text-[11px]"
          style={{ bottom: 'calc(7.25rem + env(safe-area-inset-bottom))' }}
        >
          {hintCopy}
        </div>
      )}
      {mode === 'guided' && tourIndex === 0 && visited.length === 0 && (
        <div className="no-print terminal-text pointer-events-none absolute left-1/2 z-20 max-w-[92vw] -translate-x-1/2 rounded-full border border-line bg-panel/70 px-4 py-1.5 text-center text-[10px] text-dim sm:text-[11px]"
          style={{ bottom: 'calc(7.25rem + env(safe-area-inset-bottom))' }}
        >
          the drone is flying to your first stop — press Enter when it arrives
        </div>
      )}
    </>
  );
}

/** Tour continuation control shown inside district overlays while guided. */
export function TourAdvance({ mobileFooter = false }: { mobileFooter?: boolean }) {
  const { mode, tourIndex, advanceTour, closeDistrict } = useWorld();
  if (mode !== 'guided' || tourIndex < 0) return null;
  const last = tourIndex >= TOUR_ORDER.length - 1;
  const label = last ? 'Finish tour' : 'Next stop →';

  if (mobileFooter) {
    return (
      <button
        type="button"
        className="touch-target w-full rounded-xl bg-neon px-4 py-3.5 text-base font-bold text-void shadow-[0_0_28px_-6px_#22d3ee] transition-transform active:scale-[0.98]"
        onClick={() => {
          sfx.open();
          if (last) closeDistrict();
          advanceTour();
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="touch-target rounded-xl bg-neon px-4 py-2 text-sm font-bold text-void transition-transform hover:scale-105"
      onClick={() => {
        sfx.open();
        if (last) closeDistrict();
        advanceTour();
      }}
    >
      {label}
    </button>
  );
}
