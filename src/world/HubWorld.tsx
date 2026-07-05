import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Stars, PerspectiveCamera } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useWorldPower, useWorld } from '@/state/world';
import { useQuality, useQualityFlags } from '@/engine/quality';
import { getCameraProfile } from '@/engine/cameraProfiles';
import { FrameGovernor } from '@/engine/FrameGovernor';
import { Ground } from './hub/Ground';
import { CloudRing } from './hub/CloudRing';
import { Skyline } from './hub/Skyline';
import { ParticleField } from './hub/ParticleField';
import { Portals } from './hub/Portals';
import { Terminals } from './hub/Terminals';
import { Drone } from './hub/Drone';
import { NoteOverlay } from './hub/NoteOverlay';

function HubPauseSync() {
  const activeDistrict = useWorld((s) => s.activeDistrict);
  const chatOpen = useWorld((s) => s.chatOpen);
  const activeNote = useWorld((s) => s.activeNote);
  const setHubPaused = useQuality((s) => s.setHubPaused);

  useEffect(() => {
    setHubPaused(activeDistrict !== null || chatOpen || activeNote !== null);
  }, [activeDistrict, chatOpen, activeNote, setHubPaused]);

  return null;
}

export default function HubWorld() {
  const power = useWorldPower();
  const init = useQuality((s) => s.init);
  const refreshProfile = useQuality((s) => s.refreshProfile);
  const setProgressiveReady = useQuality((s) => s.setProgressiveReady);
  const flags = useQualityFlags();
  const profile = useQuality((s) => s.profile);
  const hubPaused = useQuality((s) => s.hubPaused);
  const progressiveReady = useQuality((s) => s.progressiveReady);
  const cam = getCameraProfile(profile.screenClass, profile.portrait);

  useEffect(() => {
    init();
    const onResize = () => refreshProfile();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    const idle =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(() => setProgressiveReady(true))
        : window.setTimeout(() => setProgressiveReady(true), 100);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (typeof cancelIdleCallback !== 'undefined' && typeof idle === 'number')
        cancelIdleCallback(idle);
      else window.clearTimeout(idle as number);
    };
  }, [init, refreshProfile, setProgressiveReady]);

  return (
    <>
      <HubPauseSync />
      <Canvas
        className="!absolute inset-0"
        dpr={[0.5, flags.dprMax]}
        frameloop={hubPaused ? 'never' : 'always'}
        shadows={false}
        gl={{ antialias: flags.antialias, powerPreference: 'high-performance' }}
        aria-label="Nexus Sandbox 3D world — tap the ground to move, use quick travel, or the on-screen joystick"
      >
        <PerspectiveCamera makeDefault position={[0, 9, 17]} fov={cam.fov} />
        <FrameGovernor />
        <color attach="background" args={['#05070f']} />
        <fog attach="fog" args={['#05070f', 30, 95]} />

        <ambientLight intensity={0.25 + (power / 100) * 0.3} color="#8b98b3" />
        <directionalLight position={[12, 20, 8]} intensity={0.5} color="#67e8f9" />
        <hemisphereLight args={['#1e3a5f', '#05070f', 0.6]} />

        <Ground />
        <Skyline />
        <Portals />
        <Terminals />
        <Drone />

        {progressiveReady && flags.stars && (
          <Stars radius={120} depth={40} count={2500} factor={3} saturation={0.4} fade speed={0.6} />
        )}
        {progressiveReady && flags.cloudSprites > 0 && <CloudRing count={flags.cloudSprites} />}
        {progressiveReady && flags.particleCount > 0 && (
          <ParticleField count={flags.particleCount} />
        )}

        {flags.bloom && (
          <EffectComposer>
            <Bloom intensity={0.55} luminanceThreshold={0.75} mipmapBlur />
          </EffectComposer>
        )}
        <AdaptiveDpr pixelated />
      </Canvas>
      <NoteOverlay />
    </>
  );
}
