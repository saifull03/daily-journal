import React from 'react';
import { X } from 'lucide-react';

export default function TagBadge({
  tag,
  onRemove,
  onClick,
  active = false,
  size = 'sm',
}) {
  const name = typeof tag === 'string' ? tag : tag.name;
  const color = (typeof tag === 'object' && tag.color) ? tag.color : '#6366f1';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 font-medium rounded-lg transition-all duration-150 ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${
        active
          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className="ml-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

