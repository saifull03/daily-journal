<?php

namespace App\Http\Controllers;

use App\Http\Resources\JournalEntryResource;
use App\Models\JournalEntry;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JournalCalendarController extends Controller
{
    /**
     * Get calendar data for a specified month or date.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Default to current month if not passed
        $monthParam = $request->input('month', now()->format('Y-m'));

        try {
            $carbonMonth = Carbon::createFromFormat('Y-m', $monthParam)->startOfMonth();
        } catch (\Exception $e) {
            $carbonMonth = now()->startOfMonth();
            $monthParam = $carbonMonth->format('Y-m');
        }

        $startDate = $carbonMonth->copy()->startOfMonth()->toDateString();
        $endDate = $carbonMonth->copy()->endOfMonth()->toDateString();

        $entries = JournalEntry::where('user_id', $userId)
            ->whereBetween('journal_date', [$startDate, $endDate])
            ->with(['tags', 'images'])
            ->orderBy('journal_date', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        // Group entries by date
        $grouped = [];
        foreach ($entries as $entry) {
            $dateStr = $entry->journal_date instanceof \DateTimeInterface
                ? $entry->journal_date->format('Y-m-d')
                : substr($entry->journal_date, 0, 10);

            if (! isset($grouped[$dateStr])) {
                $grouped[$dateStr] = [];
            }
            $grouped[$dateStr][] = new JournalEntryResource($entry);
        }

        // Selected date entries if requested
        $selectedDate = $request->input('date');
        $selectedEntries = [];
        if ($selectedDate) {
            $selectedEntries = JournalEntry::where('user_id', $userId)
                ->whereDate('journal_date', $selectedDate)
                ->with(['tags', 'images'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json([
            'success' => true,
            'message' => 'Calendar entries retrieved successfully',
            'data' => [
                'month' => $monthParam,
                'days' => $grouped,
                'selected_date' => $selectedDate,
                'selected_entries' => JournalEntryResource::collection($selectedEntries),
            ],
        ]);
    }
}

