import { useState, useEffect } from 'react';
import { Bell, X, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationView from './NotificationView';

interface Notification {
    id: string;
    title: string;
    short_description: string;
    content_html: string;
    created_at: string;
    exam_type: string | null;
    is_read?: boolean;
}

export default function NotificationDropdown() {
    const { user } = useAuth() as any;
    const { activeExam } = useExam();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isNotificationViewOpen, setIsNotificationViewOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const subscription = supabase
                .channel('public:site_notifications')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'site_notifications' }, () => {
                    fetchNotifications();
                })
                .subscribe();

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [user, activeExam?.id]);

    const fetchNotifications = async () => {
        if (!user) return;

        // Fetch active notifications filtered by exam type
        let query = supabase
            .from('site_notifications')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        // Filter by exam type: current exam OR general (null)
        if (activeExam?.id) {
            query = query.or(`exam_type.is.null,exam_type.eq.${activeExam.id}`);
        } else {
            query = query.is('exam_type', null);
        }

        const { data: notifs, error: notifError } = await query.limit(10);

        if (notifError) {
            console.error('Error fetching notifications:', notifError);
            return;
        }

        // Fetch read status for this user
        const { data: readStatus } = await supabase
            .from('user_notifications_read')
            .select('notification_id')
            .eq('user_id', user.id);

        const readIds = new Set((readStatus || []).map(r => r.notification_id));

        const processedNotifs = (notifs || []).map(n => ({
            ...n,
            is_read: readIds.has(n.id)
        }));

        setNotifications(processedNotifs);
        setUnreadCount(processedNotifs.filter(n => !n.is_read).length);
    };

    const markAsRead = async (notificationId: string) => {
        if (!user) return;

        // Optimistic Update
        setNotifications(prev => prev.map(n =>
            n.id === notificationId ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            const { error } = await supabase
                .from('user_notifications_read')
                .upsert({
                    user_id: user.id,
                    notification_id: notificationId
                });

            if (error) {
                // Rollback if error
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            fetchNotifications();
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        setSelectedNotification(notification);
        setIsNotificationViewOpen(true);
        // Delay closing the dropdown slightly to allow for a smoother transition feel
        setTimeout(() => setIsOpen(false), 150);
    };

    if (!user) return null;

    if (!user) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group shadow-sm hover:shadow-lg active:scale-95"
            >
                <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400 group-hover:text-indigo-600'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-pulse ring-2 ring-white dark:ring-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-20 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] max-h-[calc(100vh-120px)] sm:max-h-[600px] z-50 flex flex-col pointer-events-auto"
                        >
                            {/* Premium Header Card */}
                            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 rounded-t-3xl shadow-2xl relative overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                            <Bell className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-tight">Bulletin Board</h4>
                                            <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest">
                                                {unreadCount > 0 ? `${unreadCount} Unread` : `${notifications.length} Total`}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="bg-white dark:bg-card rounded-b-3xl shadow-2xl border-2 border-slate-100 dark:border-border border-t-0 overflow-y-auto flex-1 min-h-0">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">All Caught Up!</p>
                                        <p className="text-[10px] font-bold text-slate-300 mt-2">No new notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-border">
                                        {notifications.map((notification) => (
                                            <motion.button
                                                key={notification.id}
                                                whileHover={{ x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`w-full p-5 transition-all group text-left relative border-l-4 ${notification.is_read
                                                    ? 'hover:bg-slate-50 dark:hover:bg-slate-900/20 border-l-transparent'
                                                    : 'bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-white dark:hover:bg-slate-900 border-l-indigo-500 shadow-sm'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h5 className={`text-sm font-black line-clamp-1 transition-colors ${notification.is_read
                                                                ? 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600'
                                                                : 'text-indigo-900 dark:text-indigo-300 group-hover:text-indigo-600'
                                                                }`}>
                                                                {notification.title}
                                                            </h5>
                                                            {!notification.is_read && (
                                                                <span className="shrink-0 w-2 h-2 bg-indigo-500 rounded-full" />
                                                            )}
                                                        </div>
                                                        {notification.short_description && (
                                                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2 line-clamp-2 leading-relaxed">
                                                                {notification.short_description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <Clock className="w-3 h-3" />
                                                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 group-hover:translate-x-1 transition-all shrink-0 mt-1 ${notification.is_read ? 'text-slate-300' : 'text-indigo-400'
                                                        }`} />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-100 dark:border-border bg-slate-50 dark:bg-muted shrink-0 rounded-b-3xl">
                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Updates Deploy in Real-Time</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {selectedNotification && (
                <NotificationView
                    isOpen={isNotificationViewOpen}
                    onClose={() => setIsNotificationViewOpen(false)}
                    title={selectedNotification.title}
                    content={selectedNotification.content_html}
                    created_at={selectedNotification.created_at}
                    short_description={selectedNotification.short_description}
                />
            )}
        </>
    );
}
