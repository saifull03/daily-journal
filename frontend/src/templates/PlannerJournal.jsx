import React, { useState } from 'react';
import { Target, CheckSquare, Plus, Trash2, Calendar, FileText, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

export default function PlannerJournal({
  entry,
  onChange,
  readOnly = false,
}) {
  const data = entry.data || {};
  const checklist = Array.isArray(data.checklist) ? data.checklist : [];
  const [newTaskText, setNewTaskText] = useState('');

  const handleFieldChange = (key, val) => {
    onChange('data', {
      ...data,
      [key]: val,
    });
  };

  const handleToggleTask = (taskId) => {
    if (readOnly) return;
    const updated = checklist.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    handleFieldChange('checklist', updated);
  };

  const handleAddTask = (e) => {
    e?.preventDefault();
    if (!newTaskText.trim() || readOnly) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
    };
    handleFieldChange('checklist', [...checklist, newTask]);
    setNewTaskText('');
  };

  const handleDeleteTask = (taskId) => {
    if (readOnly) return;
    const updated = checklist.filter((t) => t.id !== taskId);
    handleFieldChange('checklist', updated);
  };

  const completedCount = checklist.filter((t) => t.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Planner Header Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <input
            type="text"
            value={entry.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={readOnly}
            placeholder="Daily Plan & Priorities..."
            className="text-2xl font-bold text-stone-900 dark:text-stone-100 placeholder-stone-400 bg-transparent border-none focus:outline-none"
          />
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

        {/* Task Progress Bar */}
        {checklist.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-stone-500 font-medium">
              <span>Task Progress</span>
              <span>{completedCount} of {checklist.length} completed ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Checklist */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                To-Do Checklist
              </h4>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Interactive
            </span>
          </div>

          {/* Add Task input */}
          {!readOnly && (
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a new task (e.g. Finish Laravel API)..."
                className="flex-1 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl px-3.5 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" size="sm" leftIcon={Plus} variant="secondary">
                Add
              </Button>
            </form>
          )}

          {/* Checklist Items */}
          <div className="space-y-2 pt-2">
            {checklist.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-stone-50/80 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 line-through text-stone-400 dark:text-stone-500'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs sm:text-sm font-medium">{task.text}</span>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.id);
                    }}
                    className="text-stone-400 hover:text-rose-500 p-1 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {checklist.length === 0 && (
              <p className="text-xs text-stone-400 italic py-4 text-center">
                No tasks added yet. Add one above!
              </p>
            )}
          </div>

          {/* Notes section */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
              <FileText className="w-3.5 h-3.5" />
              <span>Planner Notes</span>
            </label>
            <textarea
              rows={3}
              value={data.notes || ''}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              disabled={readOnly}
              placeholder="Reflections, observations, or adjustments made throughout the day..."
              className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Right Column: Today's Goals, Important Tasks & Tomorrow */}
        <div className="space-y-4">
          {/* Today's Goals */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Target className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">
                Today's Main Goals
              </h5>
            </div>
            <textarea
              rows={3}
              value={data.goals || ''}
              onChange={(e) => handleFieldChange('goals', e.target.value)}
              disabled={readOnly}
              placeholder="What are the 1-3 high impact outcomes for today?"
              className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Important Tasks */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Must-Do Milestones
            </h5>
            <textarea
              rows={3}
              value={data.important_tasks || ''}
              onChange={(e) => handleFieldChange('important_tasks', e.target.value)}
              disabled={readOnly}
              placeholder="Critical deadlines or time-sensitive deliverables..."
              className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Tomorrow's Priorities */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <ArrowRight className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">
                Tomorrow's Priorities
              </h5>
            </div>
            <textarea
              rows={3}
              value={data.tomorrow_priorities || ''}
              onChange={(e) => handleFieldChange('tomorrow_priorities', e.target.value)}
              disabled={readOnly}
              placeholder="What to kickstart first thing tomorrow morning..."
              className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

