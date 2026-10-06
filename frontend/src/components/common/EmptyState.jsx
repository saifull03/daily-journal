import React from 'react';
import Button from './Button';
import { BookOpen, Sparkles } from 'lucide-react';

export default function EmptyState({
  icon: Icon = BookOpen,
  title = 'No journals yet',
  description = 'Your story starts here. Capture your first thought, feeling, or memory.',
  actionText = 'Write Your First Journal',
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 my-6 bg-stone-50/50 dark:bg-stone-900/30 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">
        {title}
      </h3>
      <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} leftIcon={Sparkles} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
}
