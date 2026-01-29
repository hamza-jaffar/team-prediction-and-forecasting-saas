import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { UserInfo } from '@/components/user-info';
import project from '@/routes/project';
import teamRoutes from '@/routes/team';
import { Team } from '@/types';
import { Project } from '@/types/project';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarIcon,
    EditIcon,
    MoreHorizontalIcon,
    Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';

interface ProjectTableRowProps {
    project: Project;
    onStatusChange: (slug: string, newStatus: string) => void;
    onDeleteClick: (project: Project) => void;
    team?: Team | null;
}

const statusConfig = {
    active: { label: 'Active', variant: 'default' as const },
    completed: { label: 'Completed', variant: 'secondary' as const },
    archived: { label: 'Archived', variant: 'outline' as const },
};

const ProjectTableRow = ({
    project: proj,
    onStatusChange,
    onDeleteClick,
    team,
}: ProjectTableRowProps) => {
    const [loadingStatus, setLoadingStatus] = useState(false);

    const handleStatusChange = (newStatus: string) => {
        setLoadingStatus(true);
        onStatusChange(proj.slug, newStatus);
        setTimeout(() => setLoadingStatus(false), 2000);
    };

    return (
        <tr className="border-b transition-colors hover:bg-muted/50">
            <td className="p-4 font-medium">
                <Link
                    href={
                        team
                            ? teamRoutes.project.settings({
                                  team: team.slug,
                                  slug: proj.slug,
                              }).url
                            : project.settings(proj.slug)
                    }
                    className="hover:underline"
                >
                    {proj.name}
                </Link>
            </td>
            <td className="p-4">
                {!team ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Badge
                                variant={
                                    statusConfig[
                                        proj.status as keyof typeof statusConfig
                                    ]?.variant || 'outline'
                                }
                                className="flex cursor-pointer items-center gap-1"
                            >
                                {loadingStatus && (
                                    <Spinner className="h-3 w-3" />
                                )}
                                <>
                                    {statusConfig[
                                        proj.status as keyof typeof statusConfig
                                    ]?.label || proj.status}
                                </>
                            </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem
                                onClick={() => handleStatusChange('active')}
                                disabled={loadingStatus}
                            >
                                Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusChange('completed')}
                                disabled={loadingStatus}
                            >
                                Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusChange('archived')}
                                disabled={loadingStatus}
                            >
                                Archived
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Badge
                        variant={
                            statusConfig[
                                proj.status as keyof typeof statusConfig
                            ]?.variant || 'outline'
                        }
                    >
                        {statusConfig[proj.status as keyof typeof statusConfig]
                            ?.label || proj.status}
                    </Badge>
                )}
            </td>
            <td className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                        {proj.start_date
                            ? format(new Date(proj.start_date), 'MMM d')
                            : 'TBD'}{' '}
                        -{' '}
                        {proj.end_date
                            ? format(new Date(proj.end_date), 'MMM d, yyyy')
                            : 'TBD'}
                    </span>
                </div>
            </td>
            <td className="flex gap-2 p-4">
                <UserInfo user={proj.owner} showEmail isInTable />
            </td>
            <td className="p-4 text-muted-foreground">
                {format(new Date(proj.created_at), 'MMM d, yyyy')}
            </td>
            <td className="p-4 text-right">
                {!team && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={project.edit(proj.slug).url}
                                    className="flex cursor-pointer gap-2"
                                >
                                    <EditIcon className="h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDeleteClick(proj)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2Icon className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </td>
        </tr>
    );
};

export default ProjectTableRow;
