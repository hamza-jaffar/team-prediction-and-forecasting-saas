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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { format, parseISO } from 'date-fns';
import {
    FilterIcon,
    KanbanIcon,
    LayoutListIcon,
    SearchIcon,
} from 'lucide-react';

interface ProjectFiltersProps {
    search: string;
    status: string;
    startDate: string;
    endDate: string;
    view: 'table' | 'kanban';
    onSearchChange: (value: string) => void;
    onFilterChange: (filters: any) => void;
    onViewChange: (view: 'table' | 'kanban') => void;
    isLoading?: boolean;
}

const ProjectFilters = ({
    search,
    status,
    startDate,
    endDate,
    view,
    onSearchChange,
    onFilterChange,
    onViewChange,
    isLoading,
}: ProjectFiltersProps) => {
    return (
        <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex w-full flex-1 items-center gap-2 sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search projects..."
                            className="w-full pl-9"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                    <ToggleGroup
                        type="single"
                        value={view}
                        onValueChange={(v) =>
                            v && onViewChange(v as 'table' | 'kanban')
                        }
                        className="rounded-lg border p-1"
                    >
                        <ToggleGroupItem
                            value="table"
                            aria-label="Table View"
                            className="gap-2 px-3"
                        >
                            <LayoutListIcon className="h-4 w-4" />
                            <span className="hidden lg:inline">Table</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="kanban"
                            aria-label="Kanban View"
                            className="gap-2 px-3"
                        >
                            <KanbanIcon className="h-4 w-4" />
                            <span className="hidden lg:inline">Kanban</span>
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/20 p-3">
                <div className="mr-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FilterIcon className="h-4 w-4" />
                    Filters:
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Status
                        </span>
                        <Select
                            value={status}
                            onValueChange={(val) =>
                                onFilterChange({ status: val })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="h-9 w-32">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                                <SelectItem value="archived">
                                    Archived
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range Filters */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            From
                        </span>
                        <DatePicker
                            date={startDate ? parseISO(startDate) : undefined}
                            setDate={(d) =>
                                onFilterChange({
                                    start_date: d
                                        ? format(d, 'yyyy-MM-dd')
                                        : '',
                                })
                            }
                            className="h-9 w-[180px]"
                            placeholder="Start date"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            To
                        </span>
                        <DatePicker
                            date={endDate ? parseISO(endDate) : undefined}
                            setDate={(d) =>
                                onFilterChange({
                                    end_date: d ? format(d, 'yyyy-MM-dd') : '',
                                })
                            }
                            className="h-9 w-[180px]"
                            placeholder="End date"
                            disabled={isLoading}
                        />
                    </div>

                    {(search || status !== 'all' || startDate || endDate) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                                onFilterChange({
                                    search: '',
                                    status: 'all',
                                    start_date: '',
                                    end_date: '',
                                })
                            }
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectFilters;
