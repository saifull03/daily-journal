<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role ?? ($this->is_admin ? 'admin' : 'user'),
            'is_admin' => (bool) $this->isAdmin(),
            'avatar' => $this->avatar ? (str_starts_with($this->avatar, 'http') ? $this->avatar : asset('storage/' . $this->avatar)) : null,
            'bio' => $this->bio,
            'settings' => $this->settings ?? [
                'theme' => 'light',
                'auto_save' => true,
                'font_family' => 'sans',
            ],
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
