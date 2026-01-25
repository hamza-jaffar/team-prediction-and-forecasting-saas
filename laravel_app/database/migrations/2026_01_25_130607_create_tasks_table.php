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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('status', ['todo', 'in_progress', 'blocked', 'done'])->default('todo')->index();
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium')->index();

            $table->timestamp('start_date')->nullable();
            $table->timestamp('due_date')->nullable();

            $table->integer('estimated_minutes')->nullable();
            $table->integer('actual_minutes')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
