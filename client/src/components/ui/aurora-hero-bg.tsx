"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

interface AuroraHeroProps {
    className?: string;
    children?: React.ReactNode;
}

export function AuroraHero({
    className,
    children,
}: AuroraHeroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDark, setIsDark] = React.useState(false);
    const mouse = useRef({ x: 0, y: 0, active: false });

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let dots: { x: number; y: number; originX: number; originY: number; phase: number }[] = [];
        const spacing = 35;

        const init = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            dots = [];
            for (let x = spacing / 2; x < canvas.width; x += spacing) {
                for (let y = spacing / 2; y < canvas.height; y += spacing) {
                    dots.push({ 
                        x, 
                        y, 
                        originX: x, 
                        originY: y,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }
        };

        const render = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            dots.forEach(dot => {
                const dx = mouse.current.x - dot.originX;
                const dy = mouse.current.y - dot.originY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 200;
                
                // Base pulsing animation
                const pulse = Math.sin(time * 0.002 + dot.phase) * 0.3 + 0.7;
                let size = 1.2 * pulse;
                
                // Adjust colors based on theme
                const dotColor = isDark ? "45, 132, 202" : "28, 97, 160";
                let color = `rgba(${dotColor}, ${0.1 * pulse})`;
                
                if (mouse.current.active && dist < maxDist) {
                    const ratio = 1 - dist / maxDist;
                    size = (1.5 + ratio * 4) * pulse;
                    color = `rgba(${dotColor}, ${0.2 + ratio * 0.8})`;
                    
                    // Subtle push effect
                    dot.x = dot.originX + (dx / dist) * ratio * 8;
                    dot.y = dot.originY + (dy / dist) * ratio * 8;
                } else {
                    dot.x = dot.originX;
                    dot.y = dot.originY;
                }

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouse.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true
            };
        };

        const handleMouseLeave = () => {
            mouse.current.active = false;
        };

        const resizeObserver = new ResizeObserver(() => init());
        resizeObserver.observe(container);

        init();
        requestAnimationFrame(render);

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            resizeObserver.disconnect();
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDark]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full overflow-hidden transition-colors duration-500",
                isDark ? "bg-[#0a0f1a]" : "bg-white",
                className
            )}
        >
            {/* Dot Matrix Interactive Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-auto opacity-80"
                style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
            />

            {/* Vignette Overlay */}
            <div
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,15,26,0.5)_100%)]"
                aria-hidden="true"
            />

            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}
