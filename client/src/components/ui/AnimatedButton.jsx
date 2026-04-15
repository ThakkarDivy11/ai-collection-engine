import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AnimatedButton = ({
    text,
    children,
    href,
    onClick,
    className,
}) => {
    const Component = href ? "a" : "button";

    return (
        <Component
            href={href}
            onClick={onClick}
            className={cn(
                "group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-medium text-slate-900 backdrop-blur-xl transition-all duration-500 ease-out hover:text-white active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]",
                className
            )}
        >
            {/* The Purple Blob: Slides from bottom-left to top-right on hover */}
            <span className="absolute bottom-0 left-0 w-0 h-0 transition-all duration-500 ease-out bg-purple-600 group-hover:w-full group-hover:h-[400%] -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:-translate-y-1/2 rotate-45 blur-[40px] opacity-0 group-hover:opacity-100"></span>

            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-2">
                {children || text || "Animation Button"}
            </span>
        </Component>
    );
};

export { AnimatedButton };
