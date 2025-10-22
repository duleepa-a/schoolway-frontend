"use client";
import  { useState }  from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Calendar({ selectedDate, onDateChange }: { selectedDate: Date | null; onDateChange: (d: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(() => (selectedDate ? new Date(selectedDate) : new Date()));

  // Move to first day of the month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month (0=Sun ... 6=Sat)
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay();

  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate calendar grid days (including blanks for days before first day)
  const calendarDays = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
  }

  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  return (
    <div className="w-72 bg-white rounded-2xl shadow-md p-4 select-none font-sans">
      {/* Header */}
      <div className="flex justify-between items-center text-[#0099cc] font-semibold mb-4">
        <button
          onClick={prevMonth}
          aria-label="Previous Month"
          className="p-1 rounded hover:bg-[#0099cc] transition"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          {currentMonth.toLocaleString('default', { month: 'long' })} {year}
        </div>
        <button
          onClick={nextMonth}
          aria-label="Next Month"
          className="p-1 rounded hover:bg-[#0099cc] transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-xs font-medium text-[#0099cc] mb-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {calendarDays.map((date, idx) =>
          date ? (
            <button
              key={idx}
              onClick={() => onDateChange(date)}
              className={`h-9 w-9 flex items-center justify-center rounded-full
                ${
                  selectedDate && isSameDay(date, selectedDate)
                    ? 'bg-[#0099cc] text-white'
                    : 'hover:bg-[#0099cc] text-gray-700'
                }`}
              aria-current={selectedDate && isSameDay(date, selectedDate) ? 'date' : undefined}
              tabIndex={0}
            >
              {date.getDate()}
            </button>
          ) : (
            <div key={idx} />
          )
        )}
      </div>
    </div>
  );
}

export default Calendar;
