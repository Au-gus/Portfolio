"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBiometricGate } from "@/components/providers/BiometricGateContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type BlockId = "home" | "projects" | "contact" | "about";
type AboutPhase = "idle" | "prompt" | "granted" | "denied";

// ─── About Me Terminal Modal ──────────────────────────────────────────────────
function AboutTerminal({
    onGrant,
    onDeny,
}: {
    onGrant: () => void;
    onDeny: () => void;
}) {
    const [phase, setPhase] = useState<AboutPhase>("prompt");
    const [typed, setTyped] = useState("");
    const [displayed, setDisplayed] = useState("");
    const [inputActive, setInputActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const PROMPT = "[ WARNING: RESTRICTED AREA. ENTER THE PASSPHRASE TO PROCEED: ]";

    // Typewriter effect for the warning prompt
    useEffect(() => {
        let i = 0;
        const id = setInterval(() => {
            setDisplayed(PROMPT.slice(0, i + 1));
            i++;
            if (i >= PROMPT.length) {
                clearInterval(id);
                setInputActive(true);
                setTimeout(() => inputRef.current?.focus(), 50);
            }
        }, 28);
        return () => clearInterval(id);
    }, []);

    const handleKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const val = typed.trim();
            if (val.toLowerCase() === "earth") {
                setPhase("granted");
                setTimeout(onGrant, 900);
            } else {
                setPhase("denied");
                setTimeout(onDeny, 700);
            }
            setTyped("");
        }
    }, [typed, onGrant, onDeny]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[10001] bg-black/95 flex items-center justify-center p-6"
            onClick={(e) => e.stopPropagation()}
        >
            <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl font-mono"
            >
                {/* Header bar */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                    <span className="ml-2 text-red-400/60 text-xs tracking-widest uppercase">
                        RESTRICTED — IDENTITY CHECK
                    </span>
                </div>

                <div className="border border-red-500/30 rounded-lg bg-red-950/10 p-6 space-y-5">
                    {/* Blinking warning icon */}
                    <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 0.9 }}
                        className="text-red-500 text-xs tracking-widest"
                    >
                        ▓▓▓ SECURITY ALERT ▓▓▓
                    </motion.div>

                    {/* Typewriter prompt */}
                    <p className="text-red-400 text-sm leading-relaxed tracking-wide min-h-[3em]">
                        {displayed}
                        {!inputActive && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className="inline-block w-2 h-4 bg-red-400 ml-0.5 align-middle"
                            />
                        )}
                    </p>

                    {/* Input area */}
                    <AnimatePresence>
                        {inputActive && phase === "prompt" && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 border-t border-red-500/20 pt-4"
                            >
                                <span className="text-red-500 text-sm font-bold shrink-0">root@fa:~#</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    maxLength={16}
                                    value={typed}
                                    onChange={e => setTyped(e.target.value)}
                                    onKeyDown={handleKey}
                                    className="flex-1 bg-transparent border-none outline-none text-red-300 text-sm uppercase caret-red-400"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                <motion.div
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.6 }}
                                    className="w-2 h-4 bg-red-400 shrink-0"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Result messages */}
                    <AnimatePresence mode="wait">
                        {phase === "granted" && (
                            <motion.p
                                key="granted"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-green-400 text-sm tracking-widest"
                            >
                                ✓ AUTHORIZATION CONFIRMED. ROUTING...
                            </motion.p>
                        )}
                        {phase === "denied" && (
                            <motion.p
                                key="denied"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm tracking-widest"
                            >
                                ✗ ACCESS DENIED. RETURNING TO COMMAND CENTER.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Bento Block ─────────────────────────────────────────────────────────────
function BentoBlock({
    id,
    label,
    icon,
    description,
    colSpan,
    rowSpan,
    accentColor,
    onClick,
}: {
    id: BlockId;
    label: string;
    icon: string;
    description: string;
    colSpan?: string;
    rowSpan?: string;
    accentColor: string;
    onClick: (id: BlockId) => void;
}) {
    return (
        <motion.button
            onClick={() => onClick(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={`
                relative group cursor-pointer rounded-2xl overflow-hidden text-left
                border border-white/[0.08] bg-white/[0.03]
                ${colSpan ?? ""} ${rowSpan ?? ""}
            `}
            style={{ willChange: "transform" }}
        >
            {/* Glassmorphism hover layer */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(ellipse at 30% 40%, ${accentColor}18 0%, transparent 70%)`,
                    backdropFilter: "blur(8px)",
                }}
            />

            {/* Subtle border glow on hover */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    boxShadow: `inset 0 0 0 1px ${accentColor}40, 0 0 32px ${accentColor}20`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 h-full p-6 flex flex-col justify-between min-h-[140px]">
                <div className="flex items-start justify-between">
                    <span className="text-3xl">{icon}</span>
                    <motion.span
                        initial={{ opacity: 0, x: 4 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="text-white/30 text-xs tracking-widest font-mono"
                    >
                        ENTER →
                    </motion.span>
                </div>

                <div>
                    <p
                        className="font-mono font-bold text-lg tracking-wide text-white/90 mb-1 group-hover:text-white transition-colors"
                        style={{ textShadow: `0 0 20px ${accentColor}60` }}
                    >
                        {label}
                    </p>
                    <p className="font-mono text-xs text-white/35 tracking-wider leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {/* Corner accent */}
            <div
                className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `conic-gradient(from 180deg at 100% 0%, ${accentColor}30, transparent 40%)`,
                }}
            />
        </motion.button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function RefreshInterceptor({ onDismiss }: { onDismiss: () => void }) {
    const router = useRouter();
    const { openGate } = useBiometricGate();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [terminalText, setTerminalText] = useState("");
    const TERMINAL_MSG = "[ SYSTEM RELOAD DETECTED. AWAITING USER INSTRUCTION... ]";

    // Typewriter for terminal header
    useEffect(() => {
        let i = 0;
        const id = setInterval(() => {
            setTerminalText(TERMINAL_MSG.slice(0, i + 1));
            i++;
            if (i >= TERMINAL_MSG.length) clearInterval(id);
        }, 22);
        return () => clearInterval(id);
    }, []);

    const handleBlock = useCallback((id: BlockId) => {
        switch (id) {
            case "home":
                onDismiss();
                break;
            case "projects":
                if (sessionStorage.getItem("projectAuth") === "true") {
                    router.push("/projects");
                } else {
                    openGate();
                }
                break;
            case "contact":
                onDismiss();
                setTimeout(() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
                break;
            case "about":
                setShowAboutModal(true);
                break;
        }
    }, [onDismiss, openGate, router]);

    const blocks = [
        {
            id: "home" as BlockId,
            label: "Home",
            icon: "⌂",
            description: "Return to the main interface",
            colSpan: "col-span-1",
            accentColor: "#00eeff",
        },
        {
            id: "projects" as BlockId,
            label: "Projects",
            icon: "◈",
            description: "Biometric gate required to proceed",
            colSpan: "col-span-1",
            accentColor: "#a855f7",
        },
        {
            id: "contact" as BlockId,
            label: "Contact",
            icon: "◌",
            description: "Scroll to contact section",
            colSpan: "col-span-1",
            accentColor: "#22d3ee",
        },
        {
            id: "about" as BlockId,
            label: "About Me",
            icon: "▣",
            description: "Restricted — authorization required",
            colSpan: "col-span-1",
            accentColor: "#ef4444",
        },
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-6 overflow-hidden"
            >
                {/* Subtle scanline overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
                        backgroundSize: "100% 3px",
                    }}
                />

                {/* Grid background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,238,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,238,255,0.025) 1px, transparent 1px)
                        `,
                        backgroundSize: "48px 48px",
                    }}
                />

                <div className="relative z-10 w-full max-w-2xl flex flex-col gap-8">
                    {/* Terminal header */}
                    <div className="font-mono text-center">
                        <p className="text-white/20 text-xs tracking-[0.3em] uppercase mb-3">
                            Faceless Ancient // Command Center
                        </p>
                        <p className="text-cyan-400/80 text-sm tracking-[0.12em] min-h-[1.5em]">
                            {terminalText}
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 0.7 }}
                                className="inline-block w-[7px] h-[13px] bg-cyan-400/70 ml-1 align-middle"
                            />
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {blocks.map((b, i) => (
                            <motion.div
                                key={b.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <BentoBlock
                                    {...b}
                                    onClick={handleBlock}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer */}
                    <p className="text-center font-mono text-white/15 text-xs tracking-widest">
                        SELECT AN AREA TO CONTINUE
                    </p>
                </div>
            </motion.div>

            {/* About Me Terminal Modal */}
            <AnimatePresence>
                {showAboutModal && (
                    <AboutTerminal
                        onGrant={() => {
                            setShowAboutModal(false);
                            onDismiss();
                            setTimeout(() => {
                                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                            }, 100);
                        }}
                        onDeny={() => setShowAboutModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
