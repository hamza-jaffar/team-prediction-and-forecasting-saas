import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { Project } from '@/types/project';
import { useState } from 'react';

interface DeleteProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    onConfirm: (option: 'soft' | 'permanent') => void;
    isLoading?: boolean;
}

const DeleteProjectDialog = ({
    open,
    onOpenChange,
    project,
    onConfirm,
    isLoading = false,
}: DeleteProjectDialogProps) => {
    const [deleteOption, setDeleteOption] = useState<'soft' | 'permanent'>(
        'soft',
    );

    const handleConfirm = () => {
        onConfirm(deleteOption);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                        {project?.name} will be{' '}
                        {deleteOption === 'soft'
                            ? 'moved to trash. You can restore it later if needed.'
                            : 'permanently deleted. This action cannot be undone.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                            style={{
                                borderColor:
                                    deleteOption === 'soft'
                                        ? 'hsl(var(--primary))'
                                        : 'hsl(var(--border))',
                                backgroundColor:
                                    deleteOption === 'soft'
                                        ? 'hsl(var(--primary) / 0.1)'
                                        : 'transparent',
                            }}
                        >
                            <input
                                type="radio"
                                name="deleteOption"
                                value="soft"
                                checked={deleteOption === 'soft'}
                                onChange={(e) =>
                                    setDeleteOption(
                                        e.target.value as 'soft' | 'permanent',
                                    )
                                }
                                disabled={isLoading}
                            />
                            <div className="flex-1">
                                <span className="block text-sm font-medium">
                                    Move to Trash
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Can be restored anytime
                                </span>
                            </div>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                            style={{
                                borderColor:
                                    deleteOption === 'permanent'
                                        ? 'hsl(var(--destructive))'
                                        : 'hsl(var(--border))',
                                backgroundColor:
                                    deleteOption === 'permanent'
                                        ? 'hsl(var(--destructive) / 0.1)'
                                        : 'transparent',
                            }}
                        >
                            <input
                                type="radio"
                                name="deleteOption"
                                value="permanent"
                                checked={deleteOption === 'permanent'}
                                onChange={(e) =>
                                    setDeleteOption(
                                        e.target.value as 'soft' | 'permanent',
                                    )
                                }
                                disabled={isLoading}
                            />
                            <div className="flex-1">
                                <span className="block text-sm font-medium">
                                    Permanently Delete
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Cannot be restored
                                </span>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="flex gap-3">
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                    >
                        {isLoading && <Spinner className="h-4 w-4" />}
                        Delete
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteProjectDialog;
