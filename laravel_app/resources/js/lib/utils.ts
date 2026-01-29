import { NavItem } from '@/types';
import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export const resolveHref = (href: NavItem['href']) => {
    if (!href) return ''; // handle undefined/null
    return typeof href === 'string' ? href : href.url || '';
};

export const getPath = (href: string) => {
    try {
        return new URL(href, window.location.origin).pathname;
    } catch {
        return href; // fallback if href is relative
    }
};
