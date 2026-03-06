"use client";

import { motion } from "framer-motion";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { useState, useEffect, useRef } from "react";


export function Contact() {
    // Easter Egg State
    const [isHovering, setIsHovering] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [scrambleText, setScrambleText] = useState("Say Hello ↗");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Shift') setIsShiftPressed(true);
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift') setIsShiftPressed(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovering && isShiftPressed) {
            const chars = "10ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
            interval = setInterval(() => {
                const scrambled = "Say Hello ↗".split('').map(char => {
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                setScrambleText(scrambled);
            }, 50);
        } else {
            setScrambleText("Say Hello ↗");
        }
        return () => clearInterval(interval);
    }, [isHovering, isShiftPressed]);

    return (
        <section className="py-32 px-4 md:px-16 z-10 relative">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">
                        Get in Touch
                    </p>
                    <h2 className="text-5xl md:text-7xl font-mono tracking-tighter text-white mb-6">
                        Let&apos;s Talk
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
                        Whether you have a project idea, a collaboration proposal, or just want to say hello —
                        my inbox is always open. I&apos;ll do my best to get back to you.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <MagneticWrapper>
                        <a
                            href="mailto:facelessancient2025@gmail.com"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            className={`px-10 py-4 rounded-full font-mono text-sm tracking-wide transition-all duration-300 ${isHovering && isShiftPressed
                                ? 'bg-black text-green-500 shadow-[0_0_60px_rgba(34,197,94,0.8)] border border-green-500 font-bold tracking-[0.3em] scale-105'
                                : 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:bg-white/80'
                                }`}
                        >
                            {scrambleText}
                        </a>
                    </MagneticWrapper>
                    <MagneticWrapper>
                        <a
                            href="https://github.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-4 rounded-full bg-white/5 border border-white/15 text-white font-mono text-sm tracking-wide hover:bg-white/10 transition-all duration-300"
                        >
                            GitHub ↗
                        </a>
                    </MagneticWrapper>
                </motion.div>
            </div>
        </section>
    );
}
