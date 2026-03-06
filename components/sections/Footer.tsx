"use client";

import { motion, PanInfo } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";


const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Timeline", href: "#timeline" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
];

const socials = [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Kaggle", href: "https://kaggle.com/" },
];

export function Footer() {
    const [isBlackHole, setIsBlackHole] = useState(false);



    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
        if (distance > 100) { // Drag threshold to trigger black hole
            setIsBlackHole(true);
            setTimeout(() => setIsBlackHole(false), 3000);
        }
    };

    return (
        <footer className="relative z-10 border-t border-white/5">
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                    {/* Brand column */}
                    <div className="md:col-span-5 flex flex-col gap-6 relative">
                        <div className="flex items-center gap-3 group relative z-20">
                            {/* Draggable Logo */}
                            <motion.div
                                drag={!isBlackHole}
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={0.6}
                                onDragEnd={handleDragEnd}
                                animate={isBlackHole ? {
                                    scale: [1, 0.5, 2, 0],
                                    rotate: [0, 360, 1080, 2048],
                                    filter: ["blur(0px)", "blur(2px)", "blur(10px)"],
                                    opacity: [1, 0.8, 0],
                                } : {
                                    scale: 1, rotate: 0, filter: "blur(0px)", opacity: 1
                                }}
                                transition={isBlackHole ? { duration: 1.5, ease: "easeInOut" } : { type: "spring", stiffness: 300, damping: 20 }}
                                className={`relative w-10 h-10 rounded-full overflow-hidden border cursor-grab active:cursor-grabbing ${isBlackHole ? 'border-red-500/50 shadow-[0_0_50px_rgba(255,0,0,0.8)] bg-red-900 pointer-events-none' : 'border-white/10 group-hover:border-white/30'
                                    }`}
                            >
                                <Image
                                    src="/images/fa_logo.png"
                                    alt="FA"
                                    fill
                                    className={`object-cover ${isBlackHole ? 'mix-blend-difference' : ''}`}
                                />
                            </motion.div>

                            <Link href="/">
                                <span className={`font-mono text-lg tracking-tight transition-colors ${isBlackHole ? 'text-red-500 animate-pulse' : 'text-white group-hover:text-white/80'}`}>
                                    {isBlackHole ? "[ ANOMALY DETECTED ]" : "Faceless Ancient"}
                                </span>
                            </Link>
                        </div>

                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                            Computer Science Major specializing in Machine Learning, Data Science, and modern web development. Crafting digital experiences that blend intelligence with aesthetics.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-4 mt-2">
                            {socials.map((s) => (
                                <motion.a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -2 }}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-mono hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                >
                                    {s.label}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation column */}
                    <div className="md:col-span-3 md:col-start-7">
                        <h4 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-6">
                            Navigation
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-white/50 text-sm font-mono hover:text-white transition-colors duration-300"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact column */}
                    <div className="md:col-span-3">
                        <h4 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-6">
                            Get in Touch
                        </h4>
                        <div className="flex flex-col gap-3">
                            <a
                                href="mailto:facelessancient2025@gmail.com"
                                className="text-white/50 text-sm font-mono hover:text-white transition-colors duration-300"
                            >
                                facelessancient2025@gmail.com
                            </a>
                            <p className="text-white/30 text-sm font-mono">
                                Kathmandu, Nepal
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/20 font-mono text-xs tracking-wide">
                        © {new Date().getFullYear()} Faceless Ancient · Built with Next.js & Three.js
                    </p>

                    <div className="flex items-center gap-4">


                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-mono hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                            Back to Top ↑
                        </motion.button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
