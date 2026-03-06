"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function GridBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawGrid();
        };

        const drawGrid = () => {
            const width = canvas.width;
            const height = canvas.height;
            const size = 60; // Grid cell size

            ctx.clearRect(0, 0, width, height);

            ctx.lineWidth = 1;

            // Draw grid lines
            for (let x = 0; x <= width; x += size) {
                for (let y = 0; y <= height; y += size) {
                    const dx = mouseRef.current.x - x;
                    const dy = mouseRef.current.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Base opacity, gets brighter near mouse
                    let opacity = 0.08;
                    if (dist < 300) {
                        opacity = 0.08 + (1 - dist / 300) * 0.22;
                    }

                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;

                    // Vertical lines
                    if (y === 0) {
                        ctx.beginPath();
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, height);
                        ctx.stroke();
                    }

                    // Horizontal lines
                    if (x === 0) {
                        ctx.beginPath();
                        ctx.moveTo(0, y);
                        ctx.lineTo(width, y);
                        ctx.stroke();
                    }

                    // Intersection small dots (crosses)
                    const dotOpacity = Math.max(0.1, opacity * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${dotOpacity})`;
                    ctx.fillRect(x - 1, y - 1, 3, 3);
                }
            }
        };

        const animate = () => {
            drawGrid();
            animationFrameId = requestAnimationFrame(animate);
        };

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseleave", onMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-0 pointer-events-none"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050507]/50 to-[#050507] z-10" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </motion.div>
    );
}
