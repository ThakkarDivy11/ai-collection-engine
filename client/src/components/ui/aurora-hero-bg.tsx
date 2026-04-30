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
            {/* Aurora Gradient Background - Customized for Calypso Theme */}
            <div className="absolute inset-0 overflow-hidden opacity-60 dark:opacity-90" aria-hidden="true">
                <motion.div
                    className="absolute inset-[-100%]"
                    style={{
                        background: `
              repeating-linear-gradient(100deg, 
                #4b8aac 10%, 
                #6ea5c2 15%, 
                #1a2a37 20%, 
                #4b8aac 25%, 
                #6ea5c2 30%)
            `,
                        backgroundSize: "300% 100%",
                        filter: "blur(100px)",
                    }}
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute inset-[-10px]"
                    style={{
                        background: `
              repeating-linear-gradient(100deg, 
                rgba(75, 138, 172, 0.1) 0%, 
                rgba(75, 138, 172, 0.1) 7%, 
                transparent 10%, 
                transparent 12%, 
                rgba(75, 138, 172, 0.1) 16%),
              repeating-linear-gradient(100deg, 
                #4b8aac 10%, 
                #6ea5c2 15%, 
                #2dd4bf 20%, 
                #4b8aac 25%, 
                #6ea5c2 30%)
            `,
                        backgroundSize: "200%, 100%",
                        backgroundPosition: "50% 50%, 50% 50%",
                        mixBlendMode: "overlay",
                    }}
                    animate={{
                        backgroundPosition: [
                            "50% 50%, 50% 50%",
                            "100% 50%, 150% 50%",
                            "50% 50%, 50% 50%",
                        ],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* Vignette Overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse at center, transparent 0%, rgba(3, 3, 3, 0.7) 100%)",
                }}
                aria-hidden="true"
            />

            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}
