"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getAllProjects } from "@/data/projects";
import { GridBg } from "@/components/background/GridBg";
import { ImageLoader } from "@/components/ui/ImageLoader";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

export default function AllProjectsPage() {
    const all = getAllProjects();

    return (
        <main className="min-h-screen bg-[#050507] text-white pt-32 pb-24 px-4 md:px-12 relative">
            <GridBg />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white font-mono text-sm mb-8 transition-colors"
                    >
                        ← Back to Portfolio
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-mono tracking-tighter text-white mb-4">
                        All Projects
                    </h1>
                    <p className="text-white/50 text-lg max-w-xl">
                        A complete collection of my work across data science, machine learning, computer vision, and web development.
                    </p>
                </motion.div>
            </div>

            {/* Static Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {all.map((project, i) => (
                    <div
                        key={project.id}
                        className="w-full group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm h-[300px] animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <Link href={`/project/${project.id}`} className="absolute inset-0 z-20" draggable={false}>
                            <span className="sr-only">View {project.title}</span>
                        </Link>

                        <ImageLoader
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover opacity-50 group-hover:opacity-90 transition-opacity duration-700 group-hover:scale-105 pointer-events-none"
                            wrapperClassName="absolute inset-0 z-0 pointer-events-none"
                        />

                        {/* Tags */}
                        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
                            {project.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-white/60 text-xs font-mono backdrop-blur-md">
                                    {tag}
                                </span>
                            ))}
                            {project.featured && (
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono backdrop-blur-md">
                                    Featured
                                </span>
                            )}
                        </div>

                        {/* Floating Content footer */}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-between items-end z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                            <div className="flex-1 pr-4">
                                <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">{project.category}</p>
                                <h3 className="text-xl text-white font-heading tracking-tight mb-1">{project.title}</h3>
                                <p className="text-xs text-white/50 font-mono">{project.platform}</p>
                            </div>
                            <MagneticWrapper>
                                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md text-white text-sm group-hover:bg-white group-hover:text-black transition-colors shrink-0 pointer-events-auto">
                                    ↗
                                </div>
                            </MagneticWrapper>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
