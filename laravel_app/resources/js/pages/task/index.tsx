import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, Team } from '@/types';

const TaskIndex = ({ team = null }: { team?: Team | null }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: team ? teamRoutes.dashboard(team.slug).url : dashboard().url,
        },
        {
            title: 'Task',
            href: team
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url,
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>TaskIndex</AppLayout>;
};

export default TaskIndex;
