import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, Stars } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useWorldPower } from '@/state/world';
import { Ground } from './hub/Ground';
import { CloudRing } from './hub/CloudRing';
import { Skyline } from './hub/Skyline';
import { ParticleField } from './hub/ParticleField';
import { Portals } from './hub/Portals';
import { Terminals } from './hub/Terminals';
import { Drone } from './hub/Drone';
import { NoteOverlay } from './hub/NoteOverlay';

/** True when WebGL falls back to a software rasterizer (SwiftShader/llvmpipe) — VMs, CI, old boxes. */
function detectSoftwareGL(): boolean {
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

export default function HubWorld() {
  const power = useWorldPower();
  const [degraded, setDegraded] = useState(false);
  const softwareGL = useMemo(() => detectSoftwareGL(), []);
  const highEnd = useMemo(
    () =>
      !softwareGL && typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 4) >= 8,
    [softwareGL],
  );

  return (
    <>
      <Canvas
        className="!absolute inset-0"
        camera={{ position: [0, 9, 17], fov: 50 }}
        dpr={softwareGL ? 0.5 : [1, 1.75]}
        shadows={false}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        aria-label="Nexus Sandbox 3D world — use the quick travel bar below for keyboard access"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)}>
          <color attach="background" args={['#05070f']} />
          <fog attach="fog" args={['#05070f', 30, 95]} />

          <ambientLight intensity={0.25 + (power / 100) * 0.3} color="#8b98b3" />
          <directionalLight position={[12, 20, 8]} intensity={0.5} color="#67e8f9" />
          <hemisphereLight args={['#1e3a5f', '#05070f', 0.6]} />

          {!softwareGL && (
            <Stars
              radius={120}
              depth={40}
              count={2500}
              factor={3}
              saturation={0.4}
              fade
              speed={0.6}
            />
          )}
          <Ground />
          <Skyline />
          {!softwareGL && <CloudRing />}
          {!softwareGL && <ParticleField />}
          <Portals />
          <Terminals />
          <Drone />

          {highEnd && !degraded && (
            <EffectComposer>
              <Bloom intensity={0.55} luminanceThreshold={0.75} mipmapBlur />
            </EffectComposer>
          )}
          <AdaptiveDpr pixelated />
        </PerformanceMonitor>
      </Canvas>
      <NoteOverlay />
    </>
  );
}
