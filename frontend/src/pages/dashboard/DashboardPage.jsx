import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { journalApi } from '../../api/journalApi';
import { useAuthStore } from '../../store/authStore';
import { getTimeGreeting, formatDateLong } from '../../utils/dateUtils';
import { useToastStore } from '../../store/toastStore';

import JournalCard from '../../components/journal/JournalCard';
import { JournalCardSkeleton } from '../../components/common/Skeleton';
import {
  PenSquare,
  Flame,
  BookOpen,
  Calendar,
  Clock,
  Heart,
  FileEdit,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const outletContext = useOutletContext();

  const handleOpenTemplateSelector = () => {
    if (outletContext?.openTemplateSelector) {
      outletContext.openTemplateSelector();
    } else {
      navigate('/journals/new/classic');
    }
  };

  // Fetch statistics and streaks
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['journal-statistics'],
    queryFn: () => journalApi.getStatistics(),
  });

  // Fetch Drafts
  const { data: draftsData, isLoading: isLoadingDrafts } = useQuery({
    queryKey: ['journal-drafts'],
    queryFn: () => journalApi.getDrafts({ per_page: 3 }),
  });

  // Fetch Favorites
  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['journal-favorites'],
    queryFn: () => journalApi.getFavorites({ per_page: 3 }),
  });

  const stats = statsData?.data;
  const recentEntries = stats?.recent_entries || [];
  const drafts = draftsData?.data || [];
  const favorites = favoritesData?.data || [];

  // Favorite toggle mutation
  const favoriteMutation = useMutation({
    mutationFn: (id) => journalApi.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['journal-favorites'] });
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      addToast('Favorite updated ❤️', 'info');
    },
  });

  const greeting = getTimeGreeting();
  const todayFormatted = formatDateLong(new Date('2026-10-06'));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Personalized Calm Greeting Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {todayFormatted}
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {greeting}, {user?.name?.split(' ')[0] || 'Friend'} 👋
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md">
              How was your day? Take a quiet moment to unwind, reflect, and capture your journey.
            </p>
          </div>

          {/* Prominent Write Today's Journal Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleOpenTemplateSelector}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 font-bold text-sm sm:text-base hover:bg-stone-800 dark:hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <PenSquare className="w-5 h-5 text-amber-400 dark:text-amber-600" />
              <span>+ Write Today's Journal</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row: Streak, Total, This Month, Total Words */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div
          onClick={() => navigate('/statistics')}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4.5 shadow-xs cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            🔥 {stats?.current_streak || 0} Days
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Longest: {stats?.longest_streak || 0} days
          </span>
        </div>

        {/* Total Journals */}
        <div
          onClick={() => navigate('/journals')}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4.5 shadow-xs cursor-pointer hover:border-stone-300 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Journals</span>
            <BookOpen className="w-4 h-4 text-stone-600 dark:text-stone-300" />
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {stats?.total_journals || 0}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Across {stats?.type_distribution?.length || 0} styles
          </span>
        </div>

        {/* Journals This Month */}
        <div
          onClick={() => navigate('/calendar')}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4.5 shadow-xs cursor-pointer hover:border-stone-300 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">This Month</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {stats?.journals_this_month || 0}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            October 2026
          </span>
        </div>

        {/* Total Words */}
        <div
          onClick={() => navigate('/statistics')}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4.5 shadow-xs cursor-pointer hover:border-stone-300 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Words Written</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {stats?.total_words?.toLocaleString() || 0}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Total expressions
          </span>
        </div>
      </div>

      {/* Recent Entries Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Recent Entries
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Your latest documented thoughts and stories
            </p>
          </div>
          <Link
            to="/journals"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <JournalCardSkeleton key={i} />
            ))}
          </div>
        ) : recentEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEntries.slice(0, 3).map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onToggleFavorite={(id) => favoriteMutation.mutate(id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-stone-50/50 dark:bg-stone-900/30 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 p-8 text-center text-xs text-stone-400 italic">
            No entries written yet. Click "+ Write Today's Journal" above!
          </div>
        )}
      </section>

      {/* Split Section: Favorite Journals & Draft Journals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorites */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Favorite Journals
              </h3>
            </div>
            <Link
              to="/favorites"
              className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white font-medium"
            >
              See all ({stats?.favorite_count || 0})
            </Link>
          </div>

          <div className="space-y-3">
            {favorites.length > 0 ? (
              favorites.map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  onToggleFavorite={(id) => favoriteMutation.mutate(id)}
                />
              ))
            ) : (
              <div className="bg-stone-50/50 dark:bg-stone-900/30 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 p-6 text-center text-xs text-stone-400 italic">
                No favorites yet. Heart entries you love!
              </div>
            )}
          </div>
        </section>

        {/* Drafts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                In-Progress Drafts
              </h3>
            </div>
            <Link
              to="/drafts"
              className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white font-medium"
            >
              See all ({stats?.draft_count || 0})
            </Link>
          </div>

          <div className="space-y-3">
            {drafts.length > 0 ? (
              drafts.map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  onToggleFavorite={(id) => favoriteMutation.mutate(id)}
                />
              ))
            ) : (
              <div className="bg-stone-50/50 dark:bg-stone-900/30 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 p-6 text-center text-xs text-stone-400 italic">
                No unfinished stories. All caught up!
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
