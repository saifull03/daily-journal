import React from 'react';
import AllJournalsPage from '../journal/AllJournalsPage';

export default function DraftsPage() {
  return (
    <div className="space-y-4">
      <div className="pb-2">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Draft Journals
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Unpublished thoughts waiting for you to complete them.
        </p>
      </div>

      <AllJournalsPage defaultFilter={{ is_draft: true }} />
    </div>
  );
}

