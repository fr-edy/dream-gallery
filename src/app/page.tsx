"use client";

import AppleLiquidGlass from "@/components/AppleLiquidGlass";
import DreamCard from "@/components/DreamCard";
import GlassButton from "@/components/GlassButton";
import { ChevronRight } from "lucide-react";

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
            <p className="mx-auto max-w-xl font-serif text-lg text-white/60 md:text-xl">
              Crafted with elegance, designed for dreams
            </p>

            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row">
              <GlassButton
                className="text-md font-serif font-light text-white/90 transition-colors hover:text-white w-40 h-10"
              >
                <div className="flex items-center gap-2">
                  <span>Explore Dreams</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </GlassButton>
              
            </div>
          </div>
        </div>
      </AppleLiquidGlass>
    </div>
  );
}
