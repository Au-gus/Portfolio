"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";


export default function NotFound() {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <section className="min-h-screen flex items-center justify-center p-6 pb-20 z-10 relative">
            <div className="text-center max-w-2xl">
                <h1 className="text-6xl md:text-8xl font-heading tracking-tighter text-white/50 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    404
                </h1>
                <h2 className="text-2xl font-mono text-white mb-8 tracking-widest uppercase">
                    Signal Lost
                </h2>
                <button
                    onClick={() => router.push("/")}
                    className="px-8 py-4 rounded-full bg-white/5 border border-white/20 text-white font-mono text-sm tracking-wide hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                    Return to Reality ↗
                </button>
            </div>
        </section>
    );
}
