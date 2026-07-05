import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, Group, NormalBlending } from 'three';
import { useQuality } from '@/engine/quality';

/** Deterministic pseudo-random in [0, 1) — pure under React rules, same sky every visit. */
function hash(i: number, axis: number): number {
  const t = Math.sin(i * 91.17 + axis * 271.9) * 43758.5453;
  return t - Math.floor(t);
}

/** Soft radial-gradient puff generated on a canvas — zero assets, CSP-safe. */
function makePuffTexture(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const c = canvas.getContext('2d')!;
  const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(190, 214, 245, 0.55)');
  g.addColorStop(0.45, 'rgba(150, 178, 220, 0.28)');
  g.addColorStop(1, 'rgba(120, 150, 200, 0)');
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/**
 * A drifting ring of cloud puffs surrounding the plaza, so the walkable circle reads as a
 * platform floating in the sky. Sits just outside the boundary wall (PLAZA_RADIUS = 30).
 */
export function CloudRing({ count = 42 }: { count?: number }) {
  const group = useRef<Group>(null);
  const texture = useMemo(() => makePuffTexture(), []);
  const reducedMotion = useQuality((s) => s.profile.reducedMotion);

  useEffect(() => () => texture.dispose(), [texture]);

  const puffs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / Math.max(count, 1)) * Math.PI * 2 + hash(i, 1) * 0.4;
        const radius = 33 + hash(i, 2) * 12;
        return {
          position: [
            Math.cos(angle) * radius,
            -1.2 + hash(i, 3) * 3.4,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          scale: 7 + hash(i, 4) * 9,
          opacity: 0.35 + hash(i, 5) * 0.3,
        };
      }),
    [count],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g || reducedMotion) return;
    g.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <sprite key={i} position={p.position} scale={[p.scale, p.scale * 0.55, 1]}>
          <spriteMaterial
            map={texture}
            transparent
            opacity={p.opacity}
            blending={NormalBlending}
            depthWrite={false}
            fog
          />
        </sprite>
      ))}
    </group>
  );
}
