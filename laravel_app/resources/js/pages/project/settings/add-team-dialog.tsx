import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { myTeams } from '@/routes';
import projectRoute from '@/routes/project';
import { Team } from '@/types';
import { Project } from '@/types/project';
import { Form } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project;
};

const AddTeamDialog = ({ open, onOpenChange, project }: Props) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Fetch teams when dialog opens
    useEffect(() => {
        if (!open) {
            // Reset state when dialog closes
            setTeams([]);
            setSelectedTeamId('');
            setPopoverOpen(false);
            return;
        }

        setLoadingTeams(true);

        axios
            .get(myTeams.get().url)
            .then((res) => {
                setTeams(res.data.teams ?? []);
            })
            .catch(() => {
                setTeams([]);
            })
            .finally(() => {
                setLoadingTeams(false);
            });
    }, [open]);

    const selectedTeam =
        teams.find((team) => String(team.id) === selectedTeamId) ?? null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Team</DialogTitle>
                    <DialogDescription>
                        Select a team to add to this project.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    action={projectRoute.add_team(project.id)}
                    onSuccess={() => {
                        onOpenChange(false);
                    }}
                >
                    {({ errors, processing }) => (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <input
                                    type="hidden"
                                    name="team_id"
                                    value={selectedTeam?.id ?? ''}
                                />

                                <Label htmlFor="team">Team</Label>
                                <Popover
                                    open={popoverOpen}
                                    onOpenChange={setPopoverOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full justify-between"
                                            disabled={loadingTeams}
                                        >
                                            {loadingTeams
                                                ? 'Loading teams…'
                                                : selectedTeam
                                                  ? selectedTeam.name
                                                  : 'Select Team'}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-full p-0 sm:w-80">
                                        <Command>
                                            <CommandInput placeholder="Search teams..." />

                                            <CommandList>
                                                <CommandEmpty>
                                                    No teams found.
                                                </CommandEmpty>

                                                <CommandGroup heading="Teams">
                                                    {teams.map((team) => (
                                                        <CommandItem
                                                            key={String(
                                                                team.id,
                                                            )}
                                                            value={String(
                                                                team.id,
                                                            )}
                                                            onSelect={() => {
                                                                setSelectedTeamId(
                                                                    String(
                                                                        team.id,
                                                                    ),
                                                                );
                                                                setPopoverOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {team.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.team_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Textarea
                                    className="w-full"
                                    name="role"
                                    placeholder="Enter the role of this team..."
                                />
                                <InputError message={errors.role} />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    className="ml-auto"
                                    disabled={
                                        !selectedTeam ||
                                        processing ||
                                        loadingTeams
                                    }
                                >
                                    {processing && <Spinner />}
                                    {processing ? 'Adding…' : 'Add Team'}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTeamDialog;
