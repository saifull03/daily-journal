import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../../api/journalApi';
import { getMoodById, getTemplateById } from '../../utils/moodConstants';
import {
  Flame,
  Award,
  BookOpen,
  Clock,
  Heart,
  FileText,
  BarChart2,
} from 'lucide-react';

export default function StatisticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['journal-statistics'],
    queryFn: () => journalApi.getStatistics(),
  });

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-stone-400 text-sm">
          Calculating journal insights...
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const currentStreak = stats.current_streak || 0;
  const longestStreak = stats.longest_streak || 0;
  const mostUsedTemplate = getTemplateById(stats.most_used_template);
  const mostCommonMood = getMoodById(stats.most_common_mood);

  // Maximum count for monthly activity scaling
  const maxMonthlyCount = Math.max(
    ...((stats.monthly_activity || []).map((m) => m.count) || [1]),
    1
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="pb-2">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Writing Insights & Streaks
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          A calm overview of your writing habits, moods, and creative momentum.
        </p>
      </div>

      {/* Writing Streak Hero Banner */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Flame className="w-8 h-8 fill-white animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Active Writing Momentum
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
              🔥 {currentStreak} Day Writing Streak
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Every day you write strengthens your mindfulness and clarity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-amber-200 dark:border-amber-900/50 pt-4 sm:pt-0 sm:pl-6">
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              Longest Streak
            </p>
            <p className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{longestStreak} Days</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Published Journals */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Entries</span>
            <BookOpen className="w-4 h-4 text-stone-600 dark:text-stone-300" />
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {stats.total_journals}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {stats.journals_this_month} written this month
          </span>
        </div>

        {/* Total Words Written */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Words Written</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {stats.total_words?.toLocaleString() || 0}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            ~{Math.round((stats.total_words || 0) / Math.max(stats.total_journals || 1, 1))} words / entry
          </span>
        </div>

        {/* Most Used Template */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Favorite Style</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-base font-bold text-stone-900 dark:text-stone-100 truncate">
            {mostUsedTemplate?.name}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block truncate">
            Most frequent format
          </span>
        </div>

        {/* Most Common Mood */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Predominant Mood</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 truncate">
            <span>{mostCommonMood?.emoji || '✨'}</span>
            <span>{mostCommonMood?.label || 'Varied'}</span>
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Based on logged feelings
          </span>
        </div>
      </div>

      {/* Monthly Writing Activity Minimal Bar Chart */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-stone-600 dark:text-stone-300" />
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Monthly Writing Activity (Last 6 Months)
            </h4>
          </div>
          <span className="text-xs text-stone-400">
            Consistency over time
          </span>
        </div>

        {/* Minimal Bar Chart */}
        <div className="pt-4 flex items-end justify-between gap-2 sm:gap-4 h-44 px-2">
          {stats.monthly_activity?.map((month) => {
            const heightPercent = Math.max((month.count / maxMonthlyCount) * 100, 6);

            return (
              <div
                key={month.month}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                {/* Count tooltip on hover */}
                <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-transform">
                  {month.count}
                </div>

                {/* Bar */}
                <div className="w-full max-w-[48px] bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden flex items-end h-full">
                  <div
                    className="w-full bg-stone-900 dark:bg-stone-200 group-hover:bg-amber-500 dark:group-hover:bg-amber-400 transition-colors rounded-xl"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Month label */}
                <span className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {month.short_label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distributions: Templates & Moods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journal Type Distribution */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Journal Style Distribution
          </h4>

          <div className="space-y-3 pt-2">
            {stats.type_distribution?.map((t) => {
              const tmpl = getTemplateById(t.type);
              return (
                <div key={t.type} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300">
                    <span>{tmpl.name}</span>
                    <span>{t.count} ({t.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-900 dark:bg-stone-200 rounded-full"
                      style={{ width: `${t.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Mood Distribution
          </h4>

          <div className="space-y-3 pt-2">
            {stats.mood_distribution?.map((m) => {
              const mood = getMoodById(m.mood);
              return (
                <div key={m.mood} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300">
                    <span className="flex items-center gap-1.5">
                      <span>{mood?.emoji}</span>
                      <span>{mood?.label || m.mood}</span>
                    </span>
                    <span>{m.count} ({m.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${m.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
