import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import project from '@/routes/project';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, PageProps, PaginationLink, Team } from '@/types';
import { Project } from '@/types/project';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import DeleteProjectDialog from './delete-project-dialog';
import KanbanView from './kanban-view';
import ProjectFilters from './project-filters';
import ProjectPagination from './project-pagination';
import ProjectTable from './project-table';
import ProjectTrashModal from './project-trash-modal';

// Breadcrumbs moved inside component for dynamic context

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
    team: Team | null;
}

const ProjectIndex = ({
    projects,
    queryParams = null,
    team = null,
}: ProjectIndexProps) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: team ? teamRoutes.dashboard(team.slug).url : dashboard().url,
        },
        {
            title: 'Project',
            href: team
                ? teamRoutes.project.index(team.slug).url
                : project.index().url,
        },
    ];
    const [view, setView] = useState<'table' | 'kanban'>('table');
    const [search, setSearch] = useState(queryParams?.search || '');
    const [sortField, setSortField] = useState(
        queryParams?.sort_field || 'created_at',
    );
    const [sortDirection, setSortDirection] = useState(
        queryParams?.sort_direction || 'desc',
    );
    const [trashed, setTrashed] = useState<string>(queryParams?.trashed || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [trashModalOpen, setTrashModalOpen] = useState(false);
    const [status, setStatus] = useState(queryParams?.status || 'all');
    const [startDate, setStartDate] = useState(queryParams?.start_date || '');
    const [endDate, setEndDate] = useState(queryParams?.end_date || '');
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null,
    );
    const [isFiltering, setIsFiltering] = useState(false);
    const { delete: deleteProject, processing: isDeleting } = useForm();

    const isFirstRun = useRef(true);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
    }, []);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const handler = setTimeout(() => {
            const url = team
                ? teamRoutes.project.index(team.slug).url
                : project.index().url;
            router.get(
                url,
                { ...queryParams, search: search || undefined },
                {
                    preserveState: true,
                    replace: true,
                    onStart: () => setIsFiltering(true),
                    onFinish: () => setIsFiltering(false),
                },
            );
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setStatus(queryParams?.status || 'all');
        setStartDate(queryParams?.start_date || '');
        setEndDate(queryParams?.end_date || '');
        setTrashed(queryParams?.trashed || '');
    }, [queryParams]);

    const handleTrashedChange = useCallback(
        (value: string) => {
            setTrashed(value);
            const url = team
                ? teamRoutes.project.index(team.slug).url
                : project.index().url;
            router.get(
                url,
                { ...queryParams, trashed: value || undefined },
                { preserveState: true },
            );
        },
        [queryParams],
    );

    const handleFilterChange = useCallback(
        (filters: any) => {
            const newParams = { ...queryParams, ...filters };
            // Remove empty params
            Object.keys(newParams).forEach((key) => {
                if (
                    newParams[key] === '' ||
                    newParams[key] === 'all' ||
                    newParams[key] === null ||
                    newParams[key] === undefined
                ) {
                    delete newParams[key];
                }
            });

            const url = team
                ? teamRoutes.project.index(team.slug).url
                : project.index().url;
            router.get(url, newParams, {
                preserveState: true,
                replace: true,
                onStart: () => setIsFiltering(true),
                onFinish: () => setIsFiltering(false),
            });
        },
        [queryParams],
    );

    const handleSort = useCallback(
        (field: string) => {
            const direction =
                sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
            setSortField(field);
            setSortDirection(direction);
            const url = team
                ? teamRoutes.project.index(team.slug).url
                : project.index().url;
            router.get(
                url,
                {
                    ...queryParams,
                    sort_field: field,
                    sort_direction: direction,
                },
                {
                    preserveState: true,
                    onStart: () => setIsFiltering(true),
                    onFinish: () => setIsFiltering(false),
                },
            );
        },
        [sortField, sortDirection, queryParams, team],
    );

    const handleStatusChange = useCallback(
        (slug: string, newStatus: string) => {
            const url = project.update_status(slug).url;
            router.patch(url, {
                status: newStatus,
            });
        },
        [team],
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

    const handleRestoreProject = (slug: string) => {
        const url = project.restore(slug).url;
        router.patch(
            url,
            {},
            {
                preserveState: true,
            },
        );
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
                    <div className="flex items-center gap-3">
                        {!team && (
                            <>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => setTrashModalOpen(true)}
                                >
                                    <Trash2Icon className="h-4 w-4" />
                                    Trash
                                </Button>
                                <Link href={project.create().url}>
                                    <Button className="gap-2">
                                        <PlusIcon className="h-4 w-4" />
                                        New Project
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <ProjectFilters
                    search={search}
                    status={status}
                    startDate={startDate}
                    endDate={endDate}
                    view={view}
                    onSearchChange={handleSearch}
                    onFilterChange={handleFilterChange}
                    onViewChange={setView}
                    isLoading={isFiltering}
                />

                {/* Table View */}
                {view === 'table' && (
                    <>
                        <ProjectTable
                            projects={projects.data}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                            onStatusChange={handleStatusChange}
                            onDeleteClick={handleDeleteClick}
                            isLoading={isFiltering}
                            team={team}
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
                        team={team}
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

                {/* Trash Modal */}
                <ProjectTrashModal
                    open={trashModalOpen}
                    onOpenChange={setTrashModalOpen}
                />
            </div>
        </AppLayout>
    );
};

export default ProjectIndex;
