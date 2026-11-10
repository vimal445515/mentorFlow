import React from "react";
import type { ScheduleMap } from "../types/avilability";

interface CalendarComponentProps {
  currentYear: number;
  currentMonth: number;
  selectedDate: string;
  schedule: ScheduleMap;
  onSelectDate: (dateStr: string) => void;
  onChangeMonth: (delta: number) => void;
  onGoToToday: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  currentYear,
  currentMonth,
  selectedDate,
  schedule,
  onSelectDate,
  onChangeMonth,
  onGoToToday,
}) => {
  // 1. Get basic date information for the current month view
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // What day of the week the month starts on (0-6)
  const totalDaysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Total days in this month
  const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate(); // Total days in the previous month

  // 2. Format today's date as YYYY-MM-DD to highlight it on the calendar
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // 3. Create arrays for the calendar grid slots (total 42 cells for a standard 6-row calendar grid)
  const previousMonthFillerDays = Array.from(
    { length: firstDayIndex }, 
    (_, i) => totalDaysInPrevMonth - firstDayIndex + 1 + i
  );

  const currentMonthDays = Array.from(
    { length: totalDaysInCurrentMonth }, 
    (_, i) => i + 1
  );

  // Fill the remaining cells up to 42 so the grid height stays consistent
  const remainingCellsCount = 42 - firstDayIndex - totalDaysInCurrentMonth;
  const nextMonthFillerDays = Array.from(
    { length: remainingCellsCount }, 
    (_, i) => i + 1
  );

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
      {/* Month Header Navigation */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2 text-lg font-extrabold text-stone-900">
          <i className="fa-regular fa-calendar text-indigo-600"></i>
          <span id="cal-month-title">
            {MONTHS[currentMonth]} {currentYear}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            className="p-2 text-xs font-semibold rounded-lg border border-stone-300 hover:bg-stone-50"
            title="Previous Month"
          >
            <i className="fa-solid fa-chevron-left">{"<"}</i>
          </button>
          <button
            type="button"
            onClick={onGoToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 hover:bg-stone-50"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            className="p-2 text-xs font-semibold rounded-lg border border-stone-300 hover:bg-stone-50"
            title="Next Month"
          >
            <i className="fa-solid fa-chevron-right">{">"}</i>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between items-center mb-3 text-xs">
        <span className="text-stone-500">Click any date to view and schedule slots</span>
        <div className="flex gap-3 font-bold">
          <span className="text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
          </span>
          <span className="text-blue-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Booked
          </span>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-stone-400 uppercase py-2 border-b border-stone-200">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 grid-rows-6 gap-1 mt-2" id="calendar-cells">
        
        {/* Render trailing days from the previous month */}
        {previousMonthFillerDays.map((dayNum) => (
          <div
            key={`prev-${dayNum}`}
            className="h-24 p-1.5 bg-stone-50 text-stone-400 rounded-xl opacity-50"
          >
            <span className="text-xs font-semibold">{dayNum}</span>
          </div>
        ))}

        {/* Render actual days of the current month */}
        {currentMonthDays.map((dayNumber) => {
          // Format date string as YYYY-MM-DD to match schedule keys
          const formattedMonth = String(currentMonth + 1).padStart(2, "0");
          const formattedDay = String(dayNumber).padStart(2, "0");
          const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          // Count available and booked slots for this specific date
          const slotsForDay = schedule[dateStr] || [];
          const openCount = slotsForDay.filter((s) => s.status === "available").length;
          const bookedCount = slotsForDay.filter((s) => s.status === "booked").length;

          return (
            <div
              key={dateStr}
              data-date={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`h-24 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                  : "border-stone-200 hover:border-indigo-300 bg-white"
              }`}
            >
              {/* Day Number Header */}
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                    isToday ? "bg-indigo-600 text-white" : "text-stone-700"
                  }`}
                >
                  {dayNumber}
                </span>
              </div>

              {/* Status Badges (Open / Booked counts) */}
              <div className="flex flex-col gap-1">
                {openCount > 0 && (
                  <div className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 truncate">
                    {openCount} Open
                  </div>
                )}
                {bookedCount > 0 && (
                  <div className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 truncate">
                    {bookedCount} Booked
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Render leading days from the next month to fill out the 42-cell grid */}
        {nextMonthFillerDays.map((dayNum) => (
          <div
            key={`next-${dayNum}`}
            className="h-24 p-1.5 bg-stone-50 text-stone-400 rounded-xl opacity-50"
          >
            <span className="text-xs font-semibold">{dayNum}</span>
          </div>
        ))}

      </div>
    </div>
  );
};