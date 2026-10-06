import React from 'react';
import { Loader2, Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function AutoSaveStatus({ status, lastSavedAt, onRetry }) {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (status === 'saved') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
        <Check className="w-3.5 h-3.5" />
        <span>{lastSavedAt ? `Saved ${lastSavedAt} ✓` : 'Saved just now ✓'}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Couldn't save</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="underline hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  return null;
}

