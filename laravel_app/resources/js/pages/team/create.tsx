// Shared UI + form utilities
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import team from '@/routes/team';

import { BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Create Team',
        href: team.create().url,
    },
];

const CreateTeam = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Team" />

            <section className="flex items-center justify-center">
                <div className="mx-auto w-full max-w-xl pt-10">
                    <Form
                        action={team.store().url}
                        method="post"
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Team name</Label>

                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            placeholder="e.g. Backend Warriors"
                                        />

                                        <p className="text-sm text-muted-foreground">
                                            This name will be visible to all
                                            team members.
                                        </p>

                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>

                                        <Textarea
                                            id="description"
                                            name="description"
                                            required
                                            tabIndex={2}
                                            autoComplete="description"
                                            placeholder="What is this team about?"
                                        />

                                        <p className="text-sm text-muted-foreground">
                                            Briefly describe the purpose or
                                            focus of this team.
                                        </p>

                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="create-team-button"
                                    >
                                        {processing && <Spinner />}
                                        Create Team
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </section>
        </AppLayout>
    );
};

export default CreateTeam;
