import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '../../api/journalApi';
import { useToastStore } from '../../store/toastStore';
import { toInputDate } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';

// Templates
import ClassicJournal from '../../templates/ClassicJournal';
import ReflectionJournal from '../../templates/ReflectionJournal';
import PlannerJournal from '../../templates/PlannerJournal';
import MoodJournal from '../../templates/MoodJournal';
import GratitudeJournal from '../../templates/GratitudeJournal';
import FreeWritingJournal from '../../templates/FreeWritingJournal';
import TravelJournal from '../../templates/TravelJournal';
import StudyJournal from '../../templates/StudyJournal';
import WorkJournal from '../../templates/WorkJournal';
import DreamJournal from '../../templates/DreamJournal';

// Common UI
import Button from '../../components/common/Button';
import AutoSaveStatus from '../../components/editor/AutoSaveStatus';
import TagBadge from '../../components/journal/TagBadge';
import { ArrowLeft, Save, Heart, Tag as TagIcon } from 'lucide-react';

const TEMPLATE_COMPONENTS = {
  classic: ClassicJournal,
  reflection: ReflectionJournal,
  planner: PlannerJournal,
  mood: MoodJournal,
  gratitude: GratitudeJournal,
  free_writing: FreeWritingJournal,
  travel: TravelJournal,
  study: StudyJournal,
  work: WorkJournal,
  dream: DreamJournal,
};

