"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

// --- Main Hero Component ---
export const GravitationalMeshHero = () => {
    const textControls = useAnimation();

    useEffect(() => {
        textControls.start(i => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05 + 1.5,
                duration: 1.2,
                ease: [0.2, 0.65, 0.3, 0.9]
            }
        }));
    }, [textControls]);

    const headline = "Retrying Digital";

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black text-slate-900 dark:text-white">
            <MeshCanvas />
            <div className="relative z-10 text-center px-4">
                <h1 className="text-6xl font-bold tracking-tight md:text-8xl" style={{ textShadow: '0 0 50px rgba(0, 0, 0, 0.1)' }}>
                    {headline.split("").map((char, i) => (
                        <motion.span key={i} custom={i} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block' }}>
                            {char}
                        </motion.span>
                    ))}
                </h1>
                <motion.p
                    custom={headline.length}
                    initial={{ opacity: 0, y: 30 }}
                    animate={textControls}
                    className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300"
                >
                    “Let’s keep that cinematic backdrop energy, but move the mouse ‘vibe’ for something with a ‘Reteyinh burn’ intensity.”
                </motion.p>
            </div>
        </div>
    );
};

// --- Three.js Canvas Component ---
export const MeshCanvas = ({ color }: { color?: number }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        const mouse = new THREE.Vector2(0, 0);
        const clock = new THREE.Clock();

        const isDarkMode = document.documentElement.classList.contains('dark');
        const defaultColor = color || (isDarkMode ? 0xa0a0ff : 0x404080);

        // --- Gravitational Mesh ---
        const geometry = new THREE.PlaneGeometry(50, 50, 64, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uColor: { value: new THREE.Color(defaultColor) }
            },
            vertexShader: `
            uniform float uTime;
            uniform vec2 uMouse;
            varying float vIntensity;

            void main() {
                vec3 pos = position;
                
                // Localized distortion near mouse
                vec2 mousePos = uMouse * 25.0;
                float dist = distance(pos.xy, mousePos);
                float influence = 1.0 - smoothstep(0.0, 10.0, dist);
                
                pos.z += influence * 6.0;
                vIntensity = influence;

                // Ambient wave
                pos.z += sin(pos.x * 0.4 + uTime * 0.5) * 0.15;
                pos.z += cos(pos.y * 0.4 + uTime * 0.5) * 0.15;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
            fragmentShader: `
            uniform vec3 uColor;
            varying float vIntensity;
            void main() {
                vec3 finalColor = mix(uColor * 0.5, uColor * 1.5, vIntensity);
                gl_FragColor = vec4(finalColor, 0.4 + vIntensity * 0.4);
            }
        `,
            wireframe: true,
            transparent: true,
            blending: isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI * 0.35; // Deeper tilt for more "heroic" perspective
        mesh.position.y = -5; // Move down slightly to anchor it to bottom
        scene.add(mesh);

        const handleMouseMove = (event: MouseEvent) => {
            const rect = mountRef.current?.getBoundingClientRect();
            if (rect) {
                // Precise coordinate mapping within the container
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                mouse.set(x, y);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            material.uniforms.uTime.value = elapsedTime;

            // Slower, smoother lerp for more "intentional" feel
            material.uniforms.uMouse.value.lerp(mouse, 0.04);

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [color]);

    return <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none" />;
};
