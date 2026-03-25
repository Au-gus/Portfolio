"use client";

import { useEffect, useRef } from "react";

export function useMousePosition() {
    const position = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            position.current.x = event.clientX;
            position.current.y = event.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return position;
}
