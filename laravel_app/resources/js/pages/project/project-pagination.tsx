import { Button } from '@/components/ui/button';
import { PaginationLink } from '@/types';
import { router } from '@inertiajs/react';

interface ProjectPaginationProps {
    links: PaginationLink[];
    queryParams?: any;
}

const ProjectPagination = ({
    links,
    queryParams,
}: ProjectPaginationProps) => {
    return (
        <div className="flex items-center justify-end space-x-2 px-4 py-4">
            {links.map((link, i) => (
                <Button
                    key={i}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    onClick={() =>
                        link.url && router.get(link.url, queryParams)
                    }
                    dangerouslySetInnerHTML={{
                        __html: link.label,
                    }}
                />
            ))}
        </div>
    );
};

export default ProjectPagination;
