import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import project from '@/routes/project';
import { BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Project', href: project.create().url },
];

const ProjectIndex = () => {
    const today = new Date();
    const [startDate, setStartDate] = useState<Date>(today);
    const [endDate, setEndDate] = useState<Date>();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <section className="py-10">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {/* Page Heading */}
                    <Heading
                        title="Create Project"
                        description="Start a new project and set its details. Fill out all fields to ensure your project is set up correctly."
                    />

                    {/* Form */}
                    <Form
                        action={project.store().url}
                        method="POST"
                        className="space-y-8 rounded-xl"
                    >
                        {({ errors, processing }) => (
                            <>
                                {/* Project Name */}
                                <div className="space-y-1">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="e.g. Website Redesign"
                                        className="border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Give your project a clear, descriptive
                                        name so team members can recognize it
                                        easily.
                                    </p>
                                    <InputError message={errors.name} />
                                </div>

                                {/* Project Description */}
                                <div className="space-y-1">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        required
                                        placeholder="Describe the purpose and goals of this project"
                                        className="border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Briefly describe the project, its goals,
                                        and any important notes for team
                                        members.
                                    </p>
                                    <InputError message={errors.description} />
                                </div>

                                {/* Start & End Dates */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Start Date */}
                                    <div className="flex flex-col gap-2 space-y-1">
                                        <Label htmlFor="start_date">
                                            Start Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    data-empty={!startDate}
                                                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                                                >
                                                    {startDate ? (
                                                        format(startDate, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    defaultMonth={startDate}
                                                    required
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-sm text-gray-500">
                                            The date when your project
                                            officially begins.
                                        </p>
                                        <InputError
                                            message={errors.start_date}
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div className="flex flex-col gap-2 space-y-1">
                                        <Label htmlFor="end_date">
                                            End Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    data-empty={!endDate}
                                                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                                                >
                                                    {endDate ? (
                                                        format(endDate, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    defaultMonth={endDate}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-sm text-gray-500">
                                            The planned completion date for this
                                            project. Should be after the start
                                            date.
                                        </p>
                                        <InputError message={errors.end_date} />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <input
                                    type="hidden"
                                    name="start_date"
                                    value={
                                        startDate
                                            ? format(startDate, 'yyyy-MM-dd')
                                            : ''
                                    }
                                />
                                <input
                                    type="hidden"
                                    name="end_date"
                                    value={
                                        endDate
                                            ? format(endDate, 'yyyy-MM-dd')
                                            : ''
                                    }
                                />
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/70 py-3 text-lg font-medium text-white shadow-md backdrop-blur-sm transition-all hover:bg-primary/90"
                                >
                                    {processing && <Spinner />}
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Project'}
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </section>
        </AppLayout>
    );
};

export default ProjectIndex;
