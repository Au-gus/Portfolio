"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LogEntry = {
    id: number;
    type: "command" | "error" | "hint" | "success";
    text: string;
};

export function SecurityGate({ children }: { children: React.ReactNode }) {
    const [isUnlocked, setIsUnlocked] = useState(true); // Default true for SSR
    const [isMounted, setIsMounted] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isDenied, setIsDenied] = useState(false);
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [history, setHistory] = useState<LogEntry[]>([]);
    const [attempts, setAttempts] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        // Check session storage so they don't have to unlock on every page reload within the same session
        const unlocked = sessionStorage.getItem("fa_access_granted") === "true";
        setIsUnlocked(unlocked);

        if (!unlocked) {
            // Focus the invisible input on mount if locked
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, []);

    // Also try to keep focus if they click anywhere on the screen while locked
    useEffect(() => {
        const handleClick = () => {
            if (!isUnlocked && !isAuthorizing) {
                inputRef.current?.focus();
            }
        };

        if (!isUnlocked) {
            window.addEventListener('click', handleClick);
        }
        return () => window.removeEventListener('click', handleClick);
    }, [isUnlocked, isAuthorizing]);

    useEffect(() => {
        // Auto-scroll to bottom of terminal when history updates
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history]);

    const getHint = (attemptCount: number) => {
        if (attemptCount === 1) return null;
        if (attemptCount === 2) return "HINT: The system status has been validated.";
        if (attemptCount === 3) return "HINT: Synonym for 'accepted' or 'endorsed'.";
        if (attemptCount === 4) return "HINT: Starts with 'a', ends with 'd'. 8 letters.";
        if (attemptCount >= 5) return "FAILURE IMMINENT. FINAL HINT: The passcode is 'approved'.";
        return null;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const command = inputValue.trim().toLowerCase();
            const newEntry: LogEntry = { id: Date.now(), type: "command", text: inputValue };

            if (command === "approved") {
                setIsAuthorizing(true);
                setIsDenied(false);
                setHistory(prev => [...prev, newEntry, { id: Date.now() + 1, type: "success", text: "ACCESS GRANTED. DECRYPTING WORKSPACE..." }]);
                setInputValue("");

                // Simulate a fast "Authorizing..." hacking sequence
                setTimeout(() => {
                    sessionStorage.setItem("fa_access_granted", "true");
                    setIsUnlocked(true);
                }, 1800);

            } else {
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);
                setIsDenied(true);

                const updates: LogEntry[] = [
                    newEntry,
                    { id: Date.now() + 1, type: "error", text: "ACCESS DENIED. INVALID PASSPHRASE." }
                ];

                const hint = getHint(newAttempts);
                if (hint) {
                    updates.push({ id: Date.now() + 2, type: "hint", text: hint });
                }

                setHistory(prev => [...prev, ...updates]);
                setInputValue("");

                // Briefly flash denied state so the input turns red
                setTimeout(() => setIsDenied(false), 500);
            }
        }
    };

    // Prevent rendering the raw children during SSR mismatch or before we know unlock status
    if (!isMounted) return null;

    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <AnimatePresence>
            {!isUnlocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono overflow-hidden"
                >
                    {/* Background Grid & Noise */}
                    <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-white/40 text-xs mb-8 tracking-[0.2em] uppercase"
                        >
                            Faceless Ancient // Secure Server
                        </motion.div>

                        <div className="flex flex-col space-y-4 text-sm sm:text-base text-white/80">
                            <div>
                                <p className="text-white">SYSTEM LOCKDOWN PROTOCOL INITIATED.</p>
                                <p>UNAUTHORIZED ACCESS STRICTLY PROHIBITED.</p>
                                <p className="text-white/50">Please enter the security authorization phrase to proceed.</p>
                            </div>

                            {/* Terminal History */}
                            <div className="flex flex-col space-y-2 mt-6">
                                {history.map(entry => (
                                    <div key={entry.id} className="flex flex-col">
                                        {entry.type === "command" && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500 font-bold">root@core:~#</span>
                                                <span className="text-white">{entry.text}</span>
                                            </div>
                                        )}
                                        {entry.type === "error" && (
                                            <div className="text-red-500 mt-1 uppercase text-sm tracking-widest font-bold">[ {entry.text} ]</div>
                                        )}
                                        {entry.type === "hint" && (
                                            <div className="text-yellow-500/90 mt-1 italic text-sm">{entry.text}</div>
                                        )}
                                        {entry.type === "success" && (
                                            <div className="text-green-400 mt-1 uppercase text-sm tracking-widest font-bold animate-pulse">{entry.text}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Active Input Line */}
                            {!isAuthorizing && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-green-500 font-bold">root@core:~#</span>
                                    <div className="relative flex-1 flex items-center">
                                        <span className={`tracking-wider ${isDenied ? 'text-red-500' : 'text-white'}`}>
                                            {inputValue}
                                        </span>
                                        <motion.div
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="w-2.5 h-5 bg-white ml-2"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Auto-scroll anchor */}
                            <div ref={bottomRef} />

                            {/* Hidden Input field to cleanly capture typing without mobile keyboard UI mess */}
                            <input
                                ref={inputRef}
                                type="text"
                                className="absolute opacity-0 w-0 h-0 pointer-events-none select-none"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isAuthorizing}
                                autoFocus
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                            />

                            {/* Hidden Input */}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
