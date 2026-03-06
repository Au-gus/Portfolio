"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function UniqueProjectBg({ projectId }: { projectId: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const onResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);

        let time = 0;

        // --- Effect State Arrays ---

        // P1: Ocean (Titanic)
        const bubbles = Array.from({ length: 60 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            s: Math.random() * 3 + 1,
            v: Math.random() * 0.8 + 0.2
        }));

        // P2: Data Graphs (Unemployment)
        const lines = Array.from({ length: 7 }).map(() => ({
            y: Math.random() * h,
            pts: [] as { x: number, y: number }[],
            speed: Math.random() * 2 + 1
        }));

        // P3: Iris (Floral concentric patterns)
        const irises = Array.from({ length: 4 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            offset: Math.random() * Math.PI * 2
        }));

        // P4: Loan (Financial numbers / 01s)
        const finChars = Array.from({ length: 150 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            char: Math.random() > 0.5 ? "$" : "%",
            speed: Math.random() * 1.5 + 0.5
        }));

        // P5: Amazon (Grid blocks)
        // Handled directly in loop

        // P6: NLP (Matrix raining words)
        const words = ["POSITIVE", "NEGATIVE", "NEUTRAL", "SENTIMENT", "ANALYZE", "CLASSIFY", "TEXT", "NLP", "TOKEN", "VECTOR"];
        const floatingWords = Array.from({ length: 40 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            text: words[Math.floor(Math.random() * words.length)],
            speed: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1
        }));

        // P7: YOLO (Bounding boxes)
        const boxes = Array.from({ length: 15 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            w: Math.random() * 150 + 50,
            h: Math.random() * 150 + 50,
            opacity: Math.random() * 0.3,
            c: Math.random() > 0.5 ? "#0f0" : "#f00"
        }));

        // P8: Upvotes (Arrows flying up)
        const arrows = Array.from({ length: 50 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            speed: Math.random() * 3 + 1,
            scale: Math.random() * 0.5 + 0.5
        }));

        // P9: SQL (Cylinders)
        const dbs = Array.from({ length: 20 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            scale: Math.random() * 0.5 + 0.5,
            offset: Math.random() * Math.PI * 2
        }));


        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);
            time += 0.01;

            if (projectId === "1") {
                // TITANIC: Deep Ocean
                const grd = ctx.createLinearGradient(0, 0, 0, h);
                grd.addColorStop(0, "#010308");
                grd.addColorStop(1, "#031020");
                ctx.fillStyle = grd;
                ctx.fillRect(0, 0, w, h);

                ctx.strokeStyle = "rgba(40, 100, 180, 0.15)";
                ctx.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    for (let x = 0; x <= w; x += 20) {
                        const y = h / 2 + Math.sin(x * 0.003 + time + i * 0.5) * 150 + (i - 3) * 80;
                        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }

                ctx.fillStyle = "rgba(100, 180, 255, 0.3)";
                bubbles.forEach(b => {
                    b.y -= b.v;
                    b.x += Math.sin(b.y * 0.01 + time) * 0.5;
                    if (b.y < -10) { b.y = h + 10; b.x = Math.random() * w; }
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.s, 0, Math.PI * 2);
                    ctx.fill();
                });

            } else if (projectId === "2") {
                // UNEMPLOYMENT: Market Charts
                ctx.lineWidth = 2;
                lines.forEach((l, idx) => {
                    if (l.pts.length === 0 || l.pts[l.pts.length - 1].x < w) {
                        const lastY = l.pts.length > 0 ? l.pts[l.pts.length - 1].y : l.y;
                        l.pts.push({ x: l.pts.length > 0 ? l.pts[l.pts.length - 1].x + 20 : 0, y: lastY + (Math.random() - 0.5) * 50 });
                    }
                    ctx.beginPath();
                    ctx.strokeStyle = idx % 2 === 0 ? "rgba(255, 80, 80, 0.2)" : "rgba(80, 200, 255, 0.2)";
                    for (let i = 0; i < l.pts.length; i++) {
                        l.pts[i].x -= l.speed;
                        if (i === 0) ctx.moveTo(l.pts[i].x, l.pts[i].y);
                        else ctx.lineTo(l.pts[i].x, l.pts[i].y);
                    }
                    ctx.stroke();
                    if (l.pts[0] && l.pts[0].x < -50) l.pts.shift(); // Remove off-screen points
                });

            } else if (projectId === "3") {
                // IRIS: Floral / Organics
                irises.forEach(iris => {
                    ctx.save();
                    ctx.translate(iris.x, iris.y + Math.sin(time + iris.offset) * 30);
                    ctx.rotate(time * 0.2 + iris.offset);
                    ctx.strokeStyle = `rgba(180, 80, 255, 0.15)`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    for (let j = 0; j < 6; j++) {
                        ctx.rotate(Math.PI / 3);
                        ctx.ellipse(40, 0, 80, 20, 0, 0, Math.PI * 2);
                    }
                    ctx.stroke();
                    ctx.restore();
                });

            } else if (projectId === "4") {
                // LOAN PREDICTION: Financial Matrix
                ctx.font = "18px monospace";
                finChars.forEach(fc => {
                    fc.y += fc.speed;
                    if (fc.y > h + 20) { fc.y = -20; fc.x = Math.random() * w; }
                    ctx.fillStyle = `rgba(50, 255, 120, ${0.1 + Math.sin(time * 2 + fc.x) * 0.05})`;
                    ctx.fillText(fc.char, fc.x, fc.y);
                });

            } else if (projectId === "5") {
                // AMAZON: E-commerce Grid blocks
                ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 60) {
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
                }
                for (let y = 0; y < h; y += 60) {
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
                }
                ctx.fillStyle = "rgba(255, 150, 0, 0.1)";
                const sx = (Math.floor(time * 15) % 20) * 60;
                const sy = (Math.floor(time * 8) % 20) * 60;
                ctx.fillRect(sx, sy, 60, 60);

            } else if (projectId === "6") {
                // NLP SENTIMENT: Floating Words
                ctx.font = "14px monospace";
                floatingWords.forEach(fw => {
                    fw.y -= fw.speed;
                    if (fw.y < -20) {
                        fw.y = h + 20;
                        fw.x = Math.random() * w;
                    }
                    ctx.fillStyle = `rgba(100, 150, 255, ${fw.opacity})`;
                    ctx.fillText(fw.text, fw.x, fw.y);
                });

            } else if (projectId === "7") {
                // YOLO: Bounding Boxes
                ctx.lineWidth = 1;
                boxes.forEach((b, i) => {
                    b.w += Math.sin(time + i) * 0.5;
                    b.h += Math.cos(time + i) * 0.5;
                    ctx.strokeStyle = b.c === "#0f0" ? `rgba(0, 255, 0, ${b.opacity})` : `rgba(255, 0, 0, ${b.opacity})`;
                    ctx.strokeRect(b.x, b.y, b.w, b.h);

                    ctx.beginPath();
                    ctx.moveTo(b.x + b.w / 2 - 5, b.y + b.h / 2);
                    ctx.lineTo(b.x + b.w / 2 + 5, b.y + b.h / 2);
                    ctx.moveTo(b.x + b.w / 2, b.y + b.h / 2 - 5);
                    ctx.lineTo(b.x + b.w / 2, b.y + b.h / 2 + 5);
                    ctx.stroke();

                    // Confidence score text
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.font = "10px sans-serif";
                    ctx.fillText(`${b.c === "#0f0" ? "person" : "car"} ${(0.8 + b.opacity).toFixed(2)}`, b.x, b.y - 4);
                });

            } else if (projectId === "8") {
                // UPVOTES: Arrows
                ctx.strokeStyle = "rgba(255, 120, 50, 0.2)";
                ctx.lineWidth = 2;
                arrows.forEach(a => {
                    a.y -= a.speed;
                    if (a.y < -50) { a.y = h + 50; a.x = Math.random() * w; }

                    ctx.save();
                    ctx.translate(a.x, a.y + Math.sin(time * 5 + a.x) * 2);
                    ctx.scale(a.scale, a.scale);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(15, -15);
                    ctx.lineTo(30, 0);
                    ctx.moveTo(15, -15);
                    ctx.lineTo(15, 30);
                    ctx.stroke();
                    ctx.restore();
                });

            } else if (projectId === "9") {
                // SQL: Databases Cylinders
                ctx.strokeStyle = "rgba(100, 200, 255, 0.15)";
                ctx.lineWidth = 1;
                dbs.forEach(db => {
                    const oy = Math.sin(time + db.offset) * 20;
                    ctx.save();
                    ctx.translate(db.x, db.y + oy);
                    ctx.scale(db.scale, db.scale);

                    // Draw a stack of 3 discs
                    for (let i = 0; i < 3; i++) {
                        const cy = i * 30;
                        ctx.beginPath();
                        ctx.ellipse(0, cy, 50, 20, 0, 0, Math.PI * 2);
                        if (i === 2) {
                            ctx.moveTo(-50, 0);
                            ctx.lineTo(-50, cy);
                            ctx.moveTo(50, 0);
                            ctx.lineTo(50, cy);
                        }
                        ctx.stroke();
                    }
                    ctx.restore();
                });
            } else {
                // Default fallback
                ctx.fillStyle = "rgba(255,255,255,0.02)";
                for (let i = 0; i < 100; i++) {
                    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
                }
            }

            animId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
        };
    }, [projectId]);

    const getProjectFilter = (id: string) => {
        switch (id) {
            case "1": return "radial-gradient(circle at 50% 0%, rgba(10, 30, 60, 0.4) 0%, transparent 60%)"; // Ocean Blue
            case "2": return "radial-gradient(circle at 100% 0%, rgba(40, 10, 20, 0.4) 0%, transparent 60%)"; // Red/Orange tint
            case "3": return "radial-gradient(circle at 0% 50%, rgba(40, 10, 60, 0.3) 0%, transparent 60%)"; // Floral Purple
            case "4": return "radial-gradient(circle at 50% 100%, rgba(10, 40, 20, 0.3) 0%, transparent 60%)"; // Money Green
            case "5": return "radial-gradient(circle at 80% 20%, rgba(50, 30, 0, 0.3) 0%, transparent 60%)"; // Amazon Orange
            case "6": return "radial-gradient(circle at 20% 80%, rgba(20, 30, 70, 0.3) 0%, transparent 60%)"; // Deep NLP Blue
            case "7": return "radial-gradient(circle at 50% 50%, rgba(40, 0, 0, 0.2) 0%, transparent 70%)"; // YOLO Red
            case "8": return "radial-gradient(circle at 100% 100%, rgba(50, 20, 10, 0.3) 0%, transparent 60%)"; // Upvote Orange
            case "9": return "radial-gradient(circle at 0% 0%, rgba(10, 40, 60, 0.3) 0%, transparent 60%)"; // SQL Cyan
            default: return "radial-gradient(circle at 50% 0%, rgba(30,30,40,0.3) 0%, transparent 60%)";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[-1] pointer-events-none"
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            {/* Dynamic Project Lighting */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{ background: getProjectFilter(projectId) }}
            />
            {/* Base darkener so canvas isn't overwhelmingly bright */}
            <div className="absolute inset-0 bg-[#050507]/70 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,7,0.98)_100%)] pointer-events-none" />
        </motion.div>
    );
}
