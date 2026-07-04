import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points } from 'three';
import { useWorldPower } from '@/state/world';

const COUNT = 600;

/** Ambient dust/energy motes; drift speed and brightness scale with world power. */
export function ParticleField() {
  const points = useRef<Points>(null);
  const power = useWorldPower();

  const geometry = useMemo(() => {
    // Hash-based scatter instead of Math.random: pure under React rules, identical cloud each mount.
    const hash = (i: number, axis: number) => {
      const t = Math.sin(i * 127.1 + axis * 311.7) * 43758.5453;
      return t - Math.floor(t);
    };
    const g = new BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 8 + hash(i, 1) * 38;
      const a = hash(i, 2) * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = hash(i, 3) * 22;
      positions[i * 3 + 2] = Math.sin(a) * r;
    }
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    p.rotation.y = state.clock.elapsedTime * (0.008 + (power / 100) * 0.03);
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.18}
        color="#67e8f9"
        transparent
        opacity={0.25 + (power / 100) * 0.5}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
