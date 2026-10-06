import React, { useState } from 'react';
import { Sun, Heart, Plus, Trash2, Calendar, Smile, Compass, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

export default function GratitudeJournal({
  entry,
  onChange,
  readOnly = false,
}) {
  const data = entry.data || {};
  const items = Array.isArray(data.items) ? data.items : [
    'My family and close friends',
    'Good coffee and a quiet morning',
    'Having good health and an active mind',
  ];
  const [newItemText, setNewItemText] = useState('');

  const handleFieldChange = (key, val) => {
    onChange('data', {
      ...data,
      [key]: val,
    });
  };

  const handleAddItem = (e) => {
    e?.preventDefault();
    if (!newItemText.trim() || readOnly) return;
    const updated = [...items, newItemText.trim()];
    handleFieldChange('items', updated);
    setNewItemText('');
  };

  const handleRemoveItem = (index) => {
    if (readOnly) return;
    const updated = items.filter((_, i) => i !== index);
    handleFieldChange('items', updated);
  };

  const handleUpdateItem = (index, value) => {
    if (readOnly) return;
    const updated = [...items];
    updated[index] = value;
    handleFieldChange('items', updated);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Warm Minimal Header */}
      <div className="bg-[#fffdf9] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-amber-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Cultivating Gratitude
              </span>
              <input
                type="text"
                value={entry.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
                disabled={readOnly}
                placeholder="Morning Warmth and Simple Blessings..."
                className="block text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 placeholder-stone-400 bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" />
            <input
              type="date"
              value={entry.journal_date || ''}
              onChange={(e) => onChange('journal_date', e.target.value)}
              disabled={readOnly}
              className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-transparent border-none focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Dynamic Gratitude List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              <span>Today I am grateful for...</span>
            </h4>
            <span className="text-xs text-stone-400 font-medium">
              {items.length} blessings
            </span>
          </div>

          {/* List of items */}
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200/50 dark:border-stone-700/60"
              >
                <span className="w-6 h-6 rounded-full bg-amber-200/60 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateItem(idx, e.target.value)}
                  disabled={readOnly}
                  className="flex-1 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-stone-800 dark:text-stone-100"
                />
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-stone-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Item form */}
          {!readOnly && (
            <form onSubmit={handleAddItem} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add another blessing (e.g. A walk in fresh air)..."
                className="flex-1 text-xs sm:text-sm bg-white dark:bg-stone-800/80 rounded-xl px-3.5 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Button type="submit" size="sm" leftIcon={Plus} variant="secondary">
                Add Blessing
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Additional Gratitude Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Something good that happened today */}
        <div className="bg-[#fffdf9] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Something Good That Happened Today
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.good_thing || ''}
            onChange={(e) => handleFieldChange('good_thing', e.target.value)}
            disabled={readOnly}
            placeholder="A surprise, a nice word, or small win..."
            className="w-full text-xs sm:text-sm bg-white/70 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>

        {/* Someone I appreciate */}
        <div className="bg-[#fffdf9] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Heart className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Someone I Appreciate
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.someone_appreciated || ''}
            onChange={(e) => handleFieldChange('someone_appreciated', e.target.value)}
            disabled={readOnly}
            placeholder="Who supported you or made a difference today?"
            className="w-full text-xs sm:text-sm bg-white/70 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>

        {/* A positive thought */}
        <div className="bg-[#fffdf9] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Smile className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              A Positive Thought
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.positive_thought || ''}
            onChange={(e) => handleFieldChange('positive_thought', e.target.value)}
            disabled={readOnly}
            placeholder="An affirmation or encouraging reminder..."
            className="w-full text-xs sm:text-sm bg-white/70 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Something I am looking forward to */}
        <div className="bg-[#fffdf9] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Compass className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Looking Forward To
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.looking_forward || ''}
            onChange={(e) => handleFieldChange('looking_forward', e.target.value)}
            disabled={readOnly}
            placeholder="An upcoming event, meal, or weekend activity..."
            className="w-full text-xs sm:text-sm bg-white/70 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
