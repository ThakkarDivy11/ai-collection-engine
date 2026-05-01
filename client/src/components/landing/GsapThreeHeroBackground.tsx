import React, { useEffect, useRef, useMemo, useState, memo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  Sphere, 
  MeshDistortMaterial, 
  Stars, 
  Sparkles, 
  Points, 
  PointMaterial, 
  AdaptiveDpr, 
  AdaptiveEvents,
  PerformanceMonitor
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger);

const AnimatedGlobe = memo(({ isDark }: { isDark: boolean }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.12;
      globeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <Sphere ref={globeRef} args={[2.5, 32, 32]}>
        <MeshDistortMaterial
          color={isDark ? "#63b3ed" : "#4b8aac"}
          speed={1.5}
          distort={0.3}
          transparent
          opacity={isDark ? 0.6 : 0.5}
          wireframe
        />
      </Sphere>
    </Float>
  );
});

const NeuralParticles = memo(({ isDark, count = 300 }: { isDark: boolean; count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { clock } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.02}
        color={isDark ? "#ffffff" : "#4b8aac"}
        transparent
        opacity={isDark ? 0.8 : 0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
});

const FloatingOrbs = memo(({ isDark }: { isDark: boolean }) => {
  const orbsRef = useRef<THREE.Group>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={orbsRef}>
      {[...Array(6)].map((_, i) => (
        <Float
          key={i}
          speed={0.8 + Math.random() * 0.5}
          rotationIntensity={0.4}
          floatIntensity={0.3}
        >
          <Sphere
            args={[0.15 + Math.random() * 0.15, 12, 12]}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 4
            ]}
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? "#4b8aac" : "#7ec8e3"}
              transparent
              opacity={isDark ? 0.6 : 0.5}
              emissive={i % 2 === 0 ? "#4b8aac" : "#7ec8e3"}
              emissiveIntensity={isDark ? 1.2 : 0.2}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
});

const GsapThreeHeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isDark, setIsDark] = useState(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Interactive Spotlight Overlay
    const overlay = overlayRef.current;
    if (!overlay) return;


    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      // Rotate 3D Group
      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          y: x * 0.2,
          x: -y * 0.2,
          duration: 2,
          ease: "power2.out"
        });
      }

      // Move Spotlight
      gsap.to(overlay, {
        background: `radial-gradient(circle at ${clientX}px ${clientY}px, rgba(75, 138, 172, 0.15) 0%, transparent 60%)`,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Scroll-triggered 3D movement
    if (groupRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (groupRef.current) {
            groupRef.current.position.z = self.progress * 5;
            groupRef.current.rotation.z = self.progress * 0.5;
          }
        }
      });
    }

    // Optimized GSAP
    gsap.to(overlay, {
      opacity: 0.8,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Scroll Progress Bar Animation
    gsap.to('#scroll-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #0a0f1a 0%, #1a2a37 100%)' 
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
      }}
    >
      {/* Interactive Spotlight Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none will-change-[transform,opacity] z-[5]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(75, 138, 172, 0.15) 0%, transparent 60%)'
        }}
      />

      {/* Scroll Progress Bar */}
      <div 
        id="scroll-progress" 
        className="fixed top-0 left-0 h-1 bg-calypso-500 z-[100] origin-left"
        style={{ width: '100%', transform: 'scaleX(0)' }}
      />

      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ 
          alpha: true, 
          antialias: false, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={dpr}
        frameloop="always"
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)}>
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            
            {/* Lighting - Enhanced for Dark Mode Visibility */}
            <ambientLight intensity={isDark ? 0.6 : 0.5} />
            <pointLight position={[10, 10, 10]} intensity={isDark ? 1.5 : 1} color={isDark ? "#ffffff" : "#4b8aac"} />
            <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.8 : 0.5} color="#4b8aac" />

            {/* Main Interactive Group */}
            <group ref={groupRef}>
              <AnimatedGlobe isDark={isDark} />
              <NeuralParticles isDark={isDark} count={400} />
              <FloatingOrbs isDark={isDark} />
            </group>

            {/* Stars Background - Fixed count to avoid buffer resizing */}
            <Stars
              radius={50}
              depth={30}
              count={2000}
              factor={2}
              saturation={0}
              fade
              speed={0.5}
            />

            {/* Sparkles Effect - Fixed count to avoid buffer resizing */}
            <Sparkles
              count={100}
              scale={8}
              size={1.5}
              speed={0.3}
              opacity={0.4}
              color={isDark ? "#ffffff" : "#4b8aac"}
            />
          </PerformanceMonitor>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GsapThreeHeroBackground;