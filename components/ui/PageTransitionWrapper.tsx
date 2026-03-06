"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";


const KONAMI_CODE = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a"
];

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
    const [devMode, setDevMode] = useState(false);
    const [inputKeys, setInputKeys] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (devMode) return;
            const newKeys = [...inputKeys, e.key];
            if (newKeys.length > KONAMI_CODE.length) newKeys.shift();

            setInputKeys(newKeys);

            if (newKeys.join("").toLowerCase() === KONAMI_CODE.join("").toLowerCase()) {
                setDevMode(true);
                // Auto-close dev dashboard after 10s
                setTimeout(() => setDevMode(false), 10000);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [inputKeys, devMode]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.45,
                    ease: [0.25, 1, 0.5, 1],
                }}
            >
                {children}
            </motion.div>

            {/* ── Konami Code Dev Dashboard Overlay ── */}
            <AnimatePresence>
                {devMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] pointer-events-none bg-black/95 flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Matrix Grid Bg */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,255,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.2) 1px, transparent 1px)`,
                                backgroundSize: "30px 30px"
                            }}
                        />

                        {/* Rain columns */}
                        <div className="absolute inset-0 flex justify-between overflow-hidden opacity-40">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: "-100%" }}
                                    animate={{ y: "100%" }}
                                    transition={{
                                        duration: 2 + Math.random() * 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: Math.random() * -5,
                                    }}
                                    className="font-mono text-xs text-green-500 font-bold whitespace-pre-wrap flex flex-col items-center"
                                >
                                    {Array.from({ length: 20 }).map((_, j) => (
                                        <span key={j} className="my-1">{Math.random() > 0.5 ? '1' : '0'}</span>
                                    ))}
                                </motion.div>
                            ))}
                        </div>

                        {/* HUD */}
                        <div className="relative z-10 flex flex-col items-center text-center p-8 bg-black/50 border border-green-500/30 rounded-lg backdrop-blur-sm">
                            <motion.h1
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl md:text-6xl font-mono font-bold tracking-tighter text-green-400 mb-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                            >
                                SYSTEM OVERRIDE
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="font-mono text-green-400/70 tracking-widest uppercase text-sm mb-6"
                            >
                                Welcome back, Admin.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="px-6 py-2 bg-green-500/10 border border-green-500 text-green-300 font-mono tracking-wider rounded-sm animate-pulse"
                            >
                                ✓ GOD MODE ENABLED
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
