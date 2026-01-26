import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import projectRoute from '@/routes/project';
import { BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarIcon,
    ChevronDownIcon,
    EditIcon,
    PlusCircle,
    SettingsIcon,
    UsersIcon,
} from 'lucide-react';
import { useState } from 'react';

// Mock data for project teams
const mockProjectTeams = [
    {
        id: 1,
        name: 'Frontend Team',
        description: 'Responsible for UI/UX and frontend development',
        members: [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://i.pravatar.cc/150?img=1',
                role: 'Lead Developer',
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                avatar: 'https://i.pravatar.cc/150?img=2',
                role: 'Developer',
            },
        ],
    },
    {
        id: 2,
        name: 'Backend Team',
        description: 'Handles server-side development and APIs',
        members: [
            {
                id: 3,
                name: 'Mike Johnson',
                email: 'mike@example.com',
                avatar: 'https://i.pravatar.cc/150?img=3',
                role: 'Lead Developer',
            },
            {
                id: 4,
                name: 'Sarah Williams',
                email: 'sarah@example.com',
                avatar: 'https://i.pravatar.cc/150?img=4',
                role: 'Developer',
            },
        ],
    },
    {
        id: 3,
        name: 'Design Team',
        description: 'Creates designs and user experience',
        members: [
            {
                id: 5,
                name: 'Emma Davis',
                email: 'emma@example.com',
                avatar: 'https://i.pravatar.cc/150?img=5',
                role: 'UI/UX Designer',
            },
        ],
    },
];

const mockProjectStats = {
    totalTasks: 47,
    completedTasks: 31,
    activeTasks: 12,
    members: mockProjectTeams.reduce(
        (sum, team) => sum + team.members.length,
        0,
    ),
};

const ProjectSetting = ({ project }: { project: Project }) => {
    const [expandedTeams, setExpandedTeams] = useState<number[]>([]);

    const toggleTeam = (teamId: number) => {
        setExpandedTeams((prev) =>
            prev.includes(teamId)
                ? prev.filter((id) => id !== teamId)
                : [...prev, teamId],
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Project', href: projectRoute.index().url },
        {
            title: 'Project Settings',
            href: projectRoute.settings(project.slug).url,
        },
    ];

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            archived: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const progressPercentage = Math.round(
        (mockProjectStats.completedTasks / mockProjectStats.totalTasks) * 100,
    );

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
                    <Button variant="outline" size="lg" asChild>
                        <Link
                            className="flex items-center gap-2"
                            href={projectRoute.edit(project.slug).url}
                        >
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit Project
                        </Link>
                    </Button>
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
                                <div className="mt-2">
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
                                    {mockProjectStats.completedTasks} of{' '}
                                    {mockProjectStats.totalTasks} tasks
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
                                        {mockProjectStats.totalTasks}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Active Tasks
                                    </span>
                                    <span className="font-bold text-orange-600">
                                        {mockProjectStats.activeTasks}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Completed
                                    </span>
                                    <span className="font-bold text-green-600">
                                        {mockProjectStats.completedTasks}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Team Members
                                    </span>
                                    <span className="font-bold">
                                        {mockProjectStats.members}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Teams Card */}
                <Card>
                    <CardHeader className="border-b pb-3">
                        <div className='flex w-full items-center justify-between'>
                            <CardTitle className="flex items-center gap-2">
                                <UsersIcon className="h-5 w-5" />
                                Project Teams
                            </CardTitle>
                            <Button className='cursor-pointer'> <PlusCircle /> Add Team</Button>
                        </div>
                        <CardDescription>
                            Teams assigned to this project (read-only)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-6">
                        <div className="space-y-3">
                            {mockProjectTeams.map((team) => (
                                <Collapsible
                                    key={team.id}
                                    open={expandedTeams.includes(team.id)}
                                    onOpenChange={() => toggleTeam(team.id)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted/50">
                                            <div className="flex-1">
                                                <h3 className="text-base font-semibold text-foreground">
                                                    {team.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {team.description}
                                                </p>
                                            </div>
                                            <div className="ml-2 flex items-center gap-2">
                                                <Badge variant="outline">
                                                    {team.members.length}
                                                </Badge>
                                                <ChevronDownIcon
                                                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                                                        expandedTeams.includes(
                                                            team.id,
                                                        )
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            </div>
                                        </button>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="mt-2 rounded-xl border bg-muted/30 px-4 py-3">
                                        <div className="space-y-3">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {team.members.length} Member
                                                {team.members.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                            {team.members.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center justify-between border-b border-dashed px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={
                                                                    member.avatar
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {member.name
                                                                    .split(' ')
                                                                    .map(
                                                                        (n) =>
                                                                            n[0],
                                                                    )
                                                                    .join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">
                                                                {member.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {member.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {member.role}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                Configure notification preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                        Email notifications
                                    </label>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                        Task reminders
                                    </label>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                        Team updates
                                    </label>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 rounded"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </AppLayout>
    );
};

export default ProjectSetting;
