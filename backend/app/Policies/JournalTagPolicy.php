<?php

namespace App\Policies;

use App\Models\JournalTag;
use App\Models\User;

class JournalTagPolicy
{
    /**
     * Determine whether the user can view the tag.
     */
    public function view(User $user, JournalTag $journalTag): bool
    {
        return $user->id === $journalTag->user_id;
    }

    /**
     * Determine whether the user can delete the tag.
     */
    public function delete(User $user, JournalTag $journalTag): bool
    {
        return $user->id === $journalTag->user_id;
    }
}

