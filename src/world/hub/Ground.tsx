import { Grid } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { droneTarget } from './droneRef';

/** Plaza floor: click-to-move surface + holographic grid. */
export function Ground() {
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    droneTarget.set(e.point.x, 1.6, e.point.z);
  };

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        onClick={onClick}
        receiveShadow
      >
        <circleGeometry args={[34, 64]} />
        <meshStandardMaterial color="#070b16" roughness={0.85} metalness={0.2} />
      </mesh>
      <Grid
        position={[0, 0, 0]}
        args={[68, 68]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#16203a"
        sectionSize={8}
        sectionThickness={1}
        sectionColor="#1e3a5f"
        fadeDistance={55}
        fadeStrength={1.4}
        infiniteGrid={false}
      />
      {/* center emblem */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.6, 2.75, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
