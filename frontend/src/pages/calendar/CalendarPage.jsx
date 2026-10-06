import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../../api/journalApi';
import { formatDateLong } from '../../utils/dateUtils';
import JournalCard from '../../components/journal/JournalCard';
import Button from '../../components/common/Button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-10-06'));
  const [selectedDateStr, setSelectedDateStr] = useState('2026-10-06');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const monthParam = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Fetch calendar month data from Laravel API
  const { data } = useQuery({
    queryKey: ['journal-calendar', monthParam],
    queryFn: () => journalApi.getCalendar({ month: monthParam }),
  });

  const daysMap = data?.data?.days || {};

  // Helpers for calendar grid calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date('2026-10-06');
    setCurrentDate(today);
    setSelectedDateStr('2026-10-06');
  };

  const monthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Selected date entries
  const selectedEntries = daysMap[selectedDateStr] || [];

  return (
    <div className="space-y-6">
      {/* Calendar Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {monthLabel}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Select any date to review what you wrote
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleToday}>
            Today
          </Button>
          <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 border-l border-stone-200 dark:border-stone-800"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month View Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span
                key={d}
                className="text-xs font-semibold text-stone-400 dark:text-stone-500 py-1.5"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Blank padding days for first week */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days in month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const entriesForDay = daysMap[dateStr] || [];
              const hasEntries = entriesForDay.length > 0;
              const isSelected = selectedDateStr === dateStr;
              const isToday = dateStr === '2026-10-06';

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl p-1 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md font-bold scale-105 z-10'
                      : isToday
                      ? 'border-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-stone-900 dark:text-stone-100 font-bold'
                      : hasEntries
                      ? 'bg-stone-100/80 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 hover:bg-stone-200 font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{dayNum}</span>

                  {/* Indicator dots for entries written on this date */}
                  {hasEntries && (
                    <div className="flex items-center gap-0.5 mt-1">
                      {entriesForDay.slice(0, 3).map((e, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected
                              ? 'bg-amber-400 dark:bg-amber-600'
                              : 'bg-amber-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Entries Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {formatDateLong(selectedDateStr)}
              </h3>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {selectedEntries.length} {selectedEntries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            <div className="space-y-3 pt-4 max-h-[500px] overflow-y-auto">
              {selectedEntries.length > 0 ? (
                selectedEntries.map((journal) => (
                  <JournalCard key={journal.id} journal={journal} />
                ))
              ) : (
                <div className="py-12 text-center text-xs text-stone-400 italic space-y-2">
                  <p>No journal entries written on this date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
