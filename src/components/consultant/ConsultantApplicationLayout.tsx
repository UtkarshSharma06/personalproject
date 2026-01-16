import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import {
    Loader2,
    FileText,
    MessageCircle,
    Gift,
    User,
    ArrowLeft,
    ChevronRight,
    LayoutDashboard,
    FolderOpen
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface ConsultantApplicationLayoutProps {
    children: React.ReactNode;
    activeTab: 'application' | 'messages' | 'offer' | 'documents';
}

export default function ConsultantApplicationLayout({ children, activeTab }: ConsultantApplicationLayoutProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [application, setApplication] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [unreadMessages, setUnreadMessages] = useState(0);

    const fetchUnreadCount = async () => {
        if (!id) return;
        const { data } = await supabase
            .from('admission_messages')
            .select('id')
            .eq('application_id', id)
            .eq('is_from_consultant', false)
            .eq('is_read', false);
        setUnreadMessages(data?.length || 0);
    };

    useEffect(() => {
        if (!id) return;

        const fetchApp = async () => {
            // Fetch application first
            const { data: appData, error: appError } = await supabase
                .from('admission_applications')
                .select('*')
                .eq('id', id)
                .single();

            if (appError) {
                console.error("Error fetching app:", appError);
                setIsLoading(false);
                return;
            }

            // Fetch profile separately
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', appData.user_id)
                .single();

            setApplication({ ...appData, profiles: profileData });
            setIsLoading(false);
        };

        fetchApp();
        fetchUnreadCount();

        const channel = supabase
            .channel(`layout_updates_${id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'admission_messages',
                filter: `application_id=eq.${id}`
            }, () => fetchUnreadCount())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                </div>
            </Layout>
        );
    }

    if (!application) return <div>Application not found</div>;

    const SidebarItem = ({ tabId, icon: Icon, label, path, count }: any) => (
        <button
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 ${activeTab === tabId
                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold'
                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
        >
            <Icon className={`w-5 h-5 ${activeTab === tabId ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="text-sm tracking-wide">{label}</span>
            {count > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center ml-2 shadow-lg shadow-red-200 animate-pulse">
                    {count}
                </span>
            )}
            {activeTab === tabId && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />}
        </button>
    );

    return (
        <Layout>
            <div className="flex min-h-[calc(100vh-72px)] bg-slate-50/50 relative">
                {/* Sidebar */}
                <div className="hidden lg:block lg:w-72 bg-white border-r border-slate-200 z-40 fixed top-[72px] h-[calc(100vh-72px)]">
                    <div className="p-8">
                        <button
                            onClick={() => navigate('/consultant/dashboard')}
                            className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6"
                        >
                            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                        </button>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                {application.application_data?.personal_info?.first_name?.[0] || 'S'}
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 truncate max-w-[140px]">
                                    {application.application_data?.personal_info?.first_name} {application.application_data?.personal_info?.last_name}
                                </h2>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                    #{application.user_id.substring(0, 8)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <SidebarItem tabId="application" icon={LayoutDashboard} label="Overview" path={`/consultant/application/${id}`} />
                        <SidebarItem tabId="documents" icon={FolderOpen} label="Documents" path={`/consultant/application/${id}?tab=documents`} />
                        <SidebarItem tabId="messages" icon={MessageCircle} label="Messages" path={`/consultant/application/${id}/chat`} count={unreadMessages} />
                        <SidebarItem tabId="offer" icon={Gift} label="Make Offer" path={`/consultant/application/${id}/offer`} />
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72">
                    {children}
                </div>
            </div>
        </Layout>
    );
}
