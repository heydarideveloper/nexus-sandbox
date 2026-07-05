import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { BufferGeometry, Color, Float32BufferAttribute, LineSegments, Mesh } from 'three';
import { forceCenter, forceLink, forceManyBody, forceSimulation, type SimNode } from 'd3-force-3d';
import { AnimatePresence, motion } from 'framer-motion';
import { content, type SkillNode, type SkillStatus } from '@/content';
import { useCoarsePointer, useQuality } from '@/engine/quality';
import { Bar, Card, Chip } from './ui';

const STATUS_COLOR: Record<SkillStatus, string> = {
  expert: '#22d3ee',
  advanced: '#c084fc',
  working: '#f59e0b',
  learning: '#34d399',
};

interface GraphNode extends SimNode {
  id: string;
  skill: SkillNode;
}

export default function Brain() {
  const [selected, setSelected] = useState<SkillNode | null>(null);
  const reducedMotion = useQuality((s) => s.profile.reducedMotion);
  const coarse = useCoarsePointer();

  return (
    <div className="relative flex h-full min-h-[70vh] flex-col lg:flex-row">
      <div className="relative min-h-[45vh] flex-1">
        <Canvas camera={{ position: [0, 0, 26], fov: 55 }} dpr={[1, 1.5]}>
          <color attach="background" args={['#070a14']} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={80} color="#c084fc" />
          <Graph onSelect={setSelected} selectedId={selected?.id ?? null} />
          <OrbitControls
            enablePan={false}
            minDistance={12}
            maxDistance={45}
            autoRotate={!reducedMotion}
            autoRotateSpeed={0.4}
            rotateSpeed={coarse ? 0.65 : 0.4}
            touches={{ ONE: 0, TWO: 2 }}
          />
        </Canvas>
        <div className="terminal-text pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-line bg-panel/80 px-3 py-1 text-[10px] whitespace-nowrap text-dim">
          {coarse ? 'drag to rotate · tap a node for evidence' : 'drag to rotate · click a node for evidence'}
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {(Object.keys(STATUS_COLOR) as SkillStatus[]).map((s) => (
            <span
              key={s}
              className="hud-chip"
              style={{ color: STATUS_COLOR[s], borderColor: STATUS_COLOR[s] }}
            >
              ● {s}
            </span>
          ))}
        </div>
      </div>

      {/* Evidence panel */}
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="district-scroll w-full shrink-0 overflow-y-auto border-t border-line p-5 lg:w-96 lg:border-t-0 lg:border-l"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-ink">{selected.label}</h3>
                <Chip accent={STATUS_COLOR[selected.status]}>{selected.status}</Chip>
              </div>
              <button
                className="terminal-text text-xs text-dim hover:text-rose"
                onClick={() => setSelected(null)}
              >
                clear ✕
              </button>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-dim">
                <span>honest level</span>
                <span className="terminal-text">{selected.level}%</span>
              </div>
              <Bar value={selected.level} color={STATUS_COLOR[selected.status]} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/85">{selected.description}</p>

            <h4 className="terminal-text mt-6 mb-2 text-[11px] tracking-[0.2em] text-dim uppercase">
              evidence
            </h4>
            <div className="space-y-2">
              {selected.evidence.map((id) => {
                const exp = content.experiences.find((e) => e.id === id);
                const proj = content.projects.find((p) => p.id === id);
                const label = exp
                  ? `${exp.company} — ${exp.tagline}`
                  : proj
                    ? `${proj.name} — ${proj.summary.slice(0, 60)}…`
                    : id;
                return (
                  <Card key={id}>
                    <p className="text-xs leading-relaxed text-dim">{label}</p>
                  </Card>
                );
              })}
            </div>
            <p className="terminal-text mt-4 text-[10px] text-dim">
              sources: {selected.sourceRefs.join(', ')}
            </p>
          </motion.aside>
        ) : (
          <motion.aside
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full shrink-0 flex-col items-center justify-center border-t border-line p-6 text-center lg:w-96 lg:border-t-0 lg:border-l lg:p-8"
          >
            <p className="text-4xl" aria-hidden>
              🧠
            </p>
            <p className="mt-3 text-sm text-dim">
              This is the actual map of what he knows — sized by depth, colored by honesty. Green
              nodes are still growing. Click any node to see the evidence behind it.
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function Graph({
  onSelect,
  selectedId,
}: {
  onSelect: (s: SkillNode) => void;
  selectedId: string | null;
}) {
  const { nodes, links, sim } = useMemo(() => {
    // Deterministic initial scatter (hash of index): pure under React rules and the
    // force simulation converges to the same layout every visit.
    const jitter = (i: number, axis: number) => {
      const t = Math.sin(i * 374761.393 + axis * 668265.263) * 43758.5453;
      return (t - Math.floor(t) - 0.5) * 20;
    };
    const nodes: GraphNode[] = content.skills.map((skill, i) => ({
      id: skill.id,
      skill,
      x: jitter(i, 1),
      y: jitter(i, 2),
      z: jitter(i, 3),
    }));
    const links = content.skills
      .filter((s) => s.parent)
      .map((s) => ({ source: s.parent as string, target: s.id }));

    const sim = forceSimulation<GraphNode>(nodes, 3)
      .force('charge', forceManyBody().strength(-38))
      .force(
        'link',
        (() => {
          const f = forceLink<GraphNode>(links);
          f.id((n) => n.id);
          f.distance(5.5);
          return f;
        })(),
      )
      .force('center', forceCenter(0, 0, 0))
      .alphaDecay(0.008)
      .velocityDecay(0.3);
    return { nodes, links, sim };
  }, []);

  const linePositions = useMemo(() => new Float32Array(links.length * 6), [links.length]);
  const lineGeometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);

  const lines = useRef<LineSegments>(null);

  useEffect(() => {
    return () => {
      sim.stop();
      lineGeometry.dispose();
    };
  }, [sim, lineGeometry]);

  useFrame(() => {
    if (sim.alpha() > 0.005) sim.tick();
    const geo = lines.current?.geometry;
    if (!geo) return;
    const pos = geo.getAttribute('position');
    links.forEach((l, i) => {
      const s = l.source as unknown as GraphNode;
      const t = l.target as unknown as GraphNode;
      pos.setXYZ(i * 2, s.x ?? 0, s.y ?? 0, s.z ?? 0);
      pos.setXYZ(i * 2 + 1, t.x ?? 0, t.y ?? 0, t.z ?? 0);
    });
    pos.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments ref={lines} geometry={lineGeometry}>
        <lineBasicMaterial color="#334366" transparent opacity={0.55} />
      </lineSegments>
      {nodes.map((n) => (
        <GraphSphere key={n.id} node={n} onSelect={onSelect} selected={selectedId === n.id} />
      ))}
    </group>
  );
}

function GraphSphere({
  node,
  onSelect,
  selected,
}: {
  node: GraphNode;
  onSelect: (s: SkillNode) => void;
  selected: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = useMemo(() => new Color(STATUS_COLOR[node.skill.status]), [node.skill.status]);
  const radius = 0.35 + (node.skill.level / 100) * 0.75;

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    m.position.set(node.x ?? 0, node.y ?? 0, node.z ?? 0);
    if (node.skill.status === 'learning') {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.12;
      m.scale.setScalar(pulse);
    }
  });

  return (
    <mesh
      ref={mesh}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.skill);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[radius, 20, 20]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={selected ? 1.6 : hovered ? 1.1 : 0.45}
        roughness={0.35}
      />
      {(hovered || selected) && (
        <Html center style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
          <div
            className="terminal-text rounded border px-2 py-0.5 whitespace-nowrap"
            style={{
              borderColor: STATUS_COLOR[node.skill.status],
              color: STATUS_COLOR[node.skill.status],
              background: 'rgba(5,7,15,0.85)',
              fontSize: 10,
              transform: `translateY(-${radius * 18 + 16}px)`,
            }}
          >
            {node.skill.label} · {node.skill.level}%
          </div>
        </Html>
      )}
    </mesh>
  );
}
