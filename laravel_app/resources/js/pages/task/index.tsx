import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import task from '@/routes/task';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Task',
        href: task.index().url,
    },
];

const TaskIndex = () => {
    return <AppLayout breadcrumbs={breadcrumbs}>TaskIndex</AppLayout>;
};

export default TaskIndex;
