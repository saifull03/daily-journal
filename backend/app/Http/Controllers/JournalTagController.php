<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTagRequest;
use App\Http\Resources\JournalTagResource;
use App\Models\JournalTag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JournalTagController extends Controller
{
    /**
     * Display a listing of user's tags.
     */
    public function index(Request $request): JsonResponse
    {
        $tags = JournalTag::where('user_id', $request->user()->id)
            ->withCount('journalEntries')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Tags retrieved successfully',
            'data' => JournalTagResource::collection($tags),
        ]);
    }

    /**
     * Store a new tag.
     */
    public function store(StoreTagRequest $request): JsonResponse
    {
        $userId = $request->user()->id;

        $tag = JournalTag::firstOrCreate(
            ['user_id' => $userId, 'name' => trim($request->name)],
            ['color' => $request->color ?? '#6366f1']
        );

        return response()->json([
            'success' => true,
            'message' => 'Tag created successfully',
            'data' => new JournalTagResource($tag),
        ], 201);
    }

    /**
     * Remove a tag.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $tag = JournalTag::findOrFail($id);

        if ($tag->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $tag->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tag deleted successfully',
            'data' => null,
        ]);
    }
}

