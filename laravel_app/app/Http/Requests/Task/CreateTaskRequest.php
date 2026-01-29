<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class CreateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'status' => 'nullable|in:todo,in_progress,blocked,done',
            'priority' => 'nullable|in:low,medium,high,critical',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'estimated_minutes' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required',
            'title.max' => 'Task title cannot exceed 255 characters',
            'project_id.required' => 'Please select a project for this task',
            'project_id.exists' => 'The selected project does not exist',
            'status.in' => 'Invalid task status. Must be one of: todo, in_progress, blocked, done',
            'priority.in' => 'Invalid priority level. Must be one of: low, medium, high, critical',
            'start_date.date' => 'Start date must be a valid date',
            'due_date.date' => 'Due date must be a valid date',
            'due_date.after_or_equal' => 'Due date must be after or equal to start date',
            'estimated_minutes.integer' => 'Estimated time must be a number',
            'estimated_minutes.min' => 'Estimated time cannot be negative',
        ];
    }
}
