import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import project from '@/routes/project';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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

const ProjectIndex = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Project" />
            <section className="py-6">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <Heading title="Project" />
                </div>
            </section>
        </AppLayout>
    );
};

export default ProjectIndex;
