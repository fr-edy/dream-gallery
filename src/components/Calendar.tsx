"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import DreamCard from "./DreamCard";
import { Dream } from "@/types/dream";
import { useDreams } from "@/hooks/useDreams";

interface CalendarProps {
  initialMonth?: number;
  initialYear?: number;
  className?: string;
  onDateSelect?: (date: Date) => void;
  onMonthlyRecap?: (date: Date) => void;
}

interface CalendarDay {
  date: number;
  hasImage: boolean;
  imageUrl: string | undefined;
  isCurrentMonth: boolean;
  isFuture: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  initialMonth = 8, // September (0-indexed)
  initialYear = 2025,
  className = "",
  onDateSelect,
  onMonthlyRecap,
}) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showDreamCard, setShowDreamCard] = useState(false);
  const [hoverRect, setHoverRect] = useState<{
    left: number;
    bottom: number;
    width: number;
    height: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openTarget, setOpenTarget] = useState<{ left: number; top: number } | null>(null);

  // Fetch dreams from database
  const { dreams } = useDreams();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "So"];

  // Classical paintings as background images for calendar squares
  const classicalPaintings = [
    "/images/20122bea-af47-56d8-b1ba-c15a5aa6aa1a.jpg", // Classical painting 1
    "/images/3b386f2221cbd742b5ed496b5c0b1109.jpg", // Classical painting 2
    "/images/727d77cc6f22a262cf047aeb16e9ec67.jpg", // Classical painting 3
    "/images/77585-1024__33939.jpg", // Classical painting 4
    "/images/8f785cb2-6d28-11e8-b1d3-9161aa45bf67_image_hires_160014.jpg", // Classical painting 5
    "/images/Bobkoski-rose2.webp", // Classical painting 6
    "/images/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGRmbWE5LXBkZmFtb3VzcGFpbnRpbmdldGMwMTQwMDUtaW1hZ2VfMy5qcGc.webp", // Classical painting 7
    "/images/images.jpeg", // Classical painting 8
    "/images/nw2s6sh0ngnb1.jpg", // Classical painting 9
    "/images/parmigianino-on-the-sea-shore_u-l-q1hpy8z0.jpg", // Classical painting 10
    "/images/st-jerome-2-2.jpg", // Classical painting 11
  ];

  // Function to get a random painting for a day (fallback)
  const getRandomPainting = (day: number): string => {
    const randomIndex = (day - 1) % classicalPaintings.length;
    return classicalPaintings[randomIndex] || classicalPaintings[0] || "";
  };

  // Create a mapping of days to dreams for the current month/year
  const daysWithDreams = useMemo(() => {
    const dreamMap: { [key: number]: Dream } = {};
    
    if (!dreams || !Array.isArray(dreams)) {
      return dreamMap;
    }
    
    dreams.forEach((dream) => {
      const dreamDate = new Date(dream.created_at);
      const dreamMonth = dreamDate.getMonth();
      const dreamYear = dreamDate.getFullYear();
      const dreamDay = dreamDate.getDate();
      
      // Only include dreams from current month/year
      if (dreamMonth === currentMonth && dreamYear === currentYear) {
        // If there's already a dream for this day, keep the most recent one
        if (!dreamMap[dreamDay] || new Date(dream.created_at) > new Date(dreamMap[dreamDay].created_at)) {
          // Only include dreams with valid image URLs
          if (dream.image && dream.image.trim() !== '') {
            dreamMap[dreamDay] = dream;
          }
        }
      }
    });
    
    return dreamMap;
  }, [dreams, currentMonth, currentYear]);

  // Fallback data for days without database entries using classical paintings
  const fallbackDaysWithImages: { [key: number]: string } = {
    1: getRandomPainting(1),
    2: getRandomPainting(2),
    3: getRandomPainting(3),
    4: getRandomPainting(4),
    5: getRandomPainting(5),
    6: getRandomPainting(6),
    7: getRandomPainting(7),
    8: getRandomPainting(8),
    9: getRandomPainting(9),
    10: getRandomPainting(10),
    11: getRandomPainting(11),
    12: getRandomPainting(12),
    13: getRandomPainting(13),
    14: getRandomPainting(14),
    15: getRandomPainting(15),
    16: getRandomPainting(16),
    17: getRandomPainting(17),
    18: getRandomPainting(18),
    19: getRandomPainting(19),
    20: getRandomPainting(20),
    21: getRandomPainting(21),
    22: getRandomPainting(22),
    23: getRandomPainting(23),
    24: getRandomPainting(24),
    25: getRandomPainting(25),
    26: getRandomPainting(26),
    27: getRandomPainting(27),
    28: getRandomPainting(28),
    29: getRandomPainting(29),
    30: getRandomPainting(30),
    31: getRandomPainting(31),
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: 0,
        hasImage: false,
        imageUrl: undefined,
        isCurrentMonth: false,
        isFuture: false,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentYear, currentMonth, day);
      cellDate.setHours(0, 0, 0, 0);
      const isFuture = cellDate.getTime() > today.getTime();

      // Check if there's a dream entry for this day
      const dreamEntry = daysWithDreams[day];
      let imageUrl: string | undefined;
      let hasImage = false;

      if (isFuture) {
        // Future days get the special future image
        imageUrl = "/images/3155730961d37f7f8480dc2d95216bd0.jpg";
        hasImage = true;
      } else if (dreamEntry) {
        // Use the dream's image URL if available
        imageUrl = dreamEntry.image;
        hasImage = true;
      } else if (fallbackDaysWithImages[day]) {
        // Fall back to placeholder classical paintings for past days without dreams
        imageUrl = fallbackDaysWithImages[day];
        hasImage = true;
      }

      days.push({
        date: day,
        hasImage,
        imageUrl,
        isCurrentMonth: true,
        isFuture,
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };



  const handleDateHover = (day: CalendarDay, targetEl?: HTMLElement) => {
    if (day.isCurrentMonth && day.hasImage) {
      setSelectedDay(day);
      setShowDreamCard(true);
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        setHoverRect({
          left: rect.left,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  };

  const handleDateLeave = () => {
    if (!isOpen) {
      setShowDreamCard(false);
      setSelectedDay(null);
      setHoverRect(null);
    }
  };

  const handleOpen = (day: CalendarDay, targetEl?: HTMLElement) => {
    if (!day.isCurrentMonth) return;
    const rect = targetEl?.getBoundingClientRect();
    if (rect) {
      setHoverRect({
        left: rect.left,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      });
    }
    setSelectedDay(day);
    setShowDreamCard(true);
    const cardWidth = 370;
    const cardHeight = 418;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerLeft = (viewportWidth - cardWidth) / 2;
    const centerTop = (viewportHeight - cardHeight) / 2;
    setOpenTarget({ left: centerLeft, top: centerTop });
    setIsOpen(true);
    if (onDateSelect) {
      const selectedDate = new Date(currentYear, currentMonth, day.date);
      onDateSelect(selectedDate);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setOpenTarget(null);
    setShowDreamCard(false);
    setSelectedDay(null);
    setHoverRect(null);
  };

  const calendarDays = generateCalendarDays();


  return (
    <div
      className={`relative mx-auto max-w-4xl rounded-[40px] bg-white/80 backdrop-blur-sm p-6 shadow-lg ${className}`}
    >
      {/* Header with title, navigation arrows, and user avatar */}
      <div className="mb-6 flex items-start justify-between">
        <div className="relative">
          <h1 className="mt-9 font-serif text-4xl text-black">
            {monthNames[currentMonth]} {currentYear}
          </h1>
          {/* Navigation arrows - positioned absolutely to stay in fixed position */}
          <div className="absolute top-9 left-80 flex flex-row space-x-1">
            <button
              onClick={handlePrevMonth}
              className="rounded p-1 hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronUp className="h-6 w-6 text-black" />
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded p-1 hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronDown className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>
        <motion.div 
          className="rounded-full bg-gray-300 p-2 hover:bg-gray-400 cursor-pointer"
          whileHover={{ 
            scale: 1.1,
            rotate: 360,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              rotate: { duration: 0.6, ease: "easeInOut" }
            }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 25
            }
          }}
        >
          <User className="h-6 w-6 text-gray-600" />
        </motion.div>
      </div>

      {/* Day labels */}
      <div className="mb-6 grid grid-cols-7 gap-4 px-2">
        {dayLabels.map((day) => (
          <div key={day} className="text-center font-serif text-xl text-black">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="mb-8 grid grid-cols-7 gap-4">
        {calendarDays.map((day, index) => (
          <motion.div
            key={index}
            className={`relative flex h-20 cursor-pointer items-start justify-start rounded-lg p-3 ${
              day.isCurrentMonth
                ? day.hasImage
                  ? "bg-cover bg-center bg-no-repeat"
                  : "bg-gray-800"
                : "invisible"
            } `}
            style={{
              backgroundImage: day.hasImage && !day.isFuture
                ? `url(${day.imageUrl})`
                : undefined,
            }}
            initial={{ scale: 1, y: 0 }}
            animate={{ 
              scale: 1,
              y: 0,
            }}
            whileHover={day.isCurrentMonth ? {
              scale: 1.05,
              y: -8,
              rotateY: 5,
              rotateX: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 0.8
              }
            } : {}}
            whileTap={day.isCurrentMonth ? {
              scale: 0.95,
              y: -2,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            } : {}}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              mass: 0.8
            }}
            onClick={(event) => handleOpen(day, event.currentTarget as HTMLElement)}
            onHoverStart={(event) => {
              handleDateHover(day, (event.currentTarget as HTMLElement) ?? undefined);
            }}
            onHoverEnd={() => {
              handleDateLeave();
            }}
          >
            {day.isCurrentMonth && day.isFuture && day.imageUrl && (
              <div
                className="absolute inset-0 rounded-lg bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${day.imageUrl})`,
                  opacity: 0.6,
                  pointerEvents: "none",
                }}
              />
            )}
            {day.isCurrentMonth && (
              <motion.span
                className={`font-serif text-3xl leading-tight ${
                  day.hasImage ? "text-white drop-shadow-lg" : "text-black"
                } `}
                style={{ marginTop: "20px" }}
                initial={{ opacity: 0.8 }}
                whileHover={{ 
                  opacity: 1,
                  scale: 1.1,
                  textShadow: day.hasImage ? "0 0 20px rgba(255,255,255,0.8)" : "0 0 10px rgba(0,0,0,0.5)",
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                  }
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                {day.date.toString().padStart(2, "0")}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      {/* DreamCard Hover Expand Overlay from bottom-left */}
      <AnimatePresence mode="popLayout">
        {!isOpen && showDreamCard && selectedDay && hoverRect && (
          <motion.div
            key={`dreamcard-expand-${selectedDay.date}`}
            className="fixed z-50"
            style={{
              left: hoverRect.left,
              top: hoverRect.bottom - 418,
              transformOrigin: "bottom left",
            }}
            initial={{
              opacity: 1,
              scaleX: hoverRect.width / 370,
              scaleY: hoverRect.height / 418,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
              scaleY: 1,
            }}
            exit={{
              opacity: 1,
              scaleX: hoverRect.width / 370,
              scaleY: hoverRect.height / 418,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 30,
              mass: 0.9,
            }}
            onMouseLeave={handleDateLeave}
          >
            <DreamCard
              date={`${selectedDay.date.toString().padStart(2, "0")} ${monthNames[currentMonth]}`}
              title="Dream Entry"
              description={
                selectedDay.isFuture 
                  ? "this dream is not yet dreamt" 
                  : daysWithDreams[selectedDay.date]?.dream_summary || 
                    daysWithDreams[selectedDay.date]?.dream_category || 
                    "A beautiful moment captured in time, filled with wonder and inspiration."
              }
              backgroundImage={selectedDay.imageUrl || "/images/dream-background.png"}
              disableEntranceAnimations
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open modal: animate from cell (bottom-left) into centered DreamCard */}
      <AnimatePresence>
        {isOpen && selectedDay && hoverRect && openTarget && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
            />
            <motion.div
              key={`dreamcard-open-${selectedDay.date}`}
              className="fixed z-50"
              style={{
                left: hoverRect.left,
                top: hoverRect.bottom - 418,
                transformOrigin: "bottom left",
              }}
              initial={{
                opacity: 1,
                scaleX: hoverRect.width / 370,
                scaleY: hoverRect.height / 418,
              }}
              animate={{
                left: openTarget.left,
                top: openTarget.top,
                scaleX: 1,
                scaleY: 1,
              }}
              exit={{
                left: hoverRect.left,
                top: hoverRect.bottom - 418,
                scaleX: hoverRect.width / 370,
                scaleY: hoverRect.height / 418,
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
                mass: 0.9,
              }}
            >
              <div className="relative h-[418px] w-[370px]">
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.25 }}
                  style={{ pointerEvents: "none" }}
                >
                  <DreamCard
                    date={`${selectedDay.date.toString().padStart(2, "0")} ${monthNames[currentMonth]}`}
                    title="Dream Entry"
                    description={
                      selectedDay.isFuture 
                        ? "this dream is not yet dreamt" 
                        : daysWithDreams[selectedDay.date]?.dream_summary || 
                          daysWithDreams[selectedDay.date]?.dream_category || 
                          "A beautiful moment captured in time, filled with wonder and inspiration."
                    }
                    backgroundImage={selectedDay.imageUrl || "/images/dream-background.png"}
                    disableEntranceAnimations
                  />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Monthly Recap button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onMonthlyRecap?.(new Date(currentYear, currentMonth, 1))}
          className="rounded-lg bg-black px-4 py-2 font-serif text-white transition hover:bg-gray-800"
          aria-label="Monthly recap"
        >
          Monthly recap
        </button>
      </div>
    </div>
  );
};

export default Calendar;
