import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { Team } from '@/types';
import { Task } from '@/types/task';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { RefreshCw, RotateCcw, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskTrashModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    team?: Team | null;
}

const TaskTrashModal = ({ open, onOpenChange, team }: TaskTrashModalProps) => {
    const [trashedTasks, setTrashedTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchTrashed = async () => {
        setLoading(true);
        try {
            const url = team
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url;

            const response = await axios.get(url, {
                params: { trashed: 'only' },
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.data.props?.tasks?.data) {
                setTrashedTasks(response.data.props.tasks.data);
            } else if (response.data.data) {
                setTrashedTasks(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch trashed tasks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchTrashed();
        }
    }, [open]);
    const handleRestore = (slug: string) => {
        setProcessing(slug);
        const url = team
            ? teamRoutes.task.restore({ team: team.slug, slug }).url
            : taskRoute.restore(slug).url;

        router.post(
            url,
            {},
            {
                preserveState: true,
                onSuccess: () => {
                    fetchTrashed();
                },
                onFinish: () => setProcessing(null),
            },
        );
    };

    const handleForceDelete = (slug: string) => {
        if (
            !confirm(
                'Are you sure you want to permanently delete this task? This cannot be undone.',
            )
        )
            return;

        setProcessing(slug);
        const url = team
            ? teamRoutes.task.forceDelete({ team: team.slug, slug }).url
            : taskRoute.forceDelete(slug).url;

        router.delete(url, {
            onSuccess: () => {
                fetchTrashed();
            },
            onFinish: () => setProcessing(null),
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; color: string }> = {
            todo: { variant: 'secondary', color: 'bg-gray-500' },
            in_progress: { variant: 'default', color: 'bg-blue-500' },
            blocked: { variant: 'destructive', color: 'bg-red-500' },
            done: { variant: 'success', color: 'bg-green-500' },
        };

        const config = variants[status] || variants.todo;
        const labels: Record<string, string> = {
            todo: 'To Do',
            in_progress: 'In Progress',
            blocked: 'Blocked',
            done: 'Done',
        };

        return (
            <Badge
                variant={config.variant as any}
                className="h-5 gap-1.5 opacity-60"
            >
                <div className={`h-2 w-2 rounded-full ${config.color}`} />
                {labels[status] || status}
            </Badge>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const variants: Record<string, { variant: any; icon: string }> = {
            low: { variant: 'secondary', icon: '🏳️' },
            medium: { variant: 'default', icon: '🚩' },
            high: { variant: 'warning', icon: '🚩' },
            critical: { variant: 'destructive', icon: '🚩' },
        };

        const config = variants[priority] || variants.medium;
        const labels: Record<string, string> = {
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            critical: 'Critical',
        };

        return (
            <Badge
                variant={config.variant as any}
                className="h-5 gap-1.5 opacity-60"
            >
                <span>{config.icon}</span>
                {labels[priority] || priority}
            </Badge>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col overflow-hidden p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Trash2Icon className="h-6 w-6 text-red-500" />
                            Task Trash Bin
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={fetchTrashed}
                            disabled={loading}
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                            />
                        </Button>
                    </div>
                    <DialogDescription>
                        Recently deleted tasks. They will be permanently removed
                        if you delete them here.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {loading ? (
                        <div className="flex h-40 flex-col items-center justify-center gap-3">
                            <Spinner className="h-8 w-8 text-primary" />
                            <p className="animate-pulse text-sm text-muted-foreground">
                                Loading trashed tasks...
                            </p>
                        </div>
                    ) : trashedTasks.length > 0 ? (
                        <div className="space-y-4">
                            {trashedTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex flex-col gap-4 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/5 p-4 transition-all hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-semibold line-through opacity-70">
                                                {task.title}
                                            </h3>
                                            {getStatusBadge(task.status)}
                                            {getPriorityBadge(task.priority)}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-foreground/70">
                                                    Deleted:
                                                </span>
                                                {task.deleted_at
                                                    ? format(
                                                          new Date(
                                                              task.deleted_at,
                                                          ),
                                                          'MMM d, yyyy HH:mm',
                                                      )
                                                    : 'N/A'}
                                            </div>
                                            {task.project && (
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium text-foreground/70">
                                                        Project:
                                                    </span>
                                                    {task.project.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="group h-9 gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
                                            onClick={() =>
                                                handleRestore(task.slug)
                                            }
                                            disabled={processing === task.slug}
                                        >
                                            {processing === task.slug ? (
                                                <Spinner className="h-4 w-4" />
                                            ) : (
                                                <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-45" />
                                            )}
                                            Restore
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                            onClick={() =>
                                                handleForceDelete(task.slug)
                                            }
                                            disabled={processing === task.slug}
                                        >
                                            <Trash2Icon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 text-center">
                            <div className="mb-4 rounded-full bg-muted p-4">
                                <Trash2Icon className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-lg font-medium">
                                Your trash is empty
                            </h3>
                            <p className="mt-1 max-w-[250px] text-sm text-muted-foreground">
                                Tasks you delete will appear here for a while
                                before being permanently removed.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center border-t bg-muted/5 p-6">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="min-w-[120px]"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskTrashModal;
