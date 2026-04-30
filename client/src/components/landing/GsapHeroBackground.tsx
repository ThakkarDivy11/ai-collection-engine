import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const GsapHeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create floating shapes
    const colors = [
      'rgba(75, 138, 172, 0.1)',  // calypso
      'rgba(59, 130, 246, 0.08)',  // blue
      'rgba(16, 185, 129, 0.06)',  // emerald
      'rgba(245, 158, 11, 0.04)',  // amber
    ];

    // Create multiple floating shapes
    for (let i = 0; i < 15; i++) {
      const shape = document.createElement('div');
      const size = Math.random() * 300 + 100;
      const color = colors[Math.floor(Math.random() * colors.length)];

      shape.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '30%'};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        filter: blur(${Math.random() * 40 + 20}px);
        pointer-events: none;
      `;

      containerRef.current.appendChild(shape);
      shapesRef.current.push(shape);

      // Animate each shape
      gsap.to(shape, {
        x: 'random(-200, 200)',
        y: 'random(-200, 200)',
        scale: 'random(0.8, 1.5)',
        rotation: 'random(-180, 180)',
        duration: 'random(8, 15)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
    }

    // Create gradient animation
    const gradient = document.createElement('div');
    gradient.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 20% 30%, rgba(75, 138, 172, 0.08) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 60%);
      pointer-events: none;
    `;
    containerRef.current.appendChild(gradient);

    // Animate gradient
    gsap.to(gradient, {
      background: 'radial-gradient(ellipse at 30% 40%, rgba(75, 138, 172, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Create floating particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 6 + 2;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(75, 138, 172, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px rgba(75, 138, 172, 0.3);
      `;

      containerRef.current.appendChild(particle);

      // Animate particle
      gsap.to(particle, {
        y: 'random(-100, -300)',
        x: 'random(-50, 50)',
        opacity: 'random(0.2, 0.8)',
        duration: 'random(4, 8)',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: Math.random() * 3,
      });
    }

    // Create grid pattern
    const grid = document.createElement('div');
    grid.style.cssText = `
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(75, 138, 172, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(75, 138, 172, 0.02) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    `;
    containerRef.current.appendChild(grid);

    // Animate grid
    gsap.to(grid, {
      backgroundPosition: '50px 50px',
      duration: 20,
      repeat: -1,
      ease: 'none',
    });

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      shapesRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
      }}
    />
  );
};

export default GsapHeroBackground;