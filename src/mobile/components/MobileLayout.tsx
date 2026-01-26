import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, ClipboardList, BarChart3, Settings, Menu, Bell, Search, Play, Users } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import { Button } from '@/components/ui/button';
import LatestNotificationPopup from '@/components/LatestNotificationPopup';

const MobileLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNative, setIsNative] = useState<boolean | null>(null);
  const location = useLocation();

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
    if (path.includes('practice')) return 'Practice Arena';
    if (path.includes('analytics')) return 'Statistics';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('history')) return 'History';
    if (path.includes('learning')) return 'Study Portal';
    if (path.includes('labs')) return 'Virtual Labs';
    if (path.includes('community')) return 'Study Squads';
    return 'ITALOSTUDY';
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Persistent Native Header */}
      <header className="h-16 flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40 shrink-0">
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

        <div className="flex items-center gap-1">
          <LatestNotificationPopup />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      <MobileSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Premium Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-around px-2 z-50">
        <NavButton to="/mobile/dashboard" icon={<Home className="w-6 h-6" />} label="Home" />
        <NavButton to="/mobile/practice" icon={<ClipboardList className="w-6 h-6" />} label="Practice" />
        <NavButton to="/learning" icon={<Play className="w-6 h-6" />} label="Learning" />
        <NavButton to="/mobile/analytics" icon={<BarChart3 className="w-6 h-6" />} label="Analytics" />
        <NavButton to="/mobile/settings" icon={<Settings className="w-6 h-6" />} label="Settings" />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 w-16 h-16 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            {icon}
            {isActive && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
            )}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default MobileLayout;
