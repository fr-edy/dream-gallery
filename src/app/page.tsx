"use client";

import PrismaticBurst from "@/components/PrismaticBurst";


export default function Home() {
  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      position: "relative",
      backgroundColor: "#000000",
      overflow: "hidden"
    }}>
      <PrismaticBurst
        animationType="rotate3d"
        intensity={2}
        speed={0.5}
        distort={1.0}
        paused={false}
        offset={{ x: 0, y: 0 }}
        hoverDampness={0.25}
        rayCount={24}
        mixBlendMode="normal"
        colors={["#ff007a", "#4d3dff", "#ffffff"]}
      />
    </div>
  );
}
