"use client";

import AppleLiquidGlass from "@/components/AppleLiquidGlass";
import GlassContainer from "@/components/GlassContainer";

export default function Home() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <AppleLiquidGlass
        backgroundImage="/images/landing-bg.jpeg"
        className="h-full w-full"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="space-y-8 text-center">
            <h1 className="text-6xl font-light text-white">Dream Gallery</h1>
            <p className="mx-auto max-w-xl font-serif text-lg text-white/60 italic md:text-xl">
              Crafted with elegance, designed for dreams
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <GlassContainer className="px-8 py-4">
                <a
                  href="/calendar"
                  className="text-lg font-light tracking-wide text-white/90 transition-colors hover:text-white"
                >
                  View Calendar
                </a>
              </GlassContainer>

              <GlassContainer className="px-8 py-4" variant="secondary">
                <a
                  href="#"
                  className="text-lg font-light tracking-wide text-white/90 transition-colors hover:text-white"
                >
                  Create Magic
                </a>
              </GlassContainer>
            </div>
          </div>
        </div>
      </AppleLiquidGlass>
    </div>
  );
}
