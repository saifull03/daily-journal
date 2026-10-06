import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '../../api/journalApi';
import { useToastStore } from '../../store/toastStore';
import { formatDateLong } from '../../utils/dateUtils';
import { getMoodById, getTemplateById } from '../../utils/moodConstants';

import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';
import TagBadge from '../../components/journal/TagBadge';
import ImageGallery from '../../components/journal/ImageGallery';
import {
  ArrowLeft,
  Edit3,
  Heart,
  Trash2,
  Calendar,
  Clock,
} from 'lucide-react';

export default function JournalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch journal entry details
  const { data, isLoading, isError } = useQuery({
    queryKey: ['journal', id],
    queryFn: () => journalApi.getJournal(id),
  });

  const entry = data?.data;

  // Favorite toggle mutation
  const favoriteMutation = useMutation({
    mutationFn: () => journalApi.toggleFavorite(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['journal', id] });
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
    mutationFn: () => journalApi.deleteJournal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      queryClient.invalidateQueries({ queryKey: ['journal-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['journal-calendar'] });
      addToast('Journal deleted.', 'info');
      navigate('/journals');
    },
    onError: () => {
      addToast('Failed to delete journal.', 'error');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-stone-400 text-sm">
          Opening journal...
        </div>
      </div>
    );
  }

  if (isError || !entry) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-stone-500">Journal entry not found.</p>
        <Button onClick={() => navigate('/journals')} variant="outline">
          Return to Journals
        </Button>
      </div>
    );
  }

  const moodInfo = getMoodById(entry.mood);
  const templateInfo = getTemplateById(entry.type);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top action navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <Link
          to="/journals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Entries</span>
        </Link>

        {/* Edit, Favorite, Delete Buttons */}
        <div className="flex items-center gap-2">
          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => favoriteMutation.mutate()}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              entry.is_favorite
                ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900'
                : 'border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
            title={entry.is_favorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Heart className={`w-4 h-4 ${entry.is_favorite ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Edit */}
          <Button
            size="sm"
            variant="outline"
            leftIcon={Edit3}
            onClick={() => navigate(`/journals/${entry.id}/edit`)}
          >
            Edit
          </Button>

          {/* Delete */}
          <Button
            size="sm"
            variant="dangerOutline"
            leftIcon={Trash2}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Diary Reading Container */}
      <article className="paper-texture bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8">
        {/* Header Metadata */}
        <div className="space-y-4 pb-6 border-b border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span
              className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                templateInfo.badgeColor
              }`}
            >
              {templateInfo.name}
            </span>

            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{formatDateLong(entry.journal_date)}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
            {entry.title || 'Untitled Journal'}
          </h1>

          {/* Mood & Word stats banner */}
          <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pt-1">
            {moodInfo && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800/60 font-medium text-stone-700 dark:text-stone-300">
                <span className="text-base">{moodInfo.emoji}</span>
                <span>{moodInfo.label}</span>
                {entry.mood_score && <span>({entry.mood_score}/10)</span>}
              </div>
            )}
            {entry.word_count > 0 && (
              <span className="flex items-center gap-1 text-stone-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{entry.word_count} words</span>
              </span>
            )}
          </div>
        </div>

        {/* Structured Data Content (if template has structured fields) */}
        {entry.data && Object.keys(entry.data).length > 0 && (
          <div className="space-y-4 pt-2">
            {/* Checklist if planner */}
            {Array.isArray(entry.data.checklist) && entry.data.checklist.length > 0 && (
              <div className="bg-stone-50/70 dark:bg-stone-800/40 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Tasks & Progress
                </h4>
                <div className="space-y-2">
                  {entry.data.checklist.map((t) => (
                    <div key={t.id} className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        readOnly
                        className="rounded text-blue-600 pointer-events-none"
                      />
                      <span className={t.completed ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-200'}>
                        {t.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gratitude items */}
            {Array.isArray(entry.data.items) && entry.data.items.length > 0 && (
              <div className="bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-900/30 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Gratitude Blessings
                </h4>
                <ol className="space-y-1.5 list-decimal list-inside text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                  {entry.data.items.map((it, idx) => (
                    <li key={idx} className="leading-relaxed">{it}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Other key-value reflection fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(entry.data)
                .filter(([k]) => k !== 'checklist' && k !== 'items')
                .map(([key, value]) => {
                  if (!value || typeof value !== 'string') return null;
                  const label = key.replace(/_/g, ' ');
                  return (
                    <div
                      key={key}
                      className="bg-stone-50/60 dark:bg-stone-800/30 rounded-2xl p-4 border border-stone-200/70 dark:border-stone-800/70 space-y-1"
                    >
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        {label}
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                        {value}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Freeform Main Narrative Content */}
        {entry.content && (
          <div
            className="prose prose-stone dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed pt-2"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        )}

        {/* Image Gallery */}
        {entry.images && entry.images.length > 0 && (
          <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Photo Memories ({entry.images.length})
            </h4>
            <ImageGallery images={entry.images} readOnly={true} />
          </div>
        )}

        {/* Tags footer */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-6 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] font-semibold text-stone-400 mr-1">
              Tags:
            </span>
            {entry.tags.map((t) => (
              <TagBadge key={t.id || t.name} tag={t} size="sm" />
            ))}
          </div>
        )}
      </article>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        title="Delete this journal?"
        description="This action cannot be undone."
        confirmText="Delete Journal"
      />
    </div>
  );
}
