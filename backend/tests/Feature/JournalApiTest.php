<?php

namespace Tests\Feature;

use App\Models\JournalEntry;
use App\Models\JournalTag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JournalApiTest extends TestCase
{
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane' . uniqid() . '@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'demo@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_unauthenticated_user_cannot_access_journals(): void
    {
        $response = $this->getJson('/api/journals');
        $response->assertStatus(401);
    }

    public function test_user_cannot_access_another_users_journal(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $entryUser2 = JournalEntry::create([
            'user_id' => $user2->id,
            'title' => 'Secret Diary of User 2',
            'type' => 'classic',
            'content' => 'Top secret content',
            'journal_date' => now()->toDateString(),
            'is_draft' => false,
        ]);

        // Attempt accessing user2's entry as user1
        $response = $this->actingAs($user1)->getJson("/api/journals/{$entryUser2->id}");
        $response->assertStatus(403);
    }

    public function test_user_can_create_and_fetch_journal(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/journals', [
            'title' => 'My First Test Journal',
            'type' => 'classic',
            'content' => '<p>Writing about today...</p>',
            'mood' => 'calm',
            'mood_score' => 8,
            'journal_date' => now()->toDateString(),
            'tags' => ['Testing', 'Daily'],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'My First Test Journal');

        $entryId = $response->json('data.id');

        $fetchResponse = $this->actingAs($user)->getJson("/api/journals/{$entryId}");
        $fetchResponse->assertStatus(200)
            ->assertJsonPath('data.title', 'My First Test Journal')
            ->assertJsonCount(2, 'data.tags');
    }

    public function test_user_can_toggle_favorite(): void
    {
        $user = User::factory()->create();
        $entry = JournalEntry::create([
            'user_id' => $user->id,
            'title' => 'Toggle Favorite Test',
            'type' => 'classic',
            'journal_date' => now()->toDateString(),
            'is_favorite' => false,
            'is_draft' => false,
        ]);

        $response = $this->actingAs($user)->postJson("/api/journals/{$entry->id}/favorite");
        $response->assertStatus(200)
            ->assertJsonPath('data.is_favorite', true);

        $response2 = $this->actingAs($user)->postJson("/api/journals/{$entry->id}/favorite");
        $response2->assertStatus(200)
            ->assertJsonPath('data.is_favorite', false);
    }

    public function test_user_can_autosave_draft(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/journals/autosave', [
            'title' => 'Autosaved Draft',
            'type' => 'free_writing',
            'content' => 'In-progress draft thoughts...',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_draft', true);
    }

    public function test_statistics_and_streak_endpoint(): void
    {
        $user = User::where('email', 'demo@example.com')->first();
        if (! $user) {
            $user = User::factory()->create();
        }

        $response = $this->actingAs($user)->getJson('/api/statistics');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'current_streak',
                    'longest_streak',
                    'total_journals',
                    'journals_this_month',
                    'total_words',
                    'favorite_count',
                    'draft_count',
                    'most_used_template',
                    'type_distribution',
                    'mood_distribution',
                    'monthly_activity',
                    'recent_entries',
                ],
            ]);
    }
}

