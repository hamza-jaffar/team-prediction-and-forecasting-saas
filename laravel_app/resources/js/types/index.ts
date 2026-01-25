export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    flash: {
        success: string;
        error: string;
    };
    [key: string]: unknown;
};

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & SharedData;
