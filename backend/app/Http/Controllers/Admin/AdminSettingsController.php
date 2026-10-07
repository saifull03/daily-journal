<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminSettingsController extends Controller
{
    /**
     * Get all system and brand settings for the admin panel.
     */
    public function index(): JsonResponse
    {
        $settings = SystemSetting::getAllPublic();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Update general brand and system settings.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'app_name' => 'nullable|string|max:100',
            'app_tagline' => 'nullable|string|max:255',
            'app_logo' => 'nullable|string|max:1000',
            'app_logo_bg' => 'nullable|string|max:50',
            'primary_color' => 'nullable|string|max:30',
            'welcome_message' => 'nullable|string|max:500',
            'footer_text' => 'nullable|string|max:255',
            'allow_registration' => 'nullable|boolean',
        ]);

        foreach ($validated as $key => $val) {
            if ($val !== null) {
                SystemSetting::set($key, $val, 'general');
            }
        }

        $allSettings = SystemSetting::getAllPublic();

        return response()->json([
            'success' => true,
            'message' => 'Brand and system settings updated successfully.',
            'data' => $allSettings,
        ]);
    }

    /**
     * Upload a custom brand logo image.
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        if (! $request->hasFile('logo')) {
            return response()->json([
                'success' => false,
                'message' => 'No logo file provided.',
            ], 422);
        }

        $file = $request->file('logo');
        $extension = strtolower($file->getClientOriginalExtension());
        $allowedExtensions = ['jpeg', 'png', 'jpg', 'webp', 'svg', 'gif'];

        if (! in_array($extension, $allowedExtensions, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file format. Allowed formats: PNG, JPG, JPEG, WEBP, SVG, GIF.',
            ], 422);
        }

        // Max size: 4MB
        if ($file->getSize() > 4 * 1024 * 1024) {
            return response()->json([
                'success' => false,
                'message' => 'Logo file size exceeds 4MB limit.',
            ], 422);
        }

        // Delete old logo file if exists
        $oldLogo = SystemSetting::get('app_logo');
        if ($oldLogo && file_exists(storage_path('app/public/' . $oldLogo))) {
            @unlink(storage_path('app/public/' . $oldLogo));
        }

        // Store new logo
        $filename = 'branding/brand_logo_' . time() . '.' . $extension;
        $targetDir = storage_path('app/public/branding');
        if (! is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }
        $targetPath = storage_path('app/public/' . $filename);
        copy($file->getRealPath(), $targetPath);

        SystemSetting::set('app_logo', $filename, 'branding');

        $logoUrl = asset('storage/' . $filename);

        return response()->json([
            'success' => true,
            'message' => 'Brand logo uploaded successfully.',
            'data' => [
                'app_logo' => $logoUrl,
                'path' => $filename,
            ],
        ]);
    }

    /**
     * Reset / remove custom brand logo.
     */
    public function removeLogo(): JsonResponse
    {
        $oldLogo = SystemSetting::get('app_logo');
        if ($oldLogo && file_exists(storage_path('app/public/' . $oldLogo))) {
            @unlink(storage_path('app/public/' . $oldLogo));
        }

        SystemSetting::set('app_logo', null, 'branding');

        return response()->json([
            'success' => true,
            'message' => 'Brand logo removed. Using default brand icon.',
            'data' => [
                'app_logo' => null,
            ],
        ]);
    }
}
