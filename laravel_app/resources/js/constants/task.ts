import { FlagIcon, LucideIcon } from 'lucide-react';

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TaskStatusConfig {
    label: string;
    value: TaskStatus;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color: string;
}

export interface TaskPriorityConfig {
    label: string;
    value: TaskPriority;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: LucideIcon;
    iconColor: string;
}

export const TASK_STATUSES: Record<TaskStatus, TaskStatusConfig> = {
    todo: {
        label: 'To Do',
        value: 'todo',
        variant: 'secondary',
        color: 'bg-gray-500',
    },
    in_progress: {
        label: 'In Progress',
        value: 'in_progress',
        variant: 'default',
        color: 'bg-blue-500',
    },
    blocked: {
        label: 'Blocked',
        value: 'blocked',
        variant: 'destructive',
        color: 'bg-red-500',
    },
    done: {
        label: 'Done',
        value: 'done',
        variant: 'outline',
        color: 'bg-green-500',
    },
};

export const TASK_PRIORITIES: Record<TaskPriority, TaskPriorityConfig> = {
    low: {
        label: 'Low',
        value: 'low',
        variant: 'secondary',
        icon: FlagIcon,
        iconColor: 'text-gray-500',
    },
    medium: {
        label: 'Medium',
        value: 'medium',
        variant: 'default',
        icon: FlagIcon,
        iconColor: 'text-blue-500',
    },
    high: {
        label: 'High',
        value: 'high',
        variant: 'secondary',
        icon: FlagIcon,
        iconColor: 'text-orange-500', // Changed from yellow to orange for better visibility
    },
    critical: {
        label: 'Critical',
        value: 'critical',
        variant: 'destructive',
        icon: FlagIcon,
        iconColor: 'text-red-500',
    },
};
