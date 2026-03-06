"use client";

import { motion, useScroll, useMotionValueEvent, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";
import Image from "next/image";
import Link from "next/link";
import { useBiometricGate } from "@/components/providers/BiometricGateContext";


const navItems = [
    { name: "Home", id: "home" },
    { name: "About Me", id: "about" },
    { name: "Timeline", id: "timeline" },
    { name: "Projects", id: "projects" },
    { name: "Contact", id: "contact" },
];

export function Navbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const [activeId, setActiveId] = useState("home");
    const [projectWarning, setProjectWarning] = useState(false);

    // Easter Egg State 


    const pathname = usePathname();
    const router = useRouter();
    const { openGate } = useBiometricGate();
    const isHome = pathname === "/";
    const velocity = useScrollVelocity();

    const rawY = useTransform(() => Math.min(Math.abs(velocity) * 0.05, 8));
    const floatY = useSpring(rawY, { stiffness: 180, damping: 22 });
    const rawScale = useTransform(() => 1 - Math.min(Math.abs(velocity) * 0.0003, 0.035));
    const floatScale = useSpring(rawScale, { stiffness: 200, damping: 25 });

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 60);
    });

    useEffect(() => {
        if (!isHome) return;
        const observers: IntersectionObserver[] = [];
        navItems.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
                { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, [isHome]);



    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const projectClickCount = useRef(0);
    const projectClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const projectDoubleAttempts = useRef(0); // persists across click windows
    const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showHoldWarning = () => {
        setProjectWarning(true);
        if (warningTimer.current) clearTimeout(warningTimer.current);
        warningTimer.current = setTimeout(() => setProjectWarning(false), 1500);
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (id === "projects") {
            e.preventDefault();
            projectClickCount.current += 1;

            if (projectClickCount.current >= 2) {
                projectClickCount.current = 0;
                if (projectClickTimer.current) clearTimeout(projectClickTimer.current);

                projectDoubleAttempts.current += 1;

                if (projectDoubleAttempts.current >= 3) {
                    // 3rd double-tap → auto access, no biometric needed
                    projectDoubleAttempts.current = 0;
                    router.push("/projects");
                } else {
                    // 1st or 2nd double-tap → warn and open gate
                    showHoldWarning();
                    if (sessionStorage.getItem("projectAuth") === "true") {
                        router.push("/projects");
                    } else {
                        openGate();
                    }
                }
                return;
            }

            // First tap → scroll normally, reset per-window counter after 600 ms
            if (isHome) scrollTo(id);
            projectClickTimer.current = setTimeout(() => {
                projectClickCount.current = 0;
            }, 600);
            return;
        }

        if (!isHome) return;
        e.preventDefault();
        scrollTo(id);
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-black/70 backdrop-blur-2xl border-b border-white/[0.07]"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

                {/* ── Logo left ── */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 shrink-0 group"
                >
                    <div className="w-8 h-8 relative rounded-lg overflow-hidden border border-white/10 bg-white/5">
                        <Image
                            src="/images/fa_logo.png"
                            alt="FA"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <span className="font-mono text-white/80 text-sm tracking-widest group-hover:text-white transition-colors hidden sm:block">
                        Faceless<span className="text-white/30">·</span>Ancient
                    </span>
                </Link>

                {/* ── Nav center (floating pill) ── */}
                <motion.ul
                    style={{ y: floatY, scale: floatScale }}
                    className="flex items-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-lg overflow-hidden"
                >
                    {navItems.map((item) => {
                        const isActive = isHome && activeId === item.id;
                        return (
                            <li key={item.id} className="relative">
                                <a
                                    href={`/#${item.id}`}
                                    onClick={(e) => handleClick(e, item.id)}
                                    className={`relative px-4 py-2 font-mono text-xs tracking-wide transition-all duration-300 flex items-center gap-1 ${isActive
                                        ? "text-white"
                                        : "text-white/45 hover:text-white/80"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white/10 border-x border-white/10"
                                            transition={{ type: "spring", stiffness: 380, damping: 38 }}
                                        />
                                    )}
                                    <span className="relative z-10">{item.name}</span>
                                </a>
                                {/* PLEASE HOLD toast — only on Projects */}
                                {item.id === "projects" && projectWarning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-md bg-black/90 border border-yellow-400/30 text-yellow-300 font-mono text-[10px] tracking-widest whitespace-nowrap z-[100] pointer-events-none"
                                        style={{ boxShadow: "0 0 12px rgba(250,204,21,0.2)" }}
                                    >
                                        ⏳ PLEASE HOLD
                                    </motion.div>
                                )}
                            </li>
                        );
                    })}
                </motion.ul>

            </div>


        </motion.nav>
    );
}
