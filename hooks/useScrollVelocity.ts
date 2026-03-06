"use client";

import { useLenis } from "lenis/react";
import { useState } from "react";

export function useScrollVelocity() {
    const [velocity, setVelocity] = useState(0);

    useLenis(({ velocity }) => {
        setVelocity(velocity);
    });

    return velocity;
}
