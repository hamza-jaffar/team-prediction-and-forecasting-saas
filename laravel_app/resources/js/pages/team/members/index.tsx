import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, SharedData, Team, TeamRole, User } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface ExtendedUser extends User {
    team_role?: TeamRole;
}

interface PageProps extends SharedData {
    team: Team;
    members: ExtendedUser[];
    roles: TeamRole[];
}

export default function Members() {
    const { team, members, roles } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        team_role_id: '',
    });

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [openEmail, setOpenEmail] = useState(false);
    const [openRole, setOpenRole] = useState(false);

    useEffect(() => {
        if (data.email.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(
                    teamRoutes.members.search(
                        { team: team.slug },
                        {
                            query: { query: data.email },
                        },
                    ).url,
                );
                const users = await response.json();
                setSuggestions(users);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [data.email, team.slug]);

    const canSubmit = data.email && data.team_role_id && !processing;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: teamRoutes.dashboard(team.slug).url,
        },
        {
            title: 'Members',
            href: '#',
        },
    ];

    const addMember = (e: React.FormEvent) => {
        e.preventDefault();
        post(teamRoutes.members.store(team.slug).url, {
            onSuccess: () => {
                reset('email', 'team_role_id');
                setSuggestions([]);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Members" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Add Team Member
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Select a user and assign a role to invite them
                                to your team.
                            </p>
                        </header>

                        <form
                            onSubmit={addMember}
                            className="mt-6 max-w-xl space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label>User Email</Label>
                                    <Popover
                                        open={openEmail}
                                        onOpenChange={setOpenEmail}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openEmail}
                                                className="w-full justify-between"
                                            >
                                                {data.email ||
                                                    'Search for a user...'}
                                                {isSearching ? (
                                                    <Spinner className="ml-2" />
                                                ) : (
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-full p-0"
                                            align="start"
                                        >
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder="Type email or name..."
                                                    value={data.email}
                                                    onValueChange={(val) =>
                                                        setData('email', val)
                                                    }
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No users found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {suggestions.map(
                                                            (user) => (
                                                                <CommandItem
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    value={
                                                                        user.email
                                                                    }
                                                                    disabled={
                                                                        user.is_already_member
                                                                    }
                                                                    onSelect={(
                                                                        currentValue,
                                                                    ) => {
                                                                        setData(
                                                                            'email',
                                                                            currentValue,
                                                                        );
                                                                        setOpenEmail(
                                                                            false,
                                                                        );
                                                                    }}
                                                                    className={cn(
                                                                        user.is_already_member &&
                                                                            'cursor-not-allowed opacity-50 select-none',
                                                                    )}
                                                                >
                                                                    <div className="flex w-full items-center justify-between">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-medium">
                                                                                {
                                                                                    user.name
                                                                                }
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {
                                                                                    user.email
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            {user.is_current_user && (
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className="text-[10px]"
                                                                                >
                                                                                    You
                                                                                </Badge>
                                                                            )}
                                                                            {user.is_already_member && (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="border-red-200 bg-red-50 text-[10px] text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                                                                >
                                                                                    Member
                                                                                </Badge>
                                                                            )}
                                                                            <Check
                                                                                className={cn(
                                                                                    'ml-2 h-4 w-4',
                                                                                    data.email ===
                                                                                        user.email
                                                                                        ? 'opacity-100'
                                                                                        : 'opacity-0',
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </CommandItem>
                                                            ),
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError
                                        message={
                                            errors.email as string | undefined
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Select Role</Label>
                                    <Popover
                                        open={openRole}
                                        onOpenChange={setOpenRole}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openRole}
                                                className="w-full justify-between"
                                            >
                                                {data.team_role_id
                                                    ? roles.find(
                                                          (role) =>
                                                              role.id.toString() ===
                                                              data.team_role_id.toString(),
                                                      )?.name
                                                    : 'Select a role...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-full p-0"
                                            align="start"
                                        >
                                            <Command>
                                                <CommandInput placeholder="Search role..." />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No roles found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {roles.map((role) => (
                                                            <CommandItem
                                                                key={role.id}
                                                                value={
                                                                    role.name
                                                                }
                                                                onSelect={() => {
                                                                    setData(
                                                                        'team_role_id',
                                                                        role.id.toString(),
                                                                    );
                                                                    setOpenRole(
                                                                        false,
                                                                    );
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        data.team_role_id.toString() ===
                                                                            role.id.toString()
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0',
                                                                    )}
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium">
                                                                        {
                                                                            role.name
                                                                        }
                                                                    </span>
                                                                    {role.description && (
                                                                        <span className="text-[10px] text-muted-foreground">
                                                                            {
                                                                                role.description
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError
                                        message={
                                            errors.team_role_id as
                                                | string
                                                | undefined
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button className="gap-2" disabled={!canSubmit}>
                                    {processing && <Spinner />}
                                    Add Member
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Manage Members
                            </h2>
                        </header>

                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {member.first_name}{' '}
                                                {member.last_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                                                {member.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                                                {member.team_role?.name ||
                                                    'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                {member.id !==
                                                    (team as any).user_id && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <button className="ml-4 flex items-center gap-1 text-red-600 hover:text-red-900">
                                                                <Trash2 className="size-4" />
                                                                Remove
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you
                                                                    absolutely
                                                                    sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action
                                                                    will remove{' '}
                                                                    {
                                                                        member.first_name
                                                                    }{' '}
                                                                    {
                                                                        member.last_name
                                                                    }{' '}
                                                                    from the
                                                                    team. They
                                                                    will lose
                                                                    access to
                                                                    all team
                                                                    resources
                                                                    immediately.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => {
                                                                        (
                                                                            router as any
                                                                        ).delete(
                                                                            teamRoutes.members.destroy(
                                                                                {
                                                                                    team: team.slug,
                                                                                    member: member.id,
                                                                                },
                                                                            )
                                                                                .url,
                                                                        );
                                                                    }}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Continue
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
