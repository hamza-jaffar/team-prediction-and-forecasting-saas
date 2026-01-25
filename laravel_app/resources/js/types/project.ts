import { User } from "./auth";

export interface Project {
    id: number;
    name: string;
    slug: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    created_by: number;
    owner: User
    created_at: string;
}
