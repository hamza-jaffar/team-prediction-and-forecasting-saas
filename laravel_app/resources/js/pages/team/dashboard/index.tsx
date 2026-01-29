import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, Team } from '@/types';
import { Task } from '@/types/task';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    AlertCircleIcon,
    CalendarIcon,
    ClockIcon,
    FileTextIcon,
    PlusIcon,
    UsersIcon,
} from 'lucide-react';

interface TeamDashboardProps {
    team: Team;
    stats: {
        members_count: number;
        tasks_count: number;
        completed_tasks_count: number;
        in_progress_tasks_count: number;
        overdue_tasks_count: number;
    };
    recentTasks: Task[];
}

const TeamDashboard = ({ team, stats, recentTasks }: TeamDashboardProps) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: teamRoutes.dashboard(team.slug).url,
        },
    ];

    const StatCard = ({
        title,
        value,
        icon: Icon,
        description,
        className,
    }: {
        title: string;
        value: string | number;
        icon: any;
        description?: string;
        className?: string;
    }) => (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <Heading
                        title="Team Dashboard"
                        description={`Overview for ${team.name}`}
                    />
                    <div className="flex items-center space-x-2">
                        <Link href={teamRoutes.task.create(team.slug).url}>
                            <Button className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                New Task
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Tasks"
                        value={stats.tasks_count}
                        icon={FileTextIcon}
                        description={`${stats.completed_tasks_count} completed`}
                    />
                    <StatCard
                        title="In Progress"
                        value={stats.in_progress_tasks_count}
                        icon={ClockIcon}
                        description="Currently active"
                    />
                    <StatCard
                        title="Overdue"
                        value={stats.overdue_tasks_count}
                        icon={AlertCircleIcon}
                        className={
                            stats.overdue_tasks_count > 0
                                ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'
                                : ''
                        }
                        description="Tasks past due date"
                    />
                    <StatCard
                        title="Team Members"
                        value={stats.members_count}
                        icon={UsersIcon}
                        description="Active contributors"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Tasks */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Tasks</CardTitle>
                            <CardDescription>
                                5 most recently created tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTasks.length > 0 ? (
                                    recentTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="space-y-1">
                                                <Link
                                                    href={
                                                        teamRoutes.task.show({
                                                            team: team.slug,
                                                            slug: task.slug,
                                                        }).url
                                                    }
                                                    className="font-medium hover:underline"
                                                >
                                                    {task.title}
                                                </Link>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                    <span>
                                                        From:{' '}
                                                        {task.creator
                                                            ? `${task.creator.first_name} ${task.creator.last_name}`
                                                            : 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                {task.due_date && (
                                                    <span className="flex items-center gap-1">
                                                        <CalendarIcon className="h-3 w-3" />
                                                        {format(
                                                            new Date(
                                                                task.due_date,
                                                            ),
                                                            'MMM d',
                                                        )}
                                                    </span>
                                                )}
                                                <Badge
                                                    variant={
                                                        (task.status === 'done'
                                                            ? 'success'
                                                            : 'secondary') as any
                                                    }
                                                >
                                                    {task.status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                                        <FileTextIcon className="mb-2 h-8 w-8 opacity-50" />
                                        <p>No tasks yet</p>
                                        <Link
                                            href={
                                                teamRoutes.task.create(
                                                    team.slug,
                                                ).url
                                            }
                                            className="mt-2 text-sm text-primary hover:underline"
                                        >
                                            Create your first task
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions / Activity Placeholder */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common team management tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href={teamRoutes.task.create(team.slug).url}>
                                <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50">
                                    <div className="rounded-full bg-primary/10 p-2">
                                        <PlusIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">
                                            Create Task
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            Add a new task to your list
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <Link
                                href={teamRoutes.members.index(team.slug).url}
                            >
                                <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50">
                                    <div className="rounded-full bg-primary/10 p-2">
                                        <UsersIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">
                                            Invite Members
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            Grow your team
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default TeamDashboard;
