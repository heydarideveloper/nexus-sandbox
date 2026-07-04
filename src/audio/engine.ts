/**
 * Procedural soundscape — zero audio assets, zero licenses, a few hundred bytes of code.
 * A WebAudio drone pad whose brightness follows world power, plus tiny UI cues.
 * (ADR-002 note: Howler was evaluated but plays files; synthesis fits the asset budget better.)
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let padFilter: BiquadFilterNode | null = null;
const padOscs: OscillatorNode[] = [];

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function startAmbient(power: number): void {
  const c = ensureContext();
  if (!c || !master) return;
  void c.resume();
  if (padOscs.length === 0) {
    padFilter = c.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 320;
    padFilter.Q.value = 0.6;
    const padGain = c.createGain();
    padGain.gain.value = 0.05;
    padFilter.connect(padGain);
    padGain.connect(master);

    // A-minor-ish drone: A2, E3, C4 slightly detuned for movement.
    for (const [freq, detune] of [
      [110, 0],
      [164.81, 4],
      [261.63, -3],
    ] as const) {
      const osc = c.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = c.createGain();
      g.gain.value = 0.33;
      osc.connect(g);
      g.connect(padFilter);
      osc.start();
      padOscs.push(osc);
    }
  }
  setAmbientPower(power);
  master.gain.setTargetAtTime(0.5, c.currentTime, 0.8);
}

export function stopAmbient(): void {
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
}

/** World power (0–100) opens the filter — the world literally sounds more alive. */
export function setAmbientPower(power: number): void {
  if (!ctx || !padFilter) return;
  const hz = 280 + (power / 100) * 1400;
  padFilter.frequency.setTargetAtTime(hz, ctx.currentTime, 1.2);
}

function blip(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.12): void {
  const c = ensureContext();
  if (!c || !master || master.gain.value === 0) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g);
  g.connect(master);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  hover: () => blip(660, 0.08, 'sine', 0.05),
  open: () => {
    blip(440, 0.12, 'triangle');
    setTimeout(() => blip(660, 0.14, 'triangle'), 70);
  },
  close: () => blip(330, 0.12, 'triangle', 0.08),
  unlock: () => {
    blip(523.25, 0.14, 'square', 0.07);
    setTimeout(() => blip(659.25, 0.14, 'square', 0.07), 90);
    setTimeout(() => blip(783.99, 0.22, 'square', 0.07), 180);
  },
  terminal: () => {
    blip(220, 0.06, 'square', 0.06);
    setTimeout(() => blip(440, 0.06, 'square', 0.06), 60);
  },
};
