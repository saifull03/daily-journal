<?php

namespace App\Policies;

use App\Models\JournalEntry;
use App\Models\User;

class JournalEntryPolicy
{
    /**
     * Determine whether the user can view the journal entry.
     */
    public function view(User $user, JournalEntry $journalEntry): bool
    {
        return $user->id === $journalEntry->user_id;
    }

    /**
     * Determine whether the user can update the journal entry.
     */
    public function update(User $user, JournalEntry $journalEntry): bool
    {
        return $user->id === $journalEntry->user_id;
    }

    /**
     * Determine whether the user can delete the journal entry.
     */
    public function delete(User $user, JournalEntry $journalEntry): bool
    {
        return $user->id === $journalEntry->user_id;
    }
}

