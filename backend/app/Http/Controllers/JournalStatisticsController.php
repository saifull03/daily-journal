<?php

namespace App\Http\Controllers;

use App\Http\Resources\JournalEntryResource;
use App\Models\JournalEntry;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JournalStatisticsController extends Controller
{
    /**
     * Get statistics and streaks for the user.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Base query for published (non-draft) journals
        $publishedQuery = JournalEntry::where('user_id', $userId)
            ->where('is_draft', false);

        $totalJournals = (clone $publishedQuery)->count();
        $totalDrafts = JournalEntry::where('user_id', $userId)->where('is_draft', true)->count();
        $totalFavorites = (clone $publishedQuery)->where('is_favorite', true)->count();

        // Journals this month
        $startOfMonth = now()->startOfMonth()->toDateString();
        $endOfMonth = now()->endOfMonth()->toDateString();
        $journalsThisMonth = (clone $publishedQuery)
            ->whereBetween('journal_date', [$startOfMonth, $endOfMonth])
            ->count();

        // Calculate streaks based on unique journal_dates
        $uniqueDates = (clone $publishedQuery)
            ->select(DB::raw('DATE(journal_date) as entry_date'))
            ->groupBy(DB::raw('DATE(journal_date)'))
            ->orderBy(DB::raw('DATE(journal_date)'), 'desc')
            ->pluck('entry_date')
            ->map(fn ($d) => Carbon::parse($d)->format('Y-m-d'))
            ->toArray();

        $streaks = $this->calculateStreaks($uniqueDates);
        $currentStreak = $streaks['current_streak'];
        $longestStreak = $streaks['longest_streak'];

        // Calculate total words
        $allEntries = (clone $publishedQuery)->get();
        $totalWords = $allEntries->sum('word_count');

        // Most used template
        $templateCounts = (clone $publishedQuery)
            ->select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->orderByDesc('count')
            ->get();

        $mostUsedTemplate = $templateCounts->first()?->type ?? 'classic';

        $typeDistribution = $templateCounts->map(function ($item) use ($totalJournals) {
            return [
                'type' => $item->type,
                'count' => (int) $item->count,
                'percentage' => $totalJournals > 0 ? round(($item->count / $totalJournals) * 100, 1) : 0,
            ];
        });

        // Most common mood and distribution
        $moodCounts = (clone $publishedQuery)
            ->whereNotNull('mood')
            ->where('mood', '!=', '')
            ->select('mood', DB::raw('count(*) as count'))
            ->groupBy('mood')
            ->orderByDesc('count')
            ->get();

        $mostCommonMood = $moodCounts->first()?->mood ?? null;
        $totalWithMood = $moodCounts->sum('count');

        $moodDistribution = $moodCounts->map(function ($item) use ($totalWithMood) {
            return [
                'mood' => $item->mood,
                'count' => (int) $item->count,
                'percentage' => $totalWithMood > 0 ? round(($item->count / $totalWithMood) * 100, 1) : 0,
            ];
        });

        // Monthly activity (last 6 months)
        $monthlyActivity = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = now()->subMonths($i);
            $mStart = $monthDate->copy()->startOfMonth()->toDateString();
            $mEnd = $monthDate->copy()->endOfMonth()->toDateString();

            $monthEntries = (clone $publishedQuery)
                ->whereBetween('journal_date', [$mStart, $mEnd])
                ->get();

            $monthlyActivity[] = [
                'month' => $monthDate->format('Y-m'),
                'label' => $monthDate->format('M Y'),
                'short_label' => $monthDate->format('M'),
                'count' => $monthEntries->count(),
                'words' => $monthEntries->sum('word_count'),
            ];
        }

        // Recent 5 entries
        $recentEntries = (clone $publishedQuery)
            ->with(['tags', 'images'])
            ->orderBy('journal_date', 'desc')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Statistics retrieved successfully',
            'data' => [
                'current_streak' => $currentStreak,
                'longest_streak' => $longestStreak,
                'total_journals' => $totalJournals,
                'journals_this_month' => $journalsThisMonth,
                'total_words' => $totalWords,
                'favorite_count' => $totalFavorites,
                'draft_count' => $totalDrafts,
                'most_used_template' => $mostUsedTemplate,
                'most_common_mood' => $mostCommonMood,
                'type_distribution' => $typeDistribution,
                'mood_distribution' => $moodDistribution,
                'monthly_activity' => $monthlyActivity,
                'recent_entries' => JournalEntryResource::collection($recentEntries),
            ],
        ]);
    }

    /**
     * Streak calculation helper.
     * $dates is sorted descending list of Y-m-d strings.
     */
    private function calculateStreaks(array $dates): array
    {
        if (empty($dates)) {
            return ['current_streak' => 0, 'longest_streak' => 0];
        }

        $dateObjects = array_values(array_unique($dates));
        // Sort ascending for longest streak calculation
        usort($dateObjects, fn ($a, $b) => strcmp($a, $b));

        // 1. Longest Streak
        $longest = 0;
        $tempStreak = 0;
        $prevDate = null;

        foreach ($dateObjects as $dStr) {
            $curr = Carbon::parse($dStr)->startOfDay();

            if ($prevDate === null) {
                $tempStreak = 1;
            } else {
                $diff = $prevDate->diffInDays($curr);
                if ($diff === 1) {
                    $tempStreak++;
                } else {
                    $tempStreak = 1;
                }
            }

            if ($tempStreak > $longest) {
                $longest = $tempStreak;
            }

            $prevDate = $curr;
        }

        // 2. Current Streak
        // Check if user wrote today or yesterday
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        $todayStr = $today->format('Y-m-d');
        $yesterdayStr = $yesterday->format('Y-m-d');

        $dateSet = array_flip($dateObjects);

        $currentStreak = 0;
        $checkDate = null;

        if (isset($dateSet[$todayStr])) {
            $checkDate = $today->copy();
        } elseif (isset($dateSet[$yesterdayStr])) {
            $checkDate = $yesterday->copy();
        }

        if ($checkDate !== null) {
            while (isset($dateSet[$checkDate->format('Y-m-d')])) {
                $currentStreak++;
                $checkDate->subDay();
            }
        }

        return [
            'current_streak' => $currentStreak,
            'longest_streak' => max($longest, $currentStreak),
        ];
    }
}

