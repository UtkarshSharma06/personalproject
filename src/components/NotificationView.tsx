import { Bell, X, Clock, Sparkles, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export default function NotificationView({ isOpen, onClose, title, content, created_at, short_description }: NotificationViewProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[95%] p-0 overflow-hidden border-none bg-transparent shadow-none flex flex-col max-h-[90vh]">
                <VisuallyHidden>
                    <DialogTitle>{title}</DialogTitle>
                </VisuallyHidden>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="flex flex-col flex-1 min-h-0 h-full max-h-full overflow-hidden translate-z-0"
                >
                    {/* Modern Header with Abstract Pattern */}
                    <div className="relative bg-slate-900 dark:bg-slate-950 p-10 rounded-t-[2.5rem] overflow-hidden shrink-0 border-b border-white/5">
                        {/* Abstract Background */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 400 200">
                                <defs>
                                    <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="50%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                                <g stroke="url(#circuit-gradient)" fill="none" strokeWidth="2" opacity="0.3">
                                    <circle cx="50" cy="50" r="20" />
                                    <circle cx="350" cy="150" r="30" />
                                    <circle cx="200" cy="100" r="15" />
                                    <line x1="70" y1="50" x2="185" y2="100" />
                                    <line x1="215" y1="100" x2="320" y2="150" />
                                    <rect x="150" y="30" width="40" height="40" rx="5" />
                                    <rect x="280" y="90" width="30" height="30" rx="5" />
                                </g>
                            </svg>
                        </div>

                        <div className="relative z-10">
                            <button
                                onClick={onClose}
                                className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/10"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-2xl">
                                    <MessageCircle className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                                        <Bell className="w-3 h-3 text-white" />
                                        <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">Update</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight line-clamp-2">{title}</h2>
                                    {short_description && (
                                        <p className="text-white/70 font-medium text-sm mt-1 line-clamp-1">{short_description}</p>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white dark:bg-card rounded-b-[2.5rem] flex flex-col flex-1 min-h-0 overflow-hidden relative border-2 border-slate-100 dark:border-border border-t-0">
                        {/* Scroll Container */}
                        <div className="flex-1 overflow-y-auto min-h-0 scroll-smooth">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-8 md:p-12 prose prose-slate dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>

                        {/* Sticky Footer */}
                        <div className="px-8 py-6 bg-slate-50 dark:bg-muted/50 border-t border-slate-100 dark:border-border shrink-0 z-20">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">ItaloStudy Intelligence</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-xl active:scale-95"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
