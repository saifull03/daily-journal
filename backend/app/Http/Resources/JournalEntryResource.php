<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JournalEntryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'type' => $this->type ?? 'classic',
            'content' => $this->content,
            'data' => $this->data ?? [],
            'mood' => $this->mood,
            'mood_score' => $this->mood_score,
            'journal_date' => $this->journal_date instanceof \DateTimeInterface
                ? $this->journal_date->format('Y-m-d')
                : $this->journal_date,
            'is_favorite' => (bool) $this->is_favorite,
            'is_draft' => (bool) $this->is_draft,
            'word_count' => $this->word_count,
            'character_count' => $this->character_count,
            'tags' => JournalTagResource::collection($this->whenLoaded('tags')),
            'images' => JournalImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

