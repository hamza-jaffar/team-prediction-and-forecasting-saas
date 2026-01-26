'use client';

import { ChevronRight } from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const resolveHref = (href: NavItem['href']) =>
    typeof href === 'string' ? href : href.url;

const DropdownLink = ({ item }: { item: NavItem }) => {
    const { url } = usePage();

    const isActive = item.items?.some(
        (subItem) => resolveHref(subItem.href) === url,
    );

    return (
        <Collapsible
            key={item.title}
            asChild
            defaultOpen={isActive}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) =>
                            subItem.show === true ? (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                        isActive={
                                            resolveHref(subItem.href) === url
                                        }
                                        asChild
                                    >
                                        <Link href={subItem.href}>
                                            {subItem.icon && <subItem.icon />}
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ) : null,
                        )}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

const SingleLink = ({ item }: { item: NavItem }) => {
    const { url } = usePage();

    return (
        <SidebarMenuItem>
            <SidebarMenuSubButton
                isActive={resolveHref(item.href) === url}
                asChild
            >
                <Link href={item.href}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuSubButton>
        </SidebarMenuItem>
    );
};

export function NavMain({ items }: { items: NavItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item, index) =>
                    item.show === true ? (
                        item.items ? (
                            <DropdownLink key={index} item={item} />
                        ) : (
                            <SingleLink key={index} item={item} />
                        )
                    ) : null,
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
