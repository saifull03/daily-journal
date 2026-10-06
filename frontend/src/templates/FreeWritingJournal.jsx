import React from 'react';
import RichEditor from '../components/editor/RichEditor';
import { Calendar } from 'lucide-react';

export default function FreeWritingJournal({
  entry,
  onChange,
  readOnly = false,
}) {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Minimalistic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <input
          type="text"
          value={entry.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          disabled={readOnly}
          placeholder="Title (or leave blank)..."
          className="text-2xl sm:text-4xl font-sans font-light tracking-tight text-stone-900 dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-700 bg-transparent border-none focus:outline-none"
        />

        <div className="flex items-center gap-2 text-stone-400">
          <Calendar className="w-4 h-4" />
          <input
            type="date"
            value={entry.journal_date || ''}
            onChange={(e) => onChange('journal_date', e.target.value)}
            disabled={readOnly}
            className="text-xs font-medium text-stone-500 dark:text-stone-400 bg-transparent border-none focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Massive distraction-free writing area */}
      <div className="bg-white dark:bg-stone-900/60 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-2 sm:p-4 shadow-xs">
        <RichEditor
          value={entry.content || ''}
          onChange={(html) => onChange('content', html)}
          readOnly={readOnly}
          placeholder="Unleash your mind. Just write without judgment..."
          minHeight="min-h-[560px]"
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}

