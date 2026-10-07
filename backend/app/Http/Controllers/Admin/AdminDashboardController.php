<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use App\Models\JournalImage;
use App\Models\JournalTag;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminDashboardController extends Controller
{
    /**
     * Get aggregated system statistics and metrics for admin overview.
     */
    public function stats(): JsonResponse
    {
        $totalUsers = User::count();
        $adminCount = User::where('is_admin', true)->orWhere('role', 'admin')->count();
        $regularUsers = $totalUsers - $adminCount;

        $totalJournals = JournalEntry::count();
        $publishedJournals = JournalEntry::where('is_draft', false)->count();
        $draftJournals = JournalEntry::where('is_draft', true)->count();
        $favoriteJournals = JournalEntry::where('is_favorite', true)->count();

        $totalImages = JournalImage::count();
        $totalTags = JournalTag::count();

        // Calculate approximate storage size
        $storageBytes = 0;
        try {
            $files = Storage::disk('public')->allFiles();
            foreach ($files as $file) {
                $storageBytes += Storage::disk('public')->size($file);
            }
        } catch (\Throwable $e) {
            $storageBytes = 0;
        }

        // Journal templates breakdown
        $typesBreakdown = JournalEntry::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->orderByDesc('count')
            ->get()
            ->pluck('count', 'type')
            ->toArray();

        // Mood breakdown
        $moodsBreakdown = JournalEntry::whereNotNull('mood')
            ->select('mood', DB::raw('count(*) as count'))
            ->groupBy('mood')
            ->orderByDesc('count')
            ->get()
            ->pluck('count', 'mood')
            ->toArray();

        // User registration trend over past 6 months
        $userGrowth = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $monthKey = $monthDate->format('M Y');
            $count = User::whereYear('created_at', $monthDate->year)
                ->whereMonth('created_at', $monthDate->month)
                ->count();
            $userGrowth[] = [
                'month' => $monthKey,
                'count' => $count,
            ];
        }

        // Journal creation activity over past 6 months
        $monthlyActivity = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $monthKey = $monthDate->format('M Y');
            $count = JournalEntry::whereYear('journal_date', $monthDate->year)
                ->whereMonth('journal_date', $monthDate->month)
                ->count();
            $monthlyActivity[] = [
                'month' => $monthKey,
                'count' => $count,
            ];
        }

        // Recent user signups
        $recentUsers = User::latest()
            ->take(5)
            ->withCount('journalEntries')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role ?? ($u->is_admin ? 'admin' : 'user'),
                    'is_admin' => (bool) $u->isAdmin(),
                    'avatar' => $u->avatar ? (str_starts_with($u->avatar, 'http') ? $u->avatar : asset('storage/' . $u->avatar)) : null,
                    'journal_count' => $u->journal_entries_count,
                    'created_at' => $u->created_at?->toISOString(),
                ];
            });

        // Recent journal entries across the platform
        $recentEntries = JournalEntry::latest()
            ->with(['user:id,name,email,avatar'])
            ->take(6)
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'title' => $entry->title,
                    'type' => $entry->type,
                    'mood' => $entry->mood,
                    'is_draft' => (bool) $entry->is_draft,
                    'journal_date' => $entry->journal_date?->toDateString(),
                    'created_at' => $entry->created_at?->toISOString(),
                    'user' => [
                        'id' => $entry->user?->id,
                        'name' => $entry->user?->name,
                        'email' => $entry->user?->email,
                    ],
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'counts' => [
                    'total_users' => $totalUsers,
                    'regular_users' => $regularUsers,
                    'admin_count' => $adminCount,
                    'total_journals' => $totalJournals,
                    'published_journals' => $publishedJournals,
                    'draft_journals' => $draftJournals,
                    'favorite_journals' => $favoriteJournals,
                    'total_images' => $totalImages,
                    'total_tags' => $totalTags,
                    'storage_bytes' => $storageBytes,
                    'storage_formatted' => $this->formatBytes($storageBytes),
                ],
                'types_breakdown' => $typesBreakdown,
                'moods_breakdown' => $moodsBreakdown,
                'user_growth' => $userGrowth,
                'monthly_activity' => $monthlyActivity,
                'recent_users' => $recentUsers,
                'recent_entries' => $recentEntries,
            ],
        ]);
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        }
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        }
        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' B';
    }
}
