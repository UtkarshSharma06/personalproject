import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import {
    User, History, Bookmark, Microscope, Users,
    LogOut, ShieldCheck, ChevronRight, Settings, Info,
    GraduationCap, Target, Globe, ChevronDown, BookOpen, FileText
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useExam } from '@/context/ExamContext';
import { EXAMS } from '@/config/exams';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onOpenChange }) => {
    const { user, profile, signOut } = useAuth() as any;
    const { activeExam, setActiveExam } = useExam();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isExamSwitcherOpen, setIsExamSwitcherOpen] = useState(false);

    const handleNav = (path: string) => {
        navigate(path);
        onOpenChange(false);
    };

    const handleExamSwitch = async (examId: string) => {
        await setActiveExam(examId);
        setIsExamSwitcherOpen(false);
        onOpenChange(false);
        navigate('/dashboard');
    };

    const menuItems = [
        { icon: BookOpen, label: 'Subjects', path: '/subjects', color: 'text-blue-500' },
        { icon: FileText, label: 'Resources', path: '/resources', color: 'text-pink-500' },
        { icon: History, label: t('menu.history'), path: '/history', color: 'text-indigo-500' },
        { icon: Target, label: t('menu.mock'), path: '/mock-exams', color: 'text-rose-500' },
        { icon: Bookmark, label: t('menu.bookmarks'), path: '/bookmarks', color: 'text-amber-500' },
        { icon: Microscope, label: t('menu.labs'), path: '/labs', color: 'text-emerald-500' },
        { icon: GraduationCap, label: t('menu.apply'), path: '/apply-university', color: 'text-indigo-600' },
    ];

    const adminItems = [
        { icon: ShieldCheck, label: t('menu.admin'), path: '/admin', color: 'text-slate-500' },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[300px] p-0 border-r-0 bg-background flex flex-col">
                <SheetHeader className="sr-only">
                    <SheetTitle>{t('menu.main')}</SheetTitle>
                </SheetHeader>
                {/* Profile Header */}
                <div className="p-6 pt-12 bg-gradient-to-br from-primary/10 to-transparent">
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-lg">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback className="bg-primary text-white font-black">
                                {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-lg tracking-tight truncate leading-none mb-1">
                                {profile?.display_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || "Student"}
                            </h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                                {profile?.selected_plan === 'pro' ? 'Exam Prep Plan' :
                                    profile?.selected_plan === 'elite' ? 'Global Admission Plan' :
                                        profile?.selected_plan === 'explorer' ? 'Explorer Plan' : 'Candidate'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 w-fit">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">{t('menu.online')}</span>
                        </div>
                    </div>
                </div>

                {/* Exam Switcher */}
                <div className="px-4 mb-2">
                    <button
                        onClick={() => setIsExamSwitcherOpen(!isExamSwitcherOpen)}
                        className="w-full p-4 bg-secondary/30 rounded-2xl flex items-center justify-between border border-border/50 group active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Globe size={16} />
                            </div>
                            <div className="text-left">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{t('menu.active_course')}</p>
                                <p className="text-xs font-black uppercase tracking-tight truncate max-w-[140px]">{activeExam.name}</p>
                            </div>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", isExamSwitcherOpen && "rotate-180")} />
                    </button>

                    {isExamSwitcherOpen && (
                        <div className="mt-2 p-2 bg-secondary/10 rounded-2xl border border-border/20 space-y-1 animate-in slide-in-from-top-2 duration-300">
                            {Object.values(EXAMS).map((exam) => (
                                <button
                                    key={exam.id}
                                    onClick={() => handleExamSwitch(exam.id)}
                                    className={cn(
                                        "w-full p-3 rounded-xl text-left transition-all flex items-center justify-between group",
                                        activeExam.id === exam.id ? "bg-primary text-white shadow-lg" : "hover:bg-secondary/50"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-tight truncate pr-2">{exam.name}</span>
                                    {activeExam.id === exam.id && <Check size={12} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 flex flex-col will-change-scroll">
                    <div className="space-y-1">
                        <h4 className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">{t('menu.main')}</h4>
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNav(item.path)}
                                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-secondary/50 active:scale-95 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                    <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground">{item.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>

                    {profile?.role === 'admin' && (
                        <div className="space-y-1">
                            <h4 className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">{t('menu.restricted')}</h4>
                            {adminItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleNav(item.path)}
                                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-secondary/50 active:scale-95 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                        <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground">{item.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-auto space-y-1">
                        <button
                            onClick={() => handleNav('/mobile/settings')}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all font-bold"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="text-sm font-bold">{t('menu.settings')}</span>
                        </button>
                        <button
                            onClick={() => { signOut(); onOpenChange(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-bold">{t('menu.logout')}</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-border/50 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-30">Ver 2.0.4 • ITALOSTUDY</p>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;

function Check(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
