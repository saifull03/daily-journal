import React from 'react';
import AllJournalsPage from '../journal/AllJournalsPage';

export default function FavoritesPage() {
  return (
    <div className="space-y-4">
      <div className="pb-2">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Favorite Journals ❤️
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Your most cherished reflections, memories, and breakthroughs.
        </p>
      </div>

      <AllJournalsPage defaultFilter={{ is_favorite: true }} />
    </div>
  );
}

