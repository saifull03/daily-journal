import React from 'react';
import { useLocation } from 'react-router-dom';
import { Flame, PenSquare, Sun, Moon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../../api/journalApi';
import { useTheme } from '../../hooks/useTheme';

export default function Header({ onOpenTemplateSelector }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Fetch streak info for header badge
  const { data: statsData } = useQuery({
    queryKey: ['journal-statistics'],
    queryFn: () => journalApi.getStatistics(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const streak = statsData?.data?.current_streak || 0;

  // Derive title from pathname
  const getPageTitle = (path) => {
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/journals/new')) return 'Write Journal';
    if (path.includes('/edit')) return 'Edit Journal';
    if (path.startsWith('/journals/')) return 'Journal Entry';
    if (path.startsWith('/journals')) return 'All Journals';
    if (path.startsWith('/calendar')) return 'Calendar';
    if (path.startsWith('/favorites')) return 'Favorites';
    if (path.startsWith('/drafts')) return 'Drafts';
    if (path.startsWith('/tags')) return 'Tags';
    if (path.startsWith('/statistics')) return 'Writing Statistics';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Journal';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Writing Streak Badge */}
        {streak > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold shadow-2xs"
            title={`${streak} Day Writing Streak`}
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streak} Day Streak</span>
          </div>
        )}

        {/* Theme quick toggle on mobile/header */}
        <button
          type="button"
          onClick={toggleTheme}
          className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-stone-600" />
          )}
        </button>

        {/* Quick Write Journal button (always visible in header) */}
        {!location.pathname.startsWith('/journals/new') && (
          <button
            type="button"
            onClick={onOpenTemplateSelector}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <PenSquare className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            <span className="hidden sm:inline">Write</span>
          </button>
        )}
      </div>
    </header>
  );
}

