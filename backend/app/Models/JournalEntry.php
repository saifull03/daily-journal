<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'type',
        'content',
        'data',
        'mood',
        'mood_score',
        'journal_date',
        'is_favorite',
        'is_draft',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'mood_score' => 'integer',
            'journal_date' => 'date:Y-m-d',
            'is_favorite' => 'boolean',
            'is_draft' => 'boolean',
        ];
    }

    protected $appends = ['word_count', 'character_count'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(JournalTag::class, 'journal_entry_tag', 'journal_entry_id', 'tag_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(JournalImage::class);
    }

    /**
     * Scope query to a specific user.
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Calculate word count from content and structured fields.
     */
    public function getWordCountAttribute(): int
    {
        $text = strip_tags((string) $this->content);

        // Also count words in structured text data if available
        $data = $this->data;
        if (is_array($data)) {
            $extraTexts = [];
            array_walk_recursive($data, function ($item) use (&$extraTexts) {
                if (is_string($item)) {
                    $extraTexts[] = strip_tags($item);
                }
            });
            $text .= ' ' . implode(' ', $extraTexts);
        }

        $trimmed = trim(preg_replace('/\s+/', ' ', $text));
        if (empty($trimmed)) {
            return 0;
        }

        return count(explode(' ', $trimmed));
    }

    /**
     * Calculate character count.
     */
    public function getCharacterCountAttribute(): int
    {
        $text = strip_tags((string) $this->content);
        return mb_strlen($text);
    }
}
