import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    BookOpen,
    Clock,
    LogOut,
    Brain,
    Menu,
    X,
    Globe,
    BarChart3,
    ChevronDown,
    Award,
    Bell,
    Settings,
    User,
    Play,
    Loader2,
    MessageCircle,
    Users,
    FlaskConical,
    Bookmark,
    Hash
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExam } from '@/context/ExamContext';
import { EXAMS } from '@/config/exams';
import { MandatoryFeedbackModal } from './MandatoryFeedbackModal';
import { useMandatoryFeedback } from '@/hooks/useMandatoryFeedback';
import { FeedbackDialog } from './FeedbackDialog';
import { AuthModal } from '@/components/auth/AuthModal';

interface LayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    showHeader?: boolean;
}

export default function Layout({ children, showFooter = true, showHeader = true }: LayoutProps) {
    const { user, signOut, profile } = useAuth() as any;
    const { activeExam, setActiveExam } = useExam();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncTarget, setSyncTarget] = useState("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkPlatform = async () => {
            try {
                const { Device } = await import('@capacitor/device');
                const info = await Device.getInfo();
                // Strictly Native App detection
                setIsMobile(info.platform === 'android' || info.platform === 'ios');
            } catch (e) {
                setIsMobile(false);
            }
        };
        checkPlatform();
    }, []);

    const handleExamSwitch = (exam: any) => {
        setIsSyncing(true);
        setSyncTarget(exam.name);
        setTimeout(() => {
            setActiveExam(exam.id);
            navigate('/dashboard');
            setIsSyncing(false);
        }, 1500);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const fetchGlobalUnread = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase.rpc('has_unread_messages', { p_user_id: user.id });
            if (error) throw error;
            setHasUnreadCommunityMessages(!!data);
        } catch (err) {
            console.error('Error fetching global unread:', err);
        }
    }, [user]);

    const [hasUnreadCommunityMessages, setHasUnreadCommunityMessages] = useState(false);
    const { showFeedback, markFeedbackComplete } = useMandatoryFeedback();

    useEffect(() => {
        if (!user) return;
        fetchGlobalUnread();
        const messageSub = supabase
            .channel('global-chat-notifications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_messages' }, () => fetchGlobalUnread())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_read_status', filter: `user_id=eq.${user.id}` }, () => fetchGlobalUnread())
            .subscribe();
        return () => { supabase.removeChannel(messageSub); };
    }, [user, fetchGlobalUnread, activeExam.id]);

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Subjects', path: '/subjects', icon: Brain },
        { label: 'Practice', path: '/practice', icon: BookOpen },
        { label: 'Learning', path: '/learning', icon: Play },
        { label: 'Community', path: '/community', icon: MessageCircle },
        { label: '3D Labs', path: '/labs', icon: FlaskConical },
        { label: 'Mock Exams', path: '/mock-exams', icon: Globe },
        { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
        { label: 'History', path: '/history', icon: Clock },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    ];

    const displayedNavItems = profile?.role === 'consultant'
        ? [{ label: 'Consultant Console', path: '/consultant/dashboard', icon: Users }]
        : profile?.role === 'admin'
            ? [...navItems, { label: 'Consultant Console', path: '/consultant/dashboard', icon: Users }]
            : navItems;

    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student';

    // MOBILE APP RENDER (NO HEADER)
    if (isMobile) {
        return (
            <div className="flex flex-col min-h-screen bg-background font-sans overflow-x-hidden">
                <main className="flex-1 relative">
                    {children}
                </main>
                {showFeedback && <MandatoryFeedbackModal onComplete={markFeedbackComplete} />}
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </div>
        );
    }


    // DESKTOP RENDER
    return (
        <div className={`bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 ${location.pathname.startsWith('/community') ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
            {showFeedback && <MandatoryFeedbackModal onComplete={markFeedbackComplete} />}
            {showHeader && (
                <header className="sticky top-0 z-50 w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-b border-indigo-500/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
                    <div className="container mx-auto px-6 h-18 flex items-center justify-between py-4">
                        <div className="flex items-center gap-12">
                            <Link to="/dashboard" className="flex items-center gap-4 shrink-0 hover:opacity-80 transition-opacity">
                                <img src="/italostudy-logo.png" alt="italostudy" className="h-10 w-auto" />
                            </Link>

                            <nav className="hidden lg:flex items-center bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-indigo-500/5 shadow-inner">
                                {displayedNavItems.slice(0, 5).map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2.5 ${location.pathname === item.path
                                            ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm border border-indigo-500/5'
                                            : 'text-slate-400 hover:text-slate-900 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <item.icon className="w-3.5 h-3.5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            {!isMobile && (
                                <div className="hidden md:flex items-center gap-2 mr-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border-indigo-500/10 hover:border-indigo-500/30 transition-all shadow-sm flex items-center gap-2">
                                                <div className="w-5 h-5 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                                                    <Globe className="w-3 h-3 text-indigo-600" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{activeExam.id.split('-')[0]}</span>
                                                <ChevronDown className="w-3 h-3 text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-indigo-500/10 shadow-2xl backdrop-blur-3xl bg-white/90">
                                            {Object.values(EXAMS).map((exam) => (
                                                <DropdownMenuItem
                                                    key={exam.id}
                                                    onClick={() => handleExamSwitch(exam)}
                                                    className={`rounded-xl p-3 mb-1 cursor-pointer transition-all ${activeExam.id === exam.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50'}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{exam.name}</span>
                                                        <span className="text-[8px] opacity-60 font-bold uppercase">{(exam as any).sections?.length || (exam as any).subjects?.length || 0} Modules</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}

                            <NotificationDropdown />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group overflow-hidden bg-white dark:bg-slate-900 shadow-sm relative">
                                        <div className="w-9 h-9 rounded-[0.8rem] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200/50 group-hover:scale-105 transition-transform duration-300">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest leading-none line-clamp-1">{displayName}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Beta Member</span>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-3 rounded-[2rem] border-indigo-500/10 shadow-2xl backdrop-blur-3xl bg-white/90">
                                    <div className="px-4 py-3 mb-2 border-b border-slate-50">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Authenticated Entry</p>
                                        <p className="text-[10px] font-black text-slate-900 dark:text-white truncate">{user?.email}</p>
                                    </div>
                                    <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl p-3 cursor-pointer hover:bg-slate-50 flex items-center gap-3 group">
                                        <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Settings Console</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSignOut} className="rounded-xl p-3 cursor-pointer hover:bg-rose-50 flex items-center gap-3 group">
                                        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </header>
            )}
            <main className="flex-1 relative">
                {children}
            </main>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Simple Mobile Web Navigation */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[60] bg-white dark:bg-slate-950 p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <img src="/italostudy-logo.png" alt="logo" className="h-8 w-auto" />
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {displayedNavItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4"
                            >
                                <item.icon className="w-5 h-5 text-indigo-600" />
                                <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}