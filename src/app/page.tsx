"use client";

import AppleLiquidGlass from "@/components/AppleLiquidGlass";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <AppleLiquidGlass
        backgroundImage="/images/landing-bg.jpeg"
        className="h-full w-full"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="space-y-4 text-left">
            <h1 className="font-serif text-6xl font-thin text-white">
              Dreamer
            </h1>
            <p className="mx-auto max-w-xl font-serif text-lg text-white/80 md:text-xl">
              Crafted with elegance, designed for dreams
            </p>

            <a href="/calendar" className="flex space-x-2 text-white items-center group">
              <span>Explore Dreams</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-all" />
            </a>

            {/* <GlassContainer>
              <GlassButton
                text="Explore dreams"
                onClick={() => {
                  window.location.href = "/calendar";
                }}
              ></GlassButton>
            </GlassContainer>

            <GlassButton
              text="Explore dreams"
              onClick={() => {
                window.location.href = "/calendar";
              }}
            ></GlassButton> */}
          </div>
        </div>
      </AppleLiquidGlass>
    </div>
  );
}
