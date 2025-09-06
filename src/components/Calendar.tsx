"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

interface CalendarProps {
  initialMonth?: number;
  initialYear?: number;
  className?: string;
  onDateSelect?: (date: Date) => void;
}

interface CalendarDay {
  date: number;
  hasImage: boolean;
  imageUrl: string | undefined;
  isCurrentMonth: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  initialMonth = 8, // September (0-indexed)
  initialYear = 2025,
  className = "",
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

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

  // Sample data for days with images (based on the design)
  const daysWithImages: { [key: number]: string } = {
    1: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mystical%20forest%20landscape%20with%20ancient%20trees&image_size=square",
    2: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=serene%20mountain%20valley%20at%20sunset&image_size=square",
    3: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20lake%20reflection%20scene&image_size=square",
    4: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20hour%20countryside%20view&image_size=square",
    5: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=blooming%20flower%20garden%20spring&image_size=square",
    6: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dramatic%20ocean%20waves%20coastline&image_size=square",
    7: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=warm%20desert%20dunes%20landscape&image_size=square",
    8: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=lush%20tropical%20rainforest%20canopy&image_size=square",
    9: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20forest%20golden%20leaves&image_size=square",
    10: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=snowy%20mountain%20peaks%20winter&image_size=square",
    11: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cherry%20blossom%20tree%20spring&image_size=square",
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: 0,
        hasImage: false,
        imageUrl: undefined,
        isCurrentMonth: false,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasImage = !!daysWithImages[day];
      days.push({
        date: day,
        hasImage,
        imageUrl: hasImage ? daysWithImages[day] : undefined,
        isCurrentMonth: true,
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

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && onDateSelect) {
      const selectedDate = new Date(currentYear, currentMonth, day.date);
      onDateSelect(selectedDate);
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div
      className={`relative mx-auto max-w-4xl rounded-[40px] bg-white p-6 shadow-lg ${className}`}
    >
      {/* Header with title and user avatar */}
      <div className="mb-6 flex items-start justify-between">
        <h1 className="mt-9 font-serif text-4xl text-black">
          {monthNames[currentMonth]} {currentYear}
        </h1>
        <div className="rounded-full bg-gray-300 p-3">
          <User className="h-12 w-10 text-gray-600" />
        </div>
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
          <div
            key={index}
            className={`relative flex h-20 cursor-pointer items-start justify-start rounded-lg p-3 transition-all duration-200 hover:scale-105 ${
              day.isCurrentMonth
                ? day.hasImage
                  ? "bg-cover bg-center bg-no-repeat"
                  : "bg-gray-300 hover:bg-gray-400"
                : "invisible"
            } `}
            style={{
              backgroundImage: day.hasImage
                ? `url(${day.imageUrl})`
                : undefined,
            }}
            onClick={() => handleDateClick(day)}
          >
            {day.isCurrentMonth && (
              <span
                className={`font-serif text-3xl leading-tight ${
                  day.hasImage ? "text-white drop-shadow-lg" : "text-black"
                } `}
              >
                {day.date.toString().padStart(2, "0")}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="absolute top-6 right-20 flex items-center space-x-2">
        <button
          onClick={handlePrevMonth}
          className="rounded p-1 transition-colors hover:bg-gray-100"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <button
          onClick={handleNextMonth}
          className="rounded p-1 transition-colors hover:bg-gray-100"
          aria-label="Next month"
        >
          <ChevronRight className="h-6 w-6 text-black" />
        </button>
      </div>
    </div>
  );
};

export default Calendar;
