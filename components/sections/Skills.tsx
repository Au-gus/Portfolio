"use client";

import { motion } from "framer-motion";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

const skills = [
    "Next.js 15", "React 19", "TypeScript", "Tailwind CSS",
    "WebGL", "Three.js", "Framer Motion", "GLSL Shaders",
    "Node.js", "PostgreSQL", "System Architecture", "UI/UX"
];

export function Skills() {
    return (
        <section className="py-32 px-4 md:px-12 z-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-mono tracking-tighter mb-16 text-white text-center">
                    Capabilities
                </h2>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl">
                    {skills.map((skill, i) => (
                        <MagneticWrapper key={skill}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="px-6 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-default"
                            >
                                {skill}
                            </motion.div>
                        </MagneticWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
