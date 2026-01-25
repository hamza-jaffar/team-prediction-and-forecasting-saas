import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { edit as editAppearance } from '@/routes/appearance';
import team from '@/routes/team';
import type { NavItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Building2, LayoutGrid, Settings, UserCog } from 'lucide-react';
import { TeamSwitcher } from './team-switcher';

export function AppSidebar() {
    const { url } = usePage();
    const { auth } = usePage<SharedData>().props;
    const teams = auth.user.teams || [];

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
            show: true,
        },
        {
            title: 'Team',
            href: team.create(),
            icon: Building2,
            show: true,
        },
        {
            title: 'Users',
            href: '#',
            icon: UserCog,
            show: !!auth.active_team,
            items: [
                {
                    title: 'Members',
                    href: auth.active_team
                        ? team.members.index(auth.active_team.slug).url
                        : '#',
                    show: true,
                },
                {
                    title: 'Roles & Permissions',
                    href: auth.active_team
                        ? team.roles.index(auth.active_team.slug).url
                        : '#',
                    show: true,
                },
            ],
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Settings',
            href: editAppearance().url,
            icon: Settings,
        },
    ];

    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
