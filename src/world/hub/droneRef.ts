import { Vector3 } from 'three';

/**
 * Shared mutable drone position — read per-frame by the camera rig, portals, and terminals
 * without triggering React renders (transient state, ADR-002).
 */
export const dronePosition = new Vector3(0, 1.6, 6);
export const droneTarget = new Vector3(0, 1.6, 6);
