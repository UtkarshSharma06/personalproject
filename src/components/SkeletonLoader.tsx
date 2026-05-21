import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-premium-blink bg-slate-200/80 dark:bg-slate-800/80 rounded-lg shadow-inner",
                className
            )}
        />
    );
};

export const AuthorityPageSkeleton = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-40 md:pt-8 animate-in fade-in duration-700">
            <main className="container mx-auto px-4 pb-12">
                <Skeleton className="h-6 w-48 mb-8 rounded-full" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-16">
                        {/* Hero Section */}
                        <div className="space-y-8">
                            <Skeleton className="h-6 w-40 rounded-full" />
                            <Skeleton className="h-20 w-3/4 rounded-3xl" />
                            <Skeleton className="h-8 w-full rounded-2xl" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className="h-24 rounded-2xl" />
                                ))}
                            </div>
                        </div>

                        {/* Content Blocks */}
                        <div className="space-y-8">
                            <Skeleton className="h-64 w-full rounded-[3rem]" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} className="h-48 rounded-[2rem]" />
                                ))}
                            </div>
                            <Skeleton className="h-56 w-full rounded-[3rem]" />
                        </div>

                        {/* FAQ Style List */}
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-64 rounded-xl mb-4" />
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} className="h-24 w-full rounded-3xl" />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 hidden lg:block space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
                            <Skeleton className="h-64 w-full rounded-[2.5rem]" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export const ResourcesGridSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 h-[400px] relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <Skeleton className="w-14 h-14 rounded-2xl" />
                        <Skeleton className="w-20 h-6 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-32 rounded-full mb-4" />
                    <Skeleton className="h-10 w-full rounded-2xl mb-4" />
                    <Skeleton className="h-4 w-full rounded-full mb-2" />
                    <Skeleton className="h-4 w-2/3 rounded-full mb-10" />
                    <Skeleton className="h-14 w-full rounded-2xl mt-auto" />
                </div>
            ))}
        </div>
    );
};

export const ResourceDetailSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl animate-in fade-in duration-700">
            <div className="space-y-8">
                <Skeleton className="h-4 w-32 rounded-full" />
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border-2 border-slate-100 dark:border-slate-800 relative overflow-hidden h-64 flex flex-col items-center justify-center space-y-6">
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-12 w-3/4 rounded-2xl" />
                    <Skeleton className="h-4 w-48 rounded-full" />
                </div>

                <div className="space-y-6">
                    <Skeleton className="h-4 w-40 rounded-full" />
                    <Skeleton className="h-32 w-full rounded-[2.5rem]" />
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 h-56 w-full rounded-[3rem] relative overflow-hidden">
                </div>
            </div>
        </div>
    );
};

export const BlogSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border-2 border-slate-100 rounded-[3rem] p-6 shadow-sm overflow-hidden relative group">
                    <div className="relative z-10">
                        <div className="aspect-[4/3] bg-slate-50 rounded-[2rem] mb-6" />
                        <div className="h-4 bg-slate-50 rounded-full w-2/3 mb-4" />
                        <div className="space-y-2">
                            <div className="h-3 bg-slate-50 rounded-full w-full" />
                            <div className="h-3 bg-slate-50 rounded-full w-4/5" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const PricingSkeleton = () => {
    return (
        <div className="container mx-auto px-6 py-24 space-y-12">
            <div className="text-center space-y-4">
                <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
                <Skeleton className="h-4 w-96 mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-8 rounded-[3rem] border border-slate-100 bg-white shadow-sm space-y-6">
                        <Skeleton className="h-8 w-32 rounded-xl" />
                        <Skeleton className="h-12 w-24 rounded-2xl" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(j => (
                                <div key={j} className="flex gap-2">
                                    <Skeleton className="w-5 h-5 rounded-full" />
                                    <Skeleton className="h-4 flex-1 rounded-full" />
                                </div>
                            ))}
                        </div>
                        <Skeleton className="h-12 w-full rounded-2xl" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const GlobalSkeleton = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6 p-6">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2 text-center">
                <Skeleton className="h-4 w-48 rounded-full" />
                <Skeleton className="h-2 w-32 mx-auto rounded-full opacity-50" />
            </div>
        </div>
    );
};

// Mocking unused skeletons for backward compatibility in lib/skeletons.tsx if needed
export const SubjectsGridSkeleton = () => <GlobalSkeleton />;
export const AnalyticsSkeleton = () => <GlobalSkeleton />;
export const StoreGridSkeleton = () => <GlobalSkeleton />;
export const MockExamsSkeleton = () => <GlobalSkeleton />;
export const TestListSkeleton = () => <GlobalSkeleton />;
export const HistorySkeleton = () => <GlobalSkeleton />;
export const NotificationSkeleton = () => <GlobalSkeleton />;
export const LabSkeleton = () => <GlobalSkeleton />;
export const SettingsSkeleton = () => <GlobalSkeleton />;
export const CommunitySkeleton = () => <GlobalSkeleton />;
export const LearningSkeleton = () => <GlobalSkeleton />;
export const ProfileSkeleton = () => <GlobalSkeleton />;
export const BookmarkSkeleton = () => <GlobalSkeleton />;
export const StorePageSkeleton = () => <GlobalSkeleton />;
export const DashboardSkeleton = () => <GlobalSkeleton />;
