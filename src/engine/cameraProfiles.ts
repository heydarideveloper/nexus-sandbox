import type { ScreenClass } from './capability';

export interface CameraProfile {
  fov: number;
  offset: [number, number, number];
  lerpPower: number;
  lookAtYOffset: number;
}

const PROFILES: Record<ScreenClass, CameraProfile> = {
  desktop: { fov: 50, offset: [0, 7.5, 11], lerpPower: 0.02, lookAtYOffset: 1 },
  tablet: { fov: 55, offset: [0, 8.5, 12.5], lerpPower: 0.018, lookAtYOffset: 1.1 },
  phone: { fov: 60, offset: [0, 10, 13], lerpPower: 0.015, lookAtYOffset: 1.2 },
};

export function getCameraProfile(screenClass: ScreenClass, portrait: boolean): CameraProfile {
  const base = PROFILES[screenClass];
  if (screenClass === 'phone' && portrait) {
    return {
      ...base,
      offset: [0, base.offset[1] + 1.5, base.offset[2]],
      fov: base.fov + 2,
    };
  }
  return base;
}
