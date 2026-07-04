declare module 'd3-force-3d' {
  export interface SimNode {
    id?: string;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    fx?: number | null;
    fy?: number | null;
    fz?: number | null;
    [key: string]: unknown;
  }

  export interface SimLink<N extends SimNode = SimNode> {
    source: string | N;
    target: string | N;
    [key: string]: unknown;
  }

  export interface Simulation<N extends SimNode = SimNode> {
    tick(iterations?: number): this;
    nodes(): N[];
    nodes(nodes: N[]): this;
    alpha(): number;
    alpha(alpha: number): this;
    alphaDecay(decay: number): this;
    alphaTarget(target: number): this;
    velocityDecay(decay: number): this;
    force(name: string, force?: unknown): this;
    stop(): this;
    restart(): this;
  }

  export function forceSimulation<N extends SimNode = SimNode>(
    nodes?: N[],
    numDimensions?: 1 | 2 | 3,
  ): Simulation<N>;
  export function forceLink<N extends SimNode = SimNode, L extends SimLink<N> = SimLink<N>>(
    links?: L[],
  ): {
    id(fn: (node: N) => string): unknown;
    distance(d: number | ((link: L) => number)): unknown;
    strength(s: number | ((link: L) => number)): unknown;
    links(links: L[]): unknown;
  };
  export function forceManyBody(): {
    strength(s: number): unknown;
  };
  export function forceCenter(
    x?: number,
    y?: number,
    z?: number,
  ): {
    strength(s: number): unknown;
  };
  export function forceCollide(radius?: number | ((node: SimNode) => number)): unknown;
}
