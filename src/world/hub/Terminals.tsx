import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { content } from '@/content';
import { useWorld } from '@/state/world';
import { dronePosition } from './droneRef';

/** Deterministic scatter between the portals — findable, not obvious. */
const SPOTS: [number, number][] = [
  [-26, -18],
  [27, -16],
  [-28, 12],
  [25, 14],
  [3, -26],
];

export function Terminals() {
  return (
    <>
      {content.notes.map((note, i) => (
        <HiddenTerminal
          key={note.id}
          id={note.id}
          title={note.title}
          position={SPOTS[i] ?? [0, -26]}
        />
      ))}
    </>
  );
}

function HiddenTerminal({
  id,
  title,
  position,
}: {
  id: string;
  title: string;
  position: [number, number];
}) {
  const group = useRef<Group>(null);
  const screen = useRef<Mesh>(null);
  const nearRef = useRef(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const found = useWorld((s) => s.terminalsFound.includes(id));
  const findTerminal = useWorld((s) => s.findTerminal);
  const openNote = useWorld((s) => s.openNote);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const dist = Math.hypot(dronePosition.x - position[0], dronePosition.z - position[1]);
    const isNear = dist < 6;
    if (isNear !== nearRef.current) {
      nearRef.current = isNear;
      if (labelRef.current) labelRef.current.style.display = isNear ? 'block' : 'none';
    }
    const mat = screen.current?.material as MeshStandardMaterial | undefined;
    if (mat) {
      mat.emissiveIntensity = found ? 0.9 : isNear ? 1.2 : 0.35;
    }
    g.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });

  const activate = () => {
    findTerminal(id);
    openNote(id);
  };

  return (
    <group position={[position[0], 0, position[1]]} ref={group}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.18, 1, 0.18]} />
        <meshStandardMaterial color="#131a2c" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh
        ref={screen}
        position={[0, 1.25, 0]}
        onClick={(e) => {
          e.stopPropagation();
          activate();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <boxGeometry args={[1.1, 0.7, 0.08]} />
        <meshStandardMaterial
          color="#05070f"
          emissive={found ? '#34d399' : '#1c2438'}
          emissiveIntensity={0.35}
        />
      </mesh>
      <Html center position={[0, 2.3, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
        <div
          ref={labelRef}
          className="terminal-text rounded border px-2 py-1 whitespace-nowrap"
          style={{
            display: 'none',
            borderColor: found ? '#34d399' : '#facc15',
            color: found ? '#34d399' : '#facc15',
            background: 'rgba(5,7,15,0.85)',
            fontSize: 10,
          }}
        >
          {found ? `✓ ${title}` : 'hidden terminal — click to access'}
        </div>
      </Html>
    </group>
  );
}
