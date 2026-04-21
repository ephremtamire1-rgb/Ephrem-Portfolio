/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Text, MeshDistortMaterial, Sphere, OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { 
  Menu, X, Github, Instagram, Mail, MessageSquare, LayoutGrid, User, Cpu, 
  Send, ShieldCheck, ChevronRight, ExternalLink, Facebook, Linkedin, 
  Twitter, MessageCircle, Video, Phone, PenTool, Share2, Monitor, Layers, Music,
  Sun, Moon
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { cn } from './lib/utils';
import type { User as UserType, Project, Message, DBData } from './types';
import { ChatInterface } from './components/ChatInterface';

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
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={MAX_POINTS} 
            array={positions} 
            itemSize={3} 
          />
        </bufferGeometry>
        <pointsMaterial transparent color="#22d3ee" size={0.06} sizeAttenuation={true} depthWrite={false} />
      </points>
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
      {/* Infinite Grid Floor */}
      <gridHelper args={[100, 50, "#0ea5e9", "#e0f2fe"]} position={[0, -0.1, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.2} />
      </gridHelper>
      
      {/* Floating Data Streams */}
      <group ref={gridRef}>
        {streams.map((s, i) => (
          <DataStream key={i} {...s} />
        ))}
      </group>

      {/* Atmospheric Scanning Pulse */}
      <ScanningPulse />

      {/* Hero Central Core (Representing AI Processing) */}
      <Float speed={2} floatIntensity={1} rotationIntensity={1}>
        <mesh position={[0, 4, -5]}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial 
            color="#0ea5e9" 
            wireframe 
            transparent 
            opacity={0.1} 
            emissive="#0ea5e9"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

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

// --- 3D Background Component ---
function BackgroundScene({ theme }: { theme: string }) {
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

// --- Text Motion Wrapper ---
const MotionText = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- 3D Card Component ---
function Card3D({ children, className, glow }: { children: React.ReactNode, className?: string, glow?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isTouchDevice) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <div 
      className="perspective-1200 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
        <div
          ref={cardRef}
          className={cn(
            "relative w-full h-full transform-style-3d transition-all duration-300",
            "glass-panel overflow-hidden",
            glow && "neon-glow",
            "shadow-[20px_40px_80px_-15px_rgba(15,23,42,0.15)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]",
            className
          )}
        >
        {children}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'portfolio' | 'skills' | 'edu_exp' | 'contact'>('home');
  const [dbData, setDbData] = useState<DBData | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public')
      .then(res => {
        if (!res.ok) throw new Error('System still initializing or database not connected');
        return res.json();
      })
      .then(data => {
        setDbData(data);
        if (data.settings?.theme) setTheme(data.settings.theme);
      })
      .catch(err => {
        console.error(err);
        // We'll keep the loading screen up if there's no user data
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  if (isLoading || !dbData || !dbData.user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-[200]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/20 animate-pulse" />
            <Cpu className="w-10 h-10 text-cyan-500 animate-bounce" />
          </div>
          <div className="text-[10px] uppercase font-black tracking-[0.6em] text-cyan-500/50 animate-pulse">
            System Initializing
          </div>
        </div>
      </div>
    );
  }

  const NavTabs = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'My Work' },
    { id: 'skills', label: 'Skill' },
    { id: 'edu_exp', label: 'Exp @ Edu' },
    { id: 'contact', label: 'Contact Me' },
  ];

  return (
    <div className={cn("min-h-screen font-sans selection:bg-cyan-500/30 selection:text-white transition-colors duration-500")}>
      <BackgroundScene theme={theme} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 md:px-10 flex justify-between items-center glass-panel rounded-none border-t-0 border-x-0 shadow-2xl backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tighter flex items-center gap-1 uppercase text-slate-900 dark:text-white"
        >
          {(dbData.user?.name || 'EPHREM').split(' ')[0]}<span className="text-cyan-400">.</span>DESIGN
        </motion.div>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NavTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "text-[10px] xl:text-[11px] letter-spacing-[0.2em] font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer pb-1",
                activeTab === tab.id ? "text-cyan-600 dark:text-cyan-400 border-b border-cyan-600 dark:border-cyan-400" : "text-slate-500 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400"
              )}
            >
              {tab.label}
            </button>
          ))}
          
          <button
            onClick={async () => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
              await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme })
              });
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center glass-panel border-white/20 hover:scale-110 transition-all text-slate-600 dark:text-cyan-400 pointer-events-auto shadow-lg"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={async () => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
              await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme })
              });
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center glass-panel border-white/20 text-slate-600 dark:text-cyan-400"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button onClick={() => setChatOpen(!chatOpen)} className="p-2 dark:text-white"><MessageSquare className="w-5 h-5" /></button>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 dark:text-white">
            <Menu className="w-6 h-6 text-gray-500 dark:text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Shimmer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full xs:w-80 md:w-96 z-[150] bg-slate-900 border-l border-white/10 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="text-sm font-black tracking-[0.3em] uppercase text-white">
                  MENU<span className="text-cyan-400">.</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col">
                {NavTabs.map((tab, idx) => (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "group flex items-center gap-4 py-4 border-b border-white/5 text-left transition-all relative overflow-hidden",
                      activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className="font-mono text-[10px] text-cyan-500/50 group-hover:text-cyan-400">0{idx + 1}</span>
                    <span className={cn(
                      "text-sm md:text-base font-bold uppercase tracking-[0.2em] transition-all",
                      activeTab === tab.id ? "translate-x-2" : "group-hover:translate-x-1"
                    )}>
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeSideNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-500 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto pt-16">
                <div className="text-[9px] uppercase tracking-[0.4em] text-slate-500 mb-6 font-bold">CORE NAVIGATION</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[8px] uppercase tracking-widest text-slate-500 mb-1">Theme</div>
                    <button 
                      onClick={async () => {
                        const newTheme = theme === 'light' ? 'dark' : 'light';
                        setTheme(newTheme);
                        await fetch('/api/settings', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ theme: newTheme })
                        });
                      }}
                      className="text-[10px] font-bold text-white uppercase flex items-center gap-2"
                    >
                      {theme === 'dark' ? <Sun className="w-3 h-3 text-cyan-400" /> : <Moon className="w-3 h-3 text-cyan-400" />}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[8px] uppercase tracking-widest text-slate-500 mb-1">Chat AI</div>
                    <button 
                      onClick={() => {
                        setChatOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-[10px] font-bold text-white uppercase flex items-center gap-2"
                    >
                      <MessageSquare className="w-3 h-3 text-cyan-400" />
                      Connect
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                {Object.entries(dbData.user?.socials || {}).map(([key, url]: [string, any], i) => {
                  const IconsMap: any = { instagram: Instagram, whatsapp: Phone, facebook: Facebook, linkedin: Linkedin, tiktok: Video };
                  const Icon = IconsMap[key] || ExternalLink;
                  return (
                    <a key={key} href={url} target="_blank" className="text-slate-500 hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative pt-32 md:pt-40 pb-32 px-6 md:px-10 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.section
              key="home"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-12 gap-8 items-center min-h-[70vh]"
            >
              <div className="col-span-12 md:col-span-7 lg:col-span-6 flex flex-col justify-center text-center md:text-left">
                  <MotionText delay={0.2} className="mb-6">
                    <span className="glass-panel px-4 py-1 text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-cyan-700 dark:text-cyan-200 font-bold border-cyan-500/10 dark:border-cyan-400/30">
                      {dbData.user?.title || 'Graphics Designer'}
                    </span>
                  </MotionText>
                  
                  <MotionText delay={0.3}>
                    <h1 className="hero-text text-[clamp(2.5rem,15vw,6rem)] md:text-[clamp(4rem,10vw,8rem)] lg:text-[clamp(5rem,12vw,100px)] font-black tracking-tighter leading-[0.85] mb-8 uppercase text-slate-900 dark:text-white">
                      {(dbData.user?.name || 'EPHREM').split(' ')[0]}<br />{(dbData.user?.name || 'TAMIRE').split(' ')[1] || 'TAMIRE'}<span className="text-cyan-400">.</span>
                    </h1>
                  </MotionText>

                  <MotionText delay={0.4}>
                    <p className="text-slate-600 dark:text-white text-lg md:text-xl leading-relaxed max-w-lg mb-10 font-light">
                      {dbData.user?.bio}
                    </p>
                  </MotionText>

                  <MotionText delay={0.5} className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mt-4">
                    <button 
                      onClick={() => setChatOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_20px_40px_rgba(34,211,238,0.2)] dark:shadow-none hover:shadow-cyan-500/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      Hire Me <Send className="w-3 h-3" />
                    </button>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-6 group cursor-pointer" 
                      onClick={() => setActiveTab('portfolio')}
                    >
                      <div className="w-14 h-14 rounded-full border border-slate-900/10 dark:border-white/20 flex items-center justify-center transition-all group-hover:border-cyan-500 dark:group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] shadow-lg shadow-black/5 dark:shadow-none">
                        <div className="w-2 h-2 bg-slate-400 dark:bg-white rounded-full group-hover:bg-cyan-500 dark:group-hover:bg-cyan-400 transition-colors" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-white transition-colors">Explore Works</span>
                    </motion.div>
                  </MotionText>
                </div>

              <div className="col-span-12 md:col-span-5 lg:col-span-6 relative flex items-center justify-center md:justify-end">
                <div className="project-card-container transform md:rotate-y-[-15deg] md:rotate-x-[10deg] transform-style-3d w-full max-w-md">
                  <Card3D className="aspect-[4/5] p-2" glow>
                    <motion.img 
                      whileHover={{ 
                        rotateY: 180, 
                        filter: "grayscale(0%)"
                      }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      src="input_file_0.png" 
                      alt="Ephrem Tamire" 
                      className="w-full h-full object-cover rounded-2xl grayscale transition-all duration-1000 cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-8 right-8 text-white/20 font-black text-6xl tracking-tighter select-none pointer-events-none">
                      AETHER
                    </div>
                  </Card3D>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'about' && (
            <motion.section
              key="about"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
            >
              <div className="order-2 md:order-1">
                <Card3D className="aspect-square max-w-md mx-auto" glow>
                  <motion.img 
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    src="input_file_1.png" 
                    alt="Ephrem Tamire Portrait" 
                    className="w-full h-full object-cover cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                </Card3D>
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <MotionText delay={0.1}>
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">About Me</h2>
                  <div className="h-1 w-20 bg-cyan-500 mt-4" />
                </MotionText>
                
                <MotionText delay={0.2}>
                  <p className="text-slate-600 dark:text-white text-lg leading-relaxed font-light">
                    I am a passionate Graphic Designer with a deep focus on creating high-end 3D graphics and digital brand experiences. My approach combines technical precision with artistic flair, ensuring every pixel serves a purpose.
                  </p>
                </MotionText>

                <div className="grid grid-cols-2 gap-8 pt-8">
                  <MotionText delay={0.3} className="space-y-2 p-6 glass-panel shadow-xl">
                    <div className="text-cyan-600 dark:text-cyan-400 font-black text-4xl leading-none">05+</div>
                    <div className="text-[10px] tracking-widest text-slate-500 dark:text-white uppercase font-bold">Years of Experience</div>
                  </MotionText>
                  <MotionText delay={0.4} className="space-y-2 p-6 glass-panel shadow-xl">
                    <div className="text-cyan-600 dark:text-cyan-400 font-black text-4xl leading-none">150+</div>
                    <div className="text-[10px] tracking-widest text-slate-500 dark:text-white uppercase font-bold">Projects Complete</div>
                  </MotionText>
                </div>
                
                <MotionText delay={0.5}>
                  <button 
                    onClick={() => setActiveTab('contact')}
                    className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-none"
                  >
                    Get in Touch
                  </button>
                </MotionText>
              </div>
            </motion.section>
          )}

          {activeTab === 'services' && (
            <motion.section
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <MotionText delay={0.1}>
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">My Services</h2>
                </MotionText>
                <MotionText delay={0.2}>
                  <p className="text-slate-500 dark:text-white max-w-xl mx-auto">Luxury design solutions tailored for your brand.</p>
                </MotionText>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {(dbData.services || []).map((service, idx) => {
                  const Icons = [PenTool, Share2, Layers, Cpu, Monitor, Music];
                  const Icon = Icons[idx % Icons.length];
                  
                  // Color variations for variety in light mode
                  const variations = [
                    "bg-blue-50/30 border-blue-100/50 dark:bg-white/5",
                    "bg-cyan-50/30 border-cyan-100/50 dark:bg-white/5",
                    "bg-indigo-50/30 border-indigo-100/50 dark:bg-white/5",
                    "bg-slate-50/30 border-slate-100/50 dark:bg-white/5",
                    "bg-sky-50/30 border-sky-100/50 dark:bg-white/5",
                    "bg-violet-50/30 border-violet-100/50 dark:bg-white/5"
                  ];
                  const iconColors = [
                    "bg-blue-100 text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-400",
                    "bg-cyan-100 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400",
                    "bg-indigo-100 text-indigo-600 dark:bg-cyan-400/10 dark:text-cyan-400",
                    "bg-slate-200 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-400",
                    "bg-sky-100 text-sky-600 dark:bg-cyan-400/10 dark:text-cyan-400",
                    "bg-violet-100 text-violet-600 dark:bg-cyan-400/10 dark:text-cyan-400"
                  ];
                  
                  return (
                    <Card3D 
                      key={idx} 
                      className={cn(
                        "group p-6 sm:p-10 flex flex-col gap-6 cursor-pointer transition-all h-full relative",
                        variations[idx % variations.length],
                        selectedService === idx ? "ring-2 ring-cyan-500" : ""
                      )} 
                      glow={idx === 1 || selectedService === idx}
                    >
                      {service.image && (
                        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-700">
                          <img src={service.image} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      
                      <div className="relative z-10" onClick={() => setSelectedService(selectedService === idx ? null : idx)}>
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all", iconColors[idx % iconColors.length])}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight leading-tight mb-2 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors uppercase">{service.title}</h3>
                        <p className="text-gray-500 dark:text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 font-mono">{service.focus}</p>
                        <p className="text-slate-600 dark:text-white text-sm leading-relaxed mb-6 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{service.desc}</p>
                        
                        <div className="pt-4 border-t border-black/5 dark:border-white/5">
                          <button className="text-[10px] font-bold tracking-[0.3em] text-cyan-700 dark:text-cyan-400 uppercase flex items-center gap-2 group">
                            What I Offer <ChevronRight className={cn("w-3 h-3 transition-transform", selectedService === idx ? "rotate-90" : "")} />
                          </button>
                          {selectedService === idx && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }}
                              className="mt-4 space-y-2"
                            >
                              {(service.offerings || []).map((point, pIdx) => (
                                <div key={pIdx} className="text-[11px] text-gray-500 dark:text-white leading-relaxed font-mono flex items-start gap-2">
                                  <span className="text-cyan-500 dark:text-cyan-400 mt-0.5">•</span>
                                  {point}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </Card3D>
                  );
                })}
              </div>
            </motion.section>
          )}

          {activeTab === 'portfolio' && (
            <motion.section
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-16"
            >
               <div className="text-center space-y-4">
                <MotionText delay={0.1}>
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">My Works</h2>
                </MotionText>
                <MotionText delay={0.2} className="flex flex-wrap gap-4 justify-center">
                   {['All', 'Branding', 'Motion', 'Graphics', '3D'].map(cat => (
                     <button 
                       key={cat}
                       onClick={() => setPortfolioFilter(cat)}
                       className={cn(
                         "px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all cursor-pointer border",
                         portfolioFilter === cat ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black shadow-xl" : "bg-transparent border-slate-900/10 text-slate-500 dark:border-white/10 dark:text-white hover:border-slate-900 dark:hover:border-white shadow-sm"
                       )}
                     >
                       {cat}
                     </button>
                   ))}
                </MotionText>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {(dbData.projects || [])
                  .filter(p => portfolioFilter === 'All' || p.category === portfolioFilter)
                  .map((project) => (
                    <div key={project.id} className="group cursor-pointer">
                      <Card3D className="min-h-[480px] h-auto flex flex-col group/card" glow>
                        <div className="h-48 sm:h-64 overflow-hidden relative">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover opacity-60 dark:opacity-40 group-hover:opacity-100 dark:group-hover:opacity-80 transition-all duration-1000 group-hover:scale-110" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black/80 via-transparent to-transparent opacity-80 dark:opacity-100" />
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-between relative z-10 bg-white/40 dark:bg-transparent backdrop-blur-sm dark:backdrop-blur-none">
                          <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-[9px] tracking-[0.2em] font-bold text-cyan-700 dark:text-cyan-400 uppercase mb-4">
                              {project.category}
                            </span>
                            <h3 className="text-3xl font-black mb-3 tracking-tighter uppercase leading-tight text-slate-900 dark:text-white group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-400 transition-colors">{project.title}</h3>
                            <p className="text-slate-600 dark:text-white text-sm leading-relaxed line-clamp-2 font-light">
                              {project.description}
                            </p>
                          </div>
                          <div className="pt-6">
                             <a 
                               href={`#${project.id}`}
                               className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-cyan-400 group-hover:gap-4 transition-all"
                             >
                               View Case Study <ExternalLink className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                             </a>
                          </div>
                        </div>
                      </Card3D>
                    </div>
                  ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'skills' && (
            <motion.section
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16"
            >
              <div className="space-y-8">
                <MotionText delay={0.1}>
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">My Professional Skills</h2>
                </MotionText>
                <MotionText delay={0.2}>
                  <p className="text-slate-600 dark:text-white leading-relaxed font-light">
                    I specialize in Adobe Creative Suite and modern 3D visualization tools to deliver world-class graphics.
                  </p>
                </MotionText>
                <div className="space-y-6">
                  {(dbData.skills || []).map((skill, idx) => (
                    <div 
                      key={idx} 
                      className="group space-y-2 cursor-pointer"
                      onClick={() => {
                        const relatedCat = skill.name.toLowerCase().includes('3d') || skill.name.toLowerCase().includes('blender') ? '3D' : 'Graphics';
                        setPortfolioFilter(relatedCat);
                        setActiveTab('portfolio');
                      }}
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-slate-700 dark:text-white">
                        <span className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", idx % 2 === 0 ? "bg-cyan-500 dark:bg-cyan-400" : "bg-slate-900 dark:bg-white")} />
                          {skill.name}
                        </span>
                        <span className="text-cyan-600 dark:text-cyan-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-white/5 w-full relative rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="absolute h-full bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-500 dark:to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all" 
                        />
                      </div>
                      <div className="text-[8px] text-gray-400 dark:text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                         Click to view related {skill.name.toLowerCase().includes('3d') ? '3D' : 'Graphic'} artifacts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                 <Card3D className="aspect-square" glow>
                    <motion.img 
                      whileHover={{ rotateY: -180, filter: "brightness(1.2)" }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      src="input_file_2.png" 
                      className="w-full h-full object-cover cursor-pointer" 
                    />
                 </Card3D>
              </div>
            </motion.section>
          )}

          {activeTab === 'edu_exp' && (
            <motion.section
              key="edu_exp"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              className="space-y-24"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-12">
                  <MotionText delay={0.1} className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl glass-panel shadow-lg flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Work Experience</h2>
                  </MotionText>
                  <div className="space-y-10">
                    {(dbData.experience || []).map((exp, idx) => (
                      <Card3D key={idx} className="relative p-6 sm:p-8 border-l-4 border-cyan-500 dark:border-cyan-400 group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                        <div className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-2">{exp.period}</div>
                        <h3 className="text-xl font-bold uppercase tracking-tight mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-slate-900 dark:text-white uppercase">{exp.position}</h3>
                        <div className="text-slate-500 dark:text-white font-bold text-xs uppercase tracking-widest mb-4">{exp.company}</div>
                        <p className="text-xs text-slate-600 dark:text-white leading-relaxed font-light mb-4">{exp.description}</p>
                        {exp.tasks && (
                          <div className="space-y-2">
                             {exp.tasks.map((task, tidx) => (
                               <div key={tidx} className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-white font-mono">
                                  <div className="w-1 h-1 bg-cyan-500 rounded-full" />
                                  {task}
                               </div>
                             ))}
                          </div>
                        )}
                      </Card3D>
                    ))}
                  </div>
                </div>

                <div className="space-y-12">
                  <MotionText delay={0.1} className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl glass-panel shadow-lg flex items-center justify-center text-slate-900 dark:text-white">
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Education</h2>
                  </MotionText>
                  <div className="space-y-10">
                    {(dbData.education || []).map((edu, idx) => (
                      <Card3D key={idx} className="relative p-6 sm:p-8 border-l-4 border-slate-900 dark:border-white group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                        <div className="text-[10px] font-bold text-slate-400 dark:text-white uppercase tracking-widest mb-2">{edu.year}</div>
                        <h3 className="text-xl font-bold uppercase tracking-tight mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-slate-900 dark:text-white">{edu.degree}</h3>
                        <div className="text-slate-500 dark:text-white font-bold text-xs uppercase tracking-widest mb-4">{edu.institution}</div>
                        <p className="text-xs text-slate-600 dark:text-white leading-relaxed font-light mb-4">{edu.description}</p>
                        
                        {edu.keyPoints && (
                          <div className="space-y-3">
                             <div className="text-[9px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">{edu.keyPointsTitle || 'Key Highlights:'}</div>
                             <div className="grid grid-cols-1 gap-2">
                               {edu.keyPoints.map((point, pidx) => (
                                 <div key={pidx} className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-white font-mono italic">
                                    <span className="text-slate-900 dark:text-white group-hover:opacity-100 transition-opacity">•</span>
                                    {point}
                                 </div>
                               ))}
                             </div>
                          </div>
                        )}
                      </Card3D>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificates Area */}
              <div className="space-y-12">
                <MotionText delay={0.3} className="text-center">
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Achievements & Certs</h2>
                  <p className="text-slate-500 dark:text-white mt-2 font-light">Validating the expertise through professional certification.</p>
                </MotionText>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                  {(dbData.certificates || []).map((cert, idx) => (
                    <Card3D key={idx} className="group overflow-hidden h-full">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img 
                          src={cert.image} 
                          alt={cert.title} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest mb-1">{cert.year}</div>
                          <h4 className="text-white font-bold uppercase tracking-tight text-sm leading-tight">{cert.title}</h4>
                        </div>
                      </div>
                      <div className="p-6 bg-white dark:bg-transparent border-t border-black/5 dark:border-white/5">
                        <div className="flex justify-between items-center">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white">{cert.issuer}</div>
                          <ShieldCheck className="w-4 h-4 text-cyan-500" />
                        </div>
                      </div>
                    </Card3D>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'contact' && (
            <motion.section
              key="contact"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-8">
                <MotionText delay={0.1}>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-white">Let's Create<br />Something<br /><span className="text-cyan-400">Epic.</span></h2>
                </MotionText>
                
                <MotionText delay={0.2} className="relative w-full aspect-video rounded-3xl overflow-hidden glass-panel border border-white/10 mb-8 shadow-2xl">
                  <motion.img 
                    whileHover={{ 
                      rotateY: 180,
                      filter: "grayscale(0%)"
                    }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    src="input_file_3.png" 
                    className="w-full h-full object-cover grayscale opacity-50 hover:opacity-100 transition-all duration-700 cursor-pointer" 
                    alt="Contact Landscape" 
                  />
                </MotionText>

                <MotionText delay={0.3}>
                  <p className="text-slate-600 dark:text-white leading-relaxed font-light">Available for new projects and collaborations. Drop me a line and let's turn your vision into 3D reality.</p>
                </MotionText>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors"><Mail className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /></div>
                    <div className="text-sm font-bold tracking-widest uppercase dark:text-white">ephremtamire1@gmail.com</div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors"><Phone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /></div>
                    <div className="text-sm font-bold tracking-widest uppercase flex flex-col dark:text-white">
                       <span>+251 916 771 788</span>
                       <span className="opacity-50">+251 916 314 599</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {[
                    { icon: Instagram, link: dbData.user?.socials?.instagram },
                    { icon: MessageCircle, link: dbData.user?.socials?.whatsapp },
                    { icon: Facebook, link: dbData.user?.socials?.facebook },
                    { icon: Linkedin, link: dbData.user?.socials?.linkedin },
                    { icon: Video, link: dbData.user?.socials?.tiktok },
                  ].map((s, i) => (
                    <a 
                      key={i} 
                      href={s.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all hover:-translate-y-1"
                    >
                      <s.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <Card3D className="p-6 sm:p-10" glow>
                   <form 
                     className="space-y-6"
                     onSubmit={async (e) => {
                       e.preventDefault();
                       const target = e.target as any;
                       const msg = {
                         sender: target.name.value,
                         email: target.email.value,
                         text: target.vision.value,
                         isAdmin: false
                       };
                       await fetch('/api/messages', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(msg)
                       });
                       setChatOpen(true);
                       target.reset();
                     }}
                   >
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-white">Full Name</label>
                        <input name="name" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-white">Email Address</label>
                        <input name="email" type="email" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-white">Your Vision</label>
                        <textarea name="vision" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors h-32" placeholder="Tell me about your project..." />
                      </div>
                      <button type="submit" className="w-full py-4 bg-cyan-500 text-white dark:text-black font-black uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">SEND MESSAGE</button>
                   </form>
                </Card3D>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer-like status bar */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-6 md:px-10 md:py-10 flex justify-between items-end pointer-events-none max-w-7xl mx-auto z-40">
        <div className="flex gap-4 md:gap-10 items-center pointer-events-auto">
          <div className="w-10 h-10 md:w-12 md:h-12 glass-panel rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-help group">
            <div className="w-5 h-5 md:w-6 md:h-6 border-t-2 border-white rounded-full animate-spin-slow group-hover:border-cyan-400 transition-colors" />
          </div>
          <div className="text-[9px] md:text-[10px] text-slate-500 dark:text-white uppercase tracking-widest leading-tight hidden sm:block">
            Designer Profile: <span className="text-slate-900 dark:text-white">Active</span><br />
            System Clock: <span className="text-slate-900 dark:text-white">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex gap-3 md:gap-8 items-center pointer-events-auto">
          <div className="text-right hidden md:block">
            <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 dark:text-white mb-1 font-bold">Secure Core</div>
            <div className="text-[10px] md:text-xs font-medium text-cyan-400">STATUS: ENCRYPTED</div>
          </div>
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="w-12 h-12 md:w-14 md:h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-110 transition-all active:scale-95 group"
          >
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-black group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </footer>

      {/* Modern Real-Time Chat Interface */}
      <ChatInterface 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        adminName={dbData.user?.name || 'Ephrem'}
        adminImage={dbData.user?.image}
      />

      <style>{`
        html { scroll-behavior: smooth; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
