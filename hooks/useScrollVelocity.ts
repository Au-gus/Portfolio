"use client";

import { useLenis } from "lenis/react";
import { useRef } from "react";

export function useScrollVelocity() {
    const velocity = useRef(0);

    useLenis(({ velocity: v }) => {
        velocity.current = v;
    });

    return velocity;
}
