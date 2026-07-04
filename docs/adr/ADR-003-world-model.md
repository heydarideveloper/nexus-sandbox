# ADR-003: World Model — Hub + Districts, Not Free-Roam

**Decision:** A 3D hub plaza with a player-controlled drone avatar (keyboard WASD/arrows +
click-to-move) connecting district portals. Each district is a lazy-loaded module (3D scene, DOM
scene, or hybrid) with choreographed cameras. Two visit modes: **Guided** (timed drone tour for
recruiters, 5–8 min) and **Explorer** (free discovery). A complete HTML route (`/os`) mirrors all
content for accessibility, SEO, and low-end devices.

**Options considered:**

| Option                                                            | Advantages                                                                                                                               | Disadvantages                                                                             | Risk                  |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------- |
| A. Full free-roam city (character controller, physics, collision) | Maximum "game" feel                                                                                                                      | Weeks of asset/physics work; mobile perf risk; recruiters get lost; violates perf budgets | High                  |
| B. Hub + districts                                                | Game-like exploration retained; each district independently optimized and lazy-loaded; guided path trivially implementable; fits budgets | Less literal "walk everywhere"                                                            | Low                   |
| C. Pure scroll-story (no world)                                   | Cheapest                                                                                                                                 | Loses the spec's core identity ("explorable world")                                       | Medium (fails vision) |

**Decision taken:** B.
**Reason:** Principles #1, #6, #8. The spec itself demands "optional exploration" with a guided
5–8 minute path; a hub topology is the simplest structure that supports both modes and keeps every
heavy scene behind a code-split boundary.
**Reconsider when:** v2 adds a full navigable city (evolution stage 5+), asset pipeline matured.
