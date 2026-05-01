import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera } from "@react-three/drei";
import collectAILogo from "../../assets/images/collectai-logo.png";
import "../styles/Loading.css";

// 3D Particle Sphere Component
const ParticleSphere = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    // Create particle system
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 0.5;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Gradient colors (cyan to purple)
      colors[i * 3] = 0.0 + Math.random() * 0.2; // R
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // G
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    setParticles(geometry);
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x += 0.0005;
    }
  });

  if (!particles) return null;

  return (
    <points ref={particlesRef} geometry={particles}>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Floating Geometric Shapes
const FloatingShapes = () => {
  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[2, 1, 0]}>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#00d4ff"
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh position={[-2, -1, 1]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2.5}>
        <mesh position={[0, 2, -1]}>
          <tetrahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
    </group>
  );
};

// Main Loading Component
const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !loadingComplete) {
      setLoadingComplete(true);

      // GSAP exit animations
      const tl = gsap.timeline();

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.5,
      }).to(containerRef.current, {
        display: "none",
        duration: 0,
      });
    }
  }, [progress, loadingComplete]);

  useEffect(() => {
    // Initial entrance animations with GSAP
    const tl = gsap.timeline();

    tl.fromTo(
      textRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        progressBarRef.current,
        { width: "0%" },
        { width: "100%", duration: 2, ease: "power2.inOut" },
        "-=0.5"
      )
      .fromTo(
        particlesRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" },
        "-=1.5"
      );
  }, []);

  return (
    <div ref={containerRef} className="loading-container">
      {/* Three.js Background */}
      <div className="loading-3d-background">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ParticleSphere />
          <FloatingShapes />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Jitter-style Video Effect Overlay */}
      <div className="loading-jitter-overlay">
        <div className="jitter-scanline" />
        <div className="jitter-noise" />
        <div className="jitter-glitch" />
      </div>

      {/* Loading Content */}
      <div className="loading-content">
        <div ref={textRef} className="loading-text">
          <div className="loading-logo">
            <img src={collectAILogo} alt="CollectAI" className="h-16 w-auto mb-4" />
            <h1 className="logo-text">CollectAI</h1>
          </div>

          <div className="loading-message">
            <p className="loading-title">Initializing Neural Network</p>
            <p className="loading-subtitle">
              {progress < 30
                ? "Loading AI Models..."
                : progress < 60
                ? "Establishing Secure Connections..."
                : progress < 90
                ? "Optimizing Performance..."
                : "Ready to Launch"}
            </p>
          </div>

          <div className="loading-progress-container">
            <div className="loading-progress-bar">
              <div
                ref={progressBarRef}
                className="loading-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="loading-percentage">{Math.round(progress)}%</div>
          </div>

          <div ref={particlesRef} className="loading-particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="loading-corner-tl" />
      <div className="loading-corner-tr" />
      <div className="loading-corner-bl" />
      <div className="loading-corner-br" />
    </div>
  );
};

export default Loading;