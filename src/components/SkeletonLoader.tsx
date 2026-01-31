import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-lg",
                "bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
                className
            )}
        />
    );
};

export const ResourceCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-card rounded-3xl p-6 border border-slate-100 dark:border-border shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-10 h-10 rounded-2xl" />
                <Skeleton className="w-12 h-5 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2 rounded" />
            <Skeleton className="h-4 w-full mb-1 rounded" />
            <Skeleton className="h-4 w-5/6 mb-6 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
        </div>
    );
};

export const ResourcesGridSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <ResourceCardSkeleton key={i} />
            ))}
        </div>
    );
};

// Add shimmer animation
const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.getElementById('skeleton-styles');
    if (!styleElement) {
        const style = document.createElement('style');
        style.id = 'skeleton-styles';
        style.textContent = shimmerStyles;
        document.head.appendChild(style);
    }
}
