import Heading from '@/components/heading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import project from '@/routes/project';
import {
    type BreadcrumbItem,
    type PageProps,
    type PaginationLink,
} from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarIcon,
    EditIcon,
    KanbanIcon,
    LayoutListIcon,
    MoreHorizontalIcon,
    PlusIcon,
    SearchIcon,
    Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Project',
        href: project.index().url,
    },
];

interface Project {
    id: number;
    name: string;
    slug: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    created_by: number;
    owner: {
        name: string;
    };
    created_at: string;
}

interface ProjectIndexProps extends PageProps {
    projects: {
        data: Project[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    queryParams?: any;
}

const ProjectIndex = ({ projects, queryParams = null }: ProjectIndexProps) => {
    const [view, setView] = useState<'table' | 'kanban'>('table');
    const [search, setSearch] = useState(queryParams?.search || '');
    const [sortField, setSortField] = useState(
        queryParams?.sort_field || 'created_at',
    );
    const [sortDirection, setSortDirection] = useState(
        queryParams?.sort_direction || 'desc',
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null,
    );
    const [deleteOption, setDeleteOption] = useState<'soft' | 'permanent'>(
        'soft',
    );

    const { delete: deleteProject } = useForm();

    const onSearch = (value: string) => {
        setSearch(value);
        router.get(
            project.index().url,
            { ...queryParams, search: value },
            { preserveState: true, replace: true },
        );
    };

    const onSort = (field: string) => {
        const direction =
            sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(
            project.index().url,
            { ...queryParams, sort_field: field, sort_direction: direction },
            { preserveState: true },
        );
    };

    const handleStatusChange = (slug: string, newStatus: string) => {
        router.patch(project.update_status(slug).url, { status: newStatus });
    };

    const handleDeleteClick = (proj: Project) => {
        setSelectedProject(proj);
        setDeleteOption('soft');
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedProject) return;

        if (deleteOption === 'permanent') {
            deleteProject(project.force_delete(selectedProject.slug).url, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedProject(null);
                },
            });
        } else {
            deleteProject(project.destroy(selectedProject.slug).url, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedProject(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading
                        title="Projects"
                        description="Manage and track all your projects in one place."
                    />
                    <Link href={project.create().url}>
                        <Button className="gap-2">
                            <PlusIcon className="h-4 w-4" />
                            New Project
                        </Button>
                    </Link>
                </div>

                {/* Filters & View Toggle */}
                <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search projects..."
                                className="w-full pl-9"
                                value={search}
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </div>
                        <Select value={sortField} onValueChange={onSort}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">
                                    Date Created
                                </SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="start_date">
                                    Start Date
                                </SelectItem>
                                <SelectItem value="end_date">
                                    End Date
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <ToggleGroup
                        type="single"
                        value={view}
                        onValueChange={(v) =>
                            v && setView(v as 'table' | 'kanban')
                        }
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

                {/* Table View */}
                {view === 'table' && (
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
                                    {projects.data.length > 0 ? (
                                        projects.data.map((proj) => (
                                            <tr
                                                key={proj.id}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                <td className="p-4 font-medium">
                                                    {proj.name}
                                                </td>
                                                <td className="p-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Badge
                                                                variant={
                                                                    proj.status ===
                                                                    'active'
                                                                        ? 'default'
                                                                        : proj.status ===
                                                                            'completed'
                                                                          ? 'secondary'
                                                                          : 'outline'
                                                                }
                                                                className="cursor-pointer"
                                                            >
                                                                {proj.status}
                                                            </Badge>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        proj.slug,
                                                                        'active',
                                                                    )
                                                                }
                                                            >
                                                                Active
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        proj.slug,
                                                                        'completed',
                                                                    )
                                                                }
                                                            >
                                                                Completed
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        proj.slug,
                                                                        'archived',
                                                                    )
                                                                }
                                                            >
                                                                Archived
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <CalendarIcon className="h-3 w-3" />
                                                        <span>
                                                            {proj.start_date
                                                                ? format(
                                                                      new Date(
                                                                          proj.start_date,
                                                                      ),
                                                                      'MMM d',
                                                                  )
                                                                : 'TBD'}{' '}
                                                            -{' '}
                                                            {proj.end_date
                                                                ? format(
                                                                      new Date(
                                                                          proj.end_date,
                                                                      ),
                                                                      'MMM d, yyyy',
                                                                  )
                                                                : 'TBD'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {proj.owner.name}
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            proj.created_at,
                                                        ),
                                                        'MMM d, yyyy',
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontalIcon className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
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
                                                                    handleDeleteClick(
                                                                        proj,
                                                                    )
                                                                }
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2Icon className="h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="h-24 text-center"
                                            >
                                                No projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="flex items-center justify-end space-x-2 px-4 py-4">
                            {projects.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.get(link.url, queryParams)
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Kanban View */}
                {view === 'kanban' && (
                    <KanbanView
                        projects={projects.data}
                        onStatusChange={handleStatusChange}
                        onDeleteClick={handleDeleteClick}
                    />
                )}

                {/* Delete Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will move the project to trash. You can
                                restore it later if needed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="deleteOption"
                                        value="soft"
                                        checked={deleteOption === 'soft'}
                                        onChange={(e) =>
                                            setDeleteOption(
                                                e.target.value as
                                                    | 'soft'
                                                    | 'permanent',
                                            )
                                        }
                                    />
                                    <span className="text-sm">
                                        Move to Trash (Can be restored)
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="deleteOption"
                                        value="permanent"
                                        checked={deleteOption === 'permanent'}
                                        onChange={(e) =>
                                            setDeleteOption(
                                                e.target.value as
                                                    | 'soft'
                                                    | 'permanent',
                                            )
                                        }
                                    />
                                    <span className="text-sm">
                                        Permanently Delete (Cannot be restored)
                                    </span>
                                </label>
                            </div>
                        </div>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
};

interface KanbanViewProps {
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

export default ProjectIndex;
