import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { Team } from '@/types';
import { Task } from '@/types/task';
import { Link } from '@inertiajs/react';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    EditIcon,
    EyeIcon,
    Trash2Icon,
} from 'lucide-react';

interface TaskTableProps {
    tasks: Task[];
    sortField: string;
    sortDirection: string;
    onSort: (field: string) => void;
    onDeleteClick: (task: Task) => void;
    isLoading?: boolean;
    team: Team | null;
}

const TaskTable = ({
    tasks,
    sortField,
    sortDirection,
    onSort,
    onDeleteClick,
    isLoading = false,
    team,
}: TaskTableProps) => {
    const SortIcon = ({ field }: { field: string }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? (
            <ArrowUpIcon className="ml-1 h-3 w-3" />
        ) : (
            <ArrowDownIcon className="ml-1 h-3 w-3" />
        );
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
            <Badge variant={config.variant as any} className="gap-1.5">
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
            <Badge variant={config.variant as any} className="gap-1.5">
                <span>{config.icon}</span>
                {labels[priority] || priority}
            </Badge>
        );
    };

    if (tasks.length === 0) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">No tasks found</h3>
                    <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or create a new task
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            className="cursor-pointer select-none"
                            onClick={() => onSort('title')}
                        >
                            <div className="flex items-center">
                                Title
                                <SortIcon field="title" />
                            </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead
                            className="cursor-pointer select-none"
                            onClick={() => onSort('due_date')}
                        >
                            <div className="flex items-center">
                                Due Date
                                <SortIcon field="due_date" />
                            </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow
                            key={task.id}
                            className={isLoading ? 'opacity-50' : ''}
                        >
                            <TableCell className="font-medium">
                                <Link
                                    href={
                                        team
                                            ? teamRoutes.task.show({
                                                  team: team.slug,
                                                  slug: task.slug,
                                              }).url
                                            : taskRoute.show(task.slug).url
                                    }
                                    className="hover:underline"
                                >
                                    {task.title}
                                </Link>
                            </TableCell>
                            <TableCell>{getStatusBadge(task.status)}</TableCell>
                            <TableCell>
                                {getPriorityBadge(task.priority)}
                            </TableCell>
                            <TableCell>
                                {task.project ? (
                                    <span className="text-sm text-muted-foreground">
                                        {task.project.name}
                                    </span>
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        -
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                {task.due_date ? (
                                    <span className="text-sm">
                                        {new Date(
                                            task.due_date,
                                        ).toLocaleDateString()}
                                    </span>
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        -
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={
                                            team
                                                ? teamRoutes.task.show({
                                                      team: team.slug,
                                                      slug: task.slug,
                                                  }).url
                                                : taskRoute.show(task.slug).url
                                        }
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link
                                        href={
                                            team
                                                ? teamRoutes.task.edit({
                                                      team: team.slug,
                                                      slug: task.slug,
                                                  }).url
                                                : taskRoute.edit(task.slug).url
                                        }
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                        >
                                            <EditIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        onClick={() => onDeleteClick(task)}
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TaskTable;