export default function JournalEditorPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const isEditMode = Boolean(id);
  const initialType = type || 'classic';

  // Local state for the journal entry
  const [entry, setEntry] = useState({
    id: id ? parseInt(id, 10) : null,
    title: '',
    type: initialType,
    content: '',
    data: {},
    mood: null,
    mood_score: 5,
    journal_date: toInputDate(),
    is_favorite: false,
    is_draft: true,
    tags: [],
    images: [],
  });

  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Load existing journal if edit mode
  const { data: existingData, isLoading: isLoadingExisting } = useQuery({
    queryKey: ['journal', id],
    queryFn: () => journalApi.getJournal(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (existingData?.data) {
      const e = existingData.data;
      setEntry({
        id: e.id,
        title: e.title || '',
        type: e.type || 'classic',
        content: e.content || '',
        data: e.data || {},
        mood: e.mood || null,
        mood_score: e.mood_score || 5,
        journal_date: e.journal_date || toInputDate(),
        is_favorite: Boolean(e.is_favorite),
        is_draft: Boolean(e.is_draft),
        tags: e.tags || [],
        images: e.images || [],
      });
    }
  }, [existingData]);

  // Fetch all tags for tag suggestions
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => journalApi.getTags(),
  });

  // Track if user touched fields to avoid autosaving on initial mount
  const isDirtyRef = useRef(false);
  const debounceTimerRef = useRef(null);

  // Field change handler
  const handleFieldChange = (field, value) => {
    isDirtyRef.current = true;
    setEntry((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Perform Autosave API call
  const performAutoSave = useCallback(async (currentEntry) => {
    if (!isDirtyRef.current) return;
    setSaveStatus('saving');

    try {
      const payload = {
        id: currentEntry.id,
        title: currentEntry.title || 'Untitled Draft',
        type: currentEntry.type,
        content: currentEntry.content,
        data: currentEntry.data,
        mood: currentEntry.mood,
        mood_score: currentEntry.mood_score,
        journal_date: currentEntry.journal_date,
        tags: currentEntry.tags.map((t) => (typeof t === 'object' ? t.name : t)),
      };

      const res = await journalApi.autosave(payload);
      if (res.data) {
        setEntry((prev) => ({
          ...prev,
          id: res.data.id,
          is_draft: true,
        }));
        setSaveStatus('saved');
        setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        queryClient.invalidateQueries({ queryKey: ['journals'] });
        queryClient.invalidateQueries({ queryKey: ['journal-drafts'] });
      }
    } catch {
      setSaveStatus('error');
    }
  }, [queryClient]);

  // Debounced auto-save hook: triggers 2.5s after user stops typing
  useEffect(() => {
    if (!isDirtyRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performAutoSave(entry);
    }, 2500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [entry, performAutoSave]);

  // Publish / Save Journal Mutation
  const saveMutation = useMutation({
    mutationFn: async (isDraft) => {
      const payload = {
        title: entry.title || (isDraft ? 'Untitled Draft' : 'My Journal'),
        type: entry.type,
        content: entry.content,
        data: entry.data,
        mood: entry.mood,
        mood_score: entry.mood_score,
        journal_date: entry.journal_date,
        is_favorite: entry.is_favorite,
        is_draft: isDraft,
        tags: entry.tags.map((t) => (typeof t === 'object' ? t.name : t)),
      };

      if (entry.id) {
        return await journalApi.updateJournal(entry.id, payload);
      } else {
        return await journalApi.createJournal(payload);
      }
    },
    onSuccess: (res, isDraft) => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      queryClient.invalidateQueries({ queryKey: ['journal-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['journal-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });

      if (!isDraft) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        addToast('Journal published successfully ✓', 'success');
        navigate(`/journals/${res.data.id}`);
      } else {
        addToast('Draft saved successfully ✓', 'success');
      }
    },
    onError: () => {
      addToast('Could not save your journal.', 'error');
    },
  });

  // Image Upload Handlers
  const handleUploadImages = async (files) => {
    let currentEntryId = entry.id;
    if (!currentEntryId) {
      // Must save as draft first to have an entry ID for image association
      try {
        const payload = {
          title: entry.title || 'Untitled Draft',
          type: entry.type,
          content: entry.content,
          data: entry.data,
          journal_date: entry.journal_date,
        };
        const draftRes = await journalApi.autosave(payload);
        currentEntryId = draftRes.data.id;
        setEntry((prev) => ({ ...prev, id: draftRes.data.id }));
      } catch {
        addToast('Failed to prepare draft for photo upload.', 'error');
        return;
      }
    }

    setIsUploading(true);
    const formData = new FormData();
    if (files instanceof FileList || Array.isArray(files)) {
      Array.from(files).forEach((f) => formData.append('images[]', f));
    } else {
      formData.append('image', files);
    }

    try {
      const res = await journalApi.uploadImage(currentEntryId, formData);
      const newImages = Array.isArray(res.data) ? res.data : [res.data];
      setEntry((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
      addToast('Photos uploaded successfully ✓', 'success');
      queryClient.invalidateQueries({ queryKey: ['journal', entry.id] });
    } catch {
      addToast('Failed to upload images. Check file size.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await journalApi.deleteImage(imageId);
      setEntry((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
      addToast('Photo removed', 'info');
    } catch {
      addToast('Failed to remove photo.', 'error');
    }
  };

  // Tag Add / Remove handlers
  const handleAddTag = (e) => {
    e?.preventDefault();
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (!entry.tags.some((t) => (typeof t === 'string' ? t : t.name).toLowerCase() === trimmed.toLowerCase())) {
      isDirtyRef.current = true;
      setEntry((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    isDirtyRef.current = true;
    setEntry((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => {
        const name = typeof t === 'string' ? t : t.name;
        const target = typeof tagToRemove === 'string' ? tagToRemove : tagToRemove.name;
        return name !== target;
      }),
    }));
  };

  const SelectedTemplate = TEMPLATE_COMPONENTS[entry.type] || ClassicJournal;

  if (isEditMode && isLoadingExisting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-stone-400 text-sm">
          Loading journal...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top action bar: Back, AutoSave status, Favorite, Save/Publish */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <Link
            to="/journals"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Back to journals"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <AutoSaveStatus
            status={saveStatus}
            lastSavedAt={lastSavedAt}
            onRetry={() => performAutoSave(entry)}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Favorite button */}
          <button
            type="button"
            onClick={() => handleFieldChange('is_favorite', !entry.is_favorite)}
            className={`p-2 rounded-xl border transition-colors ${
              entry.is_favorite
                ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900'
                : 'border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
            title="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${entry.is_favorite ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Save Draft */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => saveMutation.mutate(true)}
            isLoading={saveMutation.isPending && saveMutation.variables === true}
          >
            Save Draft
          </Button>

          {/* Publish / Final Save */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            leftIcon={Save}
            onClick={() => saveMutation.mutate(false)}
            isLoading={saveMutation.isPending && saveMutation.variables === false}
          >
            Publish Journal
          </Button>
        </div>
      </div>

      {/* Render the selected template */}
      <SelectedTemplate
        entry={entry}
        onChange={handleFieldChange}
        readOnly={false}
        onUploadImages={handleUploadImages}
        onRemoveImage={handleRemoveImage}
        isUploading={isUploading}
      />

      {/* Tags Section at the bottom */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-stone-500" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Journal Tags
            </h5>
          </div>
          <span className="text-[11px] text-stone-400">
            Categorize your thoughts
          </span>
        </div>

        {/* Existing assigned tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {entry.tags.map((tag) => (
            <TagBadge
              key={typeof tag === 'string' ? tag : tag.id || tag.name}
              tag={tag}
              onRemove={() => handleRemoveTag(tag)}
            />
          ))}

          {/* Quick add input */}
          <form onSubmit={handleAddTag} className="inline-flex items-center gap-1.5">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="+ Add tag..."
              className="text-xs px-2.5 py-1 rounded-lg bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-800 dark:text-stone-200"
            />
          </form>
        </div>

        {/* Suggested tags pills from user's history */}
        {tagsData?.data && tagsData.data.length > 0 && (
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-stone-400 font-semibold uppercase">
              Suggestions:
            </span>
            {tagsData.data.slice(0, 8).map((t) => {
              const alreadyHas = entry.tags.some(
                (et) => (typeof et === 'string' ? et : et.name).toLowerCase() === t.name.toLowerCase()
              );
              if (alreadyHas) return null;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    isDirtyRef.current = true;
                    setEntry((prev) => ({ ...prev, tags: [...prev.tags, t.name] }));
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  +{t.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
