import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import NotificationView from './NotificationView';

export default function LatestNotificationPopup() {
    const { user } = useAuth() as any;
    const { activeExam } = useExam();
    const [latestNotification, setLatestNotification] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (user && activeExam) {
            checkLatestNotification();
        }
    }, [user, activeExam?.id]);

    const checkLatestNotification = async () => {
        if (!user) return;

        // Check if we've already shown a popup in this session
        const sessionShown = sessionStorage.getItem('latest_notif_popup_shown');
        if (sessionShown) return;

        try {
            // 1. Fetch the latest active notification for this exam
            let query = supabase
                .from('site_notifications')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (activeExam?.id) {
                query = query.or(`exam_type.is.null,exam_type.eq.${activeExam.id}`);
            } else {
                query = query.is('exam_type', null);
            }

            const { data: notifs, error } = await query.limit(1);

            if (error || !notifs || notifs.length === 0) return;

            const latest = notifs[0];

            // 2. Check if the user has read this specific notification
            const { data: readStatus } = await supabase
                .from('user_notifications_read')
                .select('*')
                .eq('user_id', user.id)
                .eq('notification_id', latest.id)
                .maybeSingle();

            if (!readStatus) {
                // Not read yet! Show the popup
                setLatestNotification(latest);
                setIsVisible(true);
                // Mark as shown in session to avoid annoying the user on every dashboard visit
                sessionStorage.setItem('latest_notif_popup_shown', 'true');
            }
        } catch (err) {
            console.error('Error checking latest notification:', err);
        }
    };

    const handleClose = async () => {
        setIsVisible(false);

        // Mark as read when dismissed to persist across sessions/devices
        if (latestNotification && user) {
            try {
                const { error } = await supabase.from('user_notifications_read').upsert({
                    user_id: user.id,
                    notification_id: latestNotification.id
                });

                if (error) throw error;
            } catch (err) {
                console.error('Error marking notification as read:', err);
            }
        }
    };

    if (!latestNotification) return null;

    return (
        <NotificationView
            isOpen={isVisible}
            onClose={handleClose}
            title={latestNotification.title}
            content={latestNotification.content_html}
            created_at={latestNotification.created_at}
            short_description={latestNotification.short_description}
        />
    );
}
