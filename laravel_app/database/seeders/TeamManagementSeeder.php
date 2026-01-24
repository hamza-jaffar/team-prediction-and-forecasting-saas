<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeamManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['slug' => 'team.view', 'name' => 'View Team Settings'],
            ['slug' => 'team.update', 'name' => 'Update Team Settings'],
            ['slug' => 'team.delete', 'name' => 'Delete Team'],
            ['slug' => 'member.view', 'name' => 'View Members'],
            ['slug' => 'member.add', 'name' => 'Add Members'],
            ['slug' => 'member.update', 'name' => 'Update Member Role'],
            ['slug' => 'member.remove', 'name' => 'Remove Members'],
            ['slug' => 'role.manage', 'name' => 'Manage Roles & Permissions'],
        ];

        foreach ($permissions as $permission) {
            \App\Models\TeamPermission::updateOrCreate(['slug' => $permission['slug']], $permission);
        }

        $roles = [
            [
                'slug' => 'owner',
                'name' => 'Owner',
                'description' => 'Full access to all team features',
                'permissions' => ['team.view', 'team.update', 'team.delete', 'member.view', 'member.add', 'member.update', 'member.remove', 'role.manage']
            ],
            [
                'slug' => 'admin',
                'name' => 'Administrator',
                'description' => 'Can manage members and settings but cannot delete the team',
                'permissions' => ['team.view', 'team.update', 'member.view', 'member.add', 'member.update', 'member.remove', 'role.manage']
            ],
            [
                'slug' => 'member',
                'name' => 'Member',
                'description' => 'Standard member with limited access',
                'permissions' => ['team.view', 'member.view']
            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);

            $role = \App\Models\TeamRole::updateOrCreate(
                ['slug' => $roleData['slug'], 'team_id' => null],
                $roleData
            );

            $permissionIds = \App\Models\TeamPermission::whereIn('slug', $permissions)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        // --- Data Repair: Ensure all team owners are in the membership pivot table ---
        $ownerRole = \App\Models\TeamRole::where('slug', 'owner')->first();
        if ($ownerRole) {
            foreach (\App\Models\Team::all() as $team) {
                if (!$team->users()->where('user_id', $team->user_id)->exists()) {
                    $team->users()->attach($team->user_id, ['team_role_id' => $ownerRole->id]);
                } else {
                    // Update existing to ensure role is set
                    $team->users()->updateExistingPivot($team->user_id, ['team_role_id' => $ownerRole->id]);
                }
            }
        }
    }
}
