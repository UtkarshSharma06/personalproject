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
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
    const { user, signOut, profile } = useAuth() as any;
    const { activeExam, setActiveExam } = useExam();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncTarget, setSyncTarget] = useState("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleExamSwitch = (exam: any) => {
        setIsSyncing(true);
        setSyncTarget(exam.name);

        // Simulate sync delay for better UX
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

    const navItems: { label: string; path: string; icon: any; isComingSoon?: boolean }[] = [
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

    // Get display name from user metadata or email
    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student';
    const [hasUnreadCommunityMessages, setHasUnreadCommunityMessages] = useState(false);
    const { showFeedback, markFeedbackComplete } = useMandatoryFeedback();

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

    useEffect(() => {
        if (!user) return;
        fetchGlobalUnread();

        const messageSub = supabase
            .channel('global-chat-notifications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_messages' }, () => fetchGlobalUnread())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_read_status', filter: `user_id=eq.${user.id}` }, () => fetchGlobalUnread())
            .subscribe();

        return () => {
            supabase.removeChannel(messageSub);
        };
    }, [user, fetchGlobalUnread, activeExam.id]);

    return (
        <>
            {/* Mandatory Feedback Modal - Blocks everything */}
            {showFeedback && <MandatoryFeedbackModal onComplete={markFeedbackComplete} />}

            <div className={`bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 ${location.pathname.startsWith('/community') ? 'h-screen overflow-hidden' : 'min-h-screen'
                }`}>
                {/* Header */}
                <header className="sticky top-0 z-50 w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-b border-indigo-500/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
                    <div className="container mx-auto px-6 h-18 flex items-center justify-between py-4">
                        {/* Left: Brand */}
                        <div className="flex items-center gap-4 shrink-0">
                            <Link to="/dashboard" className="flex items-center gap-2 group transition-transform active:scale-95 hover:opacity-90">
                                <img
                                    src="/italostudy-logo.png"
                                    alt="italostudy"
                                    className="h-10 w-auto transition-all group-hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* Center: Desktop Navigation (Pill Style) */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {displayedNavItems.filter(item => !['History', 'Analytics', 'Apply University', 'Practice', 'Mock Exams', 'Community', '3D Labs', 'Bookmarks'].includes(item.label)).map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.isComingSoon ? '#' : item.path}
                                        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 ${isActive
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-50'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                            } ${item.isComingSoon ? 'cursor-not-allowed opacity-60' : ''}`}
                                    >
                                        <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-500/20 text-white rotate-0' : 'bg-transparent group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:rotate-12'
                                            }`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span>{item.label}</span>
                                        {item.isComingSoon && (
                                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Arena Dropdown (Practice & Mock Exams) */}
                            {profile?.role !== 'consultant' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 ${['/practice', '/mock-exams', '/labs'].includes(location.pathname)
                                                ? 'bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100 ring-4 ring-indigo-50 scale-105'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`p-1.5 rounded-full transition-all duration-300 ${['/practice', '/mock-exams', '/labs'].includes(location.pathname) ? 'bg-indigo-100 text-indigo-600 rotate-0' : 'bg-transparent group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:rotate-12'
                                                }`}>
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm">Arena</span>
                                            <ChevronDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-48 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 border border-white/20 rounded-2xl shadow-2xl p-2 animate-in zoom-in-95 duration-200">
                                        {displayedNavItems.filter(item => ['Practice', 'Mock Exams', '3D Labs'].includes(item.label)).map((item) => (
                                            <DropdownMenuItem
                                                key={item.path}
                                                onClick={() => navigate(item.path)}
                                                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50/50'
                                                    }`}
                                            >
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${location.pathname === item.path ? 'bg-indigo-100 border-indigo-200' : 'bg-white/50 dark:bg-slate-800 border-slate-100'
                                                    }`}>
                                                    <item.icon className={`w-3.5 h-3.5 ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-500'}`} />
                                                </div>
                                                <span className="font-bold text-xs">{item.label}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {/* Community (Positioned after Arena) */}
                            {displayedNavItems.filter(item => item.label === 'Community').map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 ${isActive
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-50'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-500/20 text-white rotate-0' : 'bg-transparent group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:rotate-12'
                                            }`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span>{item.label}</span>
                                        {hasUnreadCommunityMessages && !isActive && (
                                            <span className="absolute top-1 right-1 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}


                            {profile?.role !== 'consultant' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 ${['/history', '/analytics'].includes(location.pathname)
                                                ? 'bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100 ring-4 ring-indigo-50 scale-105'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`p-1.5 rounded-full transition-all duration-300 ${['/history', '/analytics'].includes(location.pathname) ? 'bg-indigo-100 text-indigo-600 rotate-0' : 'bg-transparent group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:rotate-12'
                                                }`}>
                                                <Menu className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm">Others</span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-2xl shadow-xl p-2 animate-in zoom-in-95 duration-200">
                                        {displayedNavItems.filter(item => ['History', 'Analytics', 'Bookmarks'].includes(item.label)).map((item) => (
                                            <DropdownMenuItem
                                                key={item.path}
                                                onClick={() => navigate(item.path)}
                                                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${location.pathname === item.path ? 'bg-indigo-100 border-indigo-200' : 'bg-white dark:bg-card border-slate-100'
                                                    }`}>
                                                    <item.icon className={`w-3.5 h-3.5 ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-500'}`} />
                                                </div>
                                                <span className="font-bold text-xs">{item.label}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </nav>

                        {/* Right: Exam Switcher & Profile */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Exam Switcher */}
                            {profile?.role !== 'consultant' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="hidden sm:flex items-center gap-2 bg-white dark:bg-card px-3 py-1.5 rounded-xl border border-slate-200 dark:border-border shadow-sm hover:border-indigo-200 hover:shadow-md hover:scale-105 transition-all duration-300 font-bold text-slate-700 dark:text-slate-300 text-[11px] group h-8">
                                            {activeExam.id === 'imat-prep' ? 'IMAT' :
                                                activeExam.id === 'sat-prep' ? 'SAT' :
                                                    activeExam.id === 'ielts-academic' ? 'IELTS' : 'CEnT-S'}
                                            <ChevronDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-2xl shadow-xl p-2 animate-in slide-in-from-top-4 zoom-in-95 duration-200">
                                        <div className="p-3 mb-1 border-b border-slate-50">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exam Model</h4>
                                        </div>
                                        {Object.values(EXAMS).filter(e => e.isLive).map((exam) => (
                                            <DropdownMenuItem
                                                key={exam.id}
                                                onClick={() => handleExamSwitch(exam)}
                                                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${activeExam.id === exam.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-xs">{exam.name.split(' (')[0].split('Entrance')[0]}</span>
                                                </div>
                                                {activeExam.id === exam.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {/* Sign In Button (Visible when not logged in) */}
                            {!user && (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="hidden lg:flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 hover:scale-105 transition-all shadow-lg active:scale-95"
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span>Sign In</span>
                                </button>
                            )}

                            {/* Right Actions: Notifications, Profile, Mobile Menu */}
                            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
                                {/* Notifications */}
                                {user && <NotificationDropdown />}

                                {/* Profile Dropdown */}
                                {user && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-full border border-slate-200 dark:border-border hover:border-indigo-200 hover:shadow-md transition-all duration-300 group bg-white dark:bg-card shadow-sm hover:scale-105 active:scale-95">
                                                <div className="w-8 h-8 rounded-full bg-indigo-600 border border-slate-100 flex items-center justify-center text-white font-black text-xs shadow-sm group-hover:rotate-12 transition-transform overflow-hidden">
                                                    {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                                                        <img src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt="profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        displayName.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <ChevronDown className="w-3.5 h-3.5 mr-2 opacity-30 group-hover:opacity-100 transition-opacity hidden sm:block" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-60 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-2xl shadow-2xl p-2 animate-in zoom-in-95 duration-200">
                                            <div className="p-4 border-b border-slate-50 mb-2 bg-slate-50/50 rounded-xl">
                                                <p className="font-black text-slate-900 dark:text-slate-100 text-sm">{displayName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 truncate">{user?.email}</p>
                                                {profile?.role === 'consultant' && (
                                                    <div className="mt-2 py-0.5 px-2 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full inline-block">
                                                        Certified Expert
                                                    </div>
                                                )}
                                            </div>
                                            {profile?.role !== 'consultant' && (
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate('/settings')}
                                                        className="p-2.5 rounded-xl cursor-pointer hover:bg-slate-50 dark:bg-muted font-bold text-xs flex items-center gap-2"
                                                    >
                                                        <User className="w-3.5 h-3.5 text-slate-400" /> Account Settings
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-2.5 rounded-xl cursor-not-allowed opacity-60 font-bold text-xs flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Settings className="w-3.5 h-3.5 text-slate-400" /> Study Mode
                                                        </div>
                                                        <span className="text-[7px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Soon</span>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            <div className="h-px bg-slate-50 dark:bg-muted my-1.5" />
                                            <DropdownMenuItem
                                                onClick={handleSignOut}
                                                className="p-2.5 rounded-xl cursor-pointer hover:bg-red-50 text-red-600 font-bold text-xs flex items-center gap-2"
                                            >
                                                <LogOut className="w-3.5 h-3.5" /> Sign Out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}

                                {/* Mobile Menu Button */}
                                <button
                                    className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-sm active:scale-95 transition-all text-slate-900 dark:text-slate-100"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md animate-in slide-in-from-top duration-300 p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-5rem)]">
                            <nav className="flex flex-col gap-2">
                                {displayedNavItems.filter(item => !['Practice', 'Mock Exams', '3D Labs', 'History', 'Analytics', 'Bookmarks'].includes(item.label)).map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.isComingSoon ? '#' : item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive
                                                ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100 ring-1 ring-indigo-200'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="relative">
                                                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-transparent'
                                                    }`}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                {item.label === 'Community' && hasUnreadCommunityMessages && !isActive && (
                                                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm">{item.label}</span>
                                        </Link>
                                    );
                                })}

                                {/* Arena Section */}
                                <div className="mt-4 px-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Arena</p>
                                    <div className="flex flex-col gap-1">
                                        {displayedNavItems.filter(item => ['Practice', 'Mock Exams', '3D Labs'].includes(item.label)).map((item) => {
                                            const isActive = location.pathname === item.path;
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100 ring-1 ring-indigo-200'
                                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-transparent'
                                                        }`}>
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm">{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Others Section */}
                                <div className="mt-4 px-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Others</p>
                                    <div className="flex flex-col gap-1">
                                        {displayedNavItems.filter(item => ['History', 'Analytics', 'Bookmarks'].includes(item.label)).map((item) => {
                                            const isActive = location.pathname === item.path;
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100 ring-1 ring-indigo-200'
                                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-transparent'
                                                        }`}>
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-sm">{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </nav>

                            {/* Mobile Exam Switcher */}
                            <div className="pt-6 border-t border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Exam Model</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.values(EXAMS).filter(e => e.isLive).map((exam) => (
                                        <button
                                            key={exam.id}
                                            onClick={() => {
                                                handleExamSwitch(exam);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`flex items-center justify-between px-4 py-4 rounded-2xl font-bold text-sm transition-all border ${activeExam.id === exam.id
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200 active:scale-[0.98]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-xs">{exam.name.split(' (')[0].split('Entrance')[0]}</span>
                                            </div>

                                            {activeExam.id === exam.id && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Sign Out */}
                            <div className="pt-2">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-red-600 bg-red-50/50 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                {/* Content Slot */}
                <main className={`flex-1 relative ${location.pathname.startsWith('/community') ? 'h-full overflow-hidden' : ''}`}>
                    {children}
                </main>

                {/* Footer - Hide if logged in or manually hidden */}
                {(showFooter && !user) && (
                    <footer className="bg-white dark:bg-card border-t border-slate-100 py-12 mt-auto">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                                    <img
                                        src="/italostudy-logo.png"
                                        alt="italostudy"
                                        className="h-6 w-auto"
                                    />
                                </div>
                                <div className="flex items-center gap-6">
                                    <FeedbackDialog />
                                    <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Link to="/privacy" className="hover:text-slate-900 dark:text-slate-100 transition-colors">Privacy</Link>
                                        <Link to="/terms" className="hover:text-slate-900 dark:text-slate-100 transition-colors">Terms</Link>
                                        <a href="#" className="hover:text-slate-900 dark:text-slate-100 transition-colors">Support</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                )}

                {/* Global Sync Overlay */}
                {isSyncing && (
                    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
                        </div>
                        <div className="mt-8 text-center space-y-2 relative z-10">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Syncing Dashboard</h3>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                                Configuring for {syncTarget}
                            </p>
                        </div>
                    </div>
                )}

                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </div>
        </>
    );
}