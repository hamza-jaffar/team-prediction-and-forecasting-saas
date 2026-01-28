<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class AddTeamRequest extends FormRequest
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
            'team_id' => [
                'required',
                'exists:teams,id',
                \Illuminate\Validation\Rule::unique('project_teams', 'team_id')->where(function ($query) {
                    return $query->where('project_id', $this->route('project_id'));
                })->whereNull('deleted_at'),
            ],
            'role' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'team_id.required' => 'The team field is required.',
            'team_id.exists' => 'The selected team does not exist.',
            'team_id.unique' => 'The team has already been added to this project.',
            'role.required' => 'The role field is required.',
        ];
    }
}
