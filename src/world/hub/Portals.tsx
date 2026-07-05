import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group } from 'three';
import { content } from '@/content';
import { useWorld } from '@/state/world';
import { useQualityFlags } from '@/engine/quality';
import { sfx } from '@/audio/engine';
import { dronePosition } from './droneRef';

const OPEN_RADIUS = 3.2;
const REARM_RADIUS = 5.5;
const TAGLINE_RADIUS = 8;

export function Portals() {
  return (
    <>
      {content.districts.map((d) => (
        <Portal
          key={d.id}
          id={d.id}
          name={d.name}
          tagline={d.tagline}
          accent={d.accent}
          position={d.position}
        />
      ))}
    </>
  );
}

function Portal(props: {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  position: [number, number];
}) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [near, setNear] = useState(false);
  const openDistrict = useWorld((s) => s.openDistrict);
  const visited = useWorld((s) => s.visited.includes(props.id));
  const active = useWorld((s) => s.activeDistrict);
  const goldOrbit = useWorld(
    (s) => props.id === 'lab' && s.unlockedAchievements.includes('server-authority'),
  );
  const flags = useQualityFlags();
  const armed = useRef(true);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const ring = g.children[1];
    if (ring) ring.rotation.z = t * (visited ? 0.8 : 0.3);
    if (flags.portalBobbing) g.position.y = Math.sin(t * 1.4 + props.position[0]) * 0.12;
    else g.position.y = 0;

    const dist = Math.hypot(
      dronePosition.x - props.position[0],
      dronePosition.z - props.position[1],
    );
    const isNear = dist < TAGLINE_RADIUS;
    if (isNear !== near) setNear(isNear);

    if (active) {
      armed.current = false;
      return;
    }
    if (dist > REARM_RADIUS) armed.current = true;
    else if (dist < OPEN_RADIUS && armed.current) {
      armed.current = false;
      sfx.open();
      openDistrict(props.id);
    }
  });

  const showTagline = hovered || near;

  return (
    <group position={[props.position[0], 0, props.position[1]]}>
      <group ref={group}>
        <mesh
          position={[0, 2.2, 0]}
          onClick={(e) => {
            e.stopPropagation();
            sfx.open();
            openDistrict(props.id);
          }}
          onPointerOver={() => {
            setHovered(true);
            sfx.hover();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <cylinderGeometry args={[0.14, 0.3, 4.4, 8]} />
          <meshStandardMaterial
            color={props.accent}
            emissive={props.accent}
            emissiveIntensity={hovered ? 2.4 : visited ? 1.4 : 0.7}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.6, 0.05, 8, 40]} />
          <meshStandardMaterial
            color={props.accent}
            emissive={props.accent}
            emissiveIntensity={hovered ? 2 : 0.8}
          />
        </mesh>
        {goldOrbit && (
          <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.1, 0.04, 8, 48]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.6} />
          </mesh>
        )}
        {flags.portalPointLights && (
          <pointLight
            color={props.accent}
            intensity={hovered ? 14 : 6}
            distance={10}
            decay={2}
            position={[0, 2.5, 0]}
          />
        )}
      </group>

      <Html center position={[0, 5.4, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
        <div
          className={`terminal-text rounded-lg border px-2.5 py-1 text-center whitespace-nowrap transition-all ${
            hovered ? 'scale-110' : near ? 'scale-105' : ''
          }`}
          style={{
            borderColor: props.accent,
            background: 'rgba(5,7,15,0.8)',
            color: props.accent,
            fontSize: 11,
          }}
        >
          <div className="font-bold">{props.name}</div>
          {showTagline && <div style={{ color: '#8b98b3', fontSize: 9 }}>{props.tagline}</div>}
          {visited && <div style={{ fontSize: 8, opacity: 0.8 }}>✓ explored</div>}
        </div>
      </Html>
    </group>
  );
}
