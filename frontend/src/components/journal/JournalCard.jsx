import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, Edit3, Trash2, Image as ImageIcon } from 'lucide-react';
import TagBadge from './TagBadge';
import { getMoodById, getTemplateById } from '../../utils/moodConstants';
import { formatDate } from '../../utils/dateUtils';

export default function JournalCard({
  journal,
  onToggleFavorite,
  onDelete,
}) {
  const navigate = useNavigate();

  const moodInfo = getMoodById(journal.mood);
  const templateInfo = getTemplateById(journal.type);

  // Clean html snippet for preview
  const getCleanSnippet = (html, data) => {
    let text = '';
    if (html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      text = temp.textContent || temp.innerText || '';
    }

    if (!text && data) {
      // Pick first non-empty string in structured data
      const values = Object.values(data).filter((v) => typeof v === 'string' && v.trim());
      if (values.length > 0) {
        text = values[0];
      }
    }

    return text.length > 160 ? text.substring(0, 160) + '...' : text;
  };

  const previewText = getCleanSnippet(journal.content, journal.data);

  return (
    <div
      onClick={() => navigate(`/journals/${journal.id}`)}
      className="group relative bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 hover:border-stone-300 dark:hover:border-stone-700 rounded-2xl p-5 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header row: Template badge, draft indicator, date, favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                templateInfo.badgeColor
              }`}
            >
              {templateInfo.name}
            </span>

            {journal.is_draft && (
              <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Draft
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(journal.id);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                journal.is_favorite
                  ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                  : 'text-stone-300 hover:text-stone-500 dark:text-stone-600 dark:hover:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={journal.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${journal.is_favorite ? 'fill-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Title & Mood */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {journal.title || 'Untitled Journal'}
          </h3>
          {moodInfo && (
            <span
              className="text-lg shrink-0"
              title={`${moodInfo.label} (${journal.mood_score || 5}/10)`}
            >
              {moodInfo.emoji}
            </span>
          )}
        </div>

        {/* Content Preview */}
        {previewText && (
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4 line-clamp-3">
            {previewText}
          </p>
        )}
      </div>

      <div>
        {/* Tags */}
        {journal.tags && journal.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {journal.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag.id || tag} tag={tag} size="sm" />
            ))}
            {journal.tags.length > 3 && (
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                +{journal.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer meta info: date, word count, actions */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-400 dark:text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(journal.journal_date)}
            </span>
            {journal.word_count > 0 && (
              <span>{journal.word_count} words</span>
            )}
            {journal.images && journal.images.length > 0 && (
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {journal.images.length}
              </span>
            )}
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/journals/${journal.id}/edit`);
              }}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              title="Edit journal"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(journal);
              }}
              className="p-1 rounded-md text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Delete journal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

