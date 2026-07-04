import { Grid } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { DoubleSide } from 'three';
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
        <meshStandardMaterial color="#0b1222" roughness={0.85} metalness={0.2} />
      </mesh>
      <Grid
        position={[0, 0, 0]}
        args={[68, 68]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#233457"
        sectionSize={8}
        sectionThickness={1}
        sectionColor="#31588c"
        fadeDistance={55}
        fadeStrength={1.4}
        infiniteGrid={false}
      />
      {/* center emblem */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.6, 2.75, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
      {/* plaza boundary — bright edge marking how far the walker can go (PLAZA_RADIUS = 30) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[29.4, 30.2, 96]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[30.2, 31.6, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      {/* low glowing wall rising from the boundary */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[30, 30, 1.4, 96, 1, true]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.12}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
