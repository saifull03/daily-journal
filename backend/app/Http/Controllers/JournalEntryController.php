<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJournalRequest;
use App\Http\Requests\UpdateJournalRequest;
use App\Http\Resources\JournalEntryResource;
use App\Models\JournalEntry;
use App\Models\JournalTag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JournalEntryController extends Controller
{
    /**
     * Display a listing of the user's journal entries.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $query = JournalEntry::where('user_id', $userId)
            ->with(['tags', 'images']);

        // Search in title, content, or tags
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhereHas('tags', function ($tq) use ($search) {
                      $tq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by journal type
        if ($type = $request->input('type')) {
            if ($type !== 'all') {
                $query->where('type', $type);
            }
        }

        // Filter by mood
        if ($mood = $request->input('mood')) {
            if ($mood !== 'all') {
                $query->where('mood', $mood);
            }
        }

        // Filter by tag
        if ($tag = $request->input('tag')) {
            $query->whereHas('tags', function ($tq) use ($tag) {
                if (is_numeric($tag)) {
                    $tq->where('journal_tags.id', $tag);
                } else {
                    $tq->where('journal_tags.name', $tag);
                }
            });
        }

        // Filter by exact date
        if ($date = $request->input('date')) {
            $query->whereDate('journal_date', $date);
        }

        // Filter by date range
        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('journal_date', '>=', $dateFrom);
        }
        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('journal_date', '<=', $dateTo);
        }

        // Filter by favorites
        if ($request->has('is_favorite') && $request->input('is_favorite') !== null && $request->input('is_favorite') !== '') {
            $isFav = filter_var($request->input('is_favorite'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_favorite', $isFav);
        }

        // Filter by drafts
        if ($request->has('is_draft') && $request->input('is_draft') !== null && $request->input('is_draft') !== '') {
            $isDraft = filter_var($request->input('is_draft'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_draft', $isDraft);
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        if ($sort === 'oldest') {
            $query->orderBy('journal_date', 'asc')->orderBy('id', 'asc');
        } else {
            $query->orderBy('journal_date', 'desc')->orderBy('id', 'desc');
        }

        $perPage = (int) $request->input('per_page', 10);
        $entries = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Journals retrieved successfully',
            'data' => JournalEntryResource::collection($entries),
            'meta' => [
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
                'per_page' => $entries->perPage(),
                'total' => $entries->total(),
            ],
        ]);
    }

    /**
     * Store a newly created journal entry in storage.
     */
    public function store(StoreJournalRequest $request): JsonResponse
    {
        $userId = $request->user()->id;

        $entry = DB::transaction(function () use ($request, $userId) {
            $data = $request->validated();
            $tags = $data['tags'] ?? [];
            unset($data['tags']);

            $data['user_id'] = $userId;
            $data['is_favorite'] = $data['is_favorite'] ?? false;
            $data['is_draft'] = $data['is_draft'] ?? false;

            $journalEntry = JournalEntry::create($data);

            $this->syncTags($journalEntry, $tags, $userId);

            return $journalEntry;
        });

        $entry->load(['tags', 'images']);

        return response()->json([
            'success' => true,
            'message' => 'Journal entry created successfully',
            'data' => new JournalEntryResource($entry),
        ], 201);
    }

    /**
     * Display the specified journal entry.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $entry = JournalEntry::with(['tags', 'images'])->findOrFail($id);

        if ($entry->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to journal entry.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Journal entry retrieved successfully',
            'data' => new JournalEntryResource($entry),
        ]);
    }

    /**
     * Update the specified journal entry.
     */
    public function update(UpdateJournalRequest $request, int $id): JsonResponse
    {
        $entry = JournalEntry::findOrFail($id);

        if ($entry->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to journal entry.',
            ], 403);
        }

        DB::transaction(function () use ($request, $entry) {
            $data = $request->validated();

            if (array_key_exists('tags', $data)) {
                $tags = $data['tags'] ?? [];
                unset($data['tags']);
                $this->syncTags($entry, $tags, $entry->user_id);
            }

            $entry->update($data);
        });

        $entry->load(['tags', 'images']);

        return response()->json([
            'success' => true,
            'message' => 'Journal entry updated successfully',
            'data' => new JournalEntryResource($entry),
        ]);
    }

    /**
     * Remove the specified journal entry from storage.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $entry = JournalEntry::findOrFail($id);

        if ($entry->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to journal entry.',
            ], 403);
        }

        $entry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Journal entry deleted successfully',
            'data' => null,
        ]);
    }

    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(Request $request, int $id): JsonResponse
    {
        $entry = JournalEntry::findOrFail($id);

        if ($entry->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to journal entry.',
            ], 403);
        }

        $entry->is_favorite = ! $entry->is_favorite;
        $entry->save();

        return response()->json([
            'success' => true,
            'message' => $entry->is_favorite ? 'Added to favorites' : 'Removed from favorites',
            'data' => [
                'id' => $entry->id,
                'is_favorite' => $entry->is_favorite,
            ],
        ]);
    }

    /**
     * Debounced auto-save draft handler.
     */
    public function autosave(Request $request, ?int $id = null): JsonResponse
    {
        $userId = $request->user()->id;

        $targetId = $id ?? $request->input('id');

        $validated = $request->validate([
            'id' => ['nullable', 'integer'],
            'title' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'data' => ['nullable', 'array'],
            'mood' => ['nullable', 'string'],
            'mood_score' => ['nullable', 'integer'],
            'journal_date' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
        ]);

        $tags = $validated['tags'] ?? null;
        unset($validated['tags'], $validated['id']);

        if ($targetId) {
            $entry = JournalEntry::findOrFail($targetId);
            if ($entry->user_id !== $userId) {
                return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
            }
            $entry->update($validated);
        } else {
            $validated['user_id'] = $userId;
            $validated['is_draft'] = true;
            $validated['title'] = !empty($validated['title']) ? $validated['title'] : 'Untitled Draft';
            $validated['type'] = !empty($validated['type']) ? $validated['type'] : 'classic';
            $validated['journal_date'] = !empty($validated['journal_date']) ? $validated['journal_date'] : now()->toDateString();
            $entry = JournalEntry::create($validated);
        }

        if ($tags !== null) {
            $this->syncTags($entry, $tags, $userId);
        }

        $entry->load(['tags', 'images']);

        return response()->json([
            'success' => true,
            'message' => 'Draft auto-saved successfully',
            'data' => new JournalEntryResource($entry),
        ]);
    }

    /**
     * Get user's favorite journals.
     */
    public function favorites(Request $request): JsonResponse
    {
        $request->merge(['is_favorite' => true, 'is_draft' => false]);
        return $this->index($request);
    }

    /**
     * Get user's draft journals.
     */
    public function drafts(Request $request): JsonResponse
    {
        $request->merge(['is_draft' => true]);
        return $this->index($request);
    }

    /**
     * Helper to synchronize tags by id or name.
     */
    private function syncTags(JournalEntry $entry, array $tags, int $userId): void
    {
        $tagIds = [];
        foreach ($tags as $tagItem) {
            if (is_numeric($tagItem)) {
                $tagIds[] = (int) $tagItem;
            } elseif (is_string($tagItem) && trim($tagItem) !== '') {
                $name = trim($tagItem);
                $tag = JournalTag::firstOrCreate(
                    ['user_id' => $userId, 'name' => $name],
                    ['color' => $this->getRandomTagColor()]
                );
                $tagIds[] = $tag->id;
            } elseif (is_array($tagItem) && !empty($tagItem['id'])) {
                $tagIds[] = (int) $tagItem['id'];
            }
        }

        $entry->tags()->sync(array_unique($tagIds));
    }

    private function getRandomTagColor(): string
    {
        $colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4', '#3b82f6'];
        return $colors[array_rand($colors)];
    }
}
