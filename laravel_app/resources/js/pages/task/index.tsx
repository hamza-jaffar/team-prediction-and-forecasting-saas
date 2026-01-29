import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, PageProps, PaginationLink, Team } from '@/types';
import { Task } from '@/types/task';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import DeleteTaskDialog from './delete-task-dialog';
import GanttView from './gantt-view';
import TaskFilters from './task-filters';
import TaskPagination from './task-pagination';
import TaskTable from './task-table';
import TaskTrashModal from './task-trash-modal';

interface TaskIndexProps extends PageProps {
    tasks: {
        data: Task[];
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

const TaskIndex = ({
    tasks,
    queryParams = null,
    team = null,
}: TaskIndexProps) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: team ? teamRoutes.dashboard(team.slug).url : dashboard().url,
        },
        {
            title: 'Tasks',
            href: team
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url,
        },
    ];

    const [search, setSearch] = useState(queryParams?.search || '');
    const [sortField, setSortField] = useState(
        queryParams?.sort_field || 'created_at',
    );
    const [sortDirection, setSortDirection] = useState(
        queryParams?.sort_direction || 'desc',
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [trashModalOpen, setTrashModalOpen] = useState(false);
    const [status, setStatus] = useState(queryParams?.status || 'all');
    const [priority, setPriority] = useState(queryParams?.priority || 'all');
    const [startDateFrom, setStartDateFrom] = useState(
        queryParams?.start_date_from || '',
    );
    const [startDateTo, setStartDateTo] = useState(
        queryParams?.start_date_to || '',
    );
    const [dueDateFrom, setDueDateFrom] = useState(
        queryParams?.due_date_from || '',
    );
    const [dueDateTo, setDueDateTo] = useState(queryParams?.due_date_to || '');
    const [view, setView] = useState<'table' | 'gantt'>('table');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const { delete: deleteTask, processing: isDeleting } = useForm();

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
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url;
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
        setPriority(queryParams?.priority || 'all');
        setStartDateFrom(queryParams?.start_date_from || '');
        setStartDateTo(queryParams?.start_date_to || '');
        setDueDateFrom(queryParams?.due_date_from || '');
        setDueDateTo(queryParams?.due_date_to || '');
    }, [queryParams]);

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
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url;
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
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url;
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
            const url = team
                ? // @ts-ignore
                  teamRoutes.task.update(team.slug, slug).url
                : taskRoute.update(slug).url;

            router.put(
                url,
                {
                    status: newStatus,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        },
        [team],
    );

    const handlePriorityChange = useCallback(
        (slug: string, newPriority: string) => {
            const url = team
                ? // @ts-ignore
                  teamRoutes.task.update(team.slug, slug).url
                : taskRoute.update(slug).url;

            router.patch(
                url,
                {
                    priority: newPriority,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        },
        [team],
    );

    const handleDeleteClick = (task: Task) => {
        setSelectedTask(task);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = (option: 'soft' | 'permanent') => {
        if (!selectedTask) return;

        const url =
            option === 'permanent'
                ? team
                    ? teamRoutes.task.forceDelete({
                          team: team.slug,
                          slug: selectedTask.slug,
                      }).url
                    : taskRoute.forceDelete(selectedTask.slug).url
                : team
                  ? teamRoutes.task.destroy({
                        team: team.slug,
                        slug: selectedTask.slug,
                    }).url
                  : taskRoute.destroy(selectedTask.slug).url;

        deleteTask(url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedTask(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading
                        title="Tasks"
                        description="Manage and track all your tasks in one place."
                    />
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => setTrashModalOpen(true)}
                        >
                            <Trash2Icon className="h-4 w-4" />
                            Trash
                        </Button>
                        <Link
                            href={
                                team
                                    ? teamRoutes.task.create(team.slug).url
                                    : taskRoute.create().url
                            }
                        >
                            <Button className="gap-2">
                                <PlusIcon className="h-4 w-4" />
                                New Task
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <TaskFilters
                    search={search}
                    status={status}
                    priority={priority}
                    startDateFrom={startDateFrom}
                    startDateTo={startDateTo}
                    dueDateFrom={dueDateFrom}
                    dueDateTo={dueDateTo}
                    onSearchChange={handleSearch}
                    onFilterChange={handleFilterChange}
                    isLoading={isFiltering}
                    view={view}
                    onViewChange={setView}
                />

                {/* Table View */}
                {view === 'table' && (
                    <TaskTable
                        tasks={tasks.data}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                        onDeleteClick={handleDeleteClick}
                        isLoading={isFiltering}
                        team={team}
                    />
                )}

                {/* Gantt View */}
                {view === 'gantt' && (
                    <GanttView tasks={tasks.data} isLoading={isFiltering} />
                )}

                {/* Pagination */}
                <TaskPagination
                    links={tasks.links}
                    queryParams={queryParams}
                    team={team}
                />

                {/* Delete Dialog */}
                <DeleteTaskDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    task={selectedTask}
                    onConfirm={handleConfirmDelete}
                    isLoading={isDeleting}
                />

                {/* Trash Modal */}
                <TaskTrashModal
                    open={trashModalOpen}
                    onOpenChange={setTrashModalOpen}
                    team={team}
                />
            </div>
        </AppLayout>
    );
};

export default TaskIndex;
