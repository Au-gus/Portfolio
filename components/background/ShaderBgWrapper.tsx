"use client";

import dynamic from "next/dynamic";

const ShaderBgDynamic = dynamic(() => import("./ShaderBg").then(mod => mod.ShaderBg), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-background z-[-1]" />
});

export function ShaderBgWrapper() {
    return <ShaderBgDynamic />;
}
