import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2Icon, SearchIcon, XIcon } from 'lucide-react';
import { useCallback } from 'react';

interface TaskFiltersProps {
    search: string;
    status: string;
    priority: string;
    projectId?: string;
    onSearchChange: (value: string) => void;
    onFilterChange: (filters: any) => void;
    isLoading?: boolean;
}

const TaskFilters = ({
    search,
    status,
    priority,
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
            project_id: undefined,
        });
    }, [onSearchChange, onFilterChange]);

    const hasActiveFilters =
        search || status !== 'all' || priority !== 'all' || projectId;

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
                />
                {isLoading && (
                    <Loader2Icon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Status Filter */}
                    <Select
                        value={status}
                        onValueChange={(value) =>
                            onFilterChange({ status: value })
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
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
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="low">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">🏳️</span>
                                    Low
                                </div>
                            </SelectItem>
                            <SelectItem value="medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-500">🚩</span>
                                    Medium
                                </div>
                            </SelectItem>
                            <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">🚩</span>
                                    High
                                </div>
                            </SelectItem>
                            <SelectItem value="critical">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500">🚩</span>
                                    Critical
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="gap-2"
                    >
                        <XIcon className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TaskFilters;
