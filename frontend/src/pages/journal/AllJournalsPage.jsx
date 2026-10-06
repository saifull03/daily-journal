import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { journalApi } from '../../api/journalApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useToastStore } from '../../store/toastStore';
import { TEMPLATES, MOODS } from '../../utils/moodConstants';

import JournalCard from '../../components/journal/JournalCard';
import { JournalCardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Button from '../../components/common/Button';

import {
  Search,
  ArrowUpDown,
  BookOpen,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AllJournalsPage({ defaultFilter = {} }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  // Search input with debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Filters state
  const [selectedType, setSelectedType] = useState(
    searchParams.get('type') || defaultFilter.type || 'all'
  );
  const [selectedMood, setSelectedMood] = useState(
    searchParams.get('mood') || defaultFilter.mood || 'all'
  );
  const [selectedTag, setSelectedTag] = useState(
    searchParams.get('tag') || defaultFilter.tag || ''
  );
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get('date') || defaultFilter.date || ''
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get('sort') || 'newest'
  );
  const [page, setPage] = useState(1);

  // Show only favorites or drafts if specified
  const isFavoriteFilter = defaultFilter.is_favorite ?? (searchParams.get('is_favorite') === 'true' ? true : null);
  const isDraftFilter = defaultFilter.is_draft ?? (searchParams.get('is_draft') === 'true' ? true : null);

  // Delete modal state
  const [journalToDelete, setJournalToDelete] = useState(null);

  // Fetch Tags for filter dropdown
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => journalApi.getTags(),
  });

  // Query Journals with all search and filter params
  const { data, isLoading } = useQuery({
    queryKey: [
      'journals',
      {
        page,
        search: debouncedSearch,
        type: selectedType,
        mood: selectedMood,
        tag: selectedTag,
        date: selectedDate,
        sort: sortOrder,
        is_favorite: isFavoriteFilter,
        is_draft: isDraftFilter,
      },
    ],
    queryFn: () =>
      journalApi.getJournals({
        page,
        per_page: 9,
        search: debouncedSearch || undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        mood: selectedMood !== 'all' ? selectedMood : undefined,
        tag: selectedTag || undefined,
        date: selectedDate || undefined,
        sort: sortOrder,
        is_favorite: isFavoriteFilter,
        is_draft: isDraftFilter,
      }),
  });

  const journals = data?.data || [];
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0 };

  // Favorite toggle mutation
  const favoriteMutation = useMutation({
    mutationFn: (id) => journalApi.toggleFavorite(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      queryClient.invalidateQueries({ queryKey: ['journal-statistics'] });
      addToast(
        res.data.is_favorite ? 'Added to favorites ❤️' : 'Removed from favorites',
        'info'
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => journalApi.deleteJournal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      queryClient.invalidateQueries({ queryKey: ['journal-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['journal-calendar'] });
      addToast('Journal deleted.', 'info');
      setJournalToDelete(null);
    },
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedMood('all');
    setSelectedTag('');
    setSelectedDate('');
    setSortOrder('newest');
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    selectedType !== 'all' ||
    selectedMood !== 'all' ||
    Boolean(selectedTag) ||
    Boolean(selectedDate) ||
    sortOrder !== 'newest';

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input with Debounce */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, content, or tag..."
              className="w-full text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-900 dark:text-stone-100"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent border-none focus:outline-none font-medium cursor-pointer"
              >
                <option value="newest" className="dark:bg-stone-900">Newest First</option>
                <option value="oldest" className="dark:bg-stone-900">Oldest First</option>
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium border-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
          >
            <option value="all">All Styles</option>
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Mood Filter */}
          <select
            value={selectedMood}
            onChange={(e) => {
              setSelectedMood(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium border-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
          >
            <option value="all">All Moods</option>
            {MOODS.map((m) => (
              <option key={m.id} value={m.id}>{m.emoji} {m.label}</option>
            ))}
          </select>

          {/* Tag Filter */}
          {tagsData?.data && tagsData.data.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium border-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
            >
              <option value="">All Tags</option>
              {tagsData.data.map((tag) => (
                <option key={tag.id} value={tag.name}>#{tag.name}</option>
              ))}
            </select>
          )}

          {/* Date Filter */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-lg">
            <Calendar className="w-3 h-3 text-stone-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setPage(1);
              }}
              className="bg-transparent border-none text-[11px] font-medium text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Journals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <JournalCardSkeleton key={i} />
          ))}
        </div>
      ) : journals.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {journals.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onToggleFavorite={(id) => favoriteMutation.mutate(id)}
                onDelete={(j) => setJournalToDelete(j)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800 text-xs">
              <span className="text-stone-500 dark:text-stone-400">
                Page {meta.current_page} of {meta.last_page} ({meta.total} journals)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={ChevronLeft}
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  rightIcon={ChevronRight}
                  disabled={page >= meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={hasActiveFilters ? 'No matching entries found' : 'No journals yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search terms or clearing active filters.'
              : 'Your story starts here. Capture your thoughts, feelings, and memories.'
          }
          actionText={hasActiveFilters ? 'Clear Filters' : 'Write Your First Journal'}
          onAction={hasActiveFilters ? clearAllFilters : () => navigate('/journals/new/classic')}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(journalToDelete)}
        onClose={() => setJournalToDelete(null)}
        onConfirm={() => deleteMutation.mutate(journalToDelete.id)}
        isLoading={deleteMutation.isPending}
        title="Delete this journal?"
        description="This action cannot be undone."
        confirmText="Delete Journal"
      />
    </div>
  );
}
