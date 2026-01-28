import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import project from '@/routes/project';
import { Project } from '@/types/project';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { RefreshCw, RotateCcw, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectTrashModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ProjectTrashModal = ({ open, onOpenChange }: ProjectTrashModalProps) => {
    const [trashedProjects, setTrashedProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchTrashed = async () => {
        setLoading(true);
        try {
            // We use axios but we need to tell Laravel we want the data
            // Since the index route returns Inertia, we can use partial reload or a separate API.
            // Let's use Inertia partial reload capability if possible, but that's for the current page.
            // Let's just use axios and hope the controller handles it or we parse the Inertia response.
            const response = await axios.get(project.index().url, {
                params: { trashed: 'only' },
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            // If it's an Inertia response, the data is in response.data.props.projects.data
            if (response.data.props?.projects?.data) {
                setTrashedProjects(response.data.props.projects.data);
            } else if (response.data.data) {
                setTrashedProjects(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch trashed projects', error);
            // Optionally set an error state to show the user
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchTrashed();
        }
    }, [open]);

    const handleRestore = (slug: string) => {
        setProcessing(slug);
        router.patch(
            project.restore(slug).url,
            {},
            {
                preserveState: true,
                onSuccess: () => {
                    fetchTrashed();
                    // We should also ideally tell the main page to reload its data
                    // but router.patch already does that.
                },
                onFinish: () => setProcessing(null),
            },
        );
    };

    const handleForceDelete = (slug: string) => {
        if (
            !confirm(
                'Are you sure you want to permanently delete this project? This cannot be undone.',
            )
        )
            return;
        setProcessing(slug);
        router.delete(project.force_delete(slug).url, {
            onSuccess: () => {
                fetchTrashed();
            },
            onFinish: () => setProcessing(null),
        });
    };

    const statusConfig = {
        active: { label: 'Active', variant: 'default' as const },
        completed: { label: 'Completed', variant: 'secondary' as const },
        archived: { label: 'Archived', variant: 'outline' as const },
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col overflow-hidden p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Trash2Icon className="h-6 w-6 text-red-500" />
                            Trash Bin
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={fetchTrashed}
                            disabled={loading}
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                            />
                        </Button>
                    </div>
                    <DialogDescription>
                        Recently deleted projects. They will be permanently
                        removed if you delete them here.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {loading ? (
                        <div className="flex h-40 flex-col items-center justify-center gap-3">
                            <Spinner className="h-8 w-8 text-primary" />
                            <p className="animate-pulse text-sm text-muted-foreground">
                                Loading trashed projects...
                            </p>
                        </div>
                    ) : trashedProjects.length > 0 ? (
                        <div className="space-y-4">
                            {trashedProjects.map((proj) => (
                                <div
                                    key={proj.id}
                                    className="flex flex-col gap-4 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/5 p-4 transition-all hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold line-through opacity-70">
                                                {proj.name}
                                            </h3>
                                            <Badge
                                                variant={
                                                    statusConfig[
                                                        proj.status as keyof typeof statusConfig
                                                    ]?.variant || 'outline'
                                                }
                                                className="h-5 opacity-60"
                                            >
                                                {proj.status}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-foreground/70">
                                                    Deleted:
                                                </span>
                                                {proj.deleted_at
                                                    ? format(
                                                          new Date(
                                                              proj.deleted_at,
                                                          ),
                                                          'MMM d, yyyy HH:mm',
                                                      )
                                                    : 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-foreground/70">
                                                    Owner:
                                                </span>
                                                {proj.owner?.first_name}{' '}
                                                {proj.owner?.last_name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="group h-9 gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
                                            onClick={() =>
                                                handleRestore(proj.slug)
                                            }
                                            disabled={processing === proj.slug}
                                        >
                                            {processing === proj.slug ? (
                                                <Spinner className="h-4 w-4" />
                                            ) : (
                                                <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-45" />
                                            )}
                                            Restore
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                            onClick={() =>
                                                handleForceDelete(proj.slug)
                                            }
                                            disabled={processing === proj.slug}
                                        >
                                            <Trash2Icon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 text-center">
                            <div className="mb-4 rounded-full bg-muted p-4">
                                <Trash2Icon className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-lg font-medium">
                                Your trash is empty
                            </h3>
                            <p className="mt-1 max-w-[250px] text-sm text-muted-foreground">
                                Projects you delete will appear here for a while
                                before being permanently removed.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center border-t bg-muted/5 p-6">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="min-w-[120px]"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectTrashModal;
