import { Team } from './auth';

export type ProjectTeam = {
    id: number;
    project_id: number;
    team_id: number;
    role?: any;
    status: string;
    deleted_at?: any;
    created_at: string;
    updated_at: string;
    team: Team;
};
