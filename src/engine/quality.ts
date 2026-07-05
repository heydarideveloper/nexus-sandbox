import { create } from 'zustand';
import {
  getDeviceProfile,
  refreshDeviceProfile,
  type DeviceProfile,
  type ScreenClass,
} from './capability';

export type QualityTier = 'ultra' | 'high' | 'medium' | 'low' | 'battery';

export interface QualityFlags {
  tier: QualityTier;
  /** Target frame budget in ms (16.7 = 60fps, 33.3 = 30fps). */
  frameBudgetMs: number;
  bloom: boolean;
  stars: boolean;
  cloudSprites: number;
  particleCount: number;
  antialias: boolean;
  dprMax: number;
  portalPointLights: boolean;
  portalBobbing: boolean;
  /** 0 = every frame, 2 = every other frame for ambient motion. */
  animationStride: number;
}

const TIER_ORDER: QualityTier[] = ['ultra', 'high', 'medium', 'low', 'battery'];

function tierIndex(t: QualityTier): number {
  return TIER_ORDER.indexOf(t);
}

function flagsForTier(tier: QualityTier): QualityFlags {
  switch (tier) {
    case 'ultra':
      return {
        tier,
        frameBudgetMs: 8.3,
        bloom: true,
        stars: true,
        cloudSprites: 42,
        particleCount: 600,
        antialias: true,
        dprMax: 1.75,
        portalPointLights: true,
        portalBobbing: true,
        animationStride: 1,
      };
    case 'high':
      return {
        tier,
        frameBudgetMs: 16.7,
        bloom: true,
        stars: true,
        cloudSprites: 20,
        particleCount: 300,
        antialias: true,
        dprMax: 1.5,
        portalPointLights: true,
        portalBobbing: true,
        animationStride: 1,
      };
    case 'medium':
      return {
        tier,
        frameBudgetMs: 16.7,
        bloom: false,
        stars: true,
        cloudSprites: 8,
        particleCount: 150,
        antialias: true,
        dprMax: 1.25,
        portalPointLights: false,
        portalBobbing: true,
        animationStride: 1,
      };
    case 'low':
      return {
        tier,
        frameBudgetMs: 33.3,
        bloom: false,
        stars: false,
        cloudSprites: 0,
        particleCount: 0,
        antialias: false,
        dprMax: 1.0,
        portalPointLights: false,
        portalBobbing: false,
        animationStride: 2,
      };
    case 'battery':
      return {
        tier,
        frameBudgetMs: 33.3,
        bloom: false,
        stars: false,
        cloudSprites: 0,
        particleCount: 0,
        antialias: false,
        dprMax: 0.75,
        portalPointLights: false,
        portalBobbing: false,
        animationStride: 2,
      };
  }
}

function pickInitialTier(profile: DeviceProfile): QualityTier {
  if (profile.batterySaver) return 'battery';
  if (profile.softwareGL || profile.gpuClass === 'software') return 'low';
  if (profile.reducedMotion && profile.screenClass === 'phone') return 'medium';

  const { screenClass, gpuClass, hardwareConcurrency } = profile;

  if (screenClass === 'desktop') {
    if (gpuClass === 'high' && hardwareConcurrency >= 8) return 'ultra';
    if (gpuClass !== 'low') return 'high';
    return 'medium';
  }
  if (screenClass === 'tablet') {
    if (gpuClass === 'high') return 'high';
    if (gpuClass === 'mid') return 'medium';
    return 'low';
  }
  // phone
  if (gpuClass === 'high') return 'medium';
  return 'low';
}

interface QualityState {
  profile: DeviceProfile;
  baseTier: QualityTier;
  manualTier: QualityTier | null;
  runtimeDowngrades: number;
  flags: QualityFlags;
  hubPaused: boolean;
  progressiveReady: boolean;

  init: () => void;
  refreshProfile: () => void;
  setManualTier: (tier: QualityTier | null) => void;
  setBatterySaver: (on: boolean) => void;
  degradeRuntime: () => void;
  recoverRuntime: () => void;
  setHubPaused: (paused: boolean) => void;
  setProgressiveReady: (ready: boolean) => void;
}

function resolveFlags(
  baseTier: QualityTier,
  manualTier: QualityTier | null,
  runtimeDowngrades: number,
  profile: DeviceProfile,
): QualityFlags {
  const effective =
    manualTier ??
    TIER_ORDER[Math.min(tierIndex(baseTier) + runtimeDowngrades, TIER_ORDER.length - 1)] ??
    'low';
  const flags = flagsForTier(effective);
  if (profile.reducedMotion) {
    return {
      ...flags,
      portalBobbing: false,
      animationStride: Math.max(flags.animationStride, 2),
    };
  }
  return flags;
}

export const useQuality = create<QualityState>((set, get) => ({
  profile: getDeviceProfile(),
  baseTier: 'high',
  manualTier: null,
  runtimeDowngrades: 0,
  flags: flagsForTier('high'),
  hubPaused: false,
  progressiveReady: false,

  init: () => {
    const profile = getDeviceProfile();
    const baseTier = pickInitialTier(profile);
    set({
      profile,
      baseTier,
      manualTier: null,
      runtimeDowngrades: 0,
      flags: resolveFlags(baseTier, null, 0, profile),
    });
  },

  refreshProfile: () => {
    const profile = refreshDeviceProfile();
    const { baseTier, manualTier, runtimeDowngrades } = get();
    set({ profile, flags: resolveFlags(baseTier, manualTier, runtimeDowngrades, profile) });
  },

  setManualTier: (tier) => {
    const { baseTier, runtimeDowngrades, profile } = get();
    set({ manualTier: tier, flags: resolveFlags(baseTier, tier, runtimeDowngrades, profile) });
  },

  setBatterySaver: (on) => {
    const profile = { ...get().profile, batterySaver: on };
    const baseTier = on ? 'battery' : pickInitialTier(profile);
    set({
      profile,
      baseTier,
      manualTier: on ? 'battery' : null,
      runtimeDowngrades: 0,
      flags: resolveFlags(baseTier, on ? 'battery' : null, 0, profile),
    });
  },

  degradeRuntime: () => {
    const { baseTier, manualTier, runtimeDowngrades, profile } = get();
    if (manualTier) return;
    const next = Math.min(runtimeDowngrades + 1, TIER_ORDER.length - 1 - tierIndex(baseTier));
    if (next === runtimeDowngrades) return;
    set({
      runtimeDowngrades: next,
      flags: resolveFlags(baseTier, manualTier, next, profile),
    });
  },

  recoverRuntime: () => {
    const { baseTier, manualTier, runtimeDowngrades, profile } = get();
    if (manualTier || runtimeDowngrades <= 0) return;
    const next = runtimeDowngrades - 1;
    set({
      runtimeDowngrades: next,
      flags: resolveFlags(baseTier, manualTier, next, profile),
    });
  },

  setHubPaused: (paused) => set({ hubPaused: paused }),
  setProgressiveReady: (ready) => set({ progressiveReady: ready }),
}));

export function useQualityFlags(): QualityFlags {
  return useQuality((s) => s.flags);
}

export function useScreenClass(): ScreenClass {
  return useQuality((s) => s.profile.screenClass);
}

export function useCoarsePointer(): boolean {
  return useQuality((s) => s.profile.coarsePointer);
}
