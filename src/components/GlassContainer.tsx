"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dreamy" | "minimal" | "default";
}

const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className,
  variant = "primary",
}) => {
  const baseStyles =
    "backdrop-blur-md border rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl";

  const variantStyles = {
    primary:
      "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30",
    secondary:
      "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
    dreamy:
      "bg-purple-500/10 border-purple-300/20 hover:bg-purple-500/15 hover:border-purple-300/30",
    minimal:
      "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15",
    default:
      "bg-white/8 border-white/15 hover:bg-white/12 hover:border-white/25",
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </div>
  );
};

export default GlassContainer;
