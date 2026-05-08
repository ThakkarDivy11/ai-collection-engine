import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Stars, Sparkles, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const InteractiveGlobe = ({ isDark }: { isDark: boolean }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      globeRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const globeColor = isDark ? "#1e3a5f" : "#4a90a4";
  const particleColor = isDark ? "#2d84ca" : "#7ec8e3";

  return (
    <group>
      {/* Main Globe */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
        <Sphere ref={globeRef} args={[3, 64, 64]}>
          <MeshDistortMaterial
            color={globeColor}
            speed={2}
            distort={0.3}
            transparent
            opacity={0.6}
            wireframe
          />
        </Sphere>
      </Float>

      {/* Inner Core */}
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color={isDark ? "#2a4c62" : "#6ea5c2"}
          transparent
          opacity={0.8}
          emissive={isDark ? "#1e3a5f" : "#4a90a4"}
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Orbiting Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[useMemo(() => {
              const positions = new Float32Array(1000 * 3);
              for (let i = 0; i < 1000; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 4 + Math.random() * 2;
                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = r * Math.cos(phi);
              }
              return positions;
            }, []), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={particleColor}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

const NeuralNetwork = ({ isDark }: { isDark: boolean }) => {
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions } = useMemo(() => {
    const nodeCount = 50;
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return { positions };
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      linesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  const lineColor = isDark ? "#2d84ca" : "#7ec8e3";

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={lineColor}
        transparent
        opacity={0.3}
        linewidth={1}
      />
    </lineSegments>
  );
};

const FloatingDataPoints = ({ isDark }: { isDark: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const pointColor = isDark ? "#00ff7f" : "#4ade80";

  return (
    <group ref={groupRef}>
      {[...Array(20)].map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <Sphere
            args={[0.1 + Math.random() * 0.2, 16, 16]}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 10
            ]}
          >
            <meshStandardMaterial
              color={pointColor}
              transparent
              opacity={0.6}
              emissive={pointColor}
              emissiveIntensity={0.5}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

const CameraController = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 12);
  }, [camera]);

  return <OrbitControls enableZoom={false} enablePan={false} />;
};

const PremiumThreeBackground: React.FC = () => {
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

  return (
    <div className="absolute inset-0 z-0 h-screen pointer-events-none">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <CameraController />

        {/* Lighting */}
        <ambientLight intensity={isDark ? 0.5 : 0.8} />
        <pointLight position={[10, 10, 10]} intensity={isDark ? 0.5 : 1} color={isDark ? "#2d84ca" : "#7ec8e3"} />
        <pointLight position={[-10, -10, 10]} intensity={isDark ? 0.3 : 0.5} color={isDark ? "#2a4c62" : "#6ea5c2"} />

        {/* Stars Background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Main Interactive Elements */}
        <InteractiveGlobe isDark={isDark} />
        <NeuralNetwork isDark={isDark} />
        <FloatingDataPoints isDark={isDark} />

        {/* Sparkles Effect */}
        <Sparkles
          count={200}
          scale={12}
          size={2}
          speed={0.4}
          opacity={0.5}
          color={isDark ? "#2d84ca" : "#7ec8e3"}
        />
      </Canvas>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 dark:to-[#0a0f1a] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-50/50 dark:to-[#0a0f1a]/50 pointer-events-none" />
    </div>
  );
};

export default PremiumThreeBackground;
