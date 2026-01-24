import {
    BadgeCheck,
    ChevronsUpDown,
    GalleryVerticalEnd,
    Plus,
    UserIcon,
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import team from '@/routes/team';
import { SharedData, Team } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';

export function TeamSwitcher({ teams }: { teams: Team[] }) {
    const { isMobile } = useSidebar();
    const { auth } = usePage<SharedData>().props;
    const activeTeam = auth.active_team;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {activeTeam ? (
                                    <GalleryVerticalEnd className="size-4" />
                                ) : (
                                    <UserIcon className="size-4" />
                                )}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {activeTeam?.name || 'Personal Account'}
                                </span>
                                <span className="truncate text-xs">
                                    {activeTeam?.slug || 'Personal'}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Accounts
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => router.get(dashboard().url)}
                            className="gap-2 p-2"
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border">
                                <UserIcon className="size-3.5 shrink-0" />
                            </div>
                            Personal Account
                            {!activeTeam && (
                                <BadgeCheck className="ml-auto size-4 text-sidebar-primary" />
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Teams
                        </DropdownMenuLabel>
                        {teams.map((data, index) => (
                            <DropdownMenuItem
                                key={data.slug}
                                onClick={() =>
                                    router.get(team.dashboard(data.slug).url)
                                }
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <GalleryVerticalEnd className="size-3.5 shrink-0" />
                                </div>
                                <div className="flex flex-col">
                                    {data.name}
                                    <span className="text-[10px] text-gray-500">
                                        {data.slug}
                                    </span>
                                </div>
                                <DropdownMenuShortcut>
                                    {activeTeam?.id === data.id && (
                                        <BadgeCheck className="ml-auto size-4 text-sidebar-primary" />
                                    )}
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2" asChild>
                            <Link href={team.create().url}>
                                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">
                                    Add team
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
