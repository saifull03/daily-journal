<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminJournalController extends Controller
{
    /**
     * List all journal entries across the system for moderation.
     */
    public function index(Request $request): JsonResponse
    {
        $query = JournalEntry::with(['user:id,name,email,avatar', 'tags', 'images']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        if ($request->has('is_draft')) {
            $query->where('is_draft', filter_var($request->input('is_draft'), FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = (int) $request->input('per_page', 15);
        $entries = $query->latest('journal_date')->paginate($perPage);

        $transformed = $entries->getCollection()->map(function ($entry) {
            return [
                'id' => $entry->id,
                'user_id' => $entry->user_id,
                'title' => $entry->title,
                'type' => $entry->type,
                'content' => $entry->content,
                'data' => $entry->data,
                'mood' => $entry->mood,
                'mood_score' => $entry->mood_score,
                'journal_date' => $entry->journal_date?->toDateString(),
                'is_favorite' => (bool) $entry->is_favorite,
                'is_draft' => (bool) $entry->is_draft,
                'tags' => $entry->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'color' => $t->color]),
                'images_count' => $entry->images->count(),
                'user' => [
                    'id' => $entry->user?->id,
                    'name' => $entry->user?->name,
                    'email' => $entry->user?->email,
                    'avatar' => $entry->user?->avatar ? (str_starts_with($entry->user->avatar, 'http') ? $entry->user->avatar : asset('storage/' . $entry->user->avatar)) : null,
                ],
                'created_at' => $entry->created_at?->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformed,
            'meta' => [
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
                'per_page' => $entries->perPage(),
                'total' => $entries->total(),
            ],
        ]);
    }

    /**
     * View details of a specific journal entry.
     */
    public function show(int $id): JsonResponse
    {
        $entry = JournalEntry::with(['user:id,name,email,avatar', 'tags', 'images'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $entry->id,
                'user_id' => $entry->user_id,
                'title' => $entry->title,
                'type' => $entry->type,
                'content' => $entry->content,
                'data' => $entry->data,
                'mood' => $entry->mood,
                'mood_score' => $entry->mood_score,
                'journal_date' => $entry->journal_date?->toDateString(),
                'is_favorite' => (bool) $entry->is_favorite,
                'is_draft' => (bool) $entry->is_draft,
                'tags' => $entry->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'color' => $t->color]),
                'images' => $entry->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => asset('storage/' . $img->image_path),
                    'original_name' => $img->original_name,
                ]),
                'user' => [
                    'id' => $entry->user?->id,
                    'name' => $entry->user?->name,
                    'email' => $entry->user?->email,
                ],
                'created_at' => $entry->created_at?->toISOString(),
            ],
        ]);
    }

    /**
     * Delete an entry for admin moderation.
     */
    public function destroy(int $id): JsonResponse
    {
        $entry = JournalEntry::findOrFail($id);
        $entry->tags()->detach();
        $entry->images()->delete();
        $entry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Journal entry removed by administrator.',
        ]);
    }
}
