import React from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Wrench,
  Users,
  Trophy,
  ArrowRight,
  FileText,
} from 'lucide-react';
import RichEditor from '../components/editor/RichEditor';

export default function WorkJournal({
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
      {/* Professional Header */}
      <div className="bg-stone-900 text-stone-100 dark:bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Professional Work Log</span>
          </div>

          <div className="flex items-center gap-2 text-stone-300">
            <Calendar className="w-4 h-4 text-stone-400" />
            <input
              type="date"
              value={entry.journal_date || ''}
              onChange={(e) => onChange('journal_date', e.target.value)}
              disabled={readOnly}
              className="text-xs font-semibold bg-transparent border-none focus:outline-none cursor-pointer text-stone-200"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            value={entry.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={readOnly}
            placeholder="Work Log Title (e.g. Sprint Review & Architecture Decisions)..."
            className="w-full text-2xl font-bold text-stone-100 placeholder-stone-500 bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Main Tasks */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-stone-300 mb-1">
            Primary Objectives & Focus:
          </label>
          <input
            type="text"
            value={data.main_tasks || ''}
            onChange={(e) => handleFieldChange('main_tasks', e.target.value)}
            disabled={readOnly}
            placeholder="Key deliverables and strategic goals for this workday..."
            className="w-full text-xs sm:text-sm bg-stone-800/80 rounded-xl px-3.5 py-2.5 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-stone-100"
          />
        </div>
      </div>

      {/* Task & Problem Execution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completed Tasks */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Completed Tasks
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.completed_tasks || ''}
            onChange={(e) => handleFieldChange('completed_tasks', e.target.value)}
            disabled={readOnly}
            placeholder="Closed tickets, merged PRs, delivered designs, sent reports..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Pending / In-Progress Tasks
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.pending_tasks || ''}
            onChange={(e) => handleFieldChange('pending_tasks', e.target.value)}
            disabled={readOnly}
            placeholder="Work started but waiting on review or testing..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>

        {/* Problems Encountered */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Problems & Blockers Encountered
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.problems || ''}
            onChange={(e) => handleFieldChange('problems', e.target.value)}
            disabled={readOnly}
            placeholder="Bottlenecks, unexpected bugs, communication gaps..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>

        {/* Solutions & Resolutions */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Wrench className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Solutions & Resolutions
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.solutions || ''}
            onChange={(e) => handleFieldChange('solutions', e.target.value)}
            disabled={readOnly}
            placeholder="How you unblocked the problem or mitigated the risk..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Meetings & Discussions */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Users className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Meetings & Key Discussions
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.meetings || ''}
            onChange={(e) => handleFieldChange('meetings', e.target.value)}
            disabled={readOnly}
            placeholder="Decisions made during 1:1s, sprint planning, client calls..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
            <Trophy className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Wins & Achievements
            </h5>
          </div>
          <textarea
            rows={3}
            value={data.achievements || ''}
            onChange={(e) => handleFieldChange('achievements', e.target.value)}
            disabled={readOnly}
            placeholder="Kudos, metric improvements, milestones reached..."
            className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>
      </div>

      {/* Tomorrow's Priorities */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
          <ArrowRight className="w-4 h-4 text-blue-500" />
          <h5 className="text-xs font-bold uppercase tracking-wider">
            Tomorrow's Primary Deliverables
          </h5>
        </div>
        <textarea
          rows={2}
          value={data.tomorrow_priorities || ''}
          onChange={(e) => handleFieldChange('tomorrow_priorities', e.target.value)}
          disabled={readOnly}
          placeholder="First priorities to tackle when you log on tomorrow..."
          className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Extended Work Notes */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-stone-500" />
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Work Notes & Documentation
          </h4>
        </div>
        <RichEditor
          value={entry.content || ''}
          onChange={(html) => onChange('content', html)}
          readOnly={readOnly}
          placeholder="Architecture diagrams, command logs, links to PRs or specs..."
          minHeight="min-h-[250px]"
        />
      </div>
    </div>
  );
}

