import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import projectRoute from '@/routes/project';
import { User } from '@/types';
import { Project } from '@/types/project';
import { router } from '@inertiajs/react';
import { ChevronDownIcon, PlusCircle, Trash2, UsersIcon } from 'lucide-react';
import { useState } from 'react';
import AddTeamDialog from './add-team-dialog';

const ProjectTeamSection = ({
    teams,
    project,
}: {
    teams: any[];
    project: Project;
}) => {
    const [expandedTeams, setExpandedTeams] = useState<number[]>([]);
    const [openAddTeamDialog, setOpenAddTeamDialog] = useState<boolean>(false);
    const [teamToRemove, setTeamToRemove] = useState<any>(null);

    const toggleTeam = (teamId: number) => {
        setExpandedTeams((prev) =>
            prev.includes(teamId)
                ? prev.filter((id) => id !== teamId)
                : [...prev, teamId],
        );
    };

    const handleRemoveTeam = () => {
        if (!teamToRemove) return;

        router.delete(
            projectRoute.remove_team({
                project_id: project.id,
                team_id: teamToRemove.team?.id,
            }),
            {
                onSuccess: () => {
                    setTeamToRemove(null);
                },
            },
        );
    };

    return (
        <>
            <Card>
                <CardHeader className="border-b pb-3">
                    <div className="flex w-full items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5" />
                            Project Teams
                        </CardTitle>
                        <Button
                            onClick={() => setOpenAddTeamDialog(true)}
                            className="cursor-pointer"
                        >
                            <PlusCircle /> Add Team
                        </Button>
                    </div>
                    <CardDescription>
                        Teams assigned to this project
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-6">
                    <div className="space-y-3">
                        {teams.map((projectTeam) => (
                            <Collapsible
                                key={projectTeam.id}
                                open={expandedTeams.includes(projectTeam.id)}
                                onOpenChange={() => toggleTeam(projectTeam.id)}
                            >
                                <CollapsibleTrigger asChild>
                                    <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted/50">
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-foreground">
                                                {projectTeam.team?.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {projectTeam.team?.description}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex items-center gap-2">
                                            <Badge variant="outline">
                                                {projectTeam.team?.users
                                                    ?.length || 0}
                                            </Badge>
                                            <ChevronDownIcon
                                                className={`h-5 w-5 text-muted-foreground transition-transform ${
                                                    expandedTeams.includes(
                                                        projectTeam.id,
                                                    )
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            />
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTeamToRemove(
                                                        projectTeam,
                                                    );
                                                }}
                                                className="rounded-md p-1"
                                            >
                                                <Trash2 className="h-5 w-5 cursor-pointer text-red-500" />
                                            </div>
                                        </div>
                                    </button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="mt-2 rounded-xl border bg-muted/30 px-4 py-3">
                                    <div className="space-y-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {projectTeam.team?.users?.length ||
                                                0}{' '}
                                            Member
                                            {projectTeam.team?.users?.length !==
                                            1
                                                ? 's'
                                                : ''}
                                        </p>
                                        {projectTeam.team?.users?.map(
                                            (member: User) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center justify-between border-b border-dashed px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={
                                                                    (member.profile_pic &&
                                                                        `/storage/${member.profile_pic}`) ||
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.first_name + ' ' + member.last_name)}&background=random`
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {member.first_name
                                                                    .split(' ')
                                                                    .map(
                                                                        (
                                                                            n: string,
                                                                        ) =>
                                                                            n[0],
                                                                    )
                                                                    .join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">
                                                                {member.first_name +
                                                                    ' ' +
                                                                    member.last_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {member.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {projectTeam.team?.roles?.find(
                                                            (role: any) =>
                                                                role.id ===
                                                                member.pivot
                                                                    ?.team_role_id,
                                                        )?.name || 'Member'}
                                                    </Badge>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <AddTeamDialog
                open={openAddTeamDialog}
                onOpenChange={() => setOpenAddTeamDialog(false)}
                project={project}
            />

            <AlertDialog
                open={!!teamToRemove}
                onOpenChange={(open) => !open && setTeamToRemove(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove{' '}
                            <span className="font-semibold">
                                {teamToRemove?.team?.name}
                            </span>{' '}
                            from the project. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveTeam}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Remove Team
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ProjectTeamSection;
