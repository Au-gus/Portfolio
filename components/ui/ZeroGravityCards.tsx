"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { Project } from "@/data/projects";
import { motion } from "framer-motion";
import Link from "next/link";
import { ImageLoader } from "@/components/ui/ImageLoader";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

export function ZeroGravityCards({ projects }: { projects: Project[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderLoopRef = useRef<number | null>(null);

    // Array of refs for each DOM card to measure their initial positions
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [isZeroG, setIsZeroG] = useState(false);
    const [bodies, setBodies] = useState<Matter.Body[]>([]);

    useEffect(() => {
        // Start the zero-g transition after 1.5 seconds
        const timer = setTimeout(() => {
            initPhysics();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const initPhysics = () => {
        if (!containerRef.current) return;

        // Setup Matter.js Engine
        const engine = Matter.Engine.create({
            gravity: { x: 0, y: 0, scale: 0 }
        });
        engineRef.current = engine;

        // Use document dimensions to account for scrolling
        const w = document.documentElement.scrollWidth;
        const h = document.documentElement.scrollHeight;

        // Boundaries matching the FULL ENTIRE PAGE edges so they don't get trapped in the current visible window
        const wallOptions = {
            isStatic: true,
            restitution: 0.9,
            friction: 0,
            frictionStatic: 0,
            render: { visible: false }
        };

        const ground = Matter.Bodies.rectangle(w / 2, h + 50, w + 200, 100, wallOptions);
        const ceiling = Matter.Bodies.rectangle(w / 2, -50, w + 200, 100, wallOptions);
        const leftWall = Matter.Bodies.rectangle(-50, h / 2, 100, h + 200, wallOptions);
        const rightWall = Matter.Bodies.rectangle(w + 50, h / 2, 100, h + 200, wallOptions);

        Matter.World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

        // Map DOM elements to Physics Bodies
        const newBodies: Matter.Body[] = [];

        cardRefs.current.forEach((el, index) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();

            // Lock dimensions imperatively to avoid React render loop issues reading offsetWidth
            el.style.width = `${rect.width}px`;
            el.style.height = `${rect.height}px`;
            el.style.margin = "0px";

            // Use absolute page coordinates by adding scroll offsets
            let cx = rect.left + window.scrollX + rect.width / 2;
            let cy = rect.top + window.scrollY + rect.height / 2;

            if (cy > h - rect.height / 2) cy = h - rect.height / 2 - 20;
            if (cy < rect.height / 2) cy = rect.height / 2 + 20;
            if (cx > w - rect.width / 2) cx = w - rect.width / 2 - 20;
            if (cx < rect.width / 2) cx = rect.width / 2 + 20;

            const body = Matter.Bodies.rectangle(cx, cy, rect.width, rect.height, {
                restitution: 0.2, // Low bounciness
                frictionAir: 0.06, // High air friction for fluid, heavy drag
                friction: 0.01,
                density: 0.0002,
                slop: 0.05,
                chamfer: { radius: 32 }
            });

            // Store the initial sizes / index AND the original layout target
            (body as any).cardIndex = index;
            (body as any).w = rect.width;
            (body as any).h = rect.height;
            (body as any).startX = cx;
            (body as any).startY = cy;

            // Give them a very subtle outward bloom initially
            Matter.Body.setVelocity(body, {
                x: (cx - w / 2) * 0.005,
                y: (cy - h / 2) * 0.005
            });
            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.005);

            newBodies.push(body);
            Matter.World.add(engine.world, body);
        });

        setBodies(newBodies);
        setIsZeroG(true);

        const mouseRef = { x: -1000, y: -1000 };

        // Setup Physics Event Loop for Custom Forces
        Matter.Events.on(engine, 'beforeUpdate', () => {
            newBodies.forEach(b => {
                // 1. The Attractor (Tether): Pull back to original grid spot
                const targetX = (b as any).startX;
                const targetY = (b as any).startY;
                const dxHome = targetX - b.position.x;
                const dyHome = targetY - b.position.y;

                // F = -kx (Spring Force)
                const stiffness = 0.00005; // Low stiffness value
                Matter.Body.applyForce(b, b.position, {
                    x: dxHome * stiffness,
                    y: dyHome * stiffness
                });

                // Very slowly zero out rotation so they return upright
                if (Math.abs(b.angle) > 0.01) {
                    Matter.Body.setAngularVelocity(b, b.angularVelocity * 0.95 - b.angle * 0.002);
                }

                // 2. The Repulsor (Mouse)
                if (mouseRef.x > -1000) {
                    const dxMouse = b.position.x - mouseRef.x;
                    const dyMouse = b.position.y - mouseRef.y;
                    const distScore = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                    if (distScore < 250 && distScore > 0) {
                        // Repulsive force gets stronger as distance approaches 0
                        const forceMagnitude = Math.pow(1 - distScore / 250, 2) * 0.005;
                        const dirX = dxMouse / distScore;
                        const dirY = dyMouse / distScore;

                        Matter.Body.applyForce(b, b.position, {
                            x: dirX * forceMagnitude,
                            y: dirY * forceMagnitude
                        });
                    }
                }
            });
        });

        // DOM Sync Loop via requestAnimationFrame
        const update = () => {
            Matter.Engine.update(engine, 1000 / 60);

            // Sync DOM elements to Matter.js bodies
            newBodies.forEach(b => {
                const el = cardRefs.current[(b as any).cardIndex];
                if (el) {
                    const x = b.position.x - (b as any).w / 2;
                    const y = b.position.y - (b as any).h / 2;
                    el.style.transform = `translate(${x}px, ${y}px) rotate(${b.angle}rad)`;
                }
            });

            renderLoopRef.current = requestAnimationFrame(update);
        };
        update();

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.x = e.clientX + window.scrollX;
            mouseRef.y = e.clientY + window.scrollY;
        };

        const onMouseLeave = () => {
            mouseRef.x = -1000;
            mouseRef.y = -1000;
        };

        window.addEventListener("mousemove", onMouseMove);
        window.document.addEventListener("mouseleave", onMouseLeave);

        return () => {
            if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
            window.removeEventListener("mousemove", onMouseMove);
            window.document.removeEventListener("mouseleave", onMouseLeave);
            Matter.Events.off(engine, 'beforeUpdate');
            Matter.Engine.clear(engine);
        };
    };

    // Tethering interaction: Click to increase mass and attract to center temporarily
    const handleCardDragStart = (e: React.MouseEvent, bodyIndex: number) => {
        if (!isZeroG) return;
        const engine = engineRef.current;
        if (!engine) return;

        const body = bodies[bodyIndex];
        if (!body) return;

        // Briefly spike mass to act as anchor
        Matter.Body.setMass(body, body.mass * 20);

        // Pull it towards the visible viewport center
        const centerX = window.scrollX + window.innerWidth / 2;
        const centerY = window.scrollY + window.innerHeight / 2;

        Matter.Body.applyForce(body, body.position, {
            x: (centerX - body.position.x) * 0.0005,
            y: (centerY - body.position.y) * 0.0005
        });

        // Push others away violently
        bodies.forEach(b => {
            if (b !== body) {
                const dx = b.position.x - centerX;
                const dy = b.position.y - centerY;
                Matter.Body.applyForce(b, b.position, {
                    x: (dx > 0 ? 1 : -1) * 0.005,
                    y: (dy > 0 ? 1 : -1) * 0.005
                });
            }
        });

        setTimeout(() => {
            Matter.Body.setMass(body, body.mass / 20);
        }, 1000);
    };


    return (
        <div
            ref={containerRef}
            // By NOT using fixed inset-0, we preserve the document scroll behavior
            className={`max-w-7xl mx-auto relative z-10 ${isZeroG ? 'min-h-[1200px]' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}
        >
            {projects.map((project, i) => (
                <div
                    key={project.id}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    onMouseDown={(e) => handleCardDragStart(e, i)}
                    className={`
                        group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm h-[300px]
                        ${isZeroG ? 'absolute left-0 top-0 m-0 cursor-grab active:cursor-grabbing pointer-events-auto will-change-transform' : 'w-full'}
                    `}
                >
                    <Link href={`/project/${project.id}`} className="absolute inset-0 z-20" draggable={false}>
                        <span className="sr-only">View {project.title}</span>
                    </Link>

                    <ImageLoader
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover opacity-50 group-hover:opacity-90 transition-opacity duration-700 group-hover:scale-105 pointer-events-none"
                        wrapperClassName="absolute inset-0 z-0 pointer-events-none"
                    />

                    {/* Tags */}
                    <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
                        {project.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-white/60 text-xs font-mono backdrop-blur-md">
                                {tag}
                            </span>
                        ))}
                        {project.featured && (
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono backdrop-blur-md">
                                Featured
                            </span>
                        )}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-between items-end z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                        <div className="flex-1 pr-4">
                            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">{project.category}</p>
                            <h3 className="text-xl text-white font-heading tracking-tight mb-1">{project.title}</h3>
                            <p className="text-xs text-white/50 font-mono">{project.platform}</p>
                        </div>
                        <MagneticWrapper>
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md text-white text-sm group-hover:bg-white group-hover:text-black transition-colors shrink-0 pointer-events-auto">
                                ↗
                            </div>
                        </MagneticWrapper>
                    </div>
                </div>
            ))}
        </div>
    );
}
