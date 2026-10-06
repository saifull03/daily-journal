import React from 'react';
import { Sparkles, AlertCircle, Heart, BookOpen, Compass } from 'lucide-react';
import MoodPicker from '../components/journal/MoodPicker';

export default function ReflectionJournal({
  entry,
  onChange,
  readOnly = false,
}) {
  const data = entry.data || {};

  const handleFieldChange = (key, val) => {
    onChange('data', {
      ...data,
      [key]: val,
    });
  };

  const sections = [
    {
      key: 'highlight',
      title: "Today's Highlight",
      prompt: 'What was the best part of today?',
      icon: Sparkles,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40',
      placeholder: 'Describe a moment that brought a smile or feeling of achievement...',
    },
    {
      key: 'challenges',
      title: 'Challenges',
      prompt: 'What was difficult today?',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/60 dark:border-orange-900/40',
      placeholder: 'What obstacles did you encounter, and how did you respond?...',
    },
    {
      key: 'gratitude',
      title: 'Gratitude',
      prompt: 'What am I grateful for?',
      icon: Heart,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40',
      placeholder: 'People, comforts, or small moments of beauty...',
    },
    {
      key: 'lessons',
      title: 'Lessons Learned',
      prompt: 'What did I learn today?',
      icon: BookOpen,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-900/40',
      placeholder: 'An insight about yourself, work, or the world...',
    },
    {
      key: 'tomorrow',
      title: 'Tomorrow',
      prompt: 'What do I want to accomplish tomorrow?',
      icon: Compass,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40',
      placeholder: 'Key intention or focus for tomorrow...',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Metadata Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <input
            type="text"
            value={entry.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={readOnly}
            placeholder="Reflection Title..."
            className="text-2xl font-bold text-stone-900 dark:text-stone-100 placeholder-stone-400 bg-transparent border-none focus:outline-none"
          />
          <input
            type="date"
            value={entry.journal_date || ''}
            onChange={(e) => onChange('journal_date', e.target.value)}
            disabled={readOnly}
            className="text-xs font-semibold text-stone-500 dark:text-stone-400 bg-transparent border-none focus:outline-none cursor-pointer"
          />
        </div>

        {!readOnly && (
          <MoodPicker
            selectedMood={entry.mood}
            onSelectMood={(m) => onChange('mood', m)}
            moodScore={entry.mood_score}
            onChangeScore={(s) => onChange('mood_score', s)}
            compact
          />
        )}
      </div>

      {/* Structured Card Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          const isFullWidth = idx === sections.length - 1;

          return (
            <div
              key={sec.key}
              className={`rounded-2xl border p-5 transition-all ${sec.bgColor} ${
                isFullWidth ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 shadow-2xs">
                  <Icon className={`w-4 h-4 ${sec.iconColor}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {sec.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                    "{sec.prompt}"
                  </p>
                </div>
              </div>

              <textarea
                rows={3}
                value={data[sec.key] || ''}
                onChange={(e) => handleFieldChange(sec.key, e.target.value)}
                disabled={readOnly}
                placeholder={sec.placeholder}
                className="w-full text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-white/70 dark:bg-stone-900/60 rounded-xl p-3 border border-stone-200/80 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 leading-relaxed resize-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

