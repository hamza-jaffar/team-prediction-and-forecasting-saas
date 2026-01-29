import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, Team } from '@/types';
import { Task } from '@/types/task';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarIcon,
    CheckCircle2Icon,
    ClockIcon,
    EditIcon,
    FlagIcon,
    FolderIcon,
    RotateCcwIcon,
    Trash2Icon,
    UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import DeleteTaskDialog from './delete-task-dialog';

interface TaskShowProps {
    task: Task;
    team?: Team | null;
}

const TaskShow = ({ task, team = null }: TaskShowProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: team ? teamRoutes.dashboard(team.slug).url : dashboard().url,
        },
        {
            title: 'Tasks',
            href: team
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url,
        },
        {
            title: task.title,
            href: team
                ? teamRoutes.task.show({ team: team.slug, slug: task.slug }).url
                : taskRoute.show(task.slug).url,
        },
    ];

    const getStatusConfig = (status: string) => {
        const configs: Record<
            string,
            { variant: any; color: string; label: string }
        > = {
            todo: {
                variant: 'secondary',
                color: 'bg-gray-500',
                label: 'To Do',
            },
            in_progress: {
                variant: 'default',
                color: 'bg-blue-500',
                label: 'In Progress',
            },
            blocked: {
                variant: 'destructive',
                color: 'bg-red-500',
                label: 'Blocked',
            },
            done: {
                variant: 'success',
                color: 'bg-green-500',
                label: 'Done',
            },
        };
        return configs[status] || configs.todo;
    };

    const getPriorityConfig = (priority: string) => {
        const configs: Record<
            string,
            { variant: any; label: string; color: string }
        > = {
            low: { variant: 'secondary', label: 'Low', color: 'text-gray-500' },
            medium: {
                variant: 'default',
                label: 'Medium',
                color: 'text-yellow-500',
            },
            high: {
                variant: 'warning',
                label: 'High',
                color: 'text-orange-500',
            },
            critical: {
                variant: 'destructive',
                label: 'Critical',
                color: 'text-red-500',
            },
        };
        return configs[priority] || configs.medium;
    };

    const statusConfig = getStatusConfig(task.status);
    const priorityConfig = getPriorityConfig(task.priority);

    const handleConfirmDelete = (option: 'soft' | 'permanent') => {
        const url =
            option === 'permanent'
                ? team
                    ? teamRoutes.task.forceDelete({
                          team: team.slug,
                          slug: task.slug,
                      }).url
                    : taskRoute.forceDelete(task.slug).url
                : team
                  ? teamRoutes.task.destroy({
                        team: team.slug,
                        slug: task.slug,
                    }).url
                  : taskRoute.destroy(task.slug).url;

        router.delete(url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
            },
        });
    };

    const handleRestore = () => {
        const url = team
            ? teamRoutes.task.restore({ team: team.slug, slug: task.slug }).url
            : taskRoute.restore(task.slug).url;
        router.post(url, {});
    };

    const isTrashed = !!task.deleted_at;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={task.title} />
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Card */}
                <div className="mb-6 overflow-hidden rounded-xl border bg-linear-to-br from-card to-card/50 shadow-sm">
                    <div className="p-6 sm:p-8">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                                <h1 className="mb-2 text-3xl font-bold tracking-tight">
                                    {task.title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Created on{' '}
                                    {format(
                                        new Date(task.created_at),
                                        'MMMM d, yyyy',
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {isTrashed ? (
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={handleRestore}
                                    >
                                        <RotateCcwIcon className="h-4 w-4" />
                                        Restore
                                    </Button>
                                ) : (
                                    <>
                                        <Link
                                            href={
                                                team
                                                    ? teamRoutes.task.edit({
                                                          team: team.slug,
                                                          slug: task.slug,
                                                      }).url
                                                    : taskRoute.edit(task.slug)
                                                          .url
                                            }
                                        >
                                            <Button
                                                variant="outline"
                                                className="gap-2"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={() =>
                                                setDeleteDialogOpen(true)
                                            }
                                        >
                                            <Trash2Icon className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Status and Priority Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge
                                variant={statusConfig.variant as any}
                                className="gap-2 px-3 py-1.5 text-sm"
                            >
                                <div
                                    className={`h-2 w-2 rounded-full ${statusConfig.color}`}
                                />
                                {statusConfig.label}
                            </Badge>
                            <Badge
                                variant={priorityConfig.variant as any}
                                className="gap-2 px-3 py-1.5 text-sm"
                            >
                                <FlagIcon
                                    className={`h-3.5 w-3.5 ${priorityConfig.color}`}
                                />
                                {priorityConfig.label} Priority
                            </Badge>
                            {isTrashed && (
                                <Badge
                                    variant="destructive"
                                    className="px-3 py-1.5"
                                >
                                    Trashed
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                {task.description && (
                    <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Description
                        </h2>
                        <p className="leading-relaxed whitespace-pre-wrap text-foreground">
                            {task.description}
                        </p>
                    </div>
                )}

                {/* Details Grid */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Project */}
                    {task.project && (
                        <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FolderIcon className="h-4 w-4" />
                                Project
                            </div>
                            <p className="text-lg font-semibold">
                                {task.project.name}
                            </p>
                        </div>
                    )}

                    {/* Creator */}
                    {task.creator && (
                        <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <UserIcon className="h-4 w-4" />
                                Created By
                            </div>
                            <p className="text-lg font-semibold">
                                {task.creator.first_name}{' '}
                                {task.creator.last_name}
                            </p>
                        </div>
                    )}

                    {/* Start Date */}
                    {task.start_date && (
                        <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                Start Date
                            </div>
                            <p className="text-lg font-semibold">
                                {format(
                                    new Date(task.start_date),
                                    'MMM d, yyyy',
                                )}
                            </p>
                        </div>
                    )}

                    {/* Due Date */}
                    {task.due_date && (
                        <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                Due Date
                            </div>
                            <p className="text-lg font-semibold">
                                {format(new Date(task.due_date), 'MMM d, yyyy')}
                            </p>
                        </div>
                    )}

                    {/* Estimated Time */}
                    {task.estimated_minutes && task.estimated_minutes > 0 && (
                        <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <ClockIcon className="h-4 w-4" />
                                Estimated Time
                            </div>
                            <p className="text-lg font-semibold">
                                {Math.floor(task.estimated_minutes / 60)}h{' '}
                                {task.estimated_minutes % 60}m
                            </p>
                        </div>
                    )}

                    {/* Actual Time */}
                    {task.actual_minutes && task.actual_minutes > 0 && (
                        <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <ClockIcon className="h-4 w-4" />
                                Actual Time
                            </div>
                            <p className="text-lg font-semibold">
                                {Math.floor(task.actual_minutes / 60)}h{' '}
                                {task.actual_minutes % 60}m
                            </p>
                        </div>
                    )}

                    {/* Completed At */}
                    {task.completed_at && (
                        <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CheckCircle2Icon className="h-4 w-4" />
                                Completed At
                            </div>
                            <p className="text-lg font-semibold">
                                {format(
                                    new Date(task.completed_at),
                                    'MMM d, yyyy HH:mm',
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {/* Assigned Users */}
                {task.assignedUsers && task.assignedUsers.length > 0 && (
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            <UserIcon className="h-4 w-4" />
                            Assigned To
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {task.assignedUsers.map((user) => (
                                <Badge
                                    key={user.id}
                                    variant="outline"
                                    className="px-3 py-1.5 text-sm"
                                >
                                    {user.first_name} {user.last_name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            <DeleteTaskDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                task={task}
                onConfirm={handleConfirmDelete}
            />
        </AppLayout>
    );
};

export default TaskShow;
