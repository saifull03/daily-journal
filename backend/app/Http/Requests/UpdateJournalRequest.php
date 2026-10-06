<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJournalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'type' => [
                'sometimes',
                'required',
                'string',
                'in:classic,reflection,planner,mood,gratitude,free_writing,travel,study,work,dream',
            ],
            'content' => ['nullable', 'string'],
            'data' => ['nullable', 'array'],
            'mood' => ['nullable', 'string', 'max:50'],
            'mood_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'journal_date' => ['sometimes', 'required', 'date'],
            'is_favorite' => ['nullable', 'boolean'],
            'is_draft' => ['nullable', 'boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['nullable'],
        ];
    }
}

