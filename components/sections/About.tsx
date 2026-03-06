"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { TypewriterText } from "@/components/ui/TypewriterText";


const cyclingSkills = [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "YOLO",
    "Exploratory Data Analysis",
    "Web Design",
    "UI/UX",
    "Front‑End Development",
    "Back‑End Development",
];

export function About() {
    const [skillIndex, setSkillIndex] = useState(0);

    // Easter Egg State
    const [isHovering, setIsHovering] = useState(false);
    const [isOverloading, setIsOverloading] = useState(false);
    const [cycleSpeed, setCycleSpeed] = useState(2200); // ms

    const hoverTimer = useRef<NodeJS.Timeout | null>(null);
    const overloadTimeout = useRef<NodeJS.Timeout | null>(null);

    // Normal + Speed-up cycler
    useEffect(() => {
        if (isOverloading) return; // Handled separately during overload climax

        const interval = setInterval(() => {
            setSkillIndex((i) => {
                const newIndex = (i + 1) % cyclingSkills.length;
                window.dispatchEvent(new CustomEvent("topicChange", { detail: { topic: cyclingSkills[newIndex] } }));
                return newIndex;
            });
        }, cycleSpeed);

        return () => clearInterval(interval);
    }, [cycleSpeed, isOverloading]);

    // Hover logic to trigger Easter Egg
    useEffect(() => {
        if (isHovering && !isOverloading) {
            // Speed up exponentially after a short delay
            hoverTimer.current = setTimeout(() => {
                let speed = 2200;
                const speedUpInterval = setInterval(() => {
                    speed = Math.max(50, speed * 0.7); // Accelerate
                    setCycleSpeed(speed);

                    if (speed <= 50) {
                        clearInterval(speedUpInterval);
                        setIsOverloading(true);
                        setSkillIndex(-1); // Secret index

                        // Reset after showing secret
                        overloadTimeout.current = setTimeout(() => {
                            setIsOverloading(false);
                            setCycleSpeed(2200);
                            setSkillIndex(0);
                            setIsHovering(false);
                        }, 4000);
                    }
                }, 200);

                return () => clearInterval(speedUpInterval);
            }, 1000);
        } else {
            // Reset if mouse leaves early
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
            if (!isOverloading) {
                setCycleSpeed(2200);
            }
        }

        return () => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
        };
    }, [isHovering, isOverloading]);

    const scrollToProjects = () => {
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section className="py-32 px-4 md:px-16 z-10 relative">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* Left: Cycling title + description */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* ABOUT ME label */}
                    <h2 className="text-xl font-heading text-white/50 mb-6 tracking-widest uppercase">
                        About Me
                    </h2>

                    {/* Animated cycling skill title */}
                    <div
                        className="flex flex-wrap items-baseline gap-3 mb-10 overflow-visible pb-2 min-h-[4rem] cursor-help"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <AnimatePresence mode="popLayout">
                            {isOverloading ? (
                                <motion.div
                                    key="easter-egg-skill"
                                    initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                    className="text-4xl md:text-5xl font-mono font-black tracking-tighter text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]"
                                >
                                    MASTER OF EASTER EGGS
                                </motion.div>
                            ) : (
                                <TypewriterText
                                    key={skillIndex}
                                    text={cyclingSkills[skillIndex] || ""}
                                    className="text-4xl md:text-5xl font-mono tracking-tighter text-white whitespace-pre-wrap"
                                    delay={cycleSpeed < 200 ? 0 : undefined} // remove delay when spinning fast
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6 text-white/70 text-lg leading-relaxed font-sans max-w-2xl">
                        <p>
                            I&apos;m Faceless Ancient, a scholarly explorer at the intersection of machine intelligence, visual perception, and elegant web craftsmanship. My foundation spans Python, C, C++, JavaScript, and CSS, enabling me to prototype algorithms and sculpt interactive experiences alike.
                        </p>
                        <p>
                            My technical repertoire includes Machine Learning, Deep Learning, Natural Language Processing, Computer Vision, and YOLO—each explored primarily at a conceptual level—paired with rigorous Exploratory Data Analysis. I also dabble in front‑end development, UI/UX fundamentals, and back‑end engineering, weaving these strands into cohesive digital narratives.
                        </p>
                        <p>
                            Beyond code, I am driven by curiosity and a commitment to share knowledge, whether through talks, open‑source contributions, or mentoring peers. I continuously seek new challenges that blend theory with tangible design, aiming to turn abstract ideas into polished, high‑impact applications.
                        </p>
                    </div>

                    <div className="mt-12">
                        <MagneticWrapper>
                            <button
                                onClick={scrollToProjects}
                                className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 font-mono text-sm tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                Explore Projects ↗
                            </button>
                        </MagneticWrapper>
                    </div>
                </motion.div>

                {/* Right: Stats / Quick facts */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                    className="flex flex-col gap-6"
                >
                    {[
                        { label: "Focus Areas", value: "Data Science · ML · Full-Stack Web" },
                        { label: "Current Status", value: "CS Major · Building & Learning" },
                        { label: "Based in", value: "Nepal" },
                        { label: "Languages", value: "Python · TypeScript · JavaScript" },
                        { label: "Interests", value: "Algorithms · Visual Storytelling · Open Source" },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i + 0.2, duration: 0.5 }}
                            className="border-b border-white/10 pb-6"
                        >
                            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{item.label}</p>
                            <p className="text-white font-sans text-lg">{item.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
