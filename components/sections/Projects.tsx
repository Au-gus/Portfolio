"use client";

import { motion } from "framer-motion";
import { ImageLoader } from "@/components/ui/ImageLoader";
import Link from "next/link";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { getFeaturedProjects } from "@/data/projects";

const spans = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-1",
];

export function Projects() {
    const featured = getFeaturedProjects();

    return (
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto z-10 relative">
            <div className="flex justify-between items-end mb-16">
                <h2 className="text-4xl md:text-6xl font-heading tracking-tighter text-white">
                    Projects
                </h2>
                <MagneticWrapper>
                    <Link
                        href="/projects"
                        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 font-mono text-sm transition-all duration-300 cursor-pointer"
                    >
                        View All ↗
                    </Link>
                </MagneticWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                {featured.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                        className={`group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ${spans[i] ?? ""}`}
                    >
                        <Link href={`/project/${project.id}`} className="absolute inset-0 z-20">
                            <span className="sr-only">View {project.title}</span>
                        </Link>

                        <ImageLoader
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105"
                            wrapperClassName="absolute inset-0 z-0"
                        />

                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            {project.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-black/50 border border-white/10 text-white/60 text-xs font-mono backdrop-blur-md">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-between items-end z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex-1 pr-6">
                                <p className="text-sm font-mono text-white/70 mb-2">{project.category}</p>
                                <h3 className="text-2xl text-white font-heading tracking-tight mb-2">{project.title}</h3>
                                <p className="text-sm text-white/90 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">{project.context}</p>
                            </div>
                            <MagneticWrapper>
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md text-white group-hover:bg-white group-hover:text-black transition-colors">
                                    ↗
                                </div>
                            </MagneticWrapper>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Mobile: View All */}
            <div className="flex justify-center mt-12 md:hidden">
                <Link
                    href="/projects"
                    className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-mono text-sm hover:bg-white/10 transition-all duration-300"
                >
                    View All Projects ↗
                </Link>
            </div>
        </section>
    );
}
