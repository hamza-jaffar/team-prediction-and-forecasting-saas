import { Button } from '@/components/ui/button';
import { PaginationLink, Team } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface TaskPaginationProps {
    links: PaginationLink[];
    queryParams?: any;
    team?: Team | null;
}

const TaskPagination = ({ links, queryParams, team }: TaskPaginationProps) => {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0].url && (
                    <Link href={links[0].url}>
                        <Button variant="outline" size="sm">
                            Previous
                        </Button>
                    </Link>
                )}
                {links[links.length - 1].url && (
                    <Link href={links[links.length - 1].url}>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </Link>
                )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Showing page{' '}
                        <span className="font-medium">
                            {links.findIndex((link) => link.active) || 1}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{links.length - 2}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        {links.map((link, index) => {
                            if (index === 0) {
                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium ${
                                            link.url
                                                ? 'text-foreground hover:bg-muted'
                                                : 'cursor-not-allowed text-muted-foreground'
                                        }`}
                                    >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                    </Link>
                                );
                            }

                            if (index === links.length - 1) {
                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium ${
                                            link.url
                                                ? 'text-foreground hover:bg-muted'
                                                : 'cursor-not-allowed text-muted-foreground'
                                        }`}
                                    >
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                        link.active
                                            ? 'z-10 bg-primary text-primary-foreground'
                                            : 'text-foreground hover:bg-muted'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default TaskPagination;
