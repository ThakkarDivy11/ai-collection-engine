"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface AuroraHeroProps {
    className?: string;
    children?: React.ReactNode;
}

export function AuroraHero({
    className,
    children,
}: AuroraHeroProps) {
    return (
        <div
            className={cn(
                "relative w-full overflow-hidden bg-slate-950",
                className
            )}
        >
            {/* Unique Cinematic Background */}
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                {/* Dark Base */}
                <div className="absolute inset-0 bg-[#0a0f1a]" />
                
                {/* Perspective Grid */}
                <div 
                    className="absolute inset-0 opacity-[0.15]" 
                    style={{
                        backgroundImage: `linear-gradient(#4b8aac 1px, transparent 1px), linear-gradient(90deg, #4b8aac 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)',
                        transformOrigin: 'top',
                    }}
                />

                {/* Pulsing Light Beams */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-calypso-500 to-transparent opacity-50"
                    animate={{
                        top: ["0%", "100%", "0%"],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                
                <motion.div
                    className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-transparent via-calypso-400/30 to-transparent"
                    animate={{
                        left: ["25%", "75%", "25%"],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Soft Glow Hubs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-calypso-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Vignette Overlay */}
            <div
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,15,26,0.8)_100%)]"
                aria-hidden="true"
            />

            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}
