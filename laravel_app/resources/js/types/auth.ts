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

export type TeamUserRolePivot = {
    team_id: number;
    user_id: number;
    team_role_id: number;
    created_at: string;
    updated_at: string;
};

export type Team = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    user_id: number;
    users?: User[];
    created_at: string;
    updated_at: string;
};

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_pic?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    teams?: Team[];
    role?: TeamRole;
    created_at: string;
    updated_at: string;
    pivot?: TeamUserRolePivot;
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
