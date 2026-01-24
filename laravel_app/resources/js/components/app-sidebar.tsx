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
import type { NavItem } from '@/types';
import {
    AudioWaveform,
    Bot,
    Command,
    GalleryVerticalEnd,
    LayoutGrid,
    Settings,
    SquareTerminal,
    Users,
} from 'lucide-react';
import { TeamSwitcher } from './team-switcher';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Team',
        href: team.create(),
        icon: Users,
    },
    {
        title: 'Playground',
        href: '#',
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
                title: 'History',
                href: '#',
            },
            {
                title: 'Starred',
                href: '#',
            },
            {
                title: 'Settings',
                href: '#',
            },
        ],
    },
    {
        title: 'Models',
        href: '#',
        icon: Bot,
        items: [
            {
                title: 'Genesis',
                href: '#',
            },
            {
                title: 'Explorer',
                href: '#',
            },
            {
                title: 'Quantum',
                href: '#',
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

const teams = [
    {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
    },
    {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
    },
    {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
    },
];

export function AppSidebar() {
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
