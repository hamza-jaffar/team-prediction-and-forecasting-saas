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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, Team } from '@/types';
import { Project } from '@/types/project';
import { Form, Head } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarIcon,
    ChevronDownIcon,
    ClockIcon,
    FlagIcon,
    ListTodoIcon,
    TargetIcon,
} from 'lucide-react';
import { useState } from 'react';

interface CreateTaskProps {
    team?: Team | null;
    projects?: Project[];
}

const CreateTask = ({ team = null, projects = [] }: CreateTaskProps) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: team ? teamRoutes.dashboard(team.slug).url : dashboard().url,
        },
        {
            title: 'Task',
            href: team
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url,
        },
        {
            title: 'Create Task',
            href: team
                ? teamRoutes.task.create(team.slug).url
                : taskRoute.create().url,
        },
    ];

    const [startDate, setStartDate] = useState<Date>();
    const [dueDate, setDueDate] = useState<Date>();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Task" />
            <section className="py-10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Page Heading */}
                    <Heading
                        title="Create New Task"
                        description="Break down your project into actionable tasks. Define clear objectives, set priorities, and track progress effectively."
                    />

                    {/* Form */}
                    <Form
                        action={
                            team
                                ? teamRoutes.task.store(team.slug).url
                                : taskRoute.store().url
                        }
                        method="POST"
                        className="space-y-8 rounded-xl"
                    >
                        {({ errors, processing }) => (
                            <>
                                {/* Task Title */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="title"
                                        className="flex items-center gap-2 text-base font-semibold"
                                    >
                                        <TargetIcon className="h-4 w-4 text-primary" />
                                        Task Title
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        type="text"
                                        required
                                        placeholder="e.g. Design user authentication flow"
                                        className="border-gray-300 text-base shadow-sm transition-all focus:border-primary focus:ring-primary"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Give your task a clear, action-oriented
                                        title that describes what needs to be
                                        done.
                                    </p>
                                    <InputError message={errors.title} />
                                </div>

                                {/* Task Description */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="text-base font-semibold"
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Provide detailed information about this task, including requirements, acceptance criteria, and any relevant context..."
                                        rows={5}
                                        className="border-gray-300 text-base shadow-sm transition-all focus:border-primary focus:ring-primary"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Add comprehensive details to help team
                                        members understand the task scope and
                                        requirements.
                                    </p>
                                    <InputError message={errors.description} />
                                </div>

                                {/* Project Selection */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="project_id"
                                        className="text-base font-semibold"
                                    >
                                        Project
                                    </Label>
                                    <Select name="project_id" required>
                                        <SelectTrigger className="border-gray-300 text-base shadow-sm transition-all focus:border-primary focus:ring-primary">
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.length > 0 ? (
                                                projects.map((project) => (
                                                    <SelectItem
                                                        key={project.id}
                                                        value={project.id.toString()}
                                                    >
                                                        {project.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value="no-projects"
                                                    disabled
                                                >
                                                    No projects available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        Assign this task to a specific project
                                        for better organization.
                                    </p>
                                    <InputError message={errors.project_id} />
                                </div>

                                {/* Status & Priority Grid */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="status"
                                            className="flex items-center gap-2 text-base font-semibold"
                                        >
                                            <ListTodoIcon className="h-4 w-4 text-blue-500" />
                                            Status
                                        </Label>
                                        <Select
                                            name="status"
                                            defaultValue="todo"
                                        >
                                            <SelectTrigger className="border-gray-300 shadow-sm transition-all focus:border-primary focus:ring-primary">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todo">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                                                        To Do
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="in_progress">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                        In Progress
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="blocked">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                        Blocked
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="done">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                        Done
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">
                                            Current status of the task.
                                        </p>
                                        <InputError message={errors.status} />
                                    </div>

                                    {/* Priority */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="priority"
                                            className="flex items-center gap-2 text-base font-semibold"
                                        >
                                            <FlagIcon className="h-4 w-4 text-orange-500" />
                                            Priority
                                        </Label>
                                        <Select
                                            name="priority"
                                            defaultValue="medium"
                                        >
                                            <SelectTrigger className="border-gray-300 shadow-sm transition-all focus:border-primary focus:ring-primary">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    <span className="flex items-center gap-2">
                                                        <FlagIcon className="h-3 w-3 text-gray-400" />
                                                        Low
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    <span className="flex items-center gap-2">
                                                        <FlagIcon className="h-3 w-3 text-yellow-500" />
                                                        Medium
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    <span className="flex items-center gap-2">
                                                        <FlagIcon className="h-3 w-3 text-orange-500" />
                                                        High
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="critical">
                                                    <span className="flex items-center gap-2">
                                                        <FlagIcon className="h-3 w-3 text-red-500" />
                                                        Critical
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">
                                            How urgent is this task?
                                        </p>
                                        <InputError message={errors.priority} />
                                    </div>
                                </div>

                                {/* Date Range Grid */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Start Date */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="start_date"
                                            className="flex items-center gap-2 text-base font-semibold"
                                        >
                                            <CalendarIcon className="h-4 w-4 text-green-500" />
                                            Start Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    data-empty={!startDate}
                                                    className="w-full justify-between border-gray-300 text-left font-normal shadow-sm transition-all hover:border-primary data-[empty=true]:text-muted-foreground"
                                                >
                                                    {startDate ? (
                                                        format(startDate, 'PPP')
                                                    ) : (
                                                        <span>
                                                            Pick a start date
                                                        </span>
                                                    )}
                                                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
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
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-sm text-muted-foreground">
                                            When will work on this task begin?
                                        </p>
                                        <InputError
                                            message={errors.start_date}
                                        />
                                    </div>

                                    {/* Due Date */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="due_date"
                                            className="flex items-center gap-2 text-base font-semibold"
                                        >
                                            <CalendarIcon className="h-4 w-4 text-red-500" />
                                            Due Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    data-empty={!dueDate}
                                                    className="w-full justify-between border-gray-300 text-left font-normal shadow-sm transition-all hover:border-primary data-[empty=true]:text-muted-foreground"
                                                >
                                                    {dueDate ? (
                                                        format(dueDate, 'PPP')
                                                    ) : (
                                                        <span>
                                                            Pick a due date
                                                        </span>
                                                    )}
                                                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={dueDate}
                                                    onSelect={setDueDate}
                                                    defaultMonth={dueDate}
                                                    disabled={(date) =>
                                                        startDate
                                                            ? date < startDate
                                                            : false
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-sm text-muted-foreground">
                                            Target completion date. Must be
                                            after start date.
                                        </p>
                                        <InputError message={errors.due_date} />
                                    </div>
                                </div>

                                {/* Estimated Time */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="estimated_minutes"
                                        className="flex items-center gap-2 text-base font-semibold"
                                    >
                                        <ClockIcon className="h-4 w-4 text-purple-500" />
                                        Estimated Time (in minutes)
                                    </Label>
                                    <Input
                                        id="estimated_minutes"
                                        name="estimated_minutes"
                                        type="number"
                                        min="0"
                                        step="15"
                                        placeholder="e.g. 120 (2 hours)"
                                        className="border-gray-300 text-base shadow-sm transition-all focus:border-primary focus:ring-primary"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        How long do you estimate this task will
                                        take? Enter time in minutes (e.g., 60
                                        for 1 hour, 480 for 8 hours).
                                    </p>
                                    <InputError
                                        message={errors.estimated_minutes}
                                    />
                                </div>

                                {/* Hidden inputs for dates */}
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
                                    name="due_date"
                                    value={
                                        dueDate
                                            ? format(dueDate, 'yyyy-MM-dd')
                                            : ''
                                    }
                                />

                                {/* Submit Button */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary/80 to-primary py-6 text-lg font-semibold text-white shadow-lg transition-all hover:from-primary hover:to-primary/90 hover:shadow-xl disabled:opacity-50"
                                    >
                                        {processing && <Spinner />}
                                        {processing
                                            ? 'Creating Task...'
                                            : 'Create Task'}
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

export default CreateTask;
