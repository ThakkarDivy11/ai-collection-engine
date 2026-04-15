import React, { useEffect, useRef } from "react";

export default function AnimatedBackground({ bg }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let blobs = [];
        let animationFrameId;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        // Create blobs
        for (let i = 0; i < 5; i++) {
            const hues = [140, 200, 270]; // Green, Blue, Purple
            const hue = hues[Math.floor(Math.random() * hues.length)] + (Math.random() * 20 - 10);
            blobs.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: 300 + Math.random() * 300,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                color: `hsla(${hue}, 80%, 55%, 0.3)`
            });
        }

        function animate() {
            if (!ctx) return;
            // Fill background entirely via canvas to avoid static CSS background colors
            ctx.fillStyle = bg || '#090b14';
            ctx.fillRect(0, 0, width, height);

            blobs.forEach((b) => {
                b.x += b.dx;
                b.y += b.dy;

                if (b.x < 0 || b.x > width) b.dx *= -1;
                if (b.y < 0 || b.y > height) b.dy *= -1;

                const gradient = ctx.createRadialGradient(
                    b.x,
                    b.y,
                    0,
                    b.x,
                    b.y,
                    b.r
                );

                gradient.addColorStop(0, b.color);
                gradient.addColorStop(1, "transparent");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [bg]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -10,
                pointerEvents: "none"
            }}
        />
    );
}
