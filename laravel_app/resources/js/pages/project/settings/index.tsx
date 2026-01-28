import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import projectRoute from '@/routes/project';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, Team } from '@/types';
import { Project } from '@/types/project';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, EditIcon, SettingsIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import DeleteProjectDialog from '../delete-project-dialog';
import ProjectTeamSection from './project-team-section';

const ProjectSetting = ({
    project,
    team = null,
}: {
    project: Project;
    team?: Team | null;
}) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: team ? teamRoutes.dashboard(team.slug).url : dashboard().url,
        },
        {
            title: 'Project',
            href: team
                ? teamRoutes.project.index(team.slug).url
                : projectRoute.index().url,
        },
        {
            title: 'Project Settings',
            href: team
                ? teamRoutes.project.settings({
                      team: team.slug,
                      slug: project.slug,
                  }).url
                : projectRoute.settings(project.slug).url,
        },
    ];

    const membersCount =
        project.teams?.reduce(
            (sum, team) => sum + (team.team?.users?.length || 0),
            0,
        ) || 0;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            archived: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { delete: deleteProject, processing: isDeleting } = useForm();

    const totalTasks = 0; // TODO: Implement real task counting
    const completedTasks = 0;
    const activeTasks = 0;
    const progressPercentage =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const handleStatusChange = (newStatus: string) => {
        const url = team
            ? teamRoutes.project.update_status({
                  team: team.slug,
                  slug: project.slug,
              }).url
            : projectRoute.update_status(project.slug).url;
        router.patch(url, {
            status: newStatus,
        });
    };

    const handleConfirmDelete = (option: 'soft' | 'permanent') => {
        const url =
            option === 'permanent'
                ? team
                    ? teamRoutes.project.force_delete({
                          team: team.slug,
                          slug: project.slug,
                      }).url
                    : projectRoute.force_delete(project.slug).url
                : team
                  ? teamRoutes.project.destroy({
                        team: team.slug,
                        slug: project.slug,
                    }).url
                  : projectRoute.destroy(project.slug).url;

        deleteProject(url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects Settings" />
            <div className="flex h-full flex-col space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Project Settings
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Manage and configure your project settings
                        </p>
                    </div>
                    {!team && (
                        <Button variant="outline" size="lg" asChild>
                            <Link
                                className="flex items-center gap-2"
                                href={projectRoute.edit(project.slug).url}
                            >
                                <EditIcon className="mr-2 h-4 w-4" />
                                Edit Project
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Main Grid */}
                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {/* Project Details Card - Spans 2 columns */}
                    <Card className="md:col-span-2 lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SettingsIcon className="h-5 w-5" />
                                Project Details
                            </CardTitle>
                            <CardDescription>
                                Core information about your project
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Project Name */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Project Name
                                </label>
                                <p className="mt-2 text-lg font-semibold">
                                    {project.name}
                                </p>
                            </div>

                            <Separator />

                            {/* Status */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Status
                                </label>
                                <div className="mt-2 flex items-center gap-4">
                                    <Badge
                                        className={getStatusColor(
                                            project.status,
                                        )}
                                    >
                                        {project.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            project.status.slice(1)}
                                    </Badge>
                                    {!team && (
                                        <Select
                                            defaultValue={project.status}
                                            onValueChange={handleStatusChange}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Update Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="archived">
                                                    Archived
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Description
                                </label>
                                <p className="mt-2 text-sm text-foreground">
                                    {project.description ||
                                        'No description provided.'}
                                </p>
                            </div>

                            <Separator />

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Start Date
                                    </label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium">
                                            {project.start_date
                                                ? format(
                                                      new Date(
                                                          project.start_date,
                                                      ),
                                                      'MMM d, yyyy',
                                                  )
                                                : 'TBD'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        End Date
                                    </label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium">
                                            {project.end_date
                                                ? format(
                                                      new Date(
                                                          project.end_date,
                                                      ),
                                                      'MMM d, yyyy',
                                                  )
                                                : 'TBD'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Owner */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Project Owner
                                </label>
                                <div className="mt-2 flex items-center gap-3">
                                    <UserInfo user={project.owner} showEmail />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Statistics */}
                    <Card className="md:col-span-1 lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Project Statistics</CardTitle>
                            <CardDescription>
                                Overview of project metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Progress */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Completion Progress
                                    </span>
                                    <span className="text-sm font-bold text-blue-600">
                                        {progressPercentage}%
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                        style={{
                                            width: `${progressPercentage}%`,
                                        }}
                                    ></div>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {completedTasks} of {totalTasks} tasks
                                    completed
                                </p>
                            </div>

                            <Separator />

                            {/* Stats Grid */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Total Tasks
                                    </span>
                                    <span className="font-bold">
                                        {totalTasks}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Active Tasks
                                    </span>
                                    <span className="font-bold text-orange-600">
                                        {activeTasks}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Completed
                                    </span>
                                    <span className="font-bold text-green-600">
                                        {completedTasks}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Team Members
                                    </span>
                                    <span className="font-bold">
                                        {membersCount}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {!team && (
                    <ProjectTeamSection
                        teams={project.teams || []}
                        project={project}
                        team={team}
                    />
                )}

                {!team && (
                    <>
                        {/* Danger Zone */}
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">
                                    Danger Zone
                                </CardTitle>
                                <CardDescription>
                                    Irreversible actions for this project
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            Delete Project
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Move this project to trash. You can
                                            restore it later.
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            setDeleteDialogOpen(true)
                                        }
                                        className="gap-2"
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                        Delete Project
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <DeleteProjectDialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                            project={project}
                            onConfirm={handleConfirmDelete}
                            isLoading={isDeleting}
                        />
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default ProjectSetting;
