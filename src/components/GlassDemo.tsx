"use client";

import React from "react";
import GlassContainer from "./GlassContainer";

const GlassDemo: React.FC = () => {
  return (
    <div className="mt-16 flex flex-col items-center space-y-8">
      {/* Floating glass elements for artistic effect */}
      <div className="relative">
        <GlassContainer
          variant="dreamy"
          className="rotate-3 transform p-8 transition-transform duration-700 ease-out hover:rotate-0"
        >
          <div className="text-center text-white/80">
            <h3 className="mb-2 text-2xl font-light">Dreams</h3>
            <p className="text-sm opacity-70">Float like whispers</p>
          </div>
        </GlassContainer>
      </div>

      <div className="relative">
        <GlassContainer
          variant="minimal"
          className="-rotate-2 transform p-6 transition-transform duration-500 ease-out hover:rotate-1"
        >
          <div className="text-center text-white/70">
            <h3 className="mb-1 text-xl font-light">Memories</h3>
            <p className="text-xs opacity-60">Captured in glass</p>
          </div>
        </GlassContainer>
      </div>

      <div className="relative">
        <GlassContainer
          variant="default"
          className="rotate-1 transform p-4 transition-transform duration-600 ease-out hover:-rotate-1"
        >
          <div className="text-center text-white/60">
            <h3 className="text-lg font-light">Moments</h3>
            <p className="text-xs opacity-50">Suspended in time</p>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};

export default GlassDemo;
