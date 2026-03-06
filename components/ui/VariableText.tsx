"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function VariableText({
    text,
    className
}: {
    text: string;
    className?: string;
}) {
    const { scrollYProgress } = useScroll();
    const fontWeight = useTransform(scrollYProgress, [0, 1], [300, 800]);

    return (
        <motion.h1
            className={cn("tracking-tighter inline-block", className)}
            style={{ fontWeight }}
        >
            {text}
        </motion.h1>
    );
}
