/** Screen class for layout/camera/input profiles. */
export type ScreenClass = 'phone' | 'tablet' | 'desktop';

export type GpuClass = 'software' | 'low' | 'mid' | 'high';

export interface DeviceProfile {
  screenClass: ScreenClass;
  gpuClass: GpuClass;
  softwareGL: boolean;
  coarsePointer: boolean;
  reducedMotion: boolean;
  deviceMemoryGb: number | null;
  hardwareConcurrency: number;
  /** Portrait orientation on phone/tablet. */
  portrait: boolean;
  batterySaver: boolean;
}

/** True when WebGL falls back to a software rasterizer (SwiftShader/llvmpipe). */
export function detectSoftwareGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return true;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));
    return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return true;
  }
}

function classifyGpu(softwareGL: boolean, renderer: string): GpuClass {
  if (softwareGL) return 'software';
  const r = renderer.toLowerCase();
  if (/apple gpu|adreno 6|adreno 7|mali-g7|mali-g6|nvidia|geforce|rtx|rx \d|intel iris/i.test(r))
    return 'high';
  if (/adreno [345]|mali-g[0-5]|powervr|intel hd|intel uhd/i.test(r)) return 'low';
  return 'mid';
}

function readRendererString(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return '';
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    return info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));
  } catch {
    return '';
  }
}

export function classifyScreenClass(width: number, coarsePointer: boolean): ScreenClass {
  if (!coarsePointer && width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'phone';
}

/** One-time device probe — call at app/world init. */
export function probeDeviceProfile(): DeviceProfile {
  const softwareGL = detectSoftwareGL();
  const renderer = readRendererString();
  const gpuClass = classifyGpu(softwareGL, renderer);
  const coarsePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const height = typeof window !== 'undefined' ? window.innerHeight : 800;
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const deviceMemoryGb =
    nav && 'deviceMemory' in nav ? (nav as Navigator & { deviceMemory?: number }).deviceMemory ?? null : null;

  return {
    screenClass: classifyScreenClass(width, coarsePointer),
    gpuClass,
    softwareGL,
    coarsePointer,
    reducedMotion,
    deviceMemoryGb,
    hardwareConcurrency: nav?.hardwareConcurrency ?? 4,
    portrait: height > width,
    batterySaver: false,
  };
}

/** Cached singleton — refreshed on orientation change via quality store. */
let cached: DeviceProfile | null = null;

export function getDeviceProfile(): DeviceProfile {
  if (!cached) cached = probeDeviceProfile();
  return cached;
}

export function refreshDeviceProfile(): DeviceProfile {
  cached = probeDeviceProfile();
  return cached;
}
