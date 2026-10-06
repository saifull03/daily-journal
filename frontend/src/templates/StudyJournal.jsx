import React from 'react';
import {
  GraduationCap,
  Clock,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import RichEditor from '../components/editor/RichEditor';

export default function StudyJournal({
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Notebook Header Banner */}
      <div className="bg-white dark:bg-stone-900 border-l-8 border-violet-600 dark:border-violet-500 border-y border-r border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Study & Research Notebook</span>
        </div>

        <div>
          <input
            type="text"
            value={entry.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={readOnly}
            placeholder="Study Session Title (e.g. Distributed Consensus)..."
            className="w-full text-2xl font-bold text-stone-900 dark:text-stone-100 placeholder-stone-400 bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Quick Study Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Subject */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
              <BookOpen className="w-3 h-3 text-violet-500" />
              <span>Subject / Course</span>
            </label>
            <input
              type="text"
              value={data.subject || ''}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
              disabled={readOnly}
              placeholder="e.g. Computer Science, History"
              className="w-full text-xs font-semibold text-stone-800 dark:text-stone-100 bg-transparent border-none focus:outline-none mt-1"
            />
          </div>

          {/* Duration */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
              <Clock className="w-3 h-3 text-violet-500" />
              <span>Study Duration</span>
            </label>
            <input
              type="text"
              value={data.duration || ''}
              onChange={(e) => handleFieldChange('duration', e.target.value)}
              disabled={readOnly}
              placeholder="e.g. 2 hours 15 mins"
              className="w-full text-xs font-semibold text-stone-800 dark:text-stone-100 bg-transparent border-none focus:outline-none mt-1"
            />
          </div>

          {/* Date */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
              <GraduationCap className="w-3 h-3 text-violet-500" />
              <span>Study Date</span>
            </label>
            <input
              type="date"
              value={entry.journal_date || ''}
              onChange={(e) => onChange('journal_date', e.target.value)}
              disabled={readOnly}
              className="w-full text-xs font-semibold text-stone-800 dark:text-stone-100 bg-transparent border-none focus:outline-none mt-1 cursor-pointer"
            />
          </div>
        </div>

        {/* Topics Studied */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Topics Covered:
          </label>
          <input
            type="text"
            value={data.topics || ''}
            onChange={(e) => handleFieldChange('topics', e.target.value)}
            disabled={readOnly}
            placeholder="Key concepts, chapters, formulas, or articles examined today..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl px-3.5 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Synthesis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What I Learned */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Lightbulb className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Core Takeaways (What I Learned)
            </h5>
          </div>
          <textarea
            rows={4}
            value={data.what_learned || ''}
            onChange={(e) => handleFieldChange('what_learned', e.target.value)}
            disabled={readOnly}
            placeholder="Synthesize the primary models, rules, or insights in your own words..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>

        {/* Difficult Concepts */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Difficult Concepts & Friction
            </h5>
          </div>
          <textarea
            rows={4}
            value={data.difficult_concepts || ''}
            onChange={(e) => handleFieldChange('difficult_concepts', e.target.value)}
            disabled={readOnly}
            placeholder="Parts that took extra effort or felt counter-intuitive..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>

        {/* Open Questions */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <HelpCircle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Questions To Explore
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.questions || ''}
            onChange={(e) => handleFieldChange('questions', e.target.value)}
            disabled={readOnly}
            placeholder="What gaps remain? What questions should you ask next?..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>

        {/* Tomorrow's Study Goal */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <ArrowRight className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Tomorrow's Study Goal
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.tomorrow_goal || ''}
            onChange={(e) => handleFieldChange('tomorrow_goal', e.target.value)}
            disabled={readOnly}
            placeholder="What section or practice problem will you tackle next?..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>
      </div>

      {/* Comprehensive Study Notes */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-500" />
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Detailed Lecture & Book Notes
          </h4>
        </div>
        <RichEditor
          value={entry.content || ''}
          onChange={(html) => onChange('content', html)}
          readOnly={readOnly}
          placeholder="Jot down formulas, code snippets, excerpts, and proof sketches..."
          minHeight="min-h-[300px]"
        />
      </div>
    </div>
  );
}

