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
import project from '@/routes/project';
import task from '@/routes/task';
import team from '@/routes/team';
import type { NavItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    Building2,
    ClipboardCheck,
    Folders,
    LayoutGrid,
    PlusCircle,
    Settings,
    TableOfContents,
    UserCog,
} from 'lucide-react';
import { TeamSwitcher } from './team-switcher';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const activeTeam = auth.active_team;
    const teams = auth.user.teams || [];

    const personalNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
            icon: LayoutGrid,
            show: true,
        },
        {
            title: 'My Projects',
            href: '#',
            icon: Folders,
            show: true,
            items: [
                {
                    title: 'View All',
                    href: project.index().url,
                    show: true,
                    icon: TableOfContents,
                },
                {
                    title: 'Create New',
                    href: project.create().url,
                    show: true,
                    icon: PlusCircle,
                },
            ],
        },
        {
            title: 'My Tasks',
            href: '#',
            icon: ClipboardCheck,
            show: true,
            items: [
                {
                    title: 'View All',
                    href: task.index().url,
                    show: true,
                },
            ],
        },
        {
            title: 'Teams',
            href: '#',
            icon: Building2,
            show: true,
            items: [
                {
                    title: 'Create Team',
                    href: team.create().url,
                    show: true,
                    icon: PlusCircle,
                },
            ],
        },
    ];

    const teamNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: activeTeam ? team.dashboard(activeTeam.slug).url : '#',
            icon: LayoutGrid,
            show: true,
        },
        {
            title: 'Projects',
            href: activeTeam ? team.project.index(activeTeam.slug).url : '#',
            icon: Folders,
            show: true,
        },
        {
            title: 'Tasks',
            href: activeTeam ? team.task.index(activeTeam.slug).url : '#',
            icon: ClipboardCheck,
            show: true,
        },
        {
            title: 'Team Settings',
            href: '#',
            icon: UserCog,
            show: activeTeam ? activeTeam?.user_id === auth.user.id : false,
            items: [
                {
                    title: 'Members',
                    href: activeTeam
                        ? team.members.index(activeTeam.slug).url
                        : '#',
                    show: true,
                },
                {
                    title: 'Roles & Permissions',
                    href: activeTeam
                        ? team.roles.index(activeTeam.slug).url
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
                <NavMain
                    items={activeTeam ? teamNavItems : personalNavItems}
                    label={activeTeam ? activeTeam.name : 'Personal'}
                />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
