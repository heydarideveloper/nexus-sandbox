import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, InstancedMesh, MathUtils, Object3D } from 'three';
import { useWorld, useWorldPower } from '@/state/world';

const TOWER_COUNT = 90;

interface Tower {
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  hue: number;
}

/** Instanced city skyline ringing the plaza — one draw call; lights follow world power. */
export function Skyline() {
  const mesh = useRef<InstancedMesh>(null);
  const power = useWorldPower();
  const usersUnlocked = useWorld((s) => s.unlockedAchievements.includes('users-540k'));

  const towers = useMemo<Tower[]>(() => {
    const rng = mulberry32(1337);
    return Array.from({ length: TOWER_COUNT }, (_, i) => {
      const angle = (i / TOWER_COUNT) * Math.PI * 2 + rng() * 0.1;
      const radius = 42 + rng() * 26;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        w: 2.5 + rng() * 4,
        h: 6 + rng() * 26,
        d: 2.5 + rng() * 4,
        hue: 0.52 + rng() * 0.16,
      };
    });
  }, []);

  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    towers.forEach((t, i) => {
      dummy.position.set(t.x, t.h / 2, t.z);
      dummy.scale.set(t.w, t.h, t.d);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [towers, dummy]);

  // Window lights: brightness rises with power; 540K unlock fully lights the city.
  const lightLevel = useRef(0);
  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const target = (usersUnlocked ? 0.55 : 0.12) + (power / 100) * 0.45;
    const next = MathUtils.damp(lightLevel.current, target, 1.5, delta);
    if (Math.abs(next - lightLevel.current) < 0.001) return;
    lightLevel.current = next;
    towers.forEach((t, i) => {
      color.setHSL(t.hue, 0.75, 0.08 + lightLevel.current * 0.38);
      m.setColorAt(i, color);
    });
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, TOWER_COUNT]} frustumCulled={false}>
      <boxGeometry />
      <meshStandardMaterial roughness={0.6} metalness={0.4} />
    </instancedMesh>
  );
}

/** Deterministic PRNG so the skyline is identical for every visitor. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
