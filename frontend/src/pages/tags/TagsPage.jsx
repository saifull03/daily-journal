import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { journalApi } from '../../api/journalApi';
import { useToastStore } from '../../store/toastStore';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Tag as TagIcon, Plus, Trash2 } from 'lucide-react';

const PRESET_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
];

export default function TagsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState(PRESET_COLORS[0]);
  const [tagToDelete, setTagToDelete] = useState(null);

  // Fetch Tags
  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => journalApi.getTags(),
  });

  const tags = data?.data || [];

  // Create Tag Mutation
  const createMutation = useMutation({
    mutationFn: (newTag) => journalApi.createTag(newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      addToast('Tag created successfully ✓', 'success');
      setTagName('');
    },
    onError: () => {
      addToast('Tag creation failed or already exists.', 'error');
    },
  });

  // Delete Tag Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => journalApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      addToast('Tag deleted.', 'info');
      setTagToDelete(null);
    },
  });

  const handleCreateTag = (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    createMutation.mutate({ name: tagName.trim(), color: tagColor });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-2">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Journal Tags
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Organize and label your thoughts by topic, goal, or theme.
        </p>
      </div>

      {/* Tag Creator Card */}
      <form
        onSubmit={handleCreateTag}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4"
      >
        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-stone-500" />
          <span>Create New Tag</span>
        </h4>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              label="Tag Name"
              placeholder="e.g. Creativity, Health, Deep Work..."
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              required
            />
          </div>

          {/* Color picker pills */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Color
            </label>
            <div className="flex items-center gap-1.5 p-1 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTagColor(c)}
                  className={`w-6 h-6 rounded-lg transition-transform ${
                    tagColor === c ? 'scale-110 ring-2 ring-stone-900 dark:ring-stone-100' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            leftIcon={Plus}
            isLoading={createMutation.isPending}
          >
            Create Tag
          </Button>
        </div>
      </form>

      {/* Tags Collection Grid */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
          Existing Tags ({tags.length})
        </h4>

        {isLoading ? (
          <p className="text-xs text-stone-400 animate-pulse">Loading tags...</p>
        ) : tags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 hover:border-stone-300 transition-colors"
              >
                <div
                  onClick={() => navigate(`/journals?tag=${encodeURIComponent(tag.name)}`)}
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      #{tag.name}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {tag.entries_count || 0} entries
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTagToDelete(tag)}
                  className="text-stone-400 hover:text-rose-500 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete tag"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-stone-400 italic">
            No tags created yet. Add one above!
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(tagToDelete)}
        onClose={() => setTagToDelete(null)}
        onConfirm={() => deleteMutation.mutate(tagToDelete.id)}
        isLoading={deleteMutation.isPending}
        title={`Delete tag #${tagToDelete?.name}?`}
        description="The tag will be removed from your list, but entries will not be deleted."
        confirmText="Delete Tag"
      />
    </div>
  );
}
