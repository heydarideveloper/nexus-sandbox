# ADR-008: Mobile & Tablet Adaptation

**Status:** Accepted · **Date:** 2026-07-05

## Problem

Desktop v1 is production-ready but unusable or fragile on phones and tablets: keyboard-only drone
steering, hover-only affordances, fixed camera/FOV, no safe-area handling, hub WebGL never pauses
behind overlays, coarse capability detection, and no quality tier system.

## Why adapt instead of rewrite

Constitution (Principles §1, §6, §8): preserve gameplay, progression, and the desktop experience.
Adaptation layers sit on top of working systems — no district content rewrites, no render-graph
abstraction, no asset pipeline (zero downloaded assets).

## Decision

Add device capability probing, a Zustand quality tier store, touch input + virtual joystick, camera
profiles per screen class, safe-area layout, tier-gated rendering, hub pause behind overlays, and a
dev perf overlay.

### Capability + quality tiers

- **`src/engine/capability.ts`:** one-time probe → GPU class, `deviceMemory`, cores, coarse pointer,
  screen class (phone/tablet/desktop), reduced motion, software GL detection.
- **`src/engine/quality.ts`:** tiers `ultra | high | medium | low | battery` with derived flags
  (bloom, stars, cloud/particle counts, DPR cap, portal lights, bobbing). Manual HUD override +
  battery saver toggle. Runtime degrade/recover governor in `FrameGovernor`.

### Touch input

- **`src/engine/input.ts`:** keyboard ref (desktop unchanged) + joystick vector consumed by `Drone`.
- **`VirtualJoystick`:** left thumb zone on phone/coarse-pointer viewports.

### Camera profiles

- Desktop unchanged (FOV 50, offset `[0, 7.5, 11]`).
- Tablet: FOV 55, slightly further chase.
- Phone: FOV 60+, higher offset; portrait gets extra height.
- Brain `OrbitControls`: higher touch rotate speed; `autoRotate` off when reduced motion.

### Layout

- `viewport-fit=cover`, `100dvh`, `env(safe-area-inset-*)` utilities.
- Phone HUD: compact identity chip, ≥44px touch targets, `/os` visible, toasts above dock.
- Chat: full-width bottom sheet on phones.

### Rendering hygiene

- Hub `frameloop="never"` when district/note/chat open.
- Progressive mount: ground/portals/drone first; stars/clouds/particles deferred one idle tick.
- Tier-gated effects; `.dispose()` on cloud texture, particle geometry, Brain sim/geometry.
- Terminals: ref-driven Html visibility (no `setState` in `useFrame`).

### Explicitly no changes required

- Asset tiers / KTX2 / Draco / Meshopt (fully procedural world).
- Texture resolution ladders (single 128px canvas texture).
- Full render-graph rewrite (tiers gate existing passes).
- Gameplay, progression, level design, `/os` route rework, WebGPU.

## Side effects

- Quality init runs in both `App` and `HubWorld` (idempotent).
- Joystick also shown when `screenClass === 'phone'` even if `pointer: coarse` is false (some
  emulators misreport pointer type).
- Desktop bloom now tier-gated (`ultra`/`high`) instead of raw core-count heuristic — equivalent
  on target hardware.

## Rollback

Remove `src/engine/*`, revert `HubWorld`, `Drone`, `Hud`, `App`, district touch fixes, and e2e
projects. Desktop path in git history is unchanged at commit before this ADR.
