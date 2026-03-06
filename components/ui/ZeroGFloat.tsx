"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ZeroGFloatProps {
    children: ReactNode;
    className?: string;
    intensity?: number; // 1 = subtle, 2 = moderate, 3 = strong
}

export function ZeroGFloat({ children, className = "", intensity = 2 }: ZeroGFloatProps) {
    const lift = intensity * 4;     // How much it floats up
    const rotate = intensity * 0.5; // Slight tilt
    const scale = 1 + intensity * 0.008; // Subtle grow

    return (
        <motion.div
            className={className}
            whileHover={{
                y: -lift,
                rotate: [0, -rotate, rotate, 0],
                scale,
                transition: {
                    y: { type: "spring", stiffness: 80, damping: 12 },
                    rotate: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                    scale: { type: "spring", stiffness: 200, damping: 15 },
                },
            }}
            style={{ willChange: "transform" }}
        >
            {children}
        </motion.div>
    );
}
