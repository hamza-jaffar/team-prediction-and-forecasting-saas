import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TASK_PRIORITIES } from '@/constants/task';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { Gantt, Task as GanttTask, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface GanttViewProps {
    tasks: Task[];
    isLoading?: boolean;
}

const GanttView = ({ tasks, isLoading = false }: GanttViewProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);

    const ganttTasks: GanttTask[] = useMemo(() => {
        return tasks
            .filter((t) => t.start_date && t.due_date) // Only tasks with dates
            .map((t) => {
                const priorityConfig =
                    TASK_PRIORITIES[t.priority as keyof typeof TASK_PRIORITIES];
                const color =
                    priorityConfig?.iconColor.replace('text-', 'bg-') ||
                    '#3b82f6';

                // Map text colors to hex for gantt chart if needed
                // Using a simple map for now, can be improved
                let barBackgroundColor = '#3b82f6'; // Blue default
                if (t.priority === 'critical') barBackgroundColor = '#ef4444'; // Red
                if (t.priority === 'high') barBackgroundColor = '#f97316'; // Orange
                if (t.priority === 'medium') barBackgroundColor = '#3b82f6'; // Blue
                if (t.priority === 'low') barBackgroundColor = '#10b981'; // Green

                return {
                    start: new Date(t.start_date!),
                    end: new Date(t.due_date!),
                    name: t.title,
                    id: String(t.id),
                    type: 'task',
                    progress: t.status === 'done' ? 100 : 0, // Simplified progress
                    isDisabled: true, // Read-only for now
                    styles: {
                        progressColor: '#ffffff',
                        progressSelectedColor: '#ffffff',
                        backgroundColor: barBackgroundColor,
                        backgroundSelectedColor: barBackgroundColor,
                    },
                    project: t.project?.name,
                };
            });
    }, [tasks]);

    if (isLoading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (ganttTasks.length === 0) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
                <p>No tasks with start and due dates found.</p>
                <p className="text-sm">
                    Add dates to your tasks to see them in the Gantt chart.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Select
                    value={viewMode}
                    onValueChange={(v) => setViewMode(v as ViewMode)}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="View Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ViewMode.Day}>Day</SelectItem>
                        <SelectItem value={ViewMode.Week}>Week</SelectItem>
                        <SelectItem value={ViewMode.Month}>Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full overflow-hidden rounded-lg border bg-background shadow-sm">
                <Gantt
                    tasks={ganttTasks}
                    viewMode={viewMode}
                    locale="en-US"
                    arrowColor="gray"
                    fontFamily="Inter, sans-serif"
                    fontSize="12px"
                    barCornerRadius={4}
                    rowHeight={40}
                    columnWidth={viewMode === ViewMode.Month ? 150 : 60}
                    listCellWidth="155px"
                    TooltipContent={({ task, fontSize, fontFamily }) => {
                        return (
                            <div
                                style={{
                                    background: 'white',
                                    padding: '10px',
                                    boxShadow:
                                        '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    borderRadius: '8px',
                                    fontFamily,
                                    fontSize,
                                }}
                                className="z-50 border text-sm"
                            >
                                <div className="font-semibold">{task.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {format(task.start, 'MMM d')} -{' '}
                                    {format(task.end, 'MMM d, yyyy')}
                                </div>
                                {task.project && (
                                    <div className="mt-1 text-xs text-blue-600">
                                        {task.project}
                                    </div>
                                )}
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default GanttView;
