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
import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants/task';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import taskRoute from '@/routes/task';
import teamRoutes from '@/routes/team';
import { BreadcrumbItem, Team } from '@/types';
import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { Form } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
import { useState } from 'react';

interface TaskEditProps {
    task: Task;
    projects: Project[];
    team?: Team | null;
}

const TaskEdit = ({ task, projects, team = null }: TaskEditProps) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: team ? teamRoutes.dashboard(team.slug).url : dashboard().url,
        },
        {
            title: 'Tasks',
            href: team
                ? teamRoutes.task.index(team.slug).url
                : taskRoute.index().url,
        },
        {
            title: task.title,
            href: team
                ? teamRoutes.task.show({ team: team.slug, slug: task.slug }).url
                : taskRoute.show(task.slug).url,
        },
        {
            title: 'Edit',
            href: team
                ? teamRoutes.task.edit({ team: team.slug, slug: task.slug }).url
                : taskRoute.edit(task.slug).url,
        },
    ];

    const [startDate, setStartDate] = useState<Date | undefined>(
        task.start_date ? new Date(task.start_date) : undefined,
    );
    const [dueDate, setDueDate] = useState<Date | undefined>(
        task.due_date ? new Date(task.due_date) : undefined,
    );

    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isDueDateOpen, setIsDueDateOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <section className="py-10">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <Heading
                        title="Edit Task"
                        description="Update task details and settings."
                    />
                    <Form
                        action={
                            team
                                ? teamRoutes.task.update({
                                      team: team.slug,
                                      slug: task.slug,
                                  }).url
                                : taskRoute.update(task.slug).url
                        }
                        method="PUT"
                        className="space-y-8 rounded-xl"
                    >
                        {({ errors, processing }) => (
                            <>
                                {/* Task Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">
                                        Task Title{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <CheckCircleIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="title"
                                            name="title"
                                            type="text"
                                            placeholder="e.g., Implement user authentication"
                                            className="pl-10"
                                            defaultValue={task?.title}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.title} />
                                    <p className="text-xs text-muted-foreground">
                                        A clear, concise title for your task
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Provide detailed information about this task..."
                                        rows={4}
                                        className="resize-none"
                                        defaultValue={task?.description ?? ''}
                                    />
                                    <InputError message={errors.description} />
                                    <p className="text-xs text-muted-foreground">
                                        Add context, requirements, or notes
                                    </p>
                                </div>

                                {/* Project Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="project_id">
                                        Project{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        name="project_id"
                                        defaultValue={String(task.project_id)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.length > 0 ? (
                                                projects.map((project) => (
                                                    <SelectItem
                                                        key={project.id}
                                                        value={String(
                                                            project.id,
                                                        )}
                                                    >
                                                        {project.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value="no_project_available"
                                                    disabled
                                                >
                                                    No projects available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.project_id} />
                                </div>

                                {/* Status and Priority */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            name="status"
                                            defaultValue={task.status}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(
                                                    TASK_STATUSES,
                                                ).map((config) => (
                                                    <SelectItem
                                                        key={config.value}
                                                        value={config.value}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`h-2 w-2 rounded-full ${config.color}`}
                                                            />
                                                            {config.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    {/* Priority */}
                                    <div className="space-y-2">
                                        <Label htmlFor="priority">
                                            Priority
                                        </Label>
                                        <Select
                                            name="priority"
                                            defaultValue={task.priority}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(
                                                    TASK_PRIORITIES,
                                                ).map((config) => (
                                                    <SelectItem
                                                        key={config.value}
                                                        value={config.value}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <config.icon
                                                                className={`h-4 w-4 ${config.iconColor}`}
                                                            />
                                                            {config.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.priority} />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Start Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">
                                            Start Date
                                        </Label>
                                        <Popover
                                            open={isStartDateOpen}
                                            onOpenChange={setIsStartDateOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {startDate
                                                        ? format(
                                                              startDate,
                                                              'PPP',
                                                          )
                                                        : 'Pick a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={(date) => {
                                                        setStartDate(date);
                                                        setIsStartDateOpen(
                                                            false,
                                                        );
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <input
                                            type="hidden"
                                            name="start_date"
                                            value={
                                                startDate
                                                    ? format(
                                                          startDate,
                                                          'yyyy-MM-dd',
                                                      )
                                                    : ''
                                            }
                                        />
                                        <InputError
                                            message={errors.start_date}
                                        />
                                    </div>

                                    {/* Due Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="due_date">
                                            Due Date
                                        </Label>
                                        <Popover
                                            open={isDueDateOpen}
                                            onOpenChange={setIsDueDateOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {dueDate
                                                        ? format(dueDate, 'PPP')
                                                        : 'Pick a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={dueDate}
                                                    onSelect={(date) => {
                                                        setDueDate(date);
                                                        setIsDueDateOpen(false);
                                                    }}
                                                    initialFocus
                                                    disabled={(date) =>
                                                        startDate
                                                            ? date < startDate
                                                            : false
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <input
                                            type="hidden"
                                            name="due_date"
                                            value={
                                                dueDate
                                                    ? format(
                                                          dueDate,
                                                          'yyyy-MM-dd',
                                                      )
                                                    : ''
                                            }
                                        />
                                        <InputError message={errors.due_date} />
                                    </div>
                                </div>

                                {/* Time Estimates */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Estimated Time */}
                                    <div className="space-y-2">
                                        <Label htmlFor="estimated_minutes">
                                            Estimated Time (minutes)
                                        </Label>
                                        <div className="relative">
                                            <ClockIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="estimated_minutes"
                                                name="estimated_minutes"
                                                type="number"
                                                defaultValue={
                                                    task?.estimated_minutes ?? 0
                                                }
                                                placeholder="e.g., 480"
                                                className="pl-10"
                                                min="0"
                                                step="15"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.estimated_minutes}
                                        />
                                    </div>

                                    {/* Actual Time */}
                                    <div className="space-y-2">
                                        <Label htmlFor="actual_minutes">
                                            Actual Time (minutes)
                                        </Label>
                                        <div className="relative">
                                            <ClockIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="actual_minutes"
                                                name="actual_minutes"
                                                type="number"
                                                placeholder="e.g., 520"
                                                defaultValue={
                                                    task?.actual_minutes ?? 0
                                                }
                                                className="pl-10"
                                                min="0"
                                                step="15"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.actual_minutes}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center gap-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    >
                                        {processing && (
                                            <Spinner className="mr-2" />
                                        )}
                                        {processing
                                            ? 'Updating...'
                                            : 'Update Task'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
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

export default TaskEdit;
