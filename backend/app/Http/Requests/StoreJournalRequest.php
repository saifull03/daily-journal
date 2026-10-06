<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJournalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'type' => [
                'required',
                'string',
                'in:classic,reflection,planner,mood,gratitude,free_writing,travel,study,work,dream',
            ],
            'content' => ['nullable', 'string'],
            'data' => ['nullable', 'array'],
            'mood' => ['nullable', 'string', 'max:50'],
            'mood_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'journal_date' => ['required', 'date'],
            'is_favorite' => ['nullable', 'boolean'],
            'is_draft' => ['nullable', 'boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['nullable'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (empty($this->title)) {
            $this->merge([
                'title' => $this->is_draft ? 'Untitled Draft' : 'Untitled Journal',
            ]);
        }
    }
}

