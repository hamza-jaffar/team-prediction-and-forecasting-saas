import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Task } from '@/types/task';
import { Loader2Icon } from 'lucide-react';

interface DeleteTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
    onConfirm: (option: 'soft' | 'permanent') => void;
    isLoading?: boolean;
}

const DeleteTaskDialog = ({
    open,
    onOpenChange,
    task,
    onConfirm,
    isLoading = false,
}: DeleteTaskDialogProps) => {
    if (!task) return null;

    const isTrashed = !!task.deleted_at;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isTrashed
                            ? 'Permanently Delete Task?'
                            : 'Delete Task?'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isTrashed ? (
                            <>
                                Are you sure you want to permanently delete "
                                <strong>{task.title}</strong>"? This action
                                cannot be undone and all data will be lost
                                forever.
                            </>
                        ) : (
                            <>
                                Are you sure you want to delete "
                                <strong>{task.title}</strong>"? You can restore
                                it from the trash later if needed.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>
                    {isTrashed ? (
                        <AlertDialogAction
                            onClick={() => onConfirm('permanent')}
                            disabled={isLoading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading && (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Permanently Delete
                        </AlertDialogAction>
                    ) : (
                        <AlertDialogAction
                            onClick={() => onConfirm('soft')}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Move to Trash
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteTaskDialog;
