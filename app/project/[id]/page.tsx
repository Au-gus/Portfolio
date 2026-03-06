import { ImageLoader } from "@/components/ui/ImageLoader";
import { projectDetails } from "@/data/projects";
import { UniqueProjectBg } from "@/components/background/UniqueProjectBg";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const project = projectDetails[id as keyof typeof projectDetails];

    if (!project) return notFound();

    return (
        <>
            <UniqueProjectBg projectId={id} />
            <main className="min-h-screen pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto relative z-10">

                {/* Header section */}
                <Link href="/projects" className="inline-block mb-8 text-white/50 hover:text-white font-mono transition-colors">
                    ← Back to Projects
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono uppercase tracking-wider">
                                {project.category}
                            </span>
                            <span className="text-white/50 font-mono text-sm max-w-sm">
                                Platform: {project.platform}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading tracking-tighter text-white">
                            {project.title}
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content (Notebook Style) */}
                    <div className="lg:col-span-8 flex flex-col space-y-12">

                        {/* Banner Image */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10">
                            <ImageLoader
                                src={project.image}
                                fill
                                alt={project.title}
                                className="object-cover opacity-80"
                                wrapperClassName="absolute inset-0"
                            />
                        </div>

                        {/* Context */}
                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-heading text-white mb-4 flex items-center gap-3">
                                <span className="w-6 h-[1px] bg-white/30 block"></span>
                                1. Context & Objective
                            </h2>
                            <p className="text-white/70 leading-relaxed font-sans text-lg">
                                {project.context}
                            </p>
                        </section>

                        {/* Methodology */}
                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-heading text-white mb-4 flex items-center gap-3">
                                <span className="w-6 h-[1px] bg-white/30 block"></span>
                                2. Methodology
                            </h2>
                            <div className="text-white/70 leading-relaxed font-sans text-lg whitespace-pre-line mb-8">
                                {project.methodology}
                            </div>

                            {/* Code Block Notebook Style */}
                            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl">
                                <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <span className="ml-4 text-xs font-mono text-white/40">In [1]:</span>
                                </div>
                                <div className="p-6 overflow-x-auto">
                                    <pre className="font-mono text-sm leading-relaxed text-blue-300">
                                        <code>{project.codeSnippet}</code>
                                    </pre>
                                </div>
                            </div>
                        </section>

                        {/* Results / Learnings */}
                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-heading text-white mb-4 flex items-center gap-3">
                                <span className="w-6 h-[1px] bg-white/30 block"></span>
                                3. Final Learnings
                            </h2>
                            <p className="text-white/70 leading-relaxed font-sans text-lg">
                                {project.learnings}
                            </p>
                        </section>

                    </div>

                    {/* Sidebar Metadata */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-32 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-heading text-white mb-6 border-b border-white/10 pb-4">Dataset details</h3>

                            <div className="flex flex-col gap-6">
                                <div>
                                    <p className="text-sm font-mono text-white/60 mb-1">Language</p>
                                    <p className="text-white">{project.language}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-mono text-white/60 mb-1">Size</p>
                                    <p className="text-white">{project.datasetSize}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-mono text-white/60 mb-2">Libraries Used</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.libraries.map((lib, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-white/80 border border-white/10">
                                                {lib}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}
