import { LucideIcon } from 'lucide-react';
import { Team, User } from './auth';
import { Project } from './project';

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
    id: number;
    project_id: number;
    team_id: number;
    created_by: number;
    title: string;
    description: string | null;
    slug: string;
    status: TaskStatus;
    priority: TaskPriority;
    start_date: string | null;
    due_date: string | null;
    estimated_minutes: number | null;
    actual_minutes: number | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    // Relationships
    project?: Project;
    team?: Team;
    creator?: User;
    assignedUsers?: User[];
}

export interface TaskPriorityConfig {
    label: string;
    variant: 'secondary' | 'default' | 'destructive' | 'outline';
    icon: LucideIcon;
    iconColor: string;
}
