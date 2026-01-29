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
import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';
import { format, parseISO } from 'date-fns';
import { FilterIcon, Loader2Icon, SearchIcon, XIcon } from 'lucide-react';
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
        search ||
        status !== 'all' ||
        priority !== 'all' ||
        startDateFrom ||
        startDateTo ||
        dueDateFrom ||
        dueDateTo;

    return (
        <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search tasks by title or description..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pr-10 pl-10"
                    disabled={isLoading}
                />
                {isLoading && (
                    <Loader2Icon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Filter Controls */}
            <div className="flex w-full flex-wrap items-center gap-3 rounded-lg border bg-muted/20 p-3">
                <div className="mr-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FilterIcon className="h-4 w-4" />
                    Filters:
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <Select
                        value={status}
                        onValueChange={(value) =>
                            onFilterChange({ status: value })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-[140px]">
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
                                        <div
                                            className={`h-2 w-2 rounded-full ${config.color}`}
                                        />
                                        {config.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Priority Filter */}
                    <Select
                        value={priority}
                        onValueChange={(value) =>
                            onFilterChange({ priority: value })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-[140px]">
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

                    <DateRangePicker
                        date={
                            startDateFrom
                                ? {
                                      from: startDateFrom
                                          ? parseISO(startDateFrom)
                                          : undefined,
                                      to: startDateTo
                                          ? parseISO(startDateTo)
                                          : undefined,
                                  }
                                : undefined
                        }
                        setDate={(range) => {
                            onFilterChange({
                                start_date_from: range?.from
                                    ? format(range.from, 'yyyy-MM-dd')
                                    : '',
                                start_date_to: range?.to
                                    ? format(range.to, 'yyyy-MM-dd')
                                    : '',
                            });
                        }}
                        placeholder="Start Date"
                        disabled={isLoading}
                        className="w-[200px]"
                    />
                    <DateRangePicker
                        date={
                            dueDateFrom
                                ? {
                                      from: dueDateFrom
                                          ? parseISO(dueDateFrom)
                                          : undefined,
                                      to: dueDateTo
                                          ? parseISO(dueDateTo)
                                          : undefined,
                                  }
                                : undefined
                        }
                        setDate={(range) => {
                            onFilterChange({
                                due_date_from: range?.from
                                    ? format(range.from, 'yyyy-MM-dd')
                                    : '',
                                due_date_to: range?.to
                                    ? format(range.to, 'yyyy-MM-dd')
                                    : '',
                            });
                        }}
                        placeholder="Due Date"
                        disabled={isLoading}
                        className="w-[200px]"
                    />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="ml-auto h-9 gap-2 px-2 text-muted-foreground hover:text-foreground md:ml-0"
                        disabled={isLoading}
                    >
                        <XIcon className="h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TaskFilters;
