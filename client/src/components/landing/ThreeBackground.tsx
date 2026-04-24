import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const GlowingBlob = ({ position, color, size = 2 }: { position: [number, number, number], color: string, size?: number }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </Float>
  );
};

const SubtleGrid = ({ color }: { color: string }) => {
  return (
    <gridHelper 
      args={[100, 40, color, color]} 
      position={[0, -5, 0]} 
      rotation={[0.2, 0, 0]}
    />
  );
};

const TinyParticles = ({ color }: { color: string }) => {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color={color} 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
      />
    </points>
  );
};

const ThreeBackground: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

  const themeColors = {
    grid: isDark ? "#1e293b" : "#e2e8f0",
    particles: isDark ? "#3b82f6" : "#16a34a",
    blob1: isDark ? "#3b82f6" : "#22c55e",
    blob2: isDark ? "#8b5cf6" : "#4ade80",
    blob3: isDark ? "#1e40af" : "#dcfce7",
  };

  return (
    <div className="absolute inset-0 z-0 h-screen pointer-events-none">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={isDark ? 0.8 : 1.2} />
        
        {/* Soft Background Blobs */}
        <GlowingBlob position={[-10, 5, -8]} color={themeColors.blob1} size={6} />
        <GlowingBlob position={[10, -5, -8]} color={themeColors.blob2} size={6} />
        <GlowingBlob position={[0, -8, -12]} color={themeColors.blob3} size={8} />

        <TinyParticles color={themeColors.particles} />
        <SubtleGrid color={themeColors.grid} />
      </Canvas>
      
      {/* Layered Overlays - Updated for Theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#020617] pointer-events-none" />
    </div>
  );
};

export default ThreeBackground;
