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
  PerformanceMonitor,
  Environment
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedGlobe = memo(({ isDark }: { isDark: boolean }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      globeRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={globeRef} args={[2.8, 128, 128]}>
        <MeshDistortMaterial
          color={isDark ? "#0f172a" : "#ffffff"}
          roughness={0.1}
          metalness={0.8}
          speed={1.5}
          distort={0.4}
          envMapIntensity={isDark ? 1.5 : 2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
    </Float>
  );
});

const AIParticles = memo(({ isDark, count = 300 }: { isDark: boolean; count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { clock } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 2.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.02) * 0.1;
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
        size={0.03}
        color={isDark ? "#60a5fa" : "#3b82f6"}
        transparent
        opacity={isDark ? 0.9 : 0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
});

const FloatingOrbs = memo(({ isDark }: { isDark: boolean }) => {
  const orbsRef = useRef<THREE.Group>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={orbsRef}>
      {[...Array(8)].map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.8}
          floatIntensity={0.8}
        >
          <Sphere
            args={[0.1 + Math.random() * 0.2, 32, 32]}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 6
            ]}
          >
            <meshPhysicalMaterial
              color={i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4"}
              roughness={0.1}
              metalness={0.5}
              transmission={0.8}
              thickness={1}
              transparent
              opacity={0.9}
              emissive={i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4"}
              emissiveIntensity={isDark ? 1 : 0.5}
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
  const overlayRef = useRef<HTMLDivElement>(null);
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

    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          y: x * 0.15,
          x: -y * 0.15,
          duration: 2,
          ease: "power2.out"
        });
      }

      gsap.to(overlay, {
        background: isDark
          ? `radial-gradient(circle at ${clientX}px ${clientY}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`
          : `radial-gradient(circle at ${clientX}px ${clientY}px, rgba(59, 130, 246, 0.08) 0%, transparent 60%)`,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    if (groupRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (groupRef.current) {
            groupRef.current.position.y = -self.progress * 2;
            groupRef.current.rotation.z = self.progress * 0.2;
          }
        }
      });
    }

    gsap.to(overlay, {
      opacity: 0.8,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

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
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #020617 0%, #0f172a 100%)' 
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <div 
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none will-change-[transform,opacity] z-[5]"
      />

      <div 
        id="scroll-progress" 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 z-[100] origin-left"
        style={{ width: '100%', transform: 'scaleX(0)' }}
      />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          stencil: false,
          depth: true,
          powerPreference: "high-performance"
        }}
        dpr={dpr}
        eventSource={containerRef as any}
        eventPrefix="client"
        frameloop="always"
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)}>
            <AdaptiveDpr pixelated />
            
            <Environment preset={isDark ? "night" : "city"} />
            
            <ambientLight intensity={isDark ? 0.5 : 1} />
            <pointLight position={[10, 10, 10]} intensity={isDark ? 5 : 3} color="#3b82f6" />
            <pointLight position={[-10, -10, -10]} intensity={isDark ? 4 : 2} color="#8b5cf6" />
            <pointLight position={[0, 0, 5]} intensity={isDark ? 3 : 1} color="#06b6d4" />

            <group ref={groupRef}>
              <AnimatedGlobe isDark={isDark} />
              <AIParticles isDark={isDark} count={400} />
              <FloatingOrbs isDark={isDark} />
            </group>

            <Stars
              radius={60}
              depth={40}
              count={isDark ? 3000 : 1000}
              factor={isDark ? 3 : 2}
              saturation={0}
              fade
              speed={1}
            />

            <Sparkles
              count={isDark ? 150 : 80}
              scale={12}
              size={2}
              speed={0.4}
              opacity={isDark ? 0.6 : 0.3}
              color={isDark ? "#ffffff" : "#3b82f6"}
            />
          </PerformanceMonitor>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GsapThreeHeroBackground;
