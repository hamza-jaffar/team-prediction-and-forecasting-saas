import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Team } from '@/types';
import { Task } from '@/types/task';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import TaskTableRow from './task-table-row';

interface TaskTableProps {
    tasks: Task[];
    sortField: string;
    sortDirection: string;
    onSort: (field: string) => void;
    onStatusChange: (slug: string, newStatus: string) => void;
    onPriorityChange: (slug: string, newPriority: string) => void;
    onDeleteClick: (task: Task) => void;
    isLoading?: boolean;
    team: Team | null;
}

const TaskTable = ({
    tasks,
    sortField,
    sortDirection,
    onSort,
    onStatusChange,
    onPriorityChange,
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
        <div className="relative overflow-hidden rounded-lg border">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <span className="text-xs font-medium text-primary">
                            Loading...
                        </span>
                    </div>
                </div>
            )}
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
                        <TaskTableRow
                            key={task.id}
                            task={task}
                            onStatusChange={onStatusChange}
                            onPriorityChange={onPriorityChange}
                            onDeleteClick={onDeleteClick}
                            team={team}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TaskTable;
