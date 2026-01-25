import { Project } from '@/types/project';
import ProjectTableRow from './project-table-row';

interface ProjectTableProps {
    projects: Project[];
    onStatusChange: (slug: string, newStatus: string) => void;
    onDeleteClick: (project: Project) => void;
}

const ProjectTable = ({
    projects,
    onStatusChange,
    onDeleteClick,
}: ProjectTableProps) => {
    return (
        <div className="rounded-md border bg-card">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Name
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Status
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Duration
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Owner
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Created At
                            </th>
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
