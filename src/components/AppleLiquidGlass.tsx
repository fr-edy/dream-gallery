"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

// Vertex shader for liquid glass distortion
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for liquid glass effect
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform sampler2D uTexture;
  uniform float uDistortion;
  uniform float uRadius;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Noise function for organic distortion
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Smooth noise
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Optimized fractal noise with fewer iterations
  float fractalNoise(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    // Reduced from 4 to 2 iterations for better performance
    for (int i = 0; i < 2; i++) {
      value += amplitude * smoothNoise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate distance from mouse
    vec2 mousePos = uMouse * 0.5 + 0.5;
    float dist = distance(uv, mousePos);
    
    // Create ripple effect
    float ripple = sin(dist * 20.0 - uTime * 3.0) * exp(-dist * 5.0);
    
    // Optimized noise distortion with reduced calculations
    vec2 noiseUv = uv * 2.0 + uTime * 0.08;
    float noiseValue = fractalNoise(noiseUv);
    
    // Simplified liquid effect calculation
    vec2 distortion = vec2(
      sin(uv.y * 8.0 + uTime + noiseValue) * 0.015,
      cos(uv.x * 8.0 + uTime + noiseValue) * 0.015
    );
    
    // Add mouse interaction distortion
    if (dist < uRadius) {
      float strength = (1.0 - dist / uRadius) * uDistortion;
      vec2 direction = normalize(uv - mousePos);
      distortion += direction * strength * ripple;
    }
    
    // Apply distortion to UV coordinates
    vec2 distortedUv = uv + distortion;
    
    // Sample the texture with distorted coordinates
    vec4 color = texture2D(uTexture, distortedUv);
    
    // Optimized glass-like refraction
    float fresnel = pow(1.0 - abs(dot(normalize(vPosition), vec3(0.0, 0.0, 1.0))), 1.5);
    color.rgb += fresnel * 0.08;
    
    // Simplified color shift for glass effect
    float colorShift = sin(uTime + distortedUv.x * 6.0) * 0.015;
    color.rgb += vec3(colorShift, colorShift * 0.8, colorShift * 1.2);
    
    gl_FragColor = color;
  }
`;

// Create shader material
const LiquidGlassMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uTexture: null,
    uDistortion: 0.1,
    uRadius: 0.3,
    uResolution: new THREE.Vector2(1, 1),
  },
  vertexShader,
  fragmentShader
);

// Extend the material to make it available in JSX
extend({ LiquidGlassMaterial });

// Declare the material type for TypeScript
declare module "@react-three/fiber" {
  interface ThreeElements {
    liquidGlassMaterial: React.RefAttributes<THREE.ShaderMaterial> & {
      uTexture?: THREE.Texture;
      uDistortion?: number;
      uRadius?: number;
      transparent?: boolean;
    };
  }
}

interface LiquidGlassPlaneProps {
  backgroundImage: string;
  mouse: THREE.Vector2;
}

function LiquidGlassPlane({ backgroundImage, mouse }: LiquidGlassPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<
    THREE.ShaderMaterial & {
      uTime: number;
      uMouse: THREE.Vector2;
      uResolution: THREE.Vector2;
    }
  >(null);
  const { viewport } = useThree();

  // Load background texture
  const texture = useTexture(backgroundImage);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uMouse.copy(mouse);
      materialRef.current.uResolution.set(viewport.width, viewport.height);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <liquidGlassMaterial
        ref={materialRef}
        uTexture={texture}
        uDistortion={0.15}
        uRadius={0.4}
        transparent
      />
    </mesh>
  );
}

interface AppleLiquidGlassProps {
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function AppleLiquidGlass({
  backgroundImage = "/images/landing-bg.jpeg",
  className = "",
  children,
}: AppleLiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const [webglSupported, setWebglSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebglSupported(false);
    }

    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current && !isMobile) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        mouse.current.set(x, y);
      }
    };

    // Add touch support for mobile
    const handleTouchMove = (event: TouchEvent) => {
      if (containerRef.current && isMobile && event.touches.length > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        const touch = event.touches[0];
        if (touch) {
          const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
          mouse.current.set(x, y);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile]);

  // Fallback for non-WebGL devices
  if (!webglSupported) {
    return (
      <div ref={containerRef} className={`relative h-full w-full ${className}`}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: "brightness(0.6) contrast(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/30" />

        {children && (
          <div className="relative z-10 h-full w-full">{children}</div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        dpr={
          isMobile
            ? 1
            : Math.min(
                typeof window !== "undefined" ? window.devicePixelRatio : 1,
                2
              )
        } // Optimize for mobile
        performance={{ min: 0.5 }} // Performance optimization
      >
        <LiquidGlassPlane
          backgroundImage={backgroundImage}
          mouse={mouse.current}
        />
      </Canvas>

      {/* Content overlay */}
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}
