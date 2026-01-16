import { useState } from "react";
import Layout from "@/components/Layout";
import ChatInterface from "@/components/chat/ChatInterface";
import { CommunitySidebar } from "@/components/chat/CommunitySidebar";
import { useAuth } from "@/lib/auth";
import { MessageSquareOff } from "lucide-react";

export default function Community() {
    const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);
    const { profile } = useAuth();

    // Check for explicit false (default is true or null treated as true in old schema, but we added default true)
    if (profile && profile.community_enabled === false) {
        return (
            <Layout>
                <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-black">
                    <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-full mb-6">
                        <MessageSquareOff className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-tight">Access Restricted</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                        youre are restrcted due to communiy gudeline voilations contact admin:- 05sharma@gmail.com
                    </p>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="h-full w-full max-w-full flex overflow-hidden bg-white dark:bg-black">
                {/* Sidebar: Hidden on mobile if chat is active */}
                <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 bg-white dark:bg-black z-20 ${activeCommunityId ? 'hidden md:flex' : 'flex'}`}>
                    <CommunitySidebar
                        activeCommunityId={activeCommunityId}
                        onSelectCommunity={setActiveCommunityId}
                    />
                </div>

                {/* Chat Area: Hidden on mobile if no chat active */}
                <div className={`flex-1 min-w-0 flex flex-col ${!activeCommunityId ? 'hidden md:flex' : 'flex'}`}>
                    {activeCommunityId ? (
                        <ChatInterface
                            communityId={activeCommunityId}
                            onBack={() => setActiveCommunityId(null)}
                        />
                    ) : (
                        <div className="hidden md:flex h-full w-full items-center justify-center text-muted-foreground bg-slate-50/50">
                            Select a community to start chatting
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
