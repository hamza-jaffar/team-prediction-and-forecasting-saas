import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, SharedData, Team, TeamRole, User } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import * as React from 'react';

declare function route(name: string, params?: any): string;

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
        team_role_id: roles.find((r) => r.slug === 'member')?.id || '',
    });

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
        // Use the team.members.store route Helper if available, otherwise manual
        // Route helper check: team.members.store is likely available via prefix
        post(route('team.members.store', { team: team.slug }), {
            onSuccess: () => reset('email'),
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
                                Add a new member to your team by their email
                                address.
                            </p>
                        </header>

                        <form
                            onSubmit={addMember}
                            className="mt-6 max-w-xl space-y-6"
                        >
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.email as string | undefined}
                                />
                            </div>

                            <div>
                                <Label>Role</Label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                    value={data.team_role_id}
                                    onChange={(e) =>
                                        setData('team_role_id', e.target.value)
                                    }
                                    required
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={
                                        errors.team_role_id as
                                            | string
                                            | undefined
                                    }
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-900 dark:focus:ring-offset-gray-800"
                                    disabled={processing}
                                >
                                    Add Member
                                </button>
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
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    'Are you sure you want to remove this member?',
                                                                )
                                                            ) {
                                                                (
                                                                    router as any
                                                                ).delete(
                                                                    route(
                                                                        'team.members.destroy',
                                                                        {
                                                                            team: team.slug,
                                                                            member: member.id,
                                                                        },
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                        className="ml-4 text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
                                                    </button>
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
