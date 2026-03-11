"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Matter from "matter-js";


const timelineData = [
    {
        id: "exp-new",
        year: "2025",
        role: "Data Science Intern",
        company: "CodeAlpha",
        description: "Learned about multivariate analysis and macroeconomic indicators. Analyzed datasets and built predictive models.",
        category: "Experience"
    },
    {
        id: "exp-1",
        year: "2024",
        role: "Data Science Intern",
        company: "CodeAlpha / Prodigy Infotech",
        description: "Conducted in-depth analysis of Japan's demographic trends and family height data. Developed decision tree classifiers to predict customer purchases and investigated sentiment using social media data on AI. Completed Iris Classification and Unemployment Analysis tasks.",
        category: "Experience"
    },
    {
        id: "exp-2",
        year: "2023 - 2024",
        role: "Data Science Participant",
        company: "Kaggle & Analytics Vidhya",
        description: "Participated in data science competitions, including the Titanic Survival Prediction and Loan Predictions challenges. Built predictive models and honed exploratory data analysis skills in Python.",
        category: "Experience"
    },
    {
        id: "edu-1",
        year: "2022 - 2024",
        role: "Science & Computer Science",
        company: "Kathmandu Model College (High School)",
        description: "Grade: A+. Focused on Physics, Math, and Computer Science.",
        category: "Education"
    },
    {
        id: "edu-2",
        year: "2020 - 2022",
        role: "Secondary Education",
        company: "Galaxy Public School",
        description: "Won a debate competition and participated in various other competitions. Active in debate and speech.",
        category: "Education"
    },
];

export function Resume() {
    // Easter Egg State
    const [anomalyTriggerCount, setAnomalyTriggerCount] = useState(0);
    const [isAnomalyActive, setIsAnomalyActive] = useState(false);
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleNodeClick = (index: number) => {
        if (isAnomalyActive) return;

        // Trigger only on the 3rd node (index 2)
        if (index === 2) {
            setAnomalyTriggerCount(prev => {
                const newCount = prev + 1;
                if (newCount >= 3) {
                    setIsAnomalyActive((current) => {
                        if (!current) {
                            // Gravity failure effect logic continues locally
                        }
                        return true;
                    });
                    return 0;
                }
                return newCount;
            });

            // Reset sequence if not clicked fast enough
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
            resetTimerRef.current = setTimeout(() => setAnomalyTriggerCount(0), 2000);
        } else {
            setAnomalyTriggerCount(0);
        }
    };

    const resetAnomaly = () => {
        setIsAnomalyActive(false);
        setAnomalyTriggerCount(0);
        if (renderRef.current) {
            Matter.Render.stop(renderRef.current);
            renderRef.current.canvas.remove();
        }
        if (engineRef.current) {
            Matter.Engine.clear(engineRef.current);
        }
    };

    useEffect(() => {
        if (!isAnomalyActive || !sceneRef.current) return;

        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create();
        engineRef.current = engine;

        const container = sceneRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const render = Render.create({
            element: container,
            engine: engine,
            options: {
                width,
                height,
                wireframes: false,
                background: "transparent",
            }
        });
        renderRef.current = render;

        // Create boundaries
        const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, { isStatic: true, render: { visible: false } });
        const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true, render: { visible: false } });
        const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true, render: { visible: false } });

        // Create falling resume cards (simulated by invisible physics bodies that sync to DOM)
        // Note: For a true DOM-sync physics we usually need a sync loop, but for a quick easter egg we can just let Matter.js draw basic stylized boxes over the original DOM visually using the renderer, and hide the originals.

        const cardBodies = timelineData.map((item, i) => {
            return Bodies.rectangle(
                width / 2 + (Math.random() * 200 - 100),
                -100 - (i * 200), // Drop from top staggered
                Math.min(width * 0.8, 500),
                200,
                {
                    restitution: 0.6,
                    friction: 0.1,
                    render: {
                        fillStyle: '#111115',
                        strokeStyle: '#333',
                        lineWidth: 1
                    }
                }
            );
        });

        Composite.add(engine.world, [ground, leftWall, rightWall, ...cardBodies]);

        // Add mouse interaction
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            if (render.canvas) render.canvas.remove();
            Engine.clear(engine);
        };
    }, [isAnomalyActive]);

    return (
        <section ref={sceneRef} className="py-24 md:py-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto z-10 relative min-h-screen">
            <div className={`mb-20 transition-opacity duration-1000 ${isAnomalyActive ? 'opacity-0' : 'opacity-100'}`}>
                <h2 className="text-4xl md:text-6xl font-heading tracking-tighter text-white mb-4">
                    Experience & Education
                </h2>
                <p className="text-white/50 text-xl font-mono">My timeline</p>
            </div>

            <AnimatePresence>
                {isAnomalyActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-32 left-1/2 -translate-x-1/2 z-50 text-center"
                    >
                        <div className="px-4 py-1 mb-4 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 font-mono text-xs tracking-widest inline-block animate-pulse">
                            ⚠ GRAVITY FAILURE
                        </div>
                        <br />
                        <button
                            onClick={resetAnomaly}
                            className="px-6 py-2 rounded-md bg-white text-black font-mono text-sm hover:bg-white/80 transition-colors"
                        >
                            RESTORE TIMELINE
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`relative border-l border-white/10 pl-8 md:pl-16 space-y-16 transition-opacity duration-1000 ${isAnomalyActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {timelineData.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                        className="relative group"
                    >
                        {/* Timeline Node */}
                        <div
                            onClick={() => handleNodeClick(i)}
                            className={`absolute -left-10 md:-left-[4.5rem] mt-2 top-0 w-4 h-4 rounded-full border border-white/50 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-crosshair z-20 ${i === 2 && anomalyTriggerCount > 0
                                ? 'bg-red-500 border-red-400 scale-150 shadow-[0_0_20px_rgba(255,0,0,0.8)]'
                                : 'bg-white/20 group-hover:bg-white group-hover:scale-150'
                                }`}
                        />

                        <div className="relative bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-mono text-white/50 mb-1">{item.category}</p>
                                    <h3 className="text-2xl text-white font-heading tracking-tight">{item.role}</h3>
                                    <p className="text-lg text-white/80 font-sans">{item.company}</p>
                                </div>
                                <div className="px-4 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/80 text-sm font-mono whitespace-nowrap">
                                    {item.year}
                                </div>
                            </div>

                            <p className="text-white/60 leading-relaxed max-w-3xl">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
