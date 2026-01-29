import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    isInTable = false,
}: {
    user: User;
    showEmail?: boolean;
    isInTable?: boolean;
}) {
    const getInitials = useInitials();
    const name = user.first_name + ' ' + user.last_name;

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={`/storage/${user.profile_pic}`} alt={name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(name)}
                </AvatarFallback>
            </Avatar>
            <div
                className={`flex-1 text-left leading-tight ${
                    isInTable
                        ? 'hidden md:flex md:flex-col'
                        : 'flex flex-col gap-0.5'
                }`}
            >
                <span className="truncate text-sm font-medium">{name}</span>

                {showEmail && user?.email && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
