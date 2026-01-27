
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, BarChart3, Settings, Menu, Bell, Search, Play, Users } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import { Button } from '@/components/ui/button';
import LatestNotificationPopup from '@/components/LatestNotificationPopup';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';

interface NavButtonProps {
  to: string;
  icon: React.ReactNode;
  badge?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ to, icon, badge }) => {
  const location = useLocation();

  // Use a more predictable matching logic
  const currentPath = location.pathname;
  const isActive = currentPath === to ||
    (to !== '/mobile/dashboard' && to !== '/' && currentPath.startsWith(to + '/')) ||
    (to === '/mobile/practice' && currentPath.startsWith('/mobile/practice'));

  return (
    <NavLink
      to={to}
      className="flex-1 flex flex-col items-center justify-center h-full relative"
    >
      <div className="flex items-center justify-center w-full h-full relative">
        <motion.div
          animate={{
            y: isActive ? -4 : 0,
            scale: isActive ? 1.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "relative p-3.5 rounded-2xl transition-colors duration-300 z-10",
            isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground"
          )}
        >
          {React.cloneElement(icon as React.ReactElement, { size: 24 })}
          {badge && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </motion.div>
      </div>
    </NavLink>
  );
};

const MobileLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNative, setIsNative] = useState<boolean | null>(null);
  const [hasUnreadCommunity, setHasUnreadCommunity] = useState(false);
  const [hasUnreadAnnouncement, setHasUnreadAnnouncement] = useState(false);
  const { user } = useAuth();
  const { activeExam } = useExam();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !activeExam) return;

    const checkUnreadAnnouncements = async () => {
      try {
        let query = supabase
          .from('site_notifications')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true);

        if (activeExam?.id) {
          query = query.or(`exam_type.is.null,exam_type.eq.,exam_type.eq.${activeExam.id}`);
        } else {
          query = query.or('exam_type.is.null,exam_type.eq.');
        }

        const { count: totalActive } = await query;

        const { count: readCount } = await supabase
          .from('user_notifications_read')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Simple check: if read count is less than total active notifications targeting user
        // Note: This is an approximation. A more precise check would be:
        const { data: activeIds } = await query.select('id');
        const activeIdsList = (activeIds as any)?.map((n: any) => n.id) || [];

        if (activeIdsList.length === 0) {
          setHasUnreadAnnouncement(false);
          return;
        }

        const { data: readIds } = await supabase
          .from('user_notifications_read')
          .select('notification_id')
          .eq('user_id', user.id)
          .in('notification_id', activeIdsList);

        const readIdsList = (readIds as any)?.map((n: any) => n.notification_id) || [];
        setHasUnreadAnnouncement(activeIdsList.length > readIdsList.length);
      } catch (err) {
        console.error('Error checking unread announcements:', err);
      }
    };

    checkUnreadAnnouncements();

    const notifChannel = supabase
      .channel('announcement_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_notifications' }, () => checkUnreadAnnouncements())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_notifications_read', filter: `user_id=eq.${user.id}` }, () => checkUnreadAnnouncements())
      .subscribe();

    return () => {
      supabase.removeChannel(notifChannel);
    };
  }, [user, activeExam?.id]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('broadcast_unread')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'community_messages'
      }, (payload) => {
        if (location.pathname !== '/community' && payload.new.user_id !== user.id) {
          setHasUnreadCommunity(true);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, location.pathname]);

  // Clear when entering community
  useEffect(() => {
    if (location.pathname === '/community') {
      setHasUnreadCommunity(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkPlatform = async () => {
      try {
        const { Device } = await import('@capacitor/device');
        const info = await Device.getInfo();
        setIsNative(info.platform === 'android' || info.platform === 'ios');
      } catch (e) {
        setIsNative(false);
      }
    };
    checkPlatform();
  }, []);

  // Map path to title
  const getPageTitle = (path: string) => {
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('practice')) return 'Practice';
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('history')) return 'History';
    if (path.includes('learning')) return 'Study Portal';
    if (path.includes('labs')) return 'Virtual Labs';
    if (path.includes('community')) return 'Community';
    return 'ITALOSTUDY';
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Persistent Native Header */}
      <header className="pt-[env(safe-area-inset-top)] h-[calc(4rem+env(safe-area-inset-top))] flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-full hover:bg-secondary active:scale-90 transition-transform"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tight uppercase leading-none truncate max-w-[150px]">
              {getPageTitle(location.pathname)}
            </h1>
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-1 opacity-60">Student Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/notifications')}
            className="relative rounded-full hover:bg-secondary active:scale-95 transition-transform"
          >
            <Bell className="w-5 h-5" />
            {hasUnreadAnnouncement && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
            )}
          </Button>
          <LatestNotificationPopup />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32">
        <Outlet />
      </main>

      <MobileSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Premium Floating Bottom Deck */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-50 pointer-events-none">
        <nav className="max-w-md mx-auto h-20 bg-background/95 backdrop-blur-3xl border border-white/20 rounded-[2rem] flex items-center justify-around px-1 shadow-[0_25px_60px_rgba(0,0,0,0.6)] pointer-events-auto overflow-hidden">
          <NavButton to="/mobile/dashboard" icon={<Home />} />
          <NavButton to="/mobile/practice" icon={<ClipboardList />} />
          <NavButton to="/learning" icon={<Play />} />
          <NavButton to="/mobile/analytics" icon={<BarChart3 />} />
          <NavButton
            to="/community"
            icon={<Users />}
            badge={hasUnreadCommunity}
          />
        </nav>
      </div>
    </div>
  );
};

export default MobileLayout;
