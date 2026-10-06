import React from 'react';
import MoodPicker from '../components/journal/MoodPicker';
import { getMoodById } from '../utils/moodConstants';
import { Calendar, HelpCircle, Heart, Sparkles, MessageSquare } from 'lucide-react';

export default function MoodJournal({
  entry,
  onChange,
  readOnly = false,
}) {
  const data = entry.data || {};
  const currentMood = getMoodById(entry.mood);

  const handleFieldChange = (key, val) => {
    onChange('data', {
      ...data,
      [key]: val,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mood Showcase Hero Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Emotional Wellness Check-in
            </span>
            <input
              type="text"
              value={entry.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              disabled={readOnly}
              placeholder="How are you feeling right now?..."
              className="block text-2xl font-bold text-stone-900 dark:text-stone-100 placeholder-stone-400 bg-transparent border-none focus:outline-none mt-1"
            />
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

        {/* Visual Mood Picker and Intensity */}
        <MoodPicker
          selectedMood={entry.mood}
          onSelectMood={(m) => onChange('mood', m)}
          moodScore={entry.mood_score}
          onChangeScore={(s) => onChange('mood_score', s)}
          showScore={true}
        />
      </div>

      {/* Guided Reflection Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What happened? */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              What happened?
            </h5>
          </div>
          <p className="text-[11px] text-stone-400 italic">
            Describe the situation, event, or trigger that influenced your feelings.
          </p>
          <textarea
            rows={3}
            value={data.what_happened || ''}
            onChange={(e) => handleFieldChange('what_happened', e.target.value)}
            disabled={readOnly}
            placeholder="A conversation, task, or thought that stood out..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>

        {/* Why do I feel this way? */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <Heart className="w-4 h-4 text-rose-500" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Why do I feel this way?
            </h5>
          </div>
          <p className="text-[11px] text-stone-400 italic">
            Look inward at the underlying expectations, needs, or boundaries.
          </p>
          <textarea
            rows={3}
            value={data.why_feel_this_way || ''}
            onChange={(e) => handleFieldChange('why_feel_this_way', e.target.value)}
            disabled={readOnly}
            placeholder="Was I tired? Did something challenge my values?..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>

        {/* What helped? */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              What helped?
            </h5>
          </div>
          <p className="text-[11px] text-stone-400 italic">
            Actions, thoughts, or breaks that brought relief or grounded you.
          </p>
          <textarea
            rows={3}
            value={data.what_helped || ''}
            onChange={(e) => handleFieldChange('what_helped', e.target.value)}
            disabled={readOnly}
            placeholder="A warm walk, tea, talking to a friend, deep breathing..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>

        {/* Additional Thoughts */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Additional Thoughts
            </h5>
          </div>
          <p className="text-[11px] text-stone-400 italic">
            Any other insights, patterns, or reminders for yourself.
          </p>
          <textarea
            rows={3}
            value={data.additional_thoughts || ''}
            onChange={(e) => handleFieldChange('additional_thoughts', e.target.value)}
            disabled={readOnly}
            placeholder="Remind yourself that feelings pass and clarity returns..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
