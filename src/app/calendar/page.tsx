"use client";

import Calendar from "@/components/Calendar";
import AppleLiquidGlass from "@/components/AppleLiquidGlass";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CalendarPage() {
  const handleDateSelect = (date: Date) => {
    console.log("Selected date:", date);
    // You can add more functionality here, like opening a modal or navigating to a specific day
  };

  return (
    <div className="min-h-screen w-full">
      <AppleLiquidGlass
        backgroundImage="/images/landing-bg.jpeg"
        className="min-h-screen w-full"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
          </div>

          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              onDateSelect={handleDateSelect}
              className="w-full max-w-4xl"
            />
          </div>
        </div>
      </AppleLiquidGlass>
    </div>
  );
}
