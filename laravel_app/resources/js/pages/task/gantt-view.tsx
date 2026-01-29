import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { Gantt, Task as GanttTask, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Loader2, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface GanttViewProps {
    tasks: Task[];
    isLoading?: boolean;
}

const GanttView = ({ tasks, isLoading = false }: GanttViewProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
    const [isMobile, setIsMobile] = useState(false);
    const [showList, setShowList] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkMobile = () => {
                const mobile = window.innerWidth < 1024;
                setIsMobile(mobile);
                // Set initial list visibility: hidden on mobile, shown on desktop
                setShowList(!mobile);
            };
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    const ganttTasks: GanttTask[] = useMemo(() => {
        return tasks
            .filter((t) => t.start_date && t.due_date)
            .map((t) => {
                let barBackgroundColor = '#3b82f6';
                if (t.priority === 'critical') barBackgroundColor = '#ef4444';
                if (t.priority === 'high') barBackgroundColor = '#f97316';
                if (t.priority === 'medium') barBackgroundColor = '#3b82f6';
                if (t.priority === 'low') barBackgroundColor = '#10b981';

                return {
                    start: new Date(t.start_date!),
                    end: new Date(t.due_date!),
                    name: t.title,
                    id: String(t.id),
                    type: 'task',
                    progress: t.status === 'done' ? 100 : 0,
                    isDisabled: true,
                    styles: {
                        progressColor: 'rgba(255,255,255,0.4)',
                        progressSelectedColor: 'rgba(255,255,255,0.5)',
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
            <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/5 text-muted-foreground transition-all hover:bg-muted/10">
                <p className="font-medium">No tasks found.</p>
                <p className="text-sm">
                    Try adjusting your filters or create a new task.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shadow-sm"
                        onClick={() => setShowList(!showList)}
                        title={showList ? 'Hide List' : 'Show List'}
                    >
                        {showList ? (
                            <PanelLeftClose className="h-4 w-4" />
                        ) : (
                            <PanelLeft className="h-4 w-4" />
                        )}
                    </Button>
                    <div className="hidden text-sm font-medium text-muted-foreground sm:block">
                        Timeline Overview
                    </div>
                </div>
                <Select
                    value={viewMode}
                    onValueChange={(v) => setViewMode(v as ViewMode)}
                >
                    <SelectTrigger className="w-[130px] shadow-sm">
                        <SelectValue placeholder="View Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ViewMode.Day}>Daily</SelectItem>
                        <SelectItem value={ViewMode.Week}>Weekly</SelectItem>
                        <SelectItem value={ViewMode.Month}>Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full overflow-hidden rounded-xl border bg-background shadow-md">
                <div className="overflow-x-auto">
                    <Gantt
                        tasks={ganttTasks}
                        viewMode={viewMode}
                        locale="en-US"
                        arrowColor="var(--border)"
                        fontFamily="inherit"
                        fontSize="13px"
                        barCornerRadius={8}
                        rowHeight={56}
                        columnWidth={
                            viewMode === ViewMode.Month
                                ? 200
                                : viewMode === ViewMode.Week
                                  ? 100
                                  : 70
                        }
                        listCellWidth={
                            !showList ? '0px' : isMobile ? '120px' : '280px'
                        }
                        headerHeight={60}
                        TaskListHeader={({ headerHeight }) => (
                            <div
                                style={{
                                    height: headerHeight,
                                    display: showList ? 'flex' : 'none',
                                }}
                                className="flex items-center border-r border-b bg-muted/40 px-4 text-[11px] font-bold tracking-wider text-muted-foreground/80 uppercase"
                            >
                                <div className="flex-1">Task</div>
                                {!isMobile && showList && (
                                    <div className="w-20 text-right">
                                        Start-End
                                    </div>
                                )}
                            </div>
                        )}
                        TaskListTable={({ tasks, rowHeight }) => (
                            <div
                                className="border-r bg-background"
                                style={{ display: showList ? 'block' : 'none' }}
                            >
                                {tasks.map((t) => (
                                    <div
                                        key={t.id}
                                        style={{ height: rowHeight }}
                                        className="flex items-center border-b px-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-full shadow-sm"
                                                style={{
                                                    backgroundColor:
                                                        t.styles
                                                            ?.backgroundColor ||
                                                        '#e2e8f0',
                                                }}
                                            />
                                            <span className="truncate font-medium text-foreground">
                                                {t.name}
                                            </span>
                                        </div>
                                        {!isMobile && showList && (
                                            <div className="ml-4 shrink-0 text-[10px] font-medium text-muted-foreground/60">
                                                {format(t.start, 'MMM d')} -{' '}
                                                {format(t.end, 'MMM d')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        TooltipContent={({
                            task,
                            fontSize,
                            fontFamily,
                        }: {
                            task: GanttTask;
                            fontSize: string;
                            fontFamily: string;
                        }) => (
                            <div
                                style={{
                                    fontFamily,
                                    fontSize,
                                }}
                                className="z-50 min-w-[220px] animate-in rounded-lg border bg-popover p-3 text-popover-foreground shadow-xl ring-1 ring-black/5 zoom-in-95 fade-in"
                            >
                                <div className="mb-2 flex items-center gap-2 border-b pb-2">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                task.styles?.backgroundColor,
                                        }}
                                    />
                                    <div className="leading-none font-semibold tracking-tight">
                                        {task.name}
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Start:</span>
                                        <span className="font-medium text-foreground">
                                            {format(task.start, 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Due:</span>
                                        <span className="font-medium text-foreground">
                                            {format(task.end, 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    {task.project && (
                                        <div className="mt-2 rounded bg-primary/5 px-2 py-1 text-[10px] font-bold tracking-tighter text-primary uppercase">
                                            Project: {task.project}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default GanttView;
