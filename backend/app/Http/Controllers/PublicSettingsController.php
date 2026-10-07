<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;

class PublicSettingsController extends Controller
{
    /**
     * Return public system and branding settings.
     */
    public function index(): JsonResponse
    {
        $settings = SystemSetting::getAllPublic();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }
}
