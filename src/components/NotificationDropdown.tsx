import { useState, useEffect } from 'react';
import { Bell, X, Clock, Sparkles, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationView from './NotificationView';

interface Notification {
    id: string;
    title: string | null;
    short_description: string | null;
    content_html: string;
    created_at: string;
    exam_type: string | null;
    is_read?: boolean;
    show_minimal?: boolean;
}

export default function NotificationDropdown() {
    const navigate = useNavigate();
    const { user } = useAuth() as any;
    const { activeExam } = useExam();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isNotificationViewOpen, setIsNotificationViewOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
    const [isLoadingAll, setIsLoadingAll] = useState(false);

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

        // Filter by exam type: current exam OR general (null or empty string)
        if (activeExam?.id) {
            query = query.or(`exam_type.is.null,exam_type.eq.,exam_type.eq.${activeExam.id}`);
        } else {
            query = query.or('exam_type.is.null,exam_type.eq.');
        }

        const { data: notifs, error: notifError } = await query.limit(3);

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

    const fetchAllNotifications = async () => {
        if (!user) return;
        setIsLoadingAll(true);

        let query = supabase
            .from('site_notifications')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (activeExam?.id) {
            query = query.or(`exam_type.is.null,exam_type.eq.,exam_type.eq.${activeExam.id}`);
        } else {
            query = query.or('exam_type.is.null,exam_type.eq.');
        }

        const { data: notifs, error } = await query;

        if (error) {
            console.error('Error fetching all notifications:', error);
            setIsLoadingAll(false);
            return;
        }

        const { data: readStatus } = await supabase
            .from('user_notifications_read')
            .select('notification_id')
            .eq('user_id', user.id);

        const readIds = new Set((readStatus || []).map(r => r.notification_id));

        const processedNotifs = (notifs || []).map(n => ({
            ...n,
            is_read: readIds.has(n.id)
        }));

        setAllNotifications(processedNotifs);
        setIsLoadingAll(false);
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
                            className="fixed top-20 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[350px] max-h-[calc(100vh-120px)] sm:max-h-[500px] z-50 flex flex-col pointer-events-auto"
                        >
                            {/* Bulletin Board Header Case-Study Style */}
                            <div className="bg-white px-5 py-4 rounded-t-[24px] border-b border-slate-50 relative overflow-hidden shrink-0">
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50/50 flex items-center justify-center">
                                            <Bell className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <h4 className="text-lg font-[1000] text-slate-900 tracking-tight uppercase italic">Live Feed</h4>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-all group"
                                    >
                                        <X className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
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
                                    <div className="divide-y divide-slate-50 dark:divide-border/50">
                                        {notifications.map((notification) => (
                                            <motion.button
                                                key={notification.id}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => handleNotificationClick(notification)}
                                                className="w-full p-4 transition-all group text-left relative flex items-center gap-4 hover:bg-slate-50/50"
                                            >
                                                <div className="shrink-0 w-10 h-10 bg-indigo-50/80 rounded-full flex items-center justify-center">
                                                    <div className="w-5 h-5 rounded-full border-2 border-indigo-200 flex items-center justify-center text-indigo-600">
                                                        <span className="text-[10px] font-[1000] italic">i</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[14px] font-[1000] text-slate-800 leading-tight tracking-tight truncate uppercase italic">
                                                        {notification.title || 'Update'}
                                                    </h5>

                                                    {notification.short_description && (
                                                        <p className="text-[11px] font-bold text-slate-400 mt-1.5 line-clamp-1 leading-snug tracking-tight">
                                                            {notification.short_description}
                                                        </p>
                                                    )}
                                                </div>

                                                {!notification.is_read && (
                                                    <div className="shrink-0 w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                            </div>

                            {/* Bulletin Board Footer */}
                            <div className="p-4 border-t border-slate-50 bg-white shrink-0 rounded-b-[24px] flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsExpanded(true);
                                        fetchAllNotifications();
                                    }}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors group/btn"
                                >
                                    <span className="text-[13px] font-[1000] tracking-tight uppercase italic">View All Feed</span>
                                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Expanded Hover Card Overlay */}
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                            onClick={() => setIsExpanded(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[500px] sm:max-h-[80vh] bg-white rounded-[2.5rem] shadow-2xl z-[70] flex flex-col overflow-hidden border-2 border-slate-100 border-b-[10px]"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <Bell className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-[1000] text-slate-900 tracking-tight uppercase italic">Notification Center</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete history of updates</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-all group"
                                >
                                    <X className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
                                {isLoadingAll ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Syncing Feed...</p>
                                    </div>
                                ) : allNotifications.length === 0 ? (
                                    <div className="text-center py-20">
                                        <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Feed Empty</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {allNotifications.map((notification) => (
                                            <motion.button
                                                key={notification.id}
                                                whileHover={{ y: -2 }}
                                                onClick={() => {
                                                    handleNotificationClick(notification);
                                                    setIsExpanded(false);
                                                }}
                                                className={`w-full p-6 bg-white rounded-3xl border-2 transition-all text-left flex items-start gap-4 hover:shadow-xl ${!notification.is_read ? 'border-indigo-600 border-b-8' : 'border-slate-100 border-b-4'
                                                    }`}
                                            >
                                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!notification.is_read ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'
                                                    }`}>
                                                    <Bell className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className={`text-base font-[1000] tracking-tight uppercase italic truncate ${!notification.is_read ? 'text-indigo-600' : 'text-slate-900'
                                                            }`}>
                                                            {notification.title || 'Broadcast'}
                                                        </h4>
                                                        <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">
                                                            {new Date(notification.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 line-clamp-2 leading-relaxed">
                                                        {notification.short_description || 'Click to view details.'}
                                                    </p>
                                                </div>
                                                {!notification.is_read && (
                                                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse mt-1" />
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
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
                    show_minimal={selectedNotification.show_minimal}
                />
            )}
        </>
    );
}
