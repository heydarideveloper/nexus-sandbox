import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';
import { useWorld } from '@/state/world';
import { dronePosition, droneTarget } from './droneRef';
import { useKeys } from './useKeys';

const PLAZA_RADIUS = 30;
const SPEED = 11;
const CAM_OFFSET = new Vector3(0, 7.5, 11);

/** The player avatar: a small drone that flies the plaza; the camera follows it. */
export function Drone() {
  const group = useRef<Group>(null);
  const keys = useKeys();
  const camera = useThree((s) => s.camera);
  const flyTarget = useWorld((s) => s.flyTarget);
  const paused = useWorld((s) => s.activeDistrict !== null || s.chatOpen);

  // Quick-travel / guided tour destinations arrive via the store.
  useEffect(() => {
    if (flyTarget) droneTarget.set(flyTarget[0], 1.6, flyTarget[1] + 3);
  }, [flyTarget]);

  const scratch = useRef({ dir: new Vector3(), cam: new Vector3(), look: new Vector3() });

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const g = group.current;
    if (!g) return;
    const { dir, cam, look } = scratch.current;

    if (!paused) {
      // Keyboard steering overrides any autopilot target.
      dir.set(
        (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0),
        0,
        (keys.current.back ? 1 : 0) - (keys.current.forward ? 1 : 0),
      );
      if (dir.lengthSq() > 0) {
        dir.normalize().multiplyScalar(SPEED * delta);
        droneTarget.copy(dronePosition).add(dir.multiplyScalar(6));
      }
      // Ease toward target.
      dronePosition.lerp(droneTarget, 1 - Math.pow(0.0018, delta));
      // Keep inside the plaza.
      const flat = Math.hypot(dronePosition.x, dronePosition.z);
      if (flat > PLAZA_RADIUS) {
        dronePosition.x *= PLAZA_RADIUS / flat;
        dronePosition.z *= PLAZA_RADIUS / flat;
      }
      dronePosition.y = 1.6 + Math.sin(state.clock.elapsedTime * 2.1) * 0.18;
    }

    g.position.copy(dronePosition);
    // Face travel direction.
    const vel = look.copy(droneTarget).sub(dronePosition);
    if (vel.lengthSq() > 0.05) {
      const targetRot = Math.atan2(vel.x, vel.z);
      g.rotation.y = MathUtils.lerp(g.rotation.y, targetRot, 1 - Math.pow(0.001, delta));
    }

    // Chase camera.
    cam.copy(dronePosition).add(CAM_OFFSET);
    camera.position.lerp(cam, 1 - Math.pow(0.02, delta));
    camera.lookAt(dronePosition.x, dronePosition.y + 1, dronePosition.z);
  });

  return (
    <group ref={group}>
      {/* body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.28, 0.3, 6, 12]} />
        <meshStandardMaterial color="#0e1526" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* glowing eye */}
      <mesh position={[0, 0.08, 0.26]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial emissive="#22d3ee" emissiveIntensity={3} color="#22d3ee" />
      </mesh>
      {/* rotor ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.32, 0]}>
        <torusGeometry args={[0.45, 0.045, 8, 24]} />
        <meshStandardMaterial
          color="#1c2438"
          metalness={0.8}
          roughness={0.3}
          emissive="#22d3ee"
          emissiveIntensity={0.4}
        />
      </mesh>
      <pointLight color="#22d3ee" intensity={6} distance={7} decay={2} position={[0, 0.4, 0]} />
    </group>
  );
}
