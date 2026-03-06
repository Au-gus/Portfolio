"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { RefreshInterceptor } from "@/components/ui/RefreshInterceptor";

/**
 * Detects a page reload on the client and mounts the RefreshInterceptor
 * overlay instead of exposing the normal page content immediately.
 * Only fires after the first `fa_visited` cookie is set (i.e., the user
 * has already completed the IntroSequence at least once).
 */
export function RefreshGate({ children }: { children: React.ReactNode }) {
    const [showInterceptor, setShowInterceptor] = useState(false);

    useEffect(() => {
        try {
            const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
            const isReload = navEntry?.type === "reload";
            const hasVisited = localStorage.getItem("fa_visited") === "true";

            if (isReload && hasVisited) {
                setShowInterceptor(true);
            }
        } catch {
            // Performance API unavailable — graceful degradation
        }
    }, []);

    return (
        <>
            <AnimatePresence>
                {showInterceptor && (
                    <RefreshInterceptor onDismiss={() => setShowInterceptor(false)} />
                )}
            </AnimatePresence>
            {children}
        </>
    );
}
