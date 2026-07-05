import { useEffect, useRef, type MutableRefObject } from 'react';

/** Joystick movement vector in [-1,1] — keyboard handled separately in Drone. */
export interface MoveInput {
  x: number;
  z: number;
}

const joystickInput: MoveInput = { x: 0, z: 0 };

export function getJoystickInput(): MoveInput {
  return joystickInput;
}

export function setJoystickInput(x: number, z: number): void {
  joystickInput.x = x;
  joystickInput.z = z;
}

/** Keyboard WASD + arrows — desktop path unchanged. */
export function useKeyboardMove(): MutableRefObject<{
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
}> {
  const keys = useRef({ forward: false, back: false, left: false, right: false });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA' || t?.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') keys.current.forward = true;
      if (k === 's' || e.key === 'ArrowDown') keys.current.back = true;
      if (k === 'a' || e.key === 'ArrowLeft') keys.current.left = true;
      if (k === 'd' || e.key === 'ArrowRight') keys.current.right = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') keys.current.forward = false;
      if (k === 's' || e.key === 'ArrowDown') keys.current.back = false;
      if (k === 'a' || e.key === 'ArrowLeft') keys.current.left = false;
      if (k === 'd' || e.key === 'ArrowRight') keys.current.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return keys;
}
