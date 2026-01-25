import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { KanbanIcon, LayoutListIcon, SearchIcon } from 'lucide-react';

interface ProjectFiltersProps {
    search: string;
    sortField: string;
    view: 'table' | 'kanban';
    onSearchChange: (value: string) => void;
    onSortChange: (field: string) => void;
    onViewChange: (view: 'table' | 'kanban') => void;
}

const ProjectFilters = ({
    search,
    sortField,
    view,
    onSearchChange,
    onSortChange,
    onViewChange,
}: ProjectFiltersProps) => {
    return (
        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="w-full pl-9"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Select value={sortField} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="created_at">Date Created</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="start_date">Start Date</SelectItem>
                        <SelectItem value="end_date">End Date</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ToggleGroup
                type="single"
                value={view}
                onValueChange={(v) => v && onViewChange(v as 'table' | 'kanban')}
                className="rounded-lg border p-1"
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
                    value="kanban"
                    aria-label="Kanban View"
                    className="gap-2 px-3"
                >
                    <KanbanIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Kanban</span>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export default ProjectFilters;
