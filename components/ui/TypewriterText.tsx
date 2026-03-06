"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";


interface TypewriterTextProps {
    text: string | string[];
    className?: string;
    delay?: number;
}

export function TypewriterText({ text, className = "", delay = 0 }: TypewriterTextProps) {
    const textArray = Array.isArray(text) ? text : [text];
    const hasTriggered = useRef(false);

    // Easter Egg State
    const [isRunic, setIsRunic] = useState(false);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (selection && selection.toString().toLowerCase().includes("faceless")) {
                setIsRunic(true);
                if (!hasTriggered.current) {
                    hasTriggered.current = true;
                }

                // Play fake typing sound
                try {
                    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                    if (AudioContext) {
                        const ctx = new AudioContext();
                        for (let i = 0; i < 15; i++) {
                            setTimeout(() => {
                                const osc = ctx.createOscillator();
                                const gain = ctx.createGain();
                                osc.type = "square";
                                osc.frequency.setValueAtTime(150 + Math.random() * 50, ctx.currentTime);
                                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                                osc.connect(gain);
                                gain.connect(ctx.destination);
                                osc.start();
                                osc.stop(ctx.currentTime + 0.05);
                            }, i * 100 + (Math.random() * 50));
                        }
                    }
                } catch (e) { /* ignore audio errors */ }

                setTimeout(() => setIsRunic(false), 3000);
                window.getSelection()?.removeAllRanges();
            }
        };

        document.addEventListener("mouseup", handleSelection);
        return () => document.removeEventListener("mouseup", handleSelection);
    }, []);

    return (
        <div className={`${className} ${isRunic ? 'font-script tracking-widest text-[#d4af37] drop-shadow-[0_0_8px_#d4af37] scale-105 transition-all duration-300' : 'transition-all duration-300'}`}>
            {textArray.map((line, lineIndex) => (
                <div key={lineIndex} className="overflow-visible pb-1 mb-2">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.04,
                                    delayChildren: delay,
                                },
                            },
                            hidden: {},
                        }}
                    >
                        {line.split(" ").map((word, wordIndex, array) => (
                            <span key={wordIndex} className="inline-block whitespace-nowrap">
                                {word.split("").map((char, charIndex) => (
                                    <motion.span
                                        key={charIndex}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
                                        }}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                                {wordIndex < array.length - 1 && (
                                    <motion.span
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1 },
                                        }}
                                        className="inline-block"
                                    >
                                        &nbsp;
                                    </motion.span>
                                )}
                            </span>
                        ))}
                    </motion.div>
                </div>
            ))}
        </div>
    );
}
