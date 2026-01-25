import Heading from '@/components/heading';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import {
    destroy as destroySession,
    history as historyData,
    data as sessionsData,
} from '@/routes/settings/sessions';
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import {
    Clock,
    History,
    Monitor,
    Shield,
    Smartphone,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Login History',
        href: '/settings/sessions',
    },
];

interface SessionData {
    id: string;
    ip_address: string;
    is_current_device: boolean;
    browser: string;
    platform: string;
    device: string;
    is_mobile: boolean;
    is_desktop: boolean;
    last_active: string;
}

interface HistoryData {
    id: number;
    ip_address: string;
    browser: string;
    platform: string;
    device: string;
    is_mobile: boolean;
    is_desktop: boolean;
    login_at: string;
}

export default function LoginHistory() {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [history, setHistory] = useState<HistoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);
    const [activeTab, setActiveTab] = useState<'sessions' | 'history'>(
        'sessions',
    );
    const [sessionToRevoke, setSessionToRevoke] = useState<SessionData | null>(
        null,
    );
    const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(sessionsData().url);
            setSessions(response.data);
        } catch (error) {
            console.error('Failed to fetch sessions', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const response = await axios.get(historyData().url);
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const revokeSession = (session: SessionData) => {
        setSessionToRevoke(session);
        setIsRevokeDialogOpen(true);
    };

    const handleConfirmRevoke = () => {
        if (!sessionToRevoke) return;

        router.delete(destroySession(sessionToRevoke.id).url, {
            onSuccess: () => {
                setSessions(
                    sessions.filter((s) => s.id !== sessionToRevoke.id),
                );
                setIsRevokeDialogOpen(false);
                setSessionToRevoke(null);
            },
        });
    };

    const displayedSessions = sessions.slice(0, visibleCount);
    const hasMore = sessions.length > visibleCount;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Login History" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Login History"
                        description="View and manage your active login sessions and historical login attempts."
                    />

                    <div className="flex items-center gap-1 rounded-lg bg-muted p-1 sm:w-fit">
                        <Button
                            variant={
                                activeTab === 'sessions' ? 'default' : 'ghost'
                            }
                            size="sm"
                            className="flex-1 cursor-pointer sm:flex-none"
                            onClick={() => setActiveTab('sessions')}
                        >
                            Active Sessions
                        </Button>
                        <Button
                            variant={
                                activeTab === 'history' ? 'default' : 'ghost'
                            }
                            size="sm"
                            className="flex-1 cursor-pointer sm:flex-none"
                            onClick={() => {
                                setActiveTab('history');
                                if (history.length === 0) fetchHistory();
                            }}
                        >
                            History
                        </Button>
                    </div>

                    <Card className="border-none shadow-none sm:border sm:shadow-sm">
                        <CardHeader className="px-0 sm:px-6">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                {activeTab === 'sessions' ? (
                                    <>
                                        <Shield className="h-5 w-5 text-primary" />
                                        Active Sessions
                                    </>
                                ) : (
                                    <>
                                        <History className="h-5 w-5 text-primary" />
                                        Recent Login History
                                    </>
                                )}
                            </CardTitle>
                            <CardDescription>
                                {activeTab === 'sessions'
                                    ? 'These are the devices that have recently logged into your account.'
                                    : 'A record of your recent account login attempts.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0 sm:px-6">
                            {(
                                activeTab === 'sessions'
                                    ? loading
                                    : loadingHistory
                            ) ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-4 p-4"
                                        >
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-1/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="divide-y divide-border rounded-lg border border-border">
                                    {activeTab === 'sessions' ? (
                                        displayedSessions.length > 0 ? (
                                            displayedSessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                                            {session.is_mobile ? (
                                                                <Smartphone className="h-5 w-5" />
                                                            ) : (
                                                                <Monitor className="h-5 w-5" />
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-foreground">
                                                                    {
                                                                        session.browser
                                                                    }{' '}
                                                                    on{' '}
                                                                    {
                                                                        session.platform
                                                                    }
                                                                </span>
                                                                {session.is_current_device && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
                                                                    >
                                                                        This
                                                                        device
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Clock className="h-3.5 w-3.5" />
                                                                    {
                                                                        session.last_active
                                                                    }
                                                                </div>
                                                                <div className="hidden h-1 w-1 rounded-full bg-muted-foreground/30 sm:block" />
                                                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                                                    {
                                                                        session.ip_address
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {!session.is_current_device && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                revokeSession(
                                                                    session,
                                                                )
                                                            }
                                                            className="self-start text-destructive hover:bg-destructive/10 hover:text-destructive sm:self-center"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Log out
                                                        </Button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <Shield className="mb-4 h-6 w-6 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    No active sessions found.
                                                </p>
                                            </div>
                                        )
                                    ) : history.length > 0 ? (
                                        history.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                                        {activity.is_mobile ? (
                                                            <Smartphone className="h-5 w-5" />
                                                        ) : (
                                                            <Monitor className="h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                                            {activity.browser}{' '}
                                                            on{' '}
                                                            {activity.platform}
                                                        </div>
                                                        <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {
                                                                    activity.login_at
                                                                }
                                                            </div>
                                                            <div className="hidden h-1 w-1 rounded-full bg-muted-foreground/30 sm:block" />
                                                            <div className="flex items-center gap-1.5 font-mono text-xs">
                                                                {
                                                                    activity.ip_address
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <History className="mb-4 h-6 w-6 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                No login history recorded yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'sessions' &&
                                hasMore &&
                                !loading && (
                                    <div className="mt-6 flex justify-center">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setVisibleCount(
                                                    (prev) => prev + 5,
                                                )
                                            }
                                            className="w-full sm:w-auto"
                                        >
                                            Load more sessions
                                        </Button>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>

            <AlertDialog
                open={isRevokeDialogOpen}
                onOpenChange={setIsRevokeDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will log you out of the session on{' '}
                            <span className="font-medium text-foreground">
                                {sessionToRevoke?.browser} on{' '}
                                {sessionToRevoke?.platform}
                            </span>
                            . You will need to log in again on that device to
                            access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmRevoke}
                            className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Log out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
