import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- Dark: Motion Polygons (Plexus) ---
const MAX_POINTS = 120;
const PLEXUS_LINE_SIZE = MAX_POINTS * 30 * 2;

function PlexusBackground() {
  const [activeCount, setActiveCount] = useState(120);
  
  useEffect(() => {
    const handleResize = () => {
      setActiveCount(window.innerWidth < 768 ? 60 : 120);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const positions = useMemo(() => {
    const pos = new Float32Array(MAX_POINTS * 3);
    for (let i = 0; i < MAX_POINTS; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const velocities = useMemo(() => {
    const vel = new Float32Array(MAX_POINTS * 3);
    for (let i = 0; i < MAX_POINTS; i++) {
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return vel;
  }, []);

  const lineArr = useMemo(() => new Float32Array(PLEXUS_LINE_SIZE * 3), []);
  const pointsRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (!pointsRef.current || !lineRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    let lineCount = 0;

    for (let i = 0; i < activeCount; i++) {
      posArr[i * 3] += velocities[i * 3];
      posArr[i * 3 + 1] += velocities[i * 3 + 1];
      posArr[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(posArr[i * 3]) > 12) velocities[i * 3] *= -1;
      if (Math.abs(posArr[i * 3 + 1]) > 12) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posArr[i * 3 + 2]) > 8) velocities[i * 3 + 2] *= -1;

      for (let j = i + 1; j < activeCount; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 12 && lineCount < PLEXUS_LINE_SIZE - 2) {
          lineArr[lineCount * 6] = posArr[i * 3];
          lineArr[lineCount * 6 + 1] = posArr[i * 3 + 1];
          lineArr[lineCount * 6 + 2] = posArr[i * 3 + 2];
          lineArr[lineCount * 6 + 3] = posArr[j * 3];
          lineArr[lineCount * 6 + 4] = posArr[j * 3 + 1];
          lineArr[lineCount * 6 + 5] = posArr[j * 3 + 2];
          lineCount++;
        }
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    (lineRef.current.geometry.attributes.position as THREE.BufferAttribute).array.set(lineArr);
    lineRef.current.geometry.attributes.position.needsUpdate = true;
    lineRef.current.geometry.setDrawRange(0, lineCount * 2);
    pointsRef.current.geometry.setDrawRange(0, activeCount);
  });

  return (
    <group>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={PLEXUS_LINE_SIZE} 
            array={lineArr} 
            itemSize={3} 
          />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

// --- Light: AI Flow Background (Neural Data Grid) ---
function DataStream({ pos, speed, length }: { pos: number[], speed: number, length: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.z += speed;
    if (ref.current.position.z > 10) ref.current.position.z = -10;
  });

  return (
    <mesh ref={ref} position={[pos[0], pos[1] + Math.random() * 2, pos[2]]}>
      <boxGeometry args={[0.02, 0.02, length]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
    </mesh>
  );
}

function ScanningPulse() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.getElapsedTime() % 4) / 4;
    ref.current.position.z = -20 + t * 40;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    if (mat) mat.opacity = Math.sin(t * Math.PI) * 0.1;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 1]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function AIBakeground() {
  const gridRef = useRef<THREE.Group>(null);
  const streams = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      pos: [ (Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20 ],
      speed: Math.random() * 0.05 + 0.02,
      length: Math.random() * 2 + 1,
      id: Math.random()
    }));
  }, []);

  useFrame((state) => {
    if (!gridRef.current) return;
    gridRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
  });

  return (
    <group position={[0, -2, -5]} rotation={[-Math.PI / 10, 0, 0]}>
      <gridHelper args={[100, 50, "#0ea5e9", "#e0f2fe"]} position={[0, -0.1, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.2} />
      </gridHelper>
      <group ref={gridRef}>
        {streams.map((s, i) => (
          <DataStream key={i} {...s} />
        ))}
      </group>
      <ScanningPulse />
      <Float speed={2} floatIntensity={1} rotationIntensity={1}>
        <mesh position={[0, 4, -5]}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#0ea5e9" wireframe transparent opacity={0.1} emissive="#0ea5e9" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

export function BackgroundScene({ theme }: { theme: string }) {
  const isDark = theme === 'dark';
  return (
    <div className="fixed inset-0 -z-10">
      <div className="atmosphere" />
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={isDark ? 0.2 : 0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isDark ? 0.6 : 1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.4 : 0.6} color={isDark ? "#22d3ee" : "#38bdf8"} />
        {isDark ? <PlexusBackground /> : <AIBakeground />}
        <Environment preset={isDark ? "night" : "city"} />
      </Canvas>
    </div>
  );
}
