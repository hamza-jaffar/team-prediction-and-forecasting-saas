<?php

namespace App\Service;

use App\Helpers\SlugHelper;
use App\Models\Task;
use App\Models\TaskAssignee;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaskService
{
    use TrashableService;

    /**
     * Create a new task
     *
     * @param array $data
     * @return Task
     * @throws \Exception
     */
    public static function create(array $data): Task
    {
        try {
            $data['created_by'] = Auth::id();
            $data['slug'] = SlugHelper::create($data['title'], 'tasks');
            
            // Set defaults if not provided
            $data['status'] = $data['status'] ?? 'todo';
            $data['priority'] = $data['priority'] ?? 'medium';

            return Task::create($data);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Get tasks with filters, search, and pagination
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Team|null $team
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     * @throws \Exception
     */
    public static function getTasks($request, ?\App\Models\Team $team = null)
    {
        try {
            $query = Task::with(['project', 'creator', 'team', 'assignedUsers']);

            // Team or personal context
            if ($team && $team->exists) {
                $query->where('team_id', $team->id);
            } else {
                $query->where(function ($q) {
                    $q->where('created_by', Auth::id())
                      ->orWhereHas('assignedUsers', function ($subQ) {
                          $subQ->where('user_id', Auth::id());
                      });
                });
            }

            // Handle Trash
            if ($request->input('trashed') === 'only') {
                $query->onlyTrashed();
            }

            // Status Filter
            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Priority Filter
            if ($request->filled('priority') && $request->priority !== 'all') {
                $query->where('priority', $request->priority);
            }

            // Project Filter
            if ($request->filled('project_id')) {
                $query->where('project_id', $request->project_id);
            }

            // Date Filters
            // Start Date Range
            if ($request->filled('start_date_from')) {
                $query->whereDate('start_date', '>=', $request->start_date_from);
            }
            if ($request->filled('start_date_to')) {
                $query->whereDate('start_date', '<=', $request->start_date_to);
            }

            // Due Date Range
            if ($request->filled('due_date_from')) {
                $query->whereDate('due_date', '>=', $request->due_date_from);
            }
            if ($request->filled('due_date_to')) {
                $query->whereDate('due_date', '<=', $request->due_date_to);
            }

            // Search
            if ($request->filled('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%'.$request->search.'%')
                      ->orWhere('description', 'like', '%'.$request->search.'%');
                });
            }

            // Sorting
            if ($request->filled('sort_field')) {
                $direction = strtolower($request->sort_direction) === 'asc' ? 'asc' : 'desc';
                $query->orderBy($request->sort_field, $direction);
            } else {
                $query->orderBy('created_at', 'desc');
            }

            return $query->paginate($request->per_page ?? 10);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Get a single task by slug with relationships
     *
     * @param string $slug
     * @return Task
     * @throws \Exception
     */
    public static function getTaskBySlug(string $slug): Task
    {
        try {
            return Task::withTrashed()
                ->with([
                    'project',
                    'team',
                    'creator',
                    'assignedUsers',
                    'comments',
                    'activities',
                ])
                ->where('slug', $slug)
                ->firstOrFail();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Get a task by ID
     *
     * @param int $id
     * @return Task
     * @throws \Exception
     */
    public static function getTaskById(int $id): Task
    {
        try {
            return Task::withTrashed()
                ->with(['project', 'creator', 'team'])
                ->where('id', $id)
                ->firstOrFail();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Update a task
     *
     * @param string $slug
     * @param array $data
     * @return Task
     * @throws \Exception
     */
    public static function update(string $slug, array $data): Task
    {
        try {
            $task = self::getTaskBySlug($slug);
            
            // Update slug if title changed
            if (isset($data['title']) && $data['title'] !== $task->title) {
                $data['slug'] = SlugHelper::create($data['title'], 'tasks');
            }

            // Set completed_at when status changes to done
            if (isset($data['status']) && $data['status'] === 'done' && $task->status !== 'done') {
                $data['completed_at'] = now();
            } elseif (isset($data['status']) && $data['status'] !== 'done') {
                $data['completed_at'] = null;
            }

            $task->update($data);

            return $task->fresh();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Soft delete a task
     *
     * @param string $slug
     * @return Task
     * @throws \Exception
     */
    public static function delete(string $slug): Task
    {
        try {
            $task = self::getTaskBySlug($slug);
            $task->delete();

            return $task;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Restore a soft-deleted task
     *
     * @param string $slug
     * @return Task
     * @throws \Exception
     */
    public static function restore(string $slug): Task
    {
        return self::restoreModel(Task::class, $slug);
    }

    /**
     * Permanently delete a task
     *
     * @param string $slug
     * @return bool
     * @throws \Exception
     */
    public static function forceDelete(string $slug): bool
    {
        return self::forceDeleteModel(Task::class, $slug);
    }

    /**
     * Update task status
     *
     * @param string $slug
     * @param string $status
     * @return Task
     * @throws \Exception
     */
    public static function updateStatus(string $slug, string $status): Task
    {
        try {
            $task = self::getTaskBySlug($slug);
            
            $updateData = ['status' => $status];
            
            // Set completed_at when status changes to done
            if ($status === 'done' && $task->status !== 'done') {
                $updateData['completed_at'] = now();
            } elseif ($status !== 'done') {
                $updateData['completed_at'] = null;
            }

            $task->update($updateData);

            return $task;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Assign users to a task
     *
     * @param int $taskId
     * @param array $userIds
     * @return void
     * @throws \Exception
     */
    public static function assignUsers(int $taskId, array $userIds): void
    {
        try {
            DB::beginTransaction();

            foreach ($userIds as $userId) {
                TaskAssignee::firstOrCreate([
                    'task_id' => $taskId,
                    'user_id' => $userId,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Remove a user assignment from a task
     *
     * @param int $taskId
     * @param int $userId
     * @return bool
     * @throws \Exception
     */
    public static function removeAssignee(int $taskId, int $userId): bool
    {
        try {
            return TaskAssignee::where('task_id', $taskId)
                ->where('user_id', $userId)
                ->delete();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Sync task assignees (replace all existing with new list)
     *
     * @param int $taskId
     * @param array $userIds
     * @return void
     * @throws \Exception
     */
    public static function syncAssignees(int $taskId, array $userIds): void
    {
        try {
            $task = self::getTaskById($taskId);
            $task->assignedUsers()->sync($userIds);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Get tasks assigned to a specific user
     *
     * @param int $userId
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     * @throws \Exception
     */
    public static function getTasksAssignedToUser(int $userId, $request)
    {
        try {
            $query = Task::with(['project', 'creator', 'team'])
                ->whereHas('assignedUsers', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                });

            // Apply filters similar to getTasks
            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->filled('priority') && $request->priority !== 'all') {
                $query->where('priority', $request->priority);
            }

            $query->orderBy('created_at', 'desc');

            return $query->paginate($request->per_page ?? 10);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}
