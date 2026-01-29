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
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { Team } from '@/types';
import { Task, TaskPriorityConfig } from '@/types/task';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { EditIcon, EyeIcon, FlagIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface TaskTableRowProps {
    task: Task;
    onStatusChange: (slug: string, newStatus: string) => void;
    onPriorityChange: (slug: string, newPriority: string) => void;
    onDeleteClick: (task: Task) => void;
    team?: Team | null;
}

const statusConfig = {
    todo: {
        label: 'To Do',
        variant: 'secondary' as const,
        color: 'bg-gray-500',
    },
    in_progress: {
        label: 'In Progress',
        variant: 'default' as const,
        color: 'bg-blue-500',
    },
    blocked: {
        label: 'Blocked',
        variant: 'destructive' as const,
        color: 'bg-red-500',
    },
    done: { label: 'Done', variant: 'outline' as const, color: 'bg-green-500' },
};

const priorityConfig: Record<string, TaskPriorityConfig> = {
    low: {
        label: 'Low',
        variant: 'secondary' as const,
        icon: FlagIcon,
        iconColor: 'text-gray-500',
    },
    medium: {
        label: 'Medium',
        variant: 'default' as const,
        icon: FlagIcon,
        iconColor: 'text-blue-500',
    },
    high: {
        label: 'High',
        variant: 'secondary' as const,
        icon: FlagIcon,
        iconColor: 'text-yellow-500',
    },
    critical: {
        label: 'Critical',
        variant: 'destructive' as const,
        icon: FlagIcon,
        iconColor: 'text-red-500',
    },
};

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
                            variant={
                                statusConfig[
                                    task.status as keyof typeof statusConfig
                                ]?.variant || 'secondary'
                            }
                            className="flex w-fit cursor-pointer items-center gap-1.5"
                        >
                            {loadingStatus && <Spinner className="h-3 w-3" />}
                            <div
                                className={`h-2 w-2 rounded-full ${statusConfig[task.status as keyof typeof statusConfig]?.color}`}
                            />
                            {statusConfig[
                                task.status as keyof typeof statusConfig
                            ]?.label || task.status}
                        </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => handleStatusChange(key)}
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
                            variant={
                                priorityConfig[
                                    task.priority as keyof typeof priorityConfig
                                ]?.variant || 'secondary'
                            }
                            className="flex w-fit cursor-pointer items-center gap-1.5"
                        >
                            {loadingPriority && <Spinner className="h-3 w-3" />}
                            <span>
                                {(() => {
                                    const PriorityIcon =
                                        priorityConfig[
                                            task.priority as keyof typeof priorityConfig
                                        ]?.icon;

                                    return PriorityIcon ? (
                                        <PriorityIcon
                                            className={`h-3 w-3 ${priorityConfig[task.priority as keyof typeof priorityConfig].iconColor}`}
                                        />
                                    ) : null;
                                })()}
                            </span>

                            {priorityConfig[
                                task.priority as keyof typeof priorityConfig
                            ]?.label || task.priority}
                        </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {Object.entries(priorityConfig).map(([key, config]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => handlePriorityChange(key)}
                                disabled={loadingPriority}
                            >
                                <span className="mr-2">
                                    {(() => {
                                        const PriorityIcon =
                                            priorityConfig[
                                                task.priority as keyof typeof priorityConfig
                                            ]?.icon;

                                        return PriorityIcon ? (
                                            <PriorityIcon
                                                className={`h-3 w-3 ${priorityConfig[key].iconColor}`}
                                            />
                                        ) : null;
                                    })()}
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
