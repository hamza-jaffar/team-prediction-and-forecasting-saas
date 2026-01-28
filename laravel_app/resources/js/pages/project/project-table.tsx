import { Project } from '@/types/project';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import ProjectTableRow from './project-table-row';

interface ProjectTableProps {
    projects: Project[];
    sortField: string;
    sortDirection: string;
    onSort: (field: string) => void;
    onStatusChange: (slug: string, newStatus: string) => void;
    onDeleteClick: (project: Project) => void;
    isLoading?: boolean;
}

const ProjectTable = ({
    projects,
    sortField,
    sortDirection,
    onSort,
    onStatusChange,
    onDeleteClick,
    isLoading,
}: ProjectTableProps) => {
    const renderSortIcon = (field: string) => {
        if (sortField !== field)
            return <ChevronsUpDown className="ml-2 h-4 w-4" />;
        return sortDirection === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ChevronDown className="ml-2 h-4 w-4 text-primary" />
        );
    };

    const SortableHeader = ({
        field,
        children,
    }: {
        field: string;
        children: React.ReactNode;
    }) => (
        <th
            className="group h-12 cursor-pointer px-4 text-left align-middle font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center">
                {children}
                {renderSortIcon(field)}
            </div>
        </th>
    );

    return (
        <div className="relative rounded-md border bg-card">
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
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <SortableHeader field="name">Name</SortableHeader>
                            <SortableHeader field="status">
                                Status
                            </SortableHeader>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Duration
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Owner
                            </th>
                            <SortableHeader field="created_at">
                                Created At
                            </SortableHeader>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {projects.length > 0 ? (
                            projects.map((proj) => (
                                <ProjectTableRow
                                    key={proj.id}
                                    project={proj}
                                    onStatusChange={onStatusChange}
                                    onDeleteClick={onDeleteClick}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="h-24 text-center">
                                    No projects found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectTable;
