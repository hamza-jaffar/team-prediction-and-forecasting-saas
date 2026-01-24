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
        Schema::dropIfExists('team_permission_role');
        Schema::dropIfExists('team_permissions');
        Schema::dropIfExists('team_roles');

        Schema::create('team_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('description')->nullable();
            $table->timestamps();

            $table->unique(['team_id', 'slug']);
        });

        Schema::create('team_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('team_permission_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_permission_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['team_role_id', 'team_permission_id']);
        });

        Schema::table('team_user', function (Blueprint $table) {
            $table->foreignId('team_role_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->dropColumn('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_user', function (Blueprint $table) {
            $table->string('role')->default('member')->after('user_id');
            $table->dropConstrainedForeignId('team_role_id');
        });

        Schema::dropIfExists('team_permission_role');
        Schema::dropIfExists('team_permissions');
        Schema::dropIfExists('team_roles');
    }
};
