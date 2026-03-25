"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { TypewriterText } from "@/components/ui/TypewriterText";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";


export function Hero() {
    // Easter Egg State
    const [clickCount, setClickCount] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);
    const clickResetTimer = useRef<NodeJS.Timeout | null>(null);

    const handleProfileClick = () => {
        if (isGlitching) return;
        setClickCount(prev => prev + 1);

        if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
        clickResetTimer.current = setTimeout(() => setClickCount(0), 1000); // 1s window

        if (clickCount >= 4) { // 5th click triggers it
            setIsGlitching(true);
            setClickCount(0);
            setTimeout(() => {
                setIsGlitching(false);
            }, 4000); // gltich lasts 4s
        }
    };

    return (
        <section className="min-h-[100svh] flex items-center px-4 sm:px-6 md:px-12 lg:px-20 pt-20 pb-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto w-full flex flex-row gap-3 sm:gap-6 md:gap-10 items-center justify-between z-10">

                {/* ── Left text ── */}
                <div className="flex flex-col gap-1.5 md:gap-3 flex-1 min-w-0">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-2"
                    >
                        {/* Headline */}
                        <TypewriterText
                            text="Creative Developer"
                            className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-heading tracking-tighter text-white leading-tight"
                        />

                        {/* Greeting */}
                        <TypewriterText
                            text={["Hi! I am Austin Karki,", "Data Scientist & Developer..."]}
                            className="text-lg md:text-2xl lg:text-3xl font-mono text-white leading-snug"
                            delay={1.5}
                        />

                        {/* Subtitle */}
                        <TypewriterText
                            text="Computer Science Major."
                            className="text-sm md:text-base text-blue-400 font-sans tracking-wide"
                            delay={3.0}
                        />

                        {/* Body */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 4.0, duration: 1 }}
                            className="mt-2 text-[13px] sm:text-sm md:text-base text-white/55 max-w-sm leading-relaxed"
                        >
                            Specializing in high-end digital experiences — blending machine intelligence with aesthetic, modern web development.
                        </motion.p>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 4.6, duration: 0.7 }}
                        className="mt-4"
                    >
                        <MagneticWrapper>
                            <button
                                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                                className="relative group px-7 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all duration-500 text-white text-sm font-mono tracking-wide"
                            >
                                <span className="absolute -inset-1 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse blur-lg transition-all duration-500 -z-10" />
                                Explore Work ↓
                            </button>
                        </MagneticWrapper>
                    </motion.div>
                </div>

                {/* ── Right — Profile circle ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="relative flex justify-center items-center flex-col shrink-0 ml-4 md:ml-0"
                >
                    {/* Subtle outer glow ring (Speeds up dramatically during glitch) */}
                    <div
                        className={`absolute w-[110%] h-[110%] rounded-full border border-blue-500/10 ${isGlitching ? 'animate-spin border-red-500/40 shadow-[0_0_50px_rgba(255,0,0,0.3)]' : 'animate-spin'}`}
                        style={{ animationDuration: isGlitching ? "0.2s" : "20s" }}
                    />

                    {/* Profile Container */}
                    <div
                        onClick={handleProfileClick}
                        className={`relative w-24 h-24 sm:w-32 sm:h-32 md:w-80 md:h-80 xl:w-[26rem] xl:h-[26rem] rounded-full overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-xl cursor-pointer transition-all duration-150 ${isGlitching ? 'bg-red-900/40 scale-105' : 'bg-black/40'}`}
                        style={isGlitching ? {
                            filter: "hue-rotate(90deg) contrast(150%) brightness(120%)",
                            boxShadow: "0 0 80px rgba(255,0,0,0.6), inset 0 0 40px rgba(0,255,255,0.4)"
                        } : {}}
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent z-10 pointer-events-none" />

                        <motion.div
                            animate={isGlitching ? {
                                x: [-5, 5, -10, 10, -5, 5],
                                y: [2, -2, 5, -5, 2, -2],
                                scale: [1, 1.05, 0.95, 1.1, 1],
                                opacity: [1, 0.8, 1, 0.6, 1]
                            } : {}}
                            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
                            className="w-full h-full relative"
                        >
                            <Image
                                src="/images/photo.jpg"
                                alt="Austin Karki"
                                fill
                                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 320px"
                                className={`object-cover transition-opacity duration-700 ${isGlitching ? 'opacity-100 mix-blend-difference' : 'opacity-90 hover:opacity-100'}`}
                                priority
                            />
                        </motion.div>

                        {/* Easter Egg Matrix Rain inside the circle */}
                        <AnimatePresence>
                            {isGlitching && (
                                <div className="absolute inset-0 z-20 flex flex-wrap justify-center items-center overflow-hidden mix-blend-overlay opacity-70">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ y: "100%", opacity: 0 }}
                                            animate={{ y: "-100%", opacity: [0, 1, 0] }}
                                            transition={{
                                                duration: 0.5 + Math.random(),
                                                repeat: Infinity,
                                                delay: Math.random() * 2
                                            }}
                                            className="font-mono text-xs text-green-400 font-bold mx-1"
                                        >
                                            {Math.random() > 0.5 ? '1' : '0'}
                                        </motion.span>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Hidden Text beneath the profile */}
                    <AnimatePresence>
                        {isGlitching && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 15 }}
                                exit={{ opacity: 0, y: 0 }}
                                className="absolute -bottom-8 font-mono text-red-500 font-bold text-xs tracking-[0.3em] uppercase bg-black/80 px-4 py-1 rounded-sm border border-red-500/30"
                            >
                                SYSTEM OVERRIDE // AUSTIN INTEL
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>
        </section>
    );
}
