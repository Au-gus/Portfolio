"use client";

import { useEffect, useRef } from "react";

const SPACING = 25;
const INFLUENCE_RADIUS = 600;

interface SpaceParticle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    type: 'star' | 'planet' | 'dust';
    size: number;
    twinkleSpeed: number;
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
        let particles: SpaceParticle[] = [];

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

                    const rand = Math.random();
                    let type: 'star' | 'planet' | 'dust' = 'dust';
                    let size = Math.random() * 1.5 + 0.5;
                    let twinkleSpeed = 0;

                    if (rand > 0.98) {
                        type = 'planet';
                        size = Math.random() * 3 + 2.5; // Planets are slightly larger
                    } else if (rand > 0.60) {
                        type = 'star';
                        size = Math.random() * 1.5 + 1;
                        twinkleSpeed = Math.random() * 0.05 + 0.02; // Random speed for twinkling
                    }

                    particles.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0, type, size, twinkleSpeed });
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

                const waveX = Math.sin(p.baseX * 0.003 + time) * 0.5;
                const waveY = Math.cos(p.baseY * 0.004 + time) * 0.5;

                let scale = p.size;
                let alpha = 0.3;

                // Base alphas according to celestial typing
                if (p.type === 'star') {
                    // Stars twinkle (fade in and out rapidly)
                    alpha = 0.2 + (Math.sin(time * 15 * p.twinkleSpeed + p.baseX * 0.1) * 0.5 + 0.5) * 0.6;
                } else if (p.type === 'planet') {
                    // Planets have a solid, steady glow
                    alpha = 0.8;
                } else {
                    // Dust is faint and just floats
                    alpha = 0.15;
                }

                // Mouse magnetic influence (Hover)
                if (dist < INFLUENCE_RADIUS && dist > 0) {
                    const influence = Math.pow(1 - dist / INFLUENCE_RADIUS, 2);
                    const mouseAngle = Math.atan2(dy, dx);

                    // Attract physically (black hole — pull inward)
                    p.vx -= Math.cos(mouseAngle) * influence * 1.2;
                    p.vy -= Math.sin(mouseAngle) * influence * 1.2;

                    // Hover effects on visual size & brightness
                    scale = (p.size * 1.5) - influence * 0.5;
                    if (scale < p.size * 0.5) scale = p.size * 0.5;
                    alpha = Math.min(1, alpha + influence * 0.6);
                }

                // Color shifts slightly from base target based on position
                const r = Math.floor(currentR);
                const g = Math.floor(currentG + Math.sin(p.baseX * 0.001) * 40);
                const b = Math.floor(currentB);

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

                // Draw perfect circular stars/dust
                ctx.beginPath();
                ctx.arc(p.x, p.y, scale, 0, Math.PI * 2);
                ctx.fill();
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
