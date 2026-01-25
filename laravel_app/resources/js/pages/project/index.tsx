import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import project from '@/routes/project';
import { BreadcrumbItem, PageProps, PaginationLink } from '@/types';
import { Project } from '@/types/project';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import DeleteProjectDialog from './delete-project-dialog';
import KanbanView from './kanban-view';
import ProjectFilters from './project-filters';
import ProjectPagination from './project-pagination';
import ProjectTable from './project-table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Project', href: project.index().url },
];

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
    const { delete: deleteProject, processing: isDeleting } = useForm();

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            router.get(
                project.index().url,
                { ...queryParams, search: value },
                { preserveState: true, replace: true },
            );
        },
        [queryParams],
    );

    const handleSort = useCallback(
        (field: string) => {
            const direction =
                sortField === field && sortDirection === 'asc'
                    ? 'desc'
                    : 'asc';
            setSortField(field);
            setSortDirection(direction);
            router.get(
                project.index().url,
                {
                    ...queryParams,
                    sort_field: field,
                    sort_direction: direction,
                },
                { preserveState: true },
            );
        },
        [sortField, sortDirection, queryParams],
    );

    const handleStatusChange = useCallback(
        (slug: string, newStatus: string) => {
            router.patch(project.update_status(slug).url, {
                status: newStatus,
            });
        },
        [],
    );

    const handleDeleteClick = (proj: Project) => {
        setSelectedProject(proj);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = (option: 'soft' | 'permanent') => {
        if (!selectedProject) return;

        const url =
            option === 'permanent'
                ? project.force_delete(selectedProject.slug).url
                : project.destroy(selectedProject.slug).url;

        deleteProject(url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedProject(null);
            },
        });
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

                {/* Filters */}
                <ProjectFilters
                    search={search}
                    sortField={sortField}
                    view={view}
                    onSearchChange={handleSearch}
                    onSortChange={handleSort}
                    onViewChange={setView}
                />

                {/* Table View */}
                {view === 'table' && (
                    <>
                        <ProjectTable
                            projects={projects.data}
                            onStatusChange={handleStatusChange}
                            onDeleteClick={handleDeleteClick}
                        />
                        <ProjectPagination
                            links={projects.links}
                            queryParams={queryParams}
                        />
                    </>
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
                <DeleteProjectDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    project={selectedProject}
                    onConfirm={handleConfirmDelete}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
};

export default ProjectIndex;
