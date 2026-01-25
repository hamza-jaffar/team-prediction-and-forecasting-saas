import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import project from '@/routes/project';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Project',
        href: project.create().url,
    },
];

const ProjectIndex = () => {
    return <AppLayout breadcrumbs={breadcrumbs}>ProjectIndex</AppLayout>;
};

export default ProjectIndex;
