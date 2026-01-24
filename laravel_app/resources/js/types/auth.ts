export type TeamPermission = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
};

export type TeamRole = {
    id: number;
    team_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    permissions?: TeamPermission[];
};

export type Team = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    user_id: number;
    created_at: string;
    updated_at: string;
};

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    teams?: Team[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    active_team?: Team | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
