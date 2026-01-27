
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Calendar, ChevronRight, Loader2, Megaphone, Inbox } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useExam } from '@/context/ExamContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface Notification {
    id: string;
    title: string | null;
    short_description: string | null;
    content_html: string;
    created_at: string;
    exam_type: string | null;
    show_minimal: boolean;
}

const MobileNotifications = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { activeExam } = useExam();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, [activeExam.id]);

    const fetchNotifications = async () => {
        try {
            let query = supabase
                .from('site_notifications')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;

            // Client-side filter for flexibility or if complex OR logic needed
            const filtered = (data || []).filter((n: Notification) =>
                !n.exam_type || n.exam_type === activeExam.id
            );

            setNotifications(filtered);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Mark as read when viewing
    useEffect(() => {
        if (selectedNotif && user) {
            const markAsRead = async () => {
                try {
                    await supabase.from('user_notifications_read').upsert({
                        user_id: user.id,
                        notification_id: selectedNotif.id
                    });
                } catch (e) {
                    console.error("Error marking as read:", e);
                }
            };
            markAsRead();
        }
    }, [selectedNotif?.id, user?.id]);

    return (
        <div className="flex flex-col min-h-full bg-background pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="px-6 py-6 pt-12 flex items-center gap-4 bg-background/80 backdrop-blur-md sticky top-0 z-10 border-b border-border/10">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
                    <ArrowLeft />
                </Button>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight">Inbox</h1>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {notifications.length} Announcements
                    </p>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-xs uppercase font-black tracking-widest">Syncing...</span>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                            <Inbox className="w-10 h-10 opacity-20" />
                        </div>
                        <h3 className="font-black uppercase tracking-widest text-sm">All Caught Up</h3>
                        <p className="text-xs max-w-[200px] text-center mt-2 opacity-60">No new announcements from command.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => setSelectedNotif(notif)}
                            className="group relative overflow-hidden bg-white/50 dark:bg-card border border-border/20 rounded-[2rem] p-6 active:scale-[0.98] transition-all shadow-sm hover:shadow-md hover:border-primary/30"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <Megaphone size={120} className="transform rotate-12 -translate-y-8 translate-x-8" />
                            </div>

                            <div className="relative z-10 flex gap-5">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                        <Bell size={24} className={cn(notif.exam_type ? "animate-pulse" : "")} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5 leading-none">
                                            <Calendar size={11} />
                                            {format(new Date(notif.created_at), 'MMM d, yyyy')}
                                        </span>
                                        {notif.exam_type && (
                                            <span className="bg-rose-500/10 text-rose-500 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest leading-none border border-rose-500/10">
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-[17px] font-black text-foreground leading-tight mb-2 pr-2">{notif.title || "Announcement"}</h3>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide line-clamp-1 opacity-70">
                                        {notif.short_description || "Tap to view details..."}
                                    </p>
                                </div>
                                <div className="self-center">
                                    <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-muted-foreground/40 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Dialog */}
            <Dialog open={!!selectedNotif} onOpenChange={(open) => !open && setSelectedNotif(null)}>
                <DialogContent className="max-w-[90vw] w-full rounded-[2rem] p-0 overflow-hidden bg-background border-border/10">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-black uppercase tracking-tight leading-tight">
                            {selectedNotif?.title}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                            {selectedNotif && format(new Date(selectedNotif.created_at), 'MMMM d, yyyy')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 pb-8 max-h-[70vh] overflow-y-auto">
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-muted-foreground prose-a:text-indigo-500 prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: selectedNotif?.content_html || "" }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MobileNotifications;
