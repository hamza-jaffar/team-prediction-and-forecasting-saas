import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import teamRoutes from '@/routes/team';
import {
    BreadcrumbItem,
    SharedData,
    Team,
    TeamPermission,
    TeamRole,
} from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import * as React from 'react';

interface PageProps extends SharedData {
    team: Team;
    roles: TeamRole[];
    globalRoles: TeamRole[];
    allPermissions: TeamPermission[];
}

declare function route(name: string, params?: any): string;

export default function Roles() {
    const { team, roles, globalRoles, allPermissions } =
        usePage<PageProps>().props;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        permissions: [] as number[],
    });

    const [editingRole, setEditingRole] = React.useState<TeamRole | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: teamRoutes.dashboard(team.slug).url,
        },
        {
            title: 'Roles & Permissions',
            href: '#',
        },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            put(
                teamRoutes.roles.update({
                    team: team.slug,
                    role: editingRole.id,
                }).url,
                {
                    onSuccess: () => {
                        setEditingRole(null);
                        reset();
                    },
                },
            );
        } else {
            post(teamRoutes.roles.store(team.slug).url, {
                onSuccess: () => reset(),
            });
        }
    };

    const togglePermission = (permissionId: number) => {
        const index = data.permissions.indexOf(permissionId);
        if (index > -1) {
            setData(
                'permissions',
                data.permissions.filter((id) => id !== permissionId),
            );
        } else {
            setData('permissions', [...data.permissions, permissionId]);
        }
    };

    const startEdit = (role: TeamRole) => {
        setEditingRole(role);
        setData({
            name: role.name,
            description: role.description || '',
            permissions: role.permissions?.map((p) => p.id) || [],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {editingRole
                                    ? 'Edit Role'
                                    : 'Create Custom Role'}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Define custom roles and assign granular
                                permissions for this team.
                            </p>
                        </header>

                        <form onSubmit={submit} className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div>
                                        <Label>Role Name</Label>
                                        <Input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div>
                                        <Label>Description (Optional)</Label>
                                        <Textarea
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Permissions
                                    </label>
                                    <div className="grid max-h-60 grid-cols-1 gap-2 overflow-y-auto rounded-md border p-4 sm:grid-cols-2 dark:border-gray-700">
                                        {allPermissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                    checked={data.permissions.includes(
                                                        permission.id,
                                                    )}
                                                    onChange={() =>
                                                        togglePermission(
                                                            permission.id,
                                                        )
                                                    }
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {permission.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    className={`inline-flex items-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-900 dark:focus:ring-offset-gray-800 ${processing && 'opacity-50'}`}
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    {editingRole
                                        ? 'Update Role'
                                        : 'Create Role'}
                                </button>
                                {editingRole && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingRole(null);
                                            reset();
                                        }}
                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                            <h3 className="text-md mb-4 font-semibold text-gray-900 dark:text-gray-100">
                                Team Roles
                            </h3>
                            <div className="space-y-4">
                                {roles.length === 0 && (
                                    <p className="text-sm text-gray-500">
                                        No custom roles created yet.
                                    </p>
                                )}
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center justify-between rounded-md border p-4 dark:border-gray-700"
                                    >
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                {role.name}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {role.permissions?.length || 0}{' '}
                                                permissions
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => startEdit(role)}
                                                className="text-sm text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Delete this role?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            route(
                                                                'team.roles.destroy',
                                                                {
                                                                    team: team.slug,
                                                                    role: role.id,
                                                                },
                                                            ),
                                                        );
                                                    }
                                                }}
                                                className="text-sm text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                            <h3 className="text-md mb-4 font-semibold text-gray-900 dark:text-gray-100">
                                Global Roles (Read-Only)
                            </h3>
                            <div className="space-y-4">
                                {globalRoles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="rounded-md border bg-gray-50 p-4 opacity-75 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                            {role.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {role.description}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {role.permissions?.length || 0}{' '}
                                            permissions
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
