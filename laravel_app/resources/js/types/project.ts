import { User } from './auth';
import { ProjectTeam } from './team';

export interface Project {
    id: number;
    name: string;
    slug: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    created_by: number;
    owner: User;
    teams: ProjectTeam[];
    updated_at: string;
    created_at: string;
}
