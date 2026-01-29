import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import {
    FilterIcon,
    FlagIcon,
    Loader2Icon,
    SearchIcon,
    XIcon,
} from 'lucide-react';
import { useCallback } from 'react';

interface TaskFiltersProps {
    search: string;
    status: string;
    priority: string;
    startDate: string;
    dueDate: string;
    projectId?: string;
    onSearchChange: (value: string) => void;
    onFilterChange: (filters: any) => void;
    isLoading?: boolean;
}

const TaskFilters = ({
    search,
    status,
    priority,
    startDate,
    dueDate,
    projectId,
    onSearchChange,
    onFilterChange,
    isLoading = false,
}: TaskFiltersProps) => {
    const handleClearFilters = useCallback(() => {
        onSearchChange('');
        onFilterChange({
            status: 'all',
            priority: 'all',
            start_date: '',
            due_date: '',
            project_id: undefined,
        });
    }, [onSearchChange, onFilterChange]);

    const hasActiveFilters =
        search ||
        status !== 'all' ||
        priority !== 'all' ||
        startDate ||
        dueDate ||
        projectId;

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
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/20 p-3">
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
                            <SelectItem value="todo">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gray-500" />
                                    To Do
                                </div>
                            </SelectItem>
                            <SelectItem value="in_progress">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    In Progress
                                </div>
                            </SelectItem>
                            <SelectItem value="blocked">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    Blocked
                                </div>
                            </SelectItem>
                            <SelectItem value="done">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    Done
                                </div>
                            </SelectItem>
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
                            <SelectItem value="low">
                                <div className="flex items-center gap-2">
                                    <FlagIcon className="h-3 w-3 text-gray-400" />
                                    Low
                                </div>
                            </SelectItem>
                            <SelectItem value="medium">
                                <div className="flex items-center gap-2">
                                    <FlagIcon className="h-3 w-3 text-blue-500" />
                                    Medium
                                </div>
                            </SelectItem>
                            <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                    <FlagIcon className="h-3 w-3 text-orange-500" />
                                    High
                                </div>
                            </SelectItem>
                            <SelectItem value="critical">
                                <div className="flex items-center gap-2">
                                    <FlagIcon className="h-3 w-3 text-red-500" />
                                    Critical
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Start Date Filter */}
                    <div className="flex items-center gap-2">
                        <DatePicker
                            date={startDate ? parseISO(startDate) : undefined}
                            setDate={(d) =>
                                onFilterChange({
                                    start_date: d
                                        ? format(d, 'yyyy-MM-dd')
                                        : '',
                                })
                            }
                            className="h-9 w-[140px]"
                            placeholder="Start date"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Due Date Filter */}
                    <div className="flex items-center gap-2">
                        <DatePicker
                            date={dueDate ? parseISO(dueDate) : undefined}
                            setDate={(d) =>
                                onFilterChange({
                                    due_date: d ? format(d, 'yyyy-MM-dd') : '',
                                })
                            }
                            className="h-9 w-[140px]"
                            placeholder="Due date"
                            disabled={isLoading}
                        />
                    </div>
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
