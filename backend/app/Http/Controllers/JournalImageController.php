<?php

namespace App\Http\Controllers;

use App\Http\Resources\JournalImageResource;
use App\Models\JournalEntry;
use App\Models\JournalImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JournalImageController extends Controller
{
    /**
     * Upload one or multiple images for a journal entry.
     */
    public function upload(Request $request, int $journalId): JsonResponse
    {
        $entry = JournalEntry::findOrFail($journalId);

        if ($entry->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $request->validate([
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:5120'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp,gif', 'max:5120'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $uploadedImages = [];
        $files = [];

        if ($request->hasFile('image')) {
            $files[] = $request->file('image');
        }

        if ($request->hasFile('images')) {
            $files = array_merge($files, $request->file('images'));
        }

        if (empty($files)) {
            return response()->json([
                'success' => false,
                'message' => 'No image file uploaded.',
            ], 422);
        }

        foreach ($files as $file) {
            $path = $file->store('journal_images', 'public');

            $imageRecord = JournalImage::create([
                'journal_entry_id' => $entry->id,
                'image_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
                'caption' => $request->input('caption'),
            ]);

            $uploadedImages[] = new JournalImageResource($imageRecord);
        }

        return response()->json([
            'success' => true,
            'message' => 'Image(s) uploaded successfully',
            'data' => count($uploadedImages) === 1 ? $uploadedImages[0] : $uploadedImages,
        ], 201);
    }

    /**
     * Delete an uploaded image.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $image = JournalImage::with('journalEntry')->findOrFail($id);

        if ($image->journalEntry->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        // Delete from disk if exists
        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully',
            'data' => null,
        ]);
    }
}

