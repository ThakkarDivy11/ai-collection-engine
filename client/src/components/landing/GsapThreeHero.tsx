import React, { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Stars, Sparkles, Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Three.js Components
const AnimatedGlobe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      globeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.3}>
      <Sphere ref={globeRef} args={[2.5, 64, 64]}>
        <MeshDistortMaterial
          color="#4b8aac"
          speed={2}
          distort={0.4}
          transparent
          opacity={0.7}
          wireframe
        />
      </Sphere>
    </Float>
  );
};

const NeuralParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { clock } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.03}
        color="#7ec8e3"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </Points>
  );
};

const FloatingOrbs = () => {
  const orbsRef = useRef<THREE.Group>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={orbsRef}>
      {[...Array(8)].map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.6}
          floatIntensity={0.4}
        >
          <Sphere
            args={[0.15 + Math.random() * 0.2, 16, 16]}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 4
            ]}
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? "#4b8aac" : "#7ec8e3"}
              transparent
              opacity={0.6}
              emissive={i % 2 === 0 ? "#4b8aac" : "#7ec8e3"}
              emissiveIntensity={0.4}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <OrbitControls enableZoom={false} enablePan={false} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#4b8aac" />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#7ec8e3" />

        {/* Three.js Elements */}
        <AnimatedGlobe />
        <NeuralParticles />
        <FloatingOrbs />

        {/* Stars Background */}
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={1}
          color="#4b8aac"
        />

        {/* Sparkles Effect */}
        <Sparkles
          count={150}
          scale={10}
          size={3}
          speed={0.5}
          opacity={0.6}
          color="#4b8aac"
        />
      </Canvas>
    </div>
  );
};

// Main Hero Component
const GsapThreeHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate badge
    gsap.fromTo(badgeRef.current,
      { opacity: 0, scale: 0.8, y: -20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.2
      }
    );

    // Animate title with character split
    if (titleRef.current) {
      const text = titleRef.current.textContent || '';
      titleRef.current.innerHTML = text.split('').map((char, i) =>
        `<span class="inline-block" style="animation-delay: ${i * 0.03}s">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      gsap.fromTo(titleRef.current.querySelectorAll('span'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power4.out", delay: 0.4 }
      );
    }

    // Animate subtitle
    gsap.fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.8 }
    );

    // Animate buttons
    const buttons = buttonsRef.current?.children;
    if (buttons) {
      gsap.fromTo(buttons,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          delay: 1
        }
      );
    }

    // Animate dashboard
    gsap.fromTo(dashboardRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", delay: 1.2 }
    );

    // Create floating glow elements
    for (let i = 0; i < 5; i++) {
      const glow = document.createElement('div');
      const size = Math.random() * 200 + 100;
      glow.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(75, 138, 172, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        filter: blur(40px);
        pointer-events: none;
      `;
      containerRef.current.appendChild(glow);

      gsap.to(glow, {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        scale: 'random(0.8, 1.3)',
        opacity: 'random(0.3, 0.7)',
        duration: 'random(6, 12)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
      }}
    >
      {/* Three.js Background */}
      <ThreeBackground />

      {/* Content */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-calypso-500/10 text-calypso-700 text-[10px] font-semibold mb-8 tracking-[0.3em] uppercase backdrop-blur-sm border border-calypso-500/10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-calypso-600 shadow-[0_0_8px_rgba(207,123,64,0.5)]" />
          <span>The Future of Recovery</span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-[7.5vw] md:text-[6.5rem] font-semibold text-slate-900 tracking-tighter leading-[1.1] mb-10"
        >
          AI-Powered Revenue. <br />
          <span className="text-calypso-500">Fully Automated.</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed font-normal"
        >
          CollectAI integrates Neural Churn Prediction and Autonomous Negotiators
          to deliver high-scale, AI-driven payment recovery for the modern enterprise.
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button className="px-12 py-6 bg-slate-950 text-white font-semibold rounded-3xl transition-all hover:scale-[1.03] active:scale-95 shadow-[0_30px_60px_rgba(0,0,0,0.1)] text-lg">
            Start Recovery
          </button>

          <button className="px-12 py-6 bg-white text-slate-900 font-semibold rounded-3xl border border-slate-200 transition-all hover:bg-slate-50 text-lg flex items-center gap-3 group">
            See Platform
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div
        ref={dashboardRef}
        className="w-full max-w-6xl mx-auto px-4 relative z-10"
      >
        <div className="relative group">
          <div className="absolute -inset-40 bg-calypso-500/5 blur-[150px] rounded-full pointer-events-none" />

          <div className="relative rounded-3xl overflow-hidden shadow-[0_80px_200px_rgba(0,0,0,0.15)] border border-slate-200 bg-white aspect-[16/9]">
            <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
            </div>

            <div className="p-10 h-full bg-white relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-4 gap-8 h-full text-slate-900 text-left">
                <div className="col-span-3 space-y-8">
                  <div className="h-2/3 rounded-[2.5rem] bg-slate-50 p-10 flex flex-col justify-between border border-slate-200">
                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Active Recovery Stream</div>
                    <div className="flex items-end gap-3 h-40">
                      {[30, 60, 45, 90, 65, 85, 55, 75, 40, 95, 60, 80, 50, 90].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col-reverse gap-[2px] h-full">
                          {Array.from({ length: 8 }).map((_, j) => (
                            <div
                              key={j}
                              className={`flex-1 w-full rounded-sm transition-colors duration-500 ${
                                (j + 1) * 12.5 <= h
                                  ? i < 4 ? "bg-calypso-500" : i < 9 ? "bg-calypso-400" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                  : "bg-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="h-40 rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8">
                      <div className="text-3xl font-semibold text-slate-900 mb-2">99.98%</div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Prediction Accuracy</div>
                    </div>
                    <div className="h-40 rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8">
                      <div className="text-3xl font-semibold text-slate-900 mb-2">₹48.2Cr</div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Recovered Today</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8 text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-10">Recovery Core</div>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-full border-4 border-calypso-500/10 flex items-center justify-center relative">
                      <div className="w-16 h-16 rounded-full bg-calypso-500/10 animate-ping absolute" />
                      <div className="w-12 h-12 rounded-full bg-calypso-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-calypso-500" />
                      </div>
                    </div>
                    <div className="space-y-3 w-full">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full w-1/3 bg-calypso-500 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GsapThreeHero;