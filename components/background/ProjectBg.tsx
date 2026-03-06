"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;
  
  // Perlin/Simplex pseudo-noise
  float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    // Slower, deep fluid movement
    vec2 p = vUv * 3.0; // scale
    float t = uTime * 0.05;
    
    float n1 = noise(p + vec2(t * 1.5, t * 0.8));
    float n2 = noise(p + vec2(-t * 0.5, t * 1.2) + n1);
    
    vec3 finalColor = mix(uColor1, uColor2, n2 * 0.6 + 0.2);
    
    // Subtle grid/grain
    float grain = hash(vUv * 100.0 + uTime) * 0.02;
    
    gl_FragColor = vec4(finalColor + grain, 1.0);
  }
`;

const categoryColors: Record<string, { c1: [number, number, number], c2: [number, number, number] }> = {
    "Data Science": { c1: [0.005, 0.015, 0.025], c2: [0.01, 0.04, 0.07] }, // Teal/Blue
    "Machine Learning": { c1: [0.005, 0.02, 0.01], c2: [0.02, 0.06, 0.03] }, // Dark Green
    "Web Development": { c1: [0.02, 0.005, 0.025], c2: [0.06, 0.01, 0.08] }, // Deep Purple
    "Computer Vision": { c1: [0.025, 0.005, 0.005], c2: [0.08, 0.02, 0.02] }, // Crimson
    "Natural Language Processing": { c1: [0.025, 0.015, 0.005], c2: [0.07, 0.04, 0.01] }, // Gold/Orange
    "Data Analysis": { c1: [0.005, 0.02, 0.03], c2: [0.01, 0.06, 0.09] }, // Cyan
    "Data Engineering": { c1: [0.015, 0.015, 0.03], c2: [0.04, 0.04, 0.09] }, // Indigo
    "Default": { c1: [0.005, 0.01, 0.02], c2: [0.02, 0.04, 0.08] }
};

function OceanShaderPlane({ category }: { category: string }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const colors = categoryColors[category] || categoryColors["Default"];

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(...colors.c1) },
            uColor2: { value: new THREE.Color(...colors.c2) }
        }),
        [colors.c1, colors.c2]
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2, 1, 1]} />
            <shaderMaterial
                ref={materialRef}
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                depthWrite={false}
            />
        </mesh>
    );
}

export function ProjectBg({ category = "Default" }: { category?: string }) {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                gl={{ antialias: false, powerPreference: "low-power" }} // Optimization since it's just a background gradient
                dpr={[1, 1]}
            >
                <OceanShaderPlane category={category} />
            </Canvas>
            {/* Soft vignette overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        </div>
    );
}
