import { Check, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// VisuallyHidden component for accessibility
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
    <span className="sr-only">{children}</span>
);

interface NotificationViewProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    created_at?: string;
    short_description?: string;
    show_minimal?: boolean;
}

export default function NotificationView({
    isOpen,
    onClose,
    title,
    content,
    created_at,
    show_minimal = false
}: NotificationViewProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[440px] w-[95%] p-0 overflow-hidden border border-slate-100 bg-white rounded-lg shadow-[0_24px_64px_-12px_rgba(0,0,0,0.08)] flex flex-col max-h-[85vh] [&>button]:hidden">
                <VisuallyHidden>
                    <DialogTitle>{title || 'Notification'}</DialogTitle>
                </VisuallyHidden>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col h-full max-h-full overflow-hidden"
                >
                    <div className={cn(
                        "flex flex-col h-full max-h-full w-full overflow-hidden",
                        show_minimal ? "p-0" : "pt-4 px-4 pb-4 md:pt-5 md:px-8 md:pb-8"
                    )}>
                        {/* 1. Header Section - Fixed & Centered */}
                        {!show_minimal && title && (
                            <div className="shrink-0 mb-6 mt-0 w-full flex justify-center">
                                <div className="relative w-full flex items-center justify-between gap-3 px-5 py-4 bg-white rounded-2xl shadow-[0_15px_45px_-10px_rgba(0,0,0,0.15),inset_0_-8px_12px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.05)] border border-slate-50 group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/30 to-slate-50/60 rounded-2xl" />
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent opacity-50" />

                                    <div className="relative flex flex-col gap-0.5 flex-1 min-w-0">
                                        <h3 className="text-lg md:text-2xl font-[1000] text-slate-900 tracking-tighter leading-tight uppercase truncate">
                                            {title}
                                        </h3>
                                        {created_at && (
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                {format(new Date(created_at), 'MMMM d, yyyy')}
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative shrink-0 p-2 bg-indigo-50 rounded-full border border-indigo-100/50 shadow-sm">
                                        <Bell className="w-4 h-4 text-indigo-600 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Content Section - Scrollable */}
                        <div className={cn(
                            "flex-1 overflow-y-auto custom-scrollbar min-h-0 w-full",
                            show_minimal ? "" : "px-0 pb-4"
                        )}>
                            <div
                                className={cn(
                                    "w-full overflow-x-hidden break-words",
                                    !show_minimal && "prose prose-sm dark:prose-invert prose-headings:font-black prose-p:text-slate-600 prose-img:rounded-3xl prose-img:mx-auto prose-strong:text-indigo-600 font-bold leading-relaxed text-center px-1"
                                )}
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>

                        {/* 3. Action Section - Pinned Bottom */}
                        <div className={`shrink-0 w-full flex justify-center ${show_minimal ? 'pb-6 pt-2' : 'pt-6 mt-4 border-t border-slate-50'}`}>
                            <button
                                onClick={onClose}
                                className="w-fit px-12 h-18 bg-indigo-600 hover:bg-indigo-700 text-white font-[1000] uppercase tracking-[0.2em] text-[13px] rounded-xl transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 active:scale-[0.98] group"
                            >
                                <Check className="w-6 h-6 transition-transform group-hover:scale-110" />
                                Understood
                            </button>
                        </div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
