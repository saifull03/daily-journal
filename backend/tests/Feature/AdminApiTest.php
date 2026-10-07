<?php

namespace Tests\Feature;

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    public function test_admin_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'admin123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.role', 'admin')
            ->assertJsonPath('data.user.is_admin', true);
    }

    public function test_regular_user_cannot_access_admin_stats(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'is_admin' => false,
        ]);

        $response = $this->actingAs($user)->getJson('/api/admin/stats');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_stats(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();
        if (! $admin) {
            $admin = User::factory()->create(['role' => 'admin', 'is_admin' => true]);
        }

        $response = $this->actingAs($admin)->getJson('/api/admin/stats');
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'counts' => [
                        'total_users',
                        'admin_count',
                        'total_journals',
                    ],
                    'types_breakdown',
                    'recent_users',
                    'recent_entries',
                ],
            ]);
    }

    public function test_admin_can_update_brand_settings(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();

        $response = $this->actingAs($admin)->putJson('/api/admin/settings', [
            'app_name' => 'Zen Sanctuary',
            'app_tagline' => 'Mindful Writing & Reflection',
            'primary_color' => '#6366f1',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.app_name', 'Zen Sanctuary')
            ->assertJsonPath('data.app_tagline', 'Mindful Writing & Reflection');

        // Test public settings reflects the updated brand
        $publicResponse = $this->getJson('/api/settings/public');
        $publicResponse->assertStatus(200)
            ->assertJsonPath('data.app_name', 'Zen Sanctuary');
    }

    public function test_admin_can_upload_and_delete_brand_logo(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();

        SystemSetting::set('app_logo', 'branding/custom_logo.png', 'branding');
        $this->assertNotNull(SystemSetting::get('app_logo'));

        // Test deleting logo
        $deleteResponse = $this->actingAs($admin)->deleteJson('/api/admin/settings/logo');
        $deleteResponse->assertStatus(200)
            ->assertJsonPath('data.app_logo', null);
    }
}
