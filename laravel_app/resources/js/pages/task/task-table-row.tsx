import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { TableCell, TableRow } from '@/components/ui/table';
import {
    TASK_PRIORITIES,
    TASK_STATUSES,
    TaskPriority,
    TaskStatus,
} from '@/constants/task';
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { Team } from '@/types';
import { Task } from '@/types/task';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { EditIcon, EyeIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface TaskTableRowProps {
    task: Task;
    onStatusChange: (slug: string, newStatus: string) => void;
    onPriorityChange: (slug: string, newPriority: string) => void;
    onDeleteClick: (task: Task) => void;
    team?: Team | null;
}

const TaskTableRow = ({
    task,
    onStatusChange,
    onPriorityChange,
    onDeleteClick,
    team,
}: TaskTableRowProps) => {
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingPriority, setLoadingPriority] = useState(false);

    const handleStatusChange = (newStatus: string) => {
        setLoadingStatus(true);
        onStatusChange(task.slug, newStatus);
        setTimeout(() => setLoadingStatus(false), 2000); // Simulate/Wait for reload
    };

    const handlePriorityChange = (newPriority: string) => {
        setLoadingPriority(true);
        onPriorityChange(task.slug, newPriority);
        setTimeout(() => setLoadingPriority(false), 2000);
    };

    const status =
        TASK_STATUSES[task.status as TaskStatus] || TASK_STATUSES.todo;
    const priority =
        TASK_PRIORITIES[task.priority as TaskPriority] ||
        TASK_PRIORITIES.medium;
    const PriorityIcon = priority.icon;

    return (
        <TableRow>
            <TableCell className="p-4 font-medium">
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
            <TableCell className="p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Badge
                            variant={status.variant}
                            className="flex w-fit cursor-pointer items-center gap-1.5"
                        >
                            {loadingStatus && <Spinner className="h-3 w-3" />}
                            <div
                                className={`h-2 w-2 rounded-full ${status.color}`}
                            />
                            {status.label}
                        </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {Object.values(TASK_STATUSES).map((config) => (
                            <DropdownMenuItem
                                key={config.value}
                                onClick={() => handleStatusChange(config.value)}
                                disabled={loadingStatus}
                            >
                                <div
                                    className={`mr-2 h-2 w-2 rounded-full ${config.color}`}
                                />
                                {config.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            <TableCell className="p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Badge
                            variant={priority.variant}
                            className="flex w-fit cursor-pointer items-center gap-1.5"
                        >
                            {loadingPriority && <Spinner className="h-3 w-3" />}
                            <span>
                                <PriorityIcon
                                    className={`h-3 w-3 ${priority.iconColor}`}
                                />
                            </span>
                            {priority.label}
                        </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {Object.values(TASK_PRIORITIES).map((config) => (
                            <DropdownMenuItem
                                key={config.value}
                                onClick={() =>
                                    handlePriorityChange(config.value)
                                }
                                disabled={loadingPriority}
                            >
                                <span className="mr-2">
                                    <config.icon
                                        className={`h-3 w-3 ${config.iconColor}`}
                                    />
                                </span>
                                {config.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            <TableCell className="p-4">
                {task.project ? (
                    <span className="text-sm text-muted-foreground">
                        {task.project.name}
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                )}
            </TableCell>
            <TableCell className="p-4">
                {task.due_date ? (
                    <span className="text-sm">
                        {format(new Date(task.due_date), 'MMM d, yyyy')}
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                )}
            </TableCell>
            <TableCell className="p-4 text-right">
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
    );
};

export default TaskTableRow;
