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
import team from '@/routes/team';
import type { NavItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bot, LayoutGrid, Settings, SquareTerminal, Users } from 'lucide-react';
import { TeamSwitcher } from './team-switcher';

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
        icon: Users,
        show: true,
    },
    {
        title: 'Playground',
        href: '#',
        icon: SquareTerminal,
        show: true,
        isActive: true,
        items: [
            {
                title: 'History',
                href: '#',
                show: true,
            },
            {
                title: 'Starred',
                href: '#',
                show: false,
            },
            {
                title: 'Settings',
                href: '#',
                show: true,
            },
        ],
    },
    {
        title: 'Models',
        href: '#',
        icon: Bot,
        show: true,
        items: [
            {
                title: 'Genesis',
                href: '#',
                show: true,
            },
            {
                title: 'Explorer',
                href: '#',
                show: true,
            },
            {
                title: 'Quantum',
                href: '#',
                show: true,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const teams = auth.user.teams || [];

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
