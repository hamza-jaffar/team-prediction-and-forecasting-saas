import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import project from '@/routes/project';
import { Project } from '@/types/project';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarIcon,
    EditIcon,
    MoreHorizontalIcon,
    Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';

export interface KanbanViewProps {
    projects: Project[];
    onStatusChange: (slug: string, newStatus: string) => void;
    onDeleteClick: (project: Project) => void;
}

const KanbanView = ({
    projects,
    onStatusChange,
    onDeleteClick,
}: KanbanViewProps) => {
    const [draggedProject, setDraggedProject] = useState<Project | null>(null);
    const statuses = ['active', 'completed', 'archived'];

    const handleDragStart = (proj: Project) => {
        setDraggedProject(proj);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (status: string) => {
        if (draggedProject && draggedProject.status !== status) {
            onStatusChange(draggedProject.slug, status);
        }
        setDraggedProject(null);
    };

    return (
        <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-3">
            {statuses.map((status) => (
                <div
                    key={status}
                    className="flex h-full flex-col rounded-lg border bg-muted/40 p-4"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(status)}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground capitalize">
                            {status}
                        </h3>
                        <Badge variant="outline">
                            {projects.filter((p) => p.status === status).length}
                        </Badge>
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                        {projects
                            .filter((p) => p.status === status)
                            .map((proj) => (
                                <Card
                                    key={proj.id}
                                    draggable
                                    onDragStart={() => handleDragStart(proj)}
                                    className="cursor-move transition-all hover:shadow-md"
                                >
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-base font-medium">
                                                {proj.name}
                                            </CardTitle>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="-mr-2 h-6 w-6"
                                                    >
                                                        <MoreHorizontalIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={
                                                                project.edit(
                                                                    proj.slug,
                                                                ).url
                                                            }
                                                            className="flex cursor-pointer gap-2"
                                                        >
                                                            <EditIcon className="h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onDeleteClick(proj)
                                                        }
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                            {proj.description ||
                                                'No description provided.'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                <span>
                                                    {proj.end_date
                                                        ? format(
                                                              new Date(
                                                                  proj.end_date,
                                                              ),
                                                              'MMM d',
                                                          )
                                                        : 'TBD'}
                                                </span>
                                            </div>
                                            <span>{proj.owner.name}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        {projects.filter((p) => p.status === status).length ===
                            0 && (
                            <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                                No {status} projects
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanView;
