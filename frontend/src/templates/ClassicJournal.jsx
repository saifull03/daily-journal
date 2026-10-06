import React from 'react';
import RichEditor from '../components/editor/RichEditor';
import MoodPicker from '../components/journal/MoodPicker';

export default function ClassicJournal({
  entry,
  onChange,
  readOnly = false,
}) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Paper-inspired container */}
      <div className="paper-texture bg-[#faf8f5] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        {/* Date and Mood header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Classic Diary
            </span>
            <input
              type="date"
              value={entry.journal_date || ''}
              onChange={(e) => onChange('journal_date', e.target.value)}
              disabled={readOnly}
              className="block text-xs font-medium text-stone-600 dark:text-stone-300 bg-transparent border-none focus:outline-none cursor-pointer"
            />
          </div>

          {!readOnly && (
            <div className="w-full sm:w-auto">
              <MoodPicker
                selectedMood={entry.mood}
                onSelectMood={(m) => onChange('mood', m)}
                moodScore={entry.mood_score}
                onChangeScore={(s) => onChange('mood_score', s)}
                compact
              />
            </div>
          )}
        </div>

        {/* Title Input */}
        <div>
          <input
            type="text"
            value={entry.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={readOnly}
            placeholder="Today's Journal Title..."
            className="w-full text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 placeholder-stone-400 bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Paper-styled writing area */}
        <div className="pt-2">
          <RichEditor
            value={entry.content || ''}
            onChange={(html) => onChange('content', html)}
            readOnly={readOnly}
            placeholder="Dear Diary, today began with..."
            minHeight="min-h-[420px]"
            className="border-stone-200/80 dark:border-stone-800"
          />
        </div>
      </div>
    </div>
  );
}

