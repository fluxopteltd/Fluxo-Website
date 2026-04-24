import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

/**
 * StarfieldIntro
 * True 3D wormhole (Three.js + react-three-fiber).
 *
 * Changes in this pass:
 *  - Soft circular star sprites via CanvasTexture (no more square pixels / Minecraft feel)
 *  - Removed the awkward central blue glow overlay — the additive-blending particles
 *    create the glow naturally
 *  - Background is transparent canvas sitting on a dark veil that fades to the hero bg
 *    at the end, so the transition feels continuous rather than a hard cut
 *  - Theme-aware ending tone via CSS var `hsl(var(--background))`
 *
 * Timeline (6.5s total):
 *   0.0 – 2.5s   warp travel, accelerating
 *   2.5 – 2.8s   bright white flash (exiting the wormhole)
 *   2.8 – 3.9s   Fluxo logo graceful fade-in (blur-to-sharp)
 *   3.9 – 5.3s   logo holds with subtle scale breath
 *   5.3 – 6.3s   logo graceful fade-out
 *   6.0 – 6.5s   space veil fades to hero bg, overlap with hero content reveal
 */

export const STARFIELD_INTRO_DURATION = 6.5;

// ---------- Soft circular sprite texture for particles ----------

function createStarTexture() {
  const canvas = document.createElement('canvas');
  const size = 128;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.08, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ---------- Wormhole particles ----------

const PARTICLE_COUNT = 4000;
const TUBE_RADIUS_MIN = 2;
const TUBE_RADIUS_MAX = 10;
const TUBE_LENGTH = 130;

function WormholeParticles() {
  const ref = useRef();
  const startRef = useRef(null);
  const tex = useMemo(() => createStarTexture(), []);

  const { posArr, velArr, colArr } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = TUBE_RADIUS_MIN + Math.random() * (TUBE_RADIUS_MAX - TUBE_RADIUS_MIN);
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = -Math.random() * TUBE_LENGTH;

      velocities[i] = 0.35 + Math.random() * 0.65;

      // Realistic star colors
      const p = Math.random();
      if (p < 0.55) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
      } else if (p < 0.8) {
        colors[i * 3] = 0.72; colors[i * 3 + 1] = 0.86; colors[i * 3 + 2] = 1;
      } else if (p < 0.92) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.78;
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.55; colors[i * 3 + 2] = 0.88;
      }
    }

    return { posArr: positions, velArr: velocities, colArr: colors };
  }, []);

  useFrame((state, delta) => {
    const points = ref.current;
    if (!points) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - startRef.current;

    // Accelerating warp speed
    let speed;
    if (t < 1.0) speed = 1 + t * 0.8;       // slow build
    else if (t < 2.3) speed = 1.8 + (t - 1.0) * 4.8;  // ramp
    else speed = 8;                          // peak

    const positions = points.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 2] += velArr[i] * delta * 8 * speed;

      if (positions[i * 3 + 2] > 2) {
        const theta = Math.random() * Math.PI * 2;
        const r = TUBE_RADIUS_MIN + Math.random() * (TUBE_RADIUS_MAX - TUBE_RADIUS_MIN);
        positions[i * 3] = Math.cos(theta) * r;
        positions[i * 3 + 1] = Math.sin(theta) * r;
        positions[i * 3 + 2] = -TUBE_LENGTH;
      }
    }

    points.geometry.attributes.position.needsUpdate = true;

    // Subtle camera roll for organic motion
    state.camera.rotation.z = Math.sin(t * 0.35) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={posArr} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={colArr} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        alphaMap={tex}
        size={0.22}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---------- Subtle nebula backdrop (shader, far behind) ----------

function NebulaBackdrop() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.015;
  });
  return (
    <mesh ref={ref} position={[0, 0, -80]}>
      <planeGeometry args={[80, 80]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uColor1: { value: new THREE.Color('#5b2db3') },
          uColor2: { value: new THREE.Color('#d946ef') },
          uColor3: { value: new THREE.Color('#1d4ed8') },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          varying vec2 vUv;
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float amp = 0.5;
            for (int i = 0; i < 4; i++) {
              v += amp * noise(p);
              p *= 2.0;
              amp *= 0.5;
            }
            return v;
          }
          void main() {
            vec2 uv = vUv - 0.5;
            float dist = length(uv);
            float n = fbm(uv * 3.0);
            float n2 = fbm(uv * 1.5 + 3.0);
            vec3 col = mix(uColor1, uColor2, n);
            col = mix(col, uColor3, n2 * 0.5);
            float falloff = 1.0 - smoothstep(0.2, 0.55, dist);
            float alpha = falloff * (n * 0.55 + 0.1);
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}

// ---------- Main ----------

export default function StarfieldIntro() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Space veil — dark backdrop behind canvas, fades to hero bg near the end */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ backgroundColor: '#000005' }}
        animate={{
          backgroundColor: [
            '#000005',
            '#000005',
            '#000005',
            'hsl(var(--background))',
          ],
        }}
        transition={{
          duration: STARFIELD_INTRO_DURATION,
          times: [0, 0.85, 0.92, 1],
          ease: 'easeInOut',
        }}
      />

      {/* WebGL canvas — transparent, sits over the veil */}
      <Canvas
        camera={{ position: [0, 0, 0.5], fov: 72 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <fog attach="fog" args={['#000005', 8, 55]} />
        <NebulaBackdrop />
        <WormholeParticles />
      </Canvas>

      {/* Blinding flash at wormhole exit */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{
          duration: 0.9,
          delay: 2.45,
          times: [0, 0.3, 0.5, 1],
          ease: 'easeOut',
        }}
      />

      {/* Fluxo logo — graceful long reveal */}
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.55, filter: 'blur(22px)' }}
          animate={{
            opacity: [0, 0, 1, 1, 1, 0],
            scale: [0.55, 0.55, 1, 1.03, 1.05, 1.1],
            filter: [
              'blur(22px)',
              'blur(22px)',
              'blur(0px)',
              'blur(0px)',
              'blur(0px)',
              'blur(10px)',
            ],
          }}
          transition={{
            duration: 3.6,
            delay: 2.7,
            times: [0, 0.08, 0.32, 0.52, 0.72, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <img
            src="/logos/fluxo-dark.png"
            alt="Fluxo"
            className="h-20 sm:h-24 md:h-28 drop-shadow-[0_0_60px_rgba(46,127,203,0.8)] dark:drop-shadow-[0_0_60px_rgba(80,160,255,0.7)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
