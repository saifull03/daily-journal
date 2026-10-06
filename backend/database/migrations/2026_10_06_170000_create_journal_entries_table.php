<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('type', 50)->default('classic');
            $table->longText('content')->nullable();
            $table->json('data')->nullable();
            $table->string('mood', 50)->nullable();
            $table->unsignedTinyInteger('mood_score')->nullable();
            $table->date('journal_date');
            $table->boolean('is_favorite')->default(false);
            $table->boolean('is_draft')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'journal_date']);
            $table->index(['user_id', 'is_draft']);
            $table->index(['user_id', 'is_favorite']);
            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
    }
};
