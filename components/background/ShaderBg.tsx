"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";
import { useMousePosition } from "@/hooks/useMousePosition";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Bypass camera matrices to ensure the plane always fills the screen exactly
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollVelocity;

  varying vec2 vUv;
  
  // Minimalist pseudo-noise for organic fluid movement
  float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  
  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 p = vUv;
    
    // Slow, deep warping
    vec2 warp = p;
    warp.x += noise(p * 2.0 + uTime * 0.1) * 0.2;
    warp.y += noise(p * 3.0 - uTime * 0.15) * 0.2;

    // Dist to mouse (0 to 1)
    float dist = distance(warp, uMouse);
    float glow = smoothstep(0.9, 0.0, dist) * 0.5; // Bright enough to see, but subtle

    // React to scroll velocity - creates a temporary brightness spike when scrolling
    float clampedVel = clamp(uScrollVelocity * 0.005, -1.0, 1.0);
    float intensity = abs(clampedVel) * 0.25;
    
    // Base colors - Deep, practically black void
    vec3 bg = vec3(0.015, 0.015, 0.02); 
    // Liquid glass/aurora highlight near mouse
    vec3 highlight = vec3(0.03, 0.08, 0.18); 
    
    vec3 col = mix(bg, highlight, glow + intensity * noise(warp * 5.0));
    
    // Procedural noise/grain to reduce banding and add physical texture
    float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.035;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderPlane() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const scrollVelocity = useScrollVelocity();
    const mousePosition = useMousePosition();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uScrollVelocity: { value: 0 },
        }),
        []
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

            const targetMouseX = mousePosition.x / window.innerWidth;
            const targetMouseY = 1.0 - (mousePosition.y / window.innerHeight);

            // Silky smooth mouse follow
            materialRef.current.uniforms.uMouse.value.x += (targetMouseX - materialRef.current.uniforms.uMouse.value.x) * 0.025;
            materialRef.current.uniforms.uMouse.value.y += (targetMouseY - materialRef.current.uniforms.uMouse.value.y) * 0.025;

            const targetVel = Math.abs(scrollVelocity);
            materialRef.current.uniforms.uScrollVelocity.value += (targetVel - materialRef.current.uniforms.uScrollVelocity.value) * 0.05;
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

export function ShaderBg() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                gl={{ antialias: false, powerPreference: "high-performance" }}
                dpr={[1, 1.5]}
            >
                <ShaderPlane />
            </Canvas>
        </div>
    );
}
