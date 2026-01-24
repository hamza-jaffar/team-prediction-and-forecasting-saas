import AppLayout from '@/layouts/app-layout';
import team from '@/routes/team';
import { BreadcrumbItem, SharedData, Team } from '@/types';
import { usePage } from '@inertiajs/react';

const TeamDashboard = () => {
    const { auth } = usePage<SharedData>().props;
    const activeTeam = auth.active_team as Team;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: team.dashboard(activeTeam.slug).url,
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>TeamDashboard</AppLayout>;
};

export default TeamDashboard;
