# Asset & License Inventory — Nexus Sandbox v1.0

## Media assets

| Asset                | Source                                                                             | License       |
| -------------------- | ---------------------------------------------------------------------------------- | ------------- |
| `public/favicon.svg` | Authored in-repo (SVG markup)                                                      | Project-owned |
| Audio                | **None** — soundscape is procedurally synthesized WebAudio (`src/audio/engine.ts`) | n/a           |
| 3D models / textures | **None** — all geometry is procedural (boxes, points, lines)                       | n/a           |
| Images               | **None shipped**; OG image is text-only meta for v1                                | n/a           |

## Fonts

| Font           | Source           | License                   |
| -------------- | ---------------- | ------------------------- |
| Inter          | Google Fonts CDN | SIL Open Font License 1.1 |
| JetBrains Mono | Google Fonts CDN | SIL Open Font License 1.1 |

## Runtime dependencies (npm, all permissively licensed)

| Package                                  | License | Role                               |
| ---------------------------------------- | ------- | ---------------------------------- |
| react / react-dom                        | MIT     | UI runtime                         |
| react-router-dom                         | MIT     | Routing (`/`, `/os`)               |
| three                                    | MIT     | 3D engine                          |
| @react-three/fiber, drei, postprocessing | MIT     | React renderer + helpers + effects |
| d3-force-3d                              | ISC     | Knowledge-graph force simulation   |
| zustand                                  | MIT     | World state store                  |
| zod                                      | MIT     | Content validation                 |
| framer-motion                            | MIT     | DOM animation                      |
| lenis                                    | MIT     | Smooth scrolling on `/os`          |
| @radix-ui/react-dialog                   | MIT     | Accessible overlay primitive       |
| tailwindcss (+ @tailwindcss/vite)        | MIT     | Styling                            |

Dev-only: vite, typescript, eslint (+plugins), prettier, vitest, @playwright/test,
@axe-core/playwright, @testing-library/*, jsdom, esbuild — MIT/Apache-2.0.

Removed as unused during the quality pass: `howler`, `gsap` (evaluated in ADR-002; procedural
audio and R3F `useFrame` covered their roles).

## Content provenance

All textual content derives from Mohammad Heydari's own resume documents in `resume/`
(see `docs/PROFILE.md` evidence table). No third-party copy. `Mohammad_CS.pdf` is explicitly
excluded (conflicting evidence — see risk R5).

No asset requires attribution in the shipped product; OFL fonts are served by Google Fonts
under their standard terms.
