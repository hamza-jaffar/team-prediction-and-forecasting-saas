import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';
import { format, parseISO } from 'date-fns';
import {
    FilterIcon,
    GanttChartIcon,
    LayoutListIcon,
    Loader2Icon,
    SearchIcon,
    XIcon,
} from 'lucide-react';
import { useCallback } from 'react';

interface TaskFiltersProps {
    search: string;
    status: string;
    priority: string;
    startDateFrom: string;
    startDateTo: string;
    dueDateFrom: string;
    dueDateTo: string;
    projectId?: string;
    onSearchChange: (value: string) => void;
    onFilterChange: (filters: any) => void;
    isLoading?: boolean;
    view: 'table' | 'gantt';
    onViewChange: (view: 'table' | 'gantt') => void;
}

const TaskFilters = ({
    search,
    status,
    priority,
    startDateFrom,
    startDateTo,
    dueDateFrom,
    dueDateTo,
    onSearchChange,
    onFilterChange,
    isLoading = false,
    view,
    onViewChange,
}: TaskFiltersProps) => {
    const handleClearFilters = useCallback(() => {
        onSearchChange('');
        onFilterChange({
            status: 'all',
            priority: 'all',
            start_date_from: '',
            start_date_to: '',
            due_date_from: '',
            due_date_to: '',
            project_id: undefined,
        });
    }, [onSearchChange, onFilterChange]);

    const hasActiveFilters =
        !!search ||
        status !== 'all' ||
        priority !== 'all' ||
        !!startDateFrom ||
        !!startDateTo ||
        !!dueDateFrom ||
        !!dueDateTo;

    return (
        <div className="mb-6 space-y-4">
            {/* Top Row: Search + View Toggle */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <div className="relative w-full md:max-w-md">
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        disabled={isLoading}
                        className="h-11 pr-10 pl-10"
                    />
                    {isLoading && (
                        <Loader2Icon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                </div>

                {/* View Toggle */}
                <ToggleGroup
                    type="single"
                    value={view}
                    onValueChange={(v) =>
                        v && onViewChange(v as 'table' | 'gantt')
                    }
                    className="rounded-xl border bg-background p-1 shadow-sm"
                >
                    <ToggleGroupItem
                        value="table"
                        aria-label="Table View"
                        className="gap-2 px-3"
                    >
                        <LayoutListIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Table</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="gantt"
                        aria-label="Gantt View"
                        className="gap-2 px-3"
                    >
                        <GanttChartIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Gantt</span>
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* Filters */}
            <div className="rounded-xl border bg-background p-3 shadow-sm">
                {/* Header */}
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FilterIcon className="h-4 w-4" />
                    Filters
                </div>

                {/* Filters Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[140px_140px_1fr_auto]">
                    {/* Status */}
                    <Select
                        value={status}
                        onValueChange={(value) =>
                            onFilterChange({ status: value })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {Object.values(TASK_STATUSES).map((config) => (
                                <SelectItem
                                    key={config.value}
                                    value={config.value}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${config.color}`}
                                        />
                                        {config.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Priority */}
                    <Select
                        value={priority}
                        onValueChange={(value) =>
                            onFilterChange({ priority: value })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            {Object.values(TASK_PRIORITIES).map((config) => (
                                <SelectItem
                                    key={config.value}
                                    value={config.value}
                                >
                                    <div className="flex items-center gap-2">
                                        <config.icon
                                            className={`h-3 w-3 ${config.iconColor}`}
                                        />
                                        {config.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Date Filters */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DateRangePicker
                            date={
                                startDateFrom
                                    ? {
                                          from: parseISO(startDateFrom),
                                          to: startDateTo
                                              ? parseISO(startDateTo)
                                              : undefined,
                                      }
                                    : undefined
                            }
                            setDate={(range) =>
                                onFilterChange({
                                    start_date_from: range?.from
                                        ? format(range.from, 'yyyy-MM-dd')
                                        : '',
                                    start_date_to: range?.to
                                        ? format(range.to, 'yyyy-MM-dd')
                                        : '',
                                })
                            }
                            placeholder="Start date"
                            disabled={isLoading}
                            className="h-9 w-full"
                        />

                        <DateRangePicker
                            date={
                                dueDateFrom
                                    ? {
                                          from: parseISO(dueDateFrom),
                                          to: dueDateTo
                                              ? parseISO(dueDateTo)
                                              : undefined,
                                      }
                                    : undefined
                            }
                            setDate={(range) =>
                                onFilterChange({
                                    due_date_from: range?.from
                                        ? format(range.from, 'yyyy-MM-dd')
                                        : '',
                                    due_date_to: range?.to
                                        ? format(range.to, 'yyyy-MM-dd')
                                        : '',
                                })
                            }
                            placeholder="Due date"
                            disabled={isLoading}
                            className="h-9 w-full"
                        />
                    </div>

                    {/* Clear */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            disabled={isLoading}
                            className="h-9 gap-2 justify-self-end text-muted-foreground hover:text-foreground"
                        >
                            <XIcon className="h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskFilters;
