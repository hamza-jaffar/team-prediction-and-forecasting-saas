import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchModal } from './search-modal';
import { Button } from './ui/button';
import { Kbd, KbdGroup } from './ui/kbd';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpenSearchModal(!openSearchModal);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <Button
                onClick={() => setOpenSearchModal(!openSearchModal)}
                className="ml-auto w-fit cursor-pointer justify-between sm:w-[250px] md:w-full md:max-w-xs"
                variant="outline"
            >
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                </div>
                <KbdGroup className="hidden sm:flex">
                    <Kbd>Ctrl / ⌘</Kbd>
                    <span>+</span>
                    <Kbd>K</Kbd>
                </KbdGroup>
            </Button>

            {openSearchModal && (
                <SearchModal
                    open={openSearchModal}
                    setOpen={setOpenSearchModal}
                />
            )}
        </header>
    );
}
