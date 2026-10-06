import React from 'react';
import { MOODS } from '../../utils/moodConstants';

export default function MoodPicker({
  selectedMood,
  onSelectMood,
  moodScore = 5,
  onChangeScore,
  showScore = true,
  compact = false,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
          How are you feeling?
        </label>
        <div className={`grid ${compact ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-3 sm:grid-cols-5 md:grid-cols-9'} gap-2`}>
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMood(isSelected ? null : m.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 bg-stone-100 dark:border-stone-100 dark:bg-stone-800 scale-105 shadow-xs font-medium'
                    : 'border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <span className="text-2xl mb-1 select-none">{m.emoji}</span>
                <span className="text-[11px] text-stone-700 dark:text-stone-300">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showScore && selectedMood && (
        <div className="pt-2 pb-1 bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200 dark:border-stone-800 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Mood Intensity
            </label>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
              {moodScore} / 10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodScore || 5}
            onChange={(e) => onChangeScore(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-900 dark:accent-stone-100"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
            <span>1 (Mild)</span>
            <span>5 (Moderate)</span>
            <span>10 (Intense)</span>
          </div>
        </div>
      )}
    </div>
  );
}

