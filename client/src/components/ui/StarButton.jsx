import React from "react"
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const StarButton = React.forwardRef(({ className, children, duration = 6, starColor, href, text, ...props }, ref) => {
    // Basic theme detection for client project (usually dark by default in this context)
    const isClient = typeof window !== 'undefined';
    const resolvedTheme = isClient && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

    const defaultStarColor = resolvedTheme === "dark" ? "#ffffff" : "#ff0000";
    const finalStarColor = starColor || defaultStarColor;

    const content = (
        <>
            {/* The Star animation layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl">
                <div
                    className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full animate-star-btn blur-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        offsetPath: "rect(0% 100% 100% 0% round 12px)",
                        background: finalStarColor,
                        boxShadow: `0 0 15px ${finalStarColor}, 0 0 30px ${finalStarColor}, 0 0 45px ${finalStarColor}`
                    }}
                />
            </div>

            <div className="relative z-10 flex items-center justify-center gap-2">
                {text || children}
            </div>
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                className={cn(
                    "group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-xl transition-all duration-500 ease-out hover:bg-white/10 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]",
                    className
                )}
                style={{ "--duration": duration }}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            ref={ref}
            className={cn(
                "group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-xl transition-all duration-500 ease-out hover:bg-white/10 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]",
                className
            )}
            style={{ "--duration": duration }}
            {...props}
        >
            {content}
        </button>
    )
}
)

StarButton.displayName = "StarButton"
