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
    const mouse = useRef({ x: 0, y: 0, active: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let dots: { x: number; y: number; originX: number; originY: number }[] = [];
        const spacing = 35;

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            dots = [];
            for (let x = spacing / 2; x < canvas.width; x += spacing) {
                for (let y = spacing / 2; y < canvas.height; y += spacing) {
                    dots.push({ x, y, originX: x, originY: y });
                }
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            dots.forEach(dot => {
                const dx = mouse.current.x - dot.originX;
                const dy = mouse.current.y - dot.originY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 200;
                
                let size = 1.5;
                let color = "rgba(45, 132, 202, 0.2)";
                
                if (mouse.current.active && dist < maxDist) {
                    const ratio = 1 - dist / maxDist;
                    size = 1.5 + ratio * 4;
                    color = `rgba(45, 132, 202, ${0.2 + ratio * 0.8})`;
                    
                    // Subtle push effect
                    dot.x = dot.originX + (dx / dist) * ratio * 5;
                    dot.y = dot.originY + (dy / dist) * ratio * 5;
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
            const rect = canvas.getBoundingClientRect();
            mouse.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true
            };
        };

        const handleMouseLeave = () => {
            mouse.current.active = false;
        };

        window.addEventListener("resize", init);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        init();
        render();

        return () => {
            window.removeEventListener("resize", init);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full overflow-hidden bg-[#0a0f1a]",
                className
            )}
        >
            {/* Dot Matrix Interactive Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-auto opacity-80"
                style={{ mixBlendMode: 'screen' }}
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
