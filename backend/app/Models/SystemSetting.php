<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
    ];

    /**
     * Get a setting value by key with optional fallback.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (! $setting || $setting->value === null) {
            return $default;
        }

        // Try decoding JSON if stored as array/object
        $decoded = json_decode($setting->value, true);
        return (json_last_error() === JSON_ERROR_NONE) ? $decoded : $setting->value;
    }

    /**
     * Set a setting value by key.
     */
    public static function set(string $key, mixed $value, string $group = 'general'): static
    {
        $stringValue = is_array($value) || is_object($value) ? json_encode($value) : (string) $value;

        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $stringValue, 'group' => $group]
        );
    }

    /**
     * Get all public settings formatted for frontend.
     */
    public static function getAllPublic(): array
    {
        $records = static::all()->pluck('value', 'key')->toArray();

        $logoPath = $records['app_logo'] ?? null;
        $logoUrl = null;
        if ($logoPath) {
            $logoUrl = str_starts_with($logoPath, 'http') ? $logoPath : asset('storage/' . $logoPath);
        }

        return [
            'app_name' => $records['app_name'] ?? 'Daily Journal',
            'app_tagline' => $records['app_tagline'] ?? 'Digital Diary & Mindful Sanctuary',
            'app_logo' => $logoUrl,
            'primary_color' => $records['primary_color'] ?? '#1c1917',
            'welcome_message' => $records['welcome_message'] ?? 'Capture your thoughts, reflections, and journeys in a distraction-free sanctuary.',
            'footer_text' => $records['footer_text'] ?? '© Daily Journal — Mindful writing sanctuary',
            'allow_registration' => filter_var($records['allow_registration'] ?? true, FILTER_VALIDATE_BOOLEAN),
        ];
    }
}
