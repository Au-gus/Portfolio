"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBiometricGate } from "@/components/providers/BiometricGateContext";


const HOLD_DURATION = 2000;
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ─── Confetti particle (CSS-only, no library needed) ─────────────────────────
const CONFETTI_COLORS = ["#00ffff", "#a855f7", "#f59e0b", "#34d399", "#f472b6", "#fff"];
const CONFETTI_COUNT = 60;
const confettiParticles = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.4 + Math.random() * 1.2,
    size: 6 + Math.floor(Math.random() * 8),
    rotation: Math.random() * 360,
    xDrift: (Math.random() - 0.5) * 220,
}));

export function BiometricGate() {
    const { isScanning, closeGate } = useBiometricGate();
    const router = useRouter();

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "scanning" | "granted" | "flash" | "easter">("idle");
    const [bypassAlert, setBypassAlert] = useState<null | "warning" | "threat">(null);
    const holdStart = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const resultHandled = useRef(false);
    const doubleTapCount = useRef(0);   // persistent across gate session
    const lastTapTime = useRef(0);      // timestamp of last tap
    const bypassTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reset when gate opens
    useEffect(() => {
        if (isScanning) {
            setProgress(0);
            setStatus("idle");
            setBypassAlert(null);
            resultHandled.current = false;
            doubleTapCount.current = 0;
            lastTapTime.current = 0;
            if (bypassTimer.current) clearTimeout(bypassTimer.current);
        }
    }, [isScanning]);

    const startHold = useCallback(() => {
        if (status === "granted" || status === "flash") return;
        holdStart.current = performance.now();
        setStatus("scanning");

        const tick = () => {
            if (!holdStart.current) return;
            const elapsed = performance.now() - holdStart.current;
            const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
            setProgress(pct);

            if (pct < 100) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                // Success!
                setStatus("flash");
                setProgress(100);
                resultHandled.current = true;

                // Flash for 150ms then show "ACCESS GRANTED" before routing
                setTimeout(() => {
                    setStatus("granted");
                    setTimeout(() => {
                        sessionStorage.setItem("projectAuth", "true");
                        closeGate();
                        router.push("/projects");
                    }, 800);
                }, 150);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
    }, [status, closeGate, router]);

    const stopHold = useCallback(() => {
        if (resultHandled.current) return;
        holdStart.current = null;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setProgress(0);
        setStatus("idle");
    }, []);

    // ── Double-tap bypass logic ─────────────────────────────────────────────
    const handleScannerClick = useCallback(() => {
        if (resultHandled.current) return;
        const now = Date.now();
        const gap = now - lastTapTime.current;
        lastTapTime.current = now;

        // Rapid tap window = 450ms — counts as a double-tap
        if (gap > 450) return;

        doubleTapCount.current += 1;
        if (bypassTimer.current) clearTimeout(bypassTimer.current);

        if (doubleTapCount.current >= 3) {
            // 3rd double-tap → easter egg celebration!
            doubleTapCount.current = 0;
            setBypassAlert(null);
            resultHandled.current = true;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            holdStart.current = null;
            setStatus("easter");
            setProgress(100);
            // Redirect after celebration
            setTimeout(() => {
                sessionStorage.setItem("projectAuth", "true");
                closeGate();
                router.push("/projects");
            }, 3200);
        } else if (doubleTapCount.current === 2) {
            setBypassAlert("threat");
            bypassTimer.current = setTimeout(() => setBypassAlert(null), 2500);
        } else {
            setBypassAlert("warning");
            bypassTimer.current = setTimeout(() => setBypassAlert(null), 2500);
        }
    }, [stopHold, closeGate, router]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // ── Secret Password Easter Egg ──────────────────────────────────────────
    const [typedBuffer, setTypedBuffer] = useState("");

    useEffect(() => {
        if (!isScanning) {
            setTypedBuffer("");
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            // Only care about letters
            if (!/^[a-zA-Z]$/.test(e.key)) return;

            setTypedBuffer(prev => {
                const updated = (prev + e.key).toLowerCase()
                // limit length to 30 to avoid huge strings
                const buffer = updated.slice(-30);

                // Check for sequence
                if (buffer.includes("easter") && buffer.includes("egg") && buffer.includes("found")) {
                    // Check if they appeared in order
                    const idxE = buffer.lastIndexOf("easter");
                    const idxG = buffer.lastIndexOf("egg");
                    const idxF = buffer.lastIndexOf("found");

                    if (idxE < idxG && idxG < idxF) {
                        // Trigger 
                        setBypassAlert(null);
                        resultHandled.current = true;
                        if (rafRef.current) cancelAnimationFrame(rafRef.current);
                        holdStart.current = null;
                        setStatus("easter");
                        setProgress(100);

                        // Redirect after celebration
                        setTimeout(() => {
                            sessionStorage.setItem("projectAuth", "true");
                            closeGate();
                            router.push("/projects");
                        }, 3200);
                        return ""; // Clear buffer
                    }
                }
                return buffer;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isScanning, closeGate, router]);

    const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

    return (
        <AnimatePresence>
            {isScanning && (
                <motion.div
                    key="biometric-gate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="fixed inset-0 z-[9998] bg-black flex flex-col items-center justify-center overflow-hidden select-none"
                    onClick={(e) => {
                        // Close if clicking background (not scanner, not easter)
                        if (e.target === e.currentTarget && status !== "granted" && status !== "flash" && status !== "easter") {
                            stopHold();
                            closeGate();
                        }
                    }}
                >
                    {/* ── Glowing grid background ── */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)
                            `,
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* ── EASTER EGG Celebration overlay ── */}
                    <AnimatePresence>
                        {status === "easter" && (
                            <motion.div
                                key="easter-screen"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden"
                                style={{ background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000 70%)" }}
                            >
                                {/* Confetti rain */}
                                {confettiParticles.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        className="absolute top-0 rounded-sm pointer-events-none"
                                        style={{
                                            left: `${p.left}%`,
                                            width: p.size,
                                            height: p.size * 0.5,
                                            backgroundColor: p.color,
                                            rotate: p.rotation,
                                            boxShadow: `0 0 6px ${p.color}`,
                                        }}
                                        initial={{ y: -30, opacity: 1, x: 0, rotate: p.rotation }}
                                        animate={{
                                            y: "110vh",
                                            opacity: [1, 1, 0.6, 0],
                                            x: [0, p.xDrift * 0.3, p.xDrift, p.xDrift * 1.1],
                                            rotate: p.rotation + 540,
                                        }}
                                        transition={{
                                            duration: p.duration,
                                            delay: p.delay,
                                            ease: "easeIn",
                                        }}
                                    />
                                ))}

                                {/* Center content */}
                                <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
                                    {/* Badge */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -15 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                                        className="px-4 py-1.5 rounded-full border border-yellow-400/50 bg-yellow-400/10 font-mono text-yellow-300 text-xs tracking-widest"
                                        style={{ boxShadow: "0 0 20px rgba(250,204,21,0.25)" }}
                                    >
                                        🥚 EASTER EGG FOUND
                                    </motion.div>

                                    {/* Main heading */}
                                    <motion.h2
                                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                                        className="font-mono font-black text-5xl sm:text-6xl tracking-tighter"
                                        style={{
                                            background: "linear-gradient(135deg, #fff 20%, #a855f7 50%, #00ffff 80%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            textShadow: "none",
                                            filter: "drop-shadow(0 0 30px rgba(168,85,247,0.5))",
                                        }}
                                    >
                                        CONGRATULATIONS
                                    </motion.h2>

                                    {/* Sub-text */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.55 }}
                                        className="font-mono text-white/50 text-sm tracking-widest"
                                    >
                                        you found the hidden path
                                    </motion.p>

                                    {/* Redirecting */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.6, duration: 0.6 }}
                                        className="font-mono text-cyan-400/70 text-xs tracking-[0.25em] uppercase"
                                    >
                                        opening projects...
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Flash white overlay ── */}
                    <AnimatePresence>
                        {status === "flash" && (
                            <motion.div
                                key="flash"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="absolute inset-0 bg-white z-10 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    {/* ── Core scanner UI ── */}
                    <motion.div
                        className="relative flex flex-col items-center gap-8 z-20"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* ── Header text ── */}
                        <div className="text-center">
                            <p className="font-mono text-xs text-cyan-400/60 tracking-[0.3em] uppercase mb-1">
                                Faceless Ancient // Secure Portal
                            </p>
                            <AnimatePresence mode="wait">
                                {status === "granted" || status === "flash" ? (
                                    <motion.p
                                        key="granted"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="font-mono text-green-400 text-sm tracking-[0.2em] uppercase font-bold"
                                    >
                                        ✓ ACCESS GRANTED
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        key="required"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="font-mono text-white/60 text-sm tracking-[0.15em] uppercase"
                                    >
                                        Biometric Verification Required
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Scanner SVG ── */}
                        <div
                            className="relative cursor-pointer"
                            onMouseDown={startHold}
                            onMouseUp={stopHold}
                            onMouseLeave={stopHold}
                            onTouchStart={startHold}
                            onTouchEnd={stopHold}
                            onClick={handleScannerClick}
                            style={{ touchAction: "none" }}
                        >
                            {/* Outer glow ring */}
                            <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0">
                                {/* Backdrop circle */}
                                <circle
                                    cx="100" cy="100" r={RADIUS}
                                    fill="none"
                                    stroke="rgba(0,255,255,0.08)"
                                    strokeWidth="8"
                                />

                                {/* Animated progress ring */}
                                <motion.circle
                                    cx="100" cy="100" r={RADIUS}
                                    fill="none"
                                    stroke="#00ffff"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 100 100)"
                                    style={{
                                        filter: "drop-shadow(0 0 8px #00ffff) drop-shadow(0 0 20px rgba(0,255,255,0.4))",
                                        transition: "stroke-dashoffset 0.05s linear",
                                    }}
                                />
                            </svg>

                            {/* Fingerprint SVG icon */}
                            <div
                                className="w-[200px] h-[200px] flex items-center justify-center"
                                style={{
                                    filter: status === "scanning"
                                        ? `drop-shadow(0 0 16px #00ffff) drop-shadow(0 0 40px rgba(0,255,255,0.6))`
                                        : status === "granted"
                                            ? `drop-shadow(0 0 20px #00ff88)`
                                            : `drop-shadow(0 0 6px rgba(0,255,255,0.3))`,
                                    transition: "filter 0.4s ease",
                                }}
                            >
                                <svg
                                    width="100%" height="100%" viewBox="0 0 100 100"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Stylized retina/fingerprint rings */}
                                    <circle cx="50" cy="50" r="6" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="2" opacity="0.9" />
                                    <circle cx="50" cy="50" r="14" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1.5" opacity="0.75" />
                                    <circle cx="50" cy="50" r="22" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1.5" opacity="0.6" />
                                    <circle cx="50" cy="50" r="30" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1.5" opacity="0.45" />
                                    <circle cx="50" cy="50" r="38" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1" opacity="0.3" />
                                    <circle cx="50" cy="50" r="46" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1" opacity="0.2" />

                                    {/* Crosshair lines */}
                                    <line x1="50" y1="2" x2="50" y2="20" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1.5" opacity="0.5" />
                                    <line x1="50" y1="80" x2="50" y2="98" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1.5" opacity="0.5" />
                                    <line x1="2" y1="50" x2="20" y2="50" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1.5" opacity="0.5" />
                                    <line x1="80" y1="50" x2="98" y2="50" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="1.5" opacity="0.5" />

                                    {/* Corner brackets */}
                                    <path d="M10 22 L10 10 L22 10" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="2" fill="none" opacity="0.7" />
                                    <path d="M78 10 L90 10 L90 22" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="2" fill="none" opacity="0.7" />
                                    <path d="M10 78 L10 90 L22 90" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="2" fill="none" opacity="0.7" />
                                    <path d="M78 90 L90 90 L90 78" stroke={status === "granted" ? "#00ff88" : "#00ffff"} strokeWidth="2" fill="none" opacity="0.7" />
                                </svg>
                            </div>

                            {/* Scanning pulse animation */}
                            {status === "scanning" && (
                                <motion.div
                                    className="absolute inset-[30px] rounded-full pointer-events-none"
                                    animate={{
                                        boxShadow: [
                                            "0 0 0 0px rgba(0,255,255,0.3)",
                                            "0 0 0 20px rgba(0,255,255,0)",
                                        ],
                                    }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                />
                            )}
                        </div>

                        {/* ── Security alert banner ── */}
                        <AnimatePresence mode="wait">
                            {bypassAlert && (
                                <motion.div
                                    key={bypassAlert}
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className={`font-mono text-xs tracking-widest px-4 py-2 rounded-md border text-center ${bypassAlert === "warning"
                                        ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
                                        : "border-red-500/50 bg-red-500/10 text-red-400"
                                        }`}
                                    style={{
                                        boxShadow: bypassAlert === "warning"
                                            ? "0 0 16px rgba(234,179,8,0.15)"
                                            : "0 0 16px rgba(239,68,68,0.2)",
                                    }}
                                >
                                    {bypassAlert === "warning"
                                        ? "⚠ PLEASE HOLD — REMAIN STILL FOR BIOMETRIC SCAN"
                                        : "🔴 MULTIPLE INTERRUPTIONS DETECTED — KEEP CONTACT TO COMPLETE SCAN"}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Instruction & progress text ── */}
                        <div className="text-center space-y-2">
                            <AnimatePresence mode="wait">
                                {status === "granted" || status === "flash" ? (
                                    <motion.p
                                        key="go"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="font-mono text-green-400/80 text-xs tracking-widest"
                                    >
                                        REDIRECTING TO PROJECTS...
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        key="instruction"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="font-mono text-white/40 text-xs tracking-widest"
                                    >
                                        {status === "scanning"
                                            ? `SCANNING... ${Math.round(progress)}%`
                                            : "HOLD TO VERIFY IDENTITY"
                                        }
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Progress pips */}
                            <div className="flex gap-1.5 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 h-1 rounded-full transition-all duration-200"
                                        style={{
                                            backgroundColor: progress >= (i + 1) * 20
                                                ? (status === "granted" ? "#00ff88" : "#00ffff")
                                                : "rgba(255,255,255,0.15)",
                                            boxShadow: progress >= (i + 1) * 20
                                                ? `0 0 6px ${status === "granted" ? "#00ff88" : "#00ffff"}`
                                                : "none",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── Cancel ── */}
                        {(status === "idle" || status === "scanning") && (
                            <button
                                onClick={(e) => { e.stopPropagation(); stopHold(); closeGate(); }}
                                className="font-mono text-white/20 hover:text-white/50 text-xs tracking-widest transition-colors mt-2"
                            >
                                [ ESC ] ABORT
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
