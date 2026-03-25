"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageLoaderProps extends ImageProps {
    wrapperClassName?: string;
    fallbackClassName?: string;
}

export function ImageLoader({
    className,
    wrapperClassName,
    fallbackClassName,
    alt,
    ...props
}: ImageLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn("relative overflow-hidden", wrapperClassName)}>
            {isLoading && (
                <div className={cn("absolute inset-0 animate-pulse bg-white/10 z-0", fallbackClassName)} />
            )}
            <Image
                {...props}
                alt={alt || "Image"}
                className={cn(
                    "duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] z-10",
                    isLoading ? "scale-[1.02] blur-xl opacity-0" : "scale-100 blur-0 opacity-100",
                    className
                )}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
