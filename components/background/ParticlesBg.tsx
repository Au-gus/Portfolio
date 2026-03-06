"use client";

import { useEffect, useRef } from "react";

const SPACING = 40;
const INFLUENCE_RADIUS = 600;

interface VectorParticle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
}

export function ParticlesBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animId: number;
        let particles: VectorParticle[] = [];

        let currentR = 80, currentG = 130, currentB = 255;
        let targetR = 80, targetG = 130, targetB = 255;

        const onTopicChange = (e: Event) => {
            const topic = (e as CustomEvent).detail?.topic || "";
            if (topic.includes("Machine") || topic.includes("YOLO") || topic.includes("Deep Learning")) {
                targetR = 50; targetG = 255; targetB = 150; // Green
            } else if (topic.includes("Python") || topic.includes("Data")) {
                targetR = 255; targetG = 220; targetB = 50; // Yellow
            } else if (topic.includes("Web") || topic.includes("UI") || topic.includes("Development")) {
                targetR = 150; targetG = 50; targetB = 255; // Purple
            } else if (topic.includes("Computer Vision")) {
                targetR = 255; targetG = 60; targetB = 60; // Red
            } else {
                targetR = 80; targetG = 130; targetB = 255; // Default Blue
            }
        };
        window.addEventListener("topicChange", onTopicChange);

        function resize() {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Reinitialize particle grid
            particles = [];
            const cols = Math.ceil(canvas.width / SPACING) + 1;
            const rows = Math.ceil(canvas.height / SPACING) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    // Start with grid, then add significant jitter
                    const jitterX = (Math.random() - 0.5) * SPACING * 2;
                    const jitterY = (Math.random() - 0.5) * SPACING * 2;
                    const x = i * SPACING + jitterX;
                    const y = j * SPACING + jitterY;
                    particles.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0 });
                }
            }
        }
        resize();

        function draw() {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const time = performance.now() * 0.0006;

            currentR += (targetR - currentR) * 0.02;
            currentG += (targetG - currentG) * 0.02;
            currentB += (targetB - currentB) * 0.02;

            ctx.lineWidth = 1.2;

            for (const p of particles) {
                // Gentle spring returning to base grid position
                p.vx += (p.baseX - p.x) * 0.006;
                p.vy += (p.baseY - p.y) * 0.006;

                // Very low friction — lets particles float longer
                p.vx *= 0.96;
                p.vy *= 0.96;

                // Apply velocity
                p.x += p.vx;
                p.y += p.vy;

                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Organic slow pseudo-noise wave field
                const waveX = Math.sin(p.baseX * 0.003 + time) * 0.5;
                const waveY = Math.cos(p.baseY * 0.004 + time) * 0.5;
                let baseAngle = (waveX + waveY) * Math.PI;
                let scale = 1.0;
                let alpha = 0.15; // Brighter default

                // Mouse magnetic influence (Hover)
                if (dist < INFLUENCE_RADIUS && dist > 0) {
                    const influence = Math.pow(1 - dist / INFLUENCE_RADIUS, 2);
                    const mouseAngle = Math.atan2(dy, dx);

                    // Attract physically (black hole — pull inward)
                    // We subtract because (dx, dy) points FROM mouse TO particle
                    p.vx -= Math.cos(mouseAngle) * influence * 1.2;
                    p.vy -= Math.sin(mouseAngle) * influence * 1.2;

                    // Push angle to follow mouse direction visually
                    baseAngle += mouseAngle * influence * 0.8;

                    // Stay a bit larger overall but still compress somewhat near the singularity
                    scale = 1.3 - influence * 0.6;
                    if (scale < 0.6) scale = 0.6;
                    alpha = 0.2 + influence * 0.75;
                }

                // Occasional random blinking element 
                const blink = Math.sin(p.baseX * 0.05 + time * 2) * Math.cos(p.baseY * 0.05 - time * 2);
                if (blink > 0.96 && dist > INFLUENCE_RADIUS) {
                    alpha = 0.35;
                    scale = 1.2;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(baseAngle);
                ctx.scale(scale, scale);

                // Color shifts slightly from base target based on position
                const r = Math.floor(currentR);
                const g = Math.floor(currentG + Math.sin(p.baseX * 0.001) * 40);
                const b = Math.floor(currentB);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

                // Draw minimalist cross / vector symbol (bigger arms)
                ctx.beginPath();
                ctx.moveTo(-5, 0);
                ctx.lineTo(5, 0);
                ctx.moveTo(0, -5);
                ctx.lineTo(0, 5);
                ctx.stroke();

                ctx.restore();
            }

            animId = requestAnimationFrame(draw);
        }

        const onMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const onLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };

        const onClick = (e: MouseEvent) => {
            const cx = e.clientX;
            const cy = e.clientY;
            for (const p of particles) {
                const dx = p.x - cx;
                const dy = p.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200 && dist > 0) {
                    // Gentler explosion force
                    const force = Math.pow(1 - dist / 200, 2) * 10;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
            }
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseleave", onLeave);
        window.addEventListener("click", onClick);
        window.addEventListener("resize", resize);

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
            window.removeEventListener("click", onClick);
            window.removeEventListener("resize", resize);
            window.removeEventListener("topicChange", onTopicChange);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
