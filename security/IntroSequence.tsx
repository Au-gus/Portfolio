"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";


// ─── Constants ────────────────────────────────────────────────────────────────
const TARGET = "FACELESS ANCIENT";
const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PARTICLE_N = 1500;

// Timeline (ms)
const T_POOF = 4800;  // storm fades out (poof)
const T_TEXT_IN = 5400;  // DOM text block snaps in
const T_GREETING = 7400;  // greeting appears
const T_EXIT = 9400;  // scale-up exit begins
const T_UNMOUNT = 10900; // component fully removed

const LOCK_INTERVAL_MS = (T_GREETING - T_TEXT_IN) / TARGET.length; // ~125ms per letter

type TerminalPhase = "terminal" | "storm" | "poof" | "text" | "greeting" | "exit" | "done";

const randAZ = () => AZ[Math.floor(Math.random() * AZ.length)];

// ─── Canvas particle type ─────────────────────────────────────────────────────
type CPart = {
    x: number; y: number;
    vx: number; vy: number;
    char: string;
    size: number;
    alpha: number;
};

// ─── Terminal warning block ────────────────────────────────────────────────────
function TerminalWarning({ attempt }: { attempt: number }) {
    if (attempt === 0) return null;
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 font-mono text-xs sm:text-sm leading-relaxed mt-3"
        >
            <span className="font-bold">[ ACCESS DENIED ]</span>
            {attempt >= 2 && (
                <span className="text-yellow-400 block mt-1 font-bold tracking-wide">
                    ⚠ WARNING: NEXT FAILED ATTEMPT WILL INITIATE PERMANENT SYSTEM LOCKOUT.
                </span>
            )}
            {attempt === 1 && (
                <span className="block mt-1 text-red-400/70">
                    Unauthorized access attempt logged. Identity trace initiated.
                </span>
            )}
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function IntroSequence() {
    const [phase, setPhase] = useState<TerminalPhase>("terminal");
    const [inputVal, setInputVal] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isFirstVisit, setIsFirstVisit] = useState(false);

    // Text decryption state
    const [scrambled, setScrambled] = useState("");
    const [lockedCount, setLockedCount] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const particles = useRef<CPart[]>([]);
    const poofRef = useRef(false); // when true, particles fade out
    const lockRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lockCountRef = useRef(0);

    const push = useCallback((fn: () => void, ms: number) => {
        timers.current.push(setTimeout(fn, ms));
    }, []);

    const buildDisplay = useCallback((locked: number) => {
        let out = TARGET.substring(0, locked);
        for (let i = locked; i < TARGET.length; i++) {
            out += TARGET[i] === " " ? " " : randAZ();
        }
        return out;
    }, []);

    // ── Canvas render loop ──────────────────────────────────────────────────
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, W, H);

        let anyVisible = false;

        for (const p of particles.current) {
            if (poofRef.current) {
                // Quick fade — dissolve fast
                p.alpha -= 0.018;
            } else {
                // Storm: flutter in place + scramble
                p.x += (Math.random() - 0.5) * 1.2;
                p.y += (Math.random() - 0.5) * 1.2;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                if (Math.random() < 0.12) p.char = randAZ();
            }

            if (p.alpha <= 0) continue;
            anyVisible = true;
            ctx.globalAlpha = Math.min(p.alpha, 1);
            ctx.font = `bold ${p.size}px monospace`;
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.fillText(p.char, p.x, p.y);
        }

        ctx.globalAlpha = 1;

        // Stop RAF once all particles gone
        if (poofRef.current && !anyVisible) return;

        rafRef.current = requestAnimationFrame(renderCanvas);
    }, []);

    // ── Initialize canvas particles ─────────────────────────────────────────
    const initParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const W = canvas.width;
        const H = canvas.height;

        particles.current = Array.from({ length: PARTICLE_N }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: 0,
            vy: 0,
            char: randAZ(),
            size: Math.floor(Math.random() * 12) + 10,
            alpha: Math.random() * 0.5 + 0.4,
        }));
    }, []);

    // ── Trigger hack sequence ───────────────────────────────────────────────
    const triggerHack = useCallback(() => {
        localStorage.setItem("fa_visited", "true");

        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        poofRef.current = false;
        initParticles();
        setPhase("storm");

        // Poof: start fading particles
        push(() => {
            poofRef.current = true;
            setPhase("poof");
        }, T_POOF);

        // Snap text in
        push(() => {
            cancelAnimationFrame(rafRef.current);
            setPhase("text");
            lockCountRef.current = 0;
            setLockedCount(0);
            setScrambled(buildDisplay(0));

            scrambleRef.current = setInterval(() => {
                setScrambled(buildDisplay(lockCountRef.current));
            }, 50);

            lockRef.current = setInterval(() => {
                lockCountRef.current++;
                setLockedCount(lockCountRef.current);
                if (lockCountRef.current >= TARGET.length) {
                    if (lockRef.current) clearInterval(lockRef.current);
                    if (scrambleRef.current) clearInterval(scrambleRef.current);
                    setScrambled(TARGET);
                }
            }, LOCK_INTERVAL_MS);
        }, T_TEXT_IN);

        push(() => setPhase("greeting"), T_GREETING);
        push(() => setPhase("exit"), T_EXIT);
        push(() => setPhase("done"), T_UNMOUNT);
    }, [push, initParticles, buildDisplay]);

    // Start RAF after storm phase is set
    useEffect(() => {
        if (phase === "storm") {
            rafRef.current = requestAnimationFrame(renderCanvas);
        }
    }, [phase, renderCanvas]);

    // ── Handle enter key on terminal ────────────────────────────────────────
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter" || !inputVal.trim()) return;
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setInputVal("");

        if (newAttempts >= 3) {
            triggerHack();
        }
    }, [attempts, inputVal, triggerHack]);

    useEffect(() => {
        setIsMounted(true);
        const visited = localStorage.getItem("fa_visited") === "true";
        setIsFirstVisit(!visited);

        if (visited) {
            setPhase("done");
        }

        return () => {
            timers.current.forEach(clearTimeout);
            if (lockRef.current) clearInterval(lockRef.current);
            if (scrambleRef.current) clearInterval(scrambleRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    if (!isMounted || phase === "done") return null;

    const showCanvas = phase === "storm" || phase === "poof";
    const showText = phase === "text" || phase === "greeting" || phase === "exit";
    const isExiting = phase === "exit";

    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center">

            {/* ── PHASE 1: TERMINAL UI ───────────────────────────────────── */}
            <AnimatePresence>
                {phase === "terminal" && (
                    <motion.div
                        key="terminal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-2xl px-6 font-mono"
                    >
                        {/* Header */}
                        <div className="text-white/30 text-xs tracking-[0.25em] uppercase mb-6">
                            Faceless Ancient // Secure Server — v4.2.1
                        </div>

                        <div className="border border-white/10 rounded-lg bg-white/[0.02] p-6 space-y-4">
                            {/* Boot lines */}
                            <div className="text-green-500/70 text-xs space-y-1">
                                <p>[ sys ] Initializing secure shell...</p>
                                <p>[ sys ] Biometric layer: <span className="text-yellow-400">OFFLINE</span></p>
                                <p>[ sys ] Fallback: Password authentication required.</p>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <p className="text-white/60 text-sm mb-3">
                                    Enter access credentials to proceed.
                                </p>

                                <div className="flex items-center gap-2">
                                    <span className="text-green-400 text-sm font-bold shrink-0">
                                        root@fa:~#
                                    </span>
                                    <input
                                        autoFocus
                                        type="password"
                                        value={inputVal}
                                        onChange={e => setInputVal(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="••••••••"
                                        className="flex-1 bg-transparent border-none outline-none text-white text-sm font-mono placeholder:text-white/20 caret-green-400"
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                    />
                                    <motion.div
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="w-2 h-4 bg-green-400 shrink-0"
                                    />
                                </div>
                            </div>

                            {/* Attempt warnings */}
                            <AnimatePresence>
                                {attempts > 0 && (
                                    <TerminalWarning attempt={attempts} key={attempts} />
                                )}
                            </AnimatePresence>

                            <div className="text-white/20 text-xs pt-2 border-t border-white/5">
                                Press <kbd className="px-1 py-0.5 bg-white/5 rounded text-white/40">ENTER</kbd> to submit
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── PHASE 2: CANVAS DATA STORM (+ POOF FADE) ─────────────────── */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ display: showCanvas ? "block" : "none" }}
            />

            {/* ── PHASE 3+: DOM TEXT BLOCK ──────────────────────────────────── */}
            <AnimatePresence>
                {showText && (
                    <motion.div
                        key="text-block"
                        className="relative z-10 flex flex-col items-center gap-6 px-4 text-center"
                        style={{ willChange: "transform, opacity" }}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={
                            isExiting
                                ? { opacity: 0, scale: 22, filter: "blur(60px)" }
                                : { opacity: 1, scale: 1, filter: "blur(0px)" }
                        }
                        transition={
                            isExiting
                                ? { duration: 1.4, ease: [0.4, 0, 0.1, 1] }
                                : { duration: 0.1, ease: "linear" }
                        }
                    >
                        {/* Per-letter decryption with neon glow */}
                        <div
                            className="font-mono font-black tracking-[0.2em] whitespace-pre text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                            aria-label={TARGET}
                        >
                            {scrambled.split("").map((ch, i) => {
                                const locked = i < lockedCount || phase === "greeting" || phase === "exit";
                                return (
                                    <motion.span
                                        key={i}
                                        style={{ willChange: "transform, opacity" }}
                                        animate={
                                            locked
                                                ? {
                                                    color: "#ffffff",
                                                    textShadow: [
                                                        "0 0 8px #fff",
                                                        "0 0 35px #fff, 0 0 70px #00eeffaa",
                                                        "0 0 16px #fff, 0 0 32px #00eeff66",
                                                    ],
                                                }
                                                : { color: "rgba(255,255,255,0.2)", textShadow: "none" }
                                        }
                                        transition={{ duration: 0.3 }}
                                    >
                                        {ch}
                                    </motion.span>
                                );
                            })}
                        </div>

                        {/* Smart greeting */}
                        <AnimatePresence>
                            {(phase === "greeting" || phase === "exit") && (
                                <motion.p
                                    key="greeting"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
                                    className="font-mono text-sm tracking-widest text-gray-400"
                                    style={{
                                        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                                    }}
                                >
                                    {isFirstVisit ? "WELCOME USER" : "FACELESS ANCIENT WELCOMES YOU"}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
