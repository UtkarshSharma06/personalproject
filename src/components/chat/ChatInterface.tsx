import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { MessageItem, Message } from "./MessageItem";
import { MessageInput } from "./MessageInput";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Hash, Users, ChevronLeft, Lock, Unlock, Shield, Trash2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useNavigate } from "react-router-dom";

interface ChatInterfaceProps {
    communityId: string;
    onBack?: () => void;
}

export default function ChatInterface({ communityId, onBack }: ChatInterfaceProps) {
    const { user, profile } = useAuth() as any;
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const [communityName, setCommunityName] = useState("Loading...");
    const [communityImage, setCommunityImage] = useState<string | null>(null);
    const [isRestricted, setIsRestricted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const profileCacheRef = useRef<Record<string, any>>({});
    const processedMessageIds = useRef<Set<string>>(new Set());
    // Track the latest message time for polling
    const lastMessageTimeRef = useRef<string | null>(null);
    const isAdmin = profile?.role === 'admin';
    const navigate = useNavigate();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const { isExplorer } = usePlanAccess();

    const [isConnected, setIsConnected] = useState(false);

    // Fetch community details
    useEffect(() => {
        const fetchCommunityDetails = async () => {
            const { data } = await (supabase as any)
                .from('communities')
                .select('name, image_url, is_restricted')
                .eq('id', communityId)
                .single();

            if (data) {
                setCommunityName(data.name);
                setCommunityImage(data.image_url);
                setIsRestricted(data.is_restricted || false);
            }
        };
        fetchCommunityDetails();
    }, [communityId]);

    // 1. Fetch messages, Realtime, and Polling
    useEffect(() => {
        let isMounted = true;

        // Reset state on change
        processedMessageIds.current.clear();
        lastMessageTimeRef.current = null;
        setMessages([]);
        setIsLoading(true);

        const fetchMessages = async () => {
            try {
                const { data, error } = await (supabase as any)
                    .from('community_messages')
                    .select(`
                        *,
                        profiles:user_id (
                            username,
                            display_name,
                            avatar_url,
                            email
                        ),
                        reply_to:reply_to_id (
                            content,
                            profiles:user_id ( display_name )
                        )
                    `)
                    .eq('community_id', communityId)
                    .order('created_at', { ascending: true })
                    .limit(100);

                if (error) throw error;

                if (isMounted && data) {
                    const formatted = data.map((msg: any) => {
                        const profileData = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles;
                        const validProfile = profileData || { display_name: 'Unknown User', avatar_url: null, username: 'unknown' };

                        return {
                            ...msg,
                            profiles: validProfile,
                            reply_to: msg.reply_to
                        };
                    });

                    const unique = formatted.filter((m: any) => !processedMessageIds.current.has(m.id));
                    unique.forEach((m: any) => processedMessageIds.current.add(m.id));

                    setMessages(unique);

                    if (unique.length > 0) {
                        lastMessageTimeRef.current = unique[unique.length - 1].created_at;
                    }
                    setTimeout(scrollToBottom, 100);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const fetchNewMessages = async () => {
            if (!lastMessageTimeRef.current) return;

            try {
                const { data } = await (supabase as any)
                    .from('community_messages')
                    .select(`
                        *,
                        profiles:user_id (username, display_name, avatar_url, email),
                        reply_to:reply_to_id (content, profiles:user_id(display_name))
                    `)
                    .eq('community_id', communityId)
                    .gt('created_at', lastMessageTimeRef.current)
                    .order('created_at', { ascending: true });

                if (isMounted && data && data.length > 0) {
                    const uniqueNew = data
                        .map((msg: any) => {
                            const profileData = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles;
                            const validProfile = profileData || { display_name: 'Unknown User', avatar_url: null, username: 'unknown' };
                            return {
                                ...msg,
                                profiles: validProfile,
                                reply_to: msg.reply_to
                            };
                        })
                        .filter((m: any) => !processedMessageIds.current.has(m.id));

                    if (uniqueNew.length > 0) {
                        uniqueNew.forEach((m: any) => processedMessageIds.current.add(m.id));
                        setMessages(prev => [...prev, ...uniqueNew]);
                        lastMessageTimeRef.current = uniqueNew[uniqueNew.length - 1].created_at;
                        setTimeout(scrollToBottom, 50);
                    }
                }
            } catch (err) {
                // Silent catch for polling
            }
        };

        fetchMessages();

        const channel = supabase
            .channel(`public:community_messages:${communityId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'community_messages'
                },
                (payload: any) => {
                    if (payload.event === 'INSERT' && payload.new) {
                        const newMsg = payload.new;
                        if (newMsg.community_id !== communityId) return;
                        if (processedMessageIds.current.has(newMsg.id)) return;
                        if (newMsg.user_id === user?.id) return;
                        fetchNewMessages();
                    }
                }
            )
            .subscribe((status) => setIsConnected(status === 'SUBSCRIBED'));

        // Listen for Community Updates (Restriction status)
        const communityChannel = supabase
            .channel(`public:communities:${communityId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'communities',
                    filter: `id=eq.${communityId}`
                },
                (payload: any) => {
                    if (payload.new) {
                        setCommunityName(payload.new.name);
                        setCommunityImage(payload.new.image_url);
                        setIsRestricted(payload.new.is_restricted || false);
                    }
                }
            )
            .subscribe();

        const pollInterval = setInterval(fetchNewMessages, 3000);

        return () => {
            isMounted = false;
            clearInterval(pollInterval);
            supabase.removeChannel(channel);
            supabase.removeChannel(communityChannel);
        };
    }, [communityId, user?.id]);

    const fetchSingleMessage = async (id: string): Promise<Message | null> => {
        const { data } = await (supabase as any)
            .from('community_messages')
            .select(`
        *,
        profiles(display_name, email, avatar_url),
        reply_to:community_messages!reply_to_id(
            content,
            profiles(display_name)
        )
      `)
            .eq('id', id)
            .single();

        if (!data) return null;
        return {
            ...data,
            reply_to: Array.isArray(data.reply_to) ? data.reply_to[0] : data.reply_to
        } as unknown as Message;
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    // Generic cache for usernames to resolve mentions
    const [userMap, setUserMap] = useState<Map<string, string>>(new Map());

    // Fetch all profiles for mention resolution (Optimized: fetching only needed fields)
    useEffect(() => {
        const fetchProfiles = async () => {
            const { data } = await (supabase as any)
                .from('profiles')
                .select('id, username, display_name, avatar_url');

            if (data) {
                const map = new Map();
                const cache: Record<string, any> = {};
                data.forEach((p: any) => {
                    if (p.username) map.set(p.username.toLowerCase(), p.id);
                    cache[p.id] = {
                        display_name: p.display_name,
                        username: p.username,
                        avatar_url: p.avatar_url
                    };
                });
                setUserMap(map);
                profileCacheRef.current = cache;
            }
        };
        fetchProfiles();
    }, []);

    // Mark mentions as read when entering community
    useEffect(() => {
        const markRead = async () => {
            if (!user) return;
            await (supabase as any)
                .from('chat_mentions')
                .update({ is_read: true })
                .eq('community_id', communityId)
                .eq('user_id', user.id);
        };
        markRead();
    }, [communityId, user]);


    const handleSend = async (content: string | null, file: File | null) => {
        if (!user) return;

        // Detect mentions
        const mentionedIds: string[] = [];
        if (content) {
            const words = content.split(/\s+/);
            words.forEach(word => {
                if (word.startsWith('@')) {
                    const username = word.slice(1).toLowerCase().replace(/[^a-z0-9_]/g, ''); // Clean basic punctuation
                    const userId = userMap.get(username);
                    if (userId) mentionedIds.push(userId);
                }
            });
        }

        // Optimistically add message
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: Message = {
            id: tempId,
            content: content,
            file_url: file ? URL.createObjectURL(file) : null,
            file_type: file?.type || null,
            file_name: file?.name || null,
            created_at: new Date().toISOString(),
            user_id: user.id,
            reply_to_id: replyTo?.id || null,
            is_deleted: false,
            // @ts-ignore
            community_id: communityId,
            profiles: {
                display_name: profile?.display_name || user.email?.split('@')[0] || 'Me',
                email: user.email || '',
                avatar_url: (user.user_metadata?.avatar_url as string) || null,
                // @ts-ignore
                username: profile?.username
            },
            reply_to: replyTo ? {
                profiles: { display_name: replyTo.profiles.display_name },
                content: replyTo.content
            } : undefined
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setTimeout(() => scrollToBottom(), 0);
        setReplyTo(null);

        try {
            let fileUrl = null;
            let fileType = null;
            let fileName = null;

            // 1. Upload file if exists
            if (file) {
                const fileExt = file.name.split('.').pop();
                const filePath = `${user.id}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('community-uploads')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('community-uploads')
                    .getPublicUrl(filePath);

                fileUrl = publicUrl;
                fileType = file.type;
                fileName = file.name;
            }

            // 2. Call RPC to insert message and mentions atomically
            const { data: messageId, error: insertError } = await (supabase as any)
                .rpc('send_community_message', {
                    p_community_id: communityId,
                    p_content: content,
                    p_file_url: fileUrl,
                    p_file_type: fileType,
                    p_file_name: fileName,
                    p_reply_to_id: optimisticMessage.reply_to_id,
                    p_mentioned_user_ids: mentionedIds
                });

            if (insertError) throw insertError;

            // Replace temp message with real one & prevent duplicates
            processedMessageIds.current.add(messageId);
            setMessages(prev => {
                // If message already exists (e.g. from polling), remove temp one to avoid duplicate
                if (prev.some(m => m.id === messageId)) {
                    return prev.filter(m => m.id !== tempId);
                }
                // Otherwise update temp id to real id
                return prev.map(msg => msg.id === tempId ? { ...msg, id: messageId, file_url: fileUrl } : msg);
            });

        } catch (error: any) {
            console.error('Send error:', error);
            toast({ title: "Error", description: error.message || "Failed to send message.", variant: "destructive" });
            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
        }
    };

    const toggleRestriction = async () => {
        if (!isAdmin) return;
        try {
            const { error } = await (supabase as any)
                .from('communities')
                .update({ is_restricted: !isRestricted })
                .eq('id', communityId);

            if (error) throw error;
            setIsRestricted(!isRestricted);
            toast({
                title: !isRestricted ? "Chat Locked" : "Chat Unlocked",
                description: !isRestricted ? "Only admins can send messages now." : "Everyone can send messages now."
            });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update restriction", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await (supabase as any)
                .from('community_messages')
                .update({ is_deleted: true, content: null, file_url: null })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Delete error:', error);
            toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
        }
    };

    const handleDeleteCommunity = async () => {
        if (!isAdmin || !window.confirm("Are you sure you want to delete this community? This cannot be undone.")) return;
        try {
            const { error } = await (supabase as any)
                .from('communities')
                .delete()
                .eq('id', communityId);

            if (error) throw error;
            toast({ title: "Community Deleted", description: "Redirecting..." });
            if (onBack) onBack();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleBanUser = async (userId: string, username: string) => {
        if (!isAdmin || !window.confirm(`Ban @${username}? They will be logged out properly.`)) return;
        try {
            const { error } = await (supabase as any)
                .from('profiles')
                .update({ is_banned: true })
                .eq('id', userId);

            if (error) throw error;
            toast({ title: "User Banned", description: `@${username} has been banned.` });
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to ban user", variant: "destructive" });
        }
    };

    const handleRestrictUser = async (userId: string, username: string) => {
        if (!isAdmin || !window.confirm(`Restrict chat for @${username}?`)) return;
        try {
            const { error } = await (supabase as any)
                .from('profiles')
                .update({ community_enabled: false })
                .eq('id', userId);

            if (error) throw error;
            toast({ title: "User Restricted", description: `Chat disabled for @${username}.` });
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to restrict user", variant: "destructive" });
        }
    };

    if (profile?.community_enabled === false) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-slate-50/50 dark:bg-black/50 text-center p-4">
                <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                    <Loader2 className="h-12 w-12 text-indigo-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Focus Mode On</h2>
                <p className="text-slate-500 max-w-md">
                    Community chat is disabled to help you focus.
                    <br />You can re-enable it in Settings.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-black/50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* Chat Header */}
            <div className="h-16 flex items-center px-4 md:px-8 bg-white/70 dark:bg-black/20 backdrop-blur-xl border-b border-white/20 z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button variant="ghost" size="icon" className="md:hidden -ml-2 h-8 w-8" onClick={onBack}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 overflow-hidden">
                        {communityImage ? (
                            <img src={communityImage} className="w-full h-full object-cover" alt="Community" />
                        ) : (
                            <Hash className="h-5 w-5" />
                        )}
                    </div>
                    <div>
                        <h1 className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight">{communityName}</h1>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            {isConnected ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-emerald-600 dark:text-emerald-400">Live</span>
                                </>
                            ) : (
                                <>
                                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                                    <span className="text-amber-600 dark:text-amber-400">Connecting...</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* Admin Actions */}
                {isAdmin && (
                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`${isRestricted ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={toggleRestriction}
                        >
                            {isRestricted ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    <Unlock className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={handleDeleteCommunity}
                            title="Delete Community"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Messages Area */}
            {/* Messages Container */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 py-6 space-y-2 relative z-10 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 text-sm">
                        <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <Hash className="h-10 w-10 text-indigo-300" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">No messages yet</h3>
                            <p className="text-sm text-muted-foreground">Be the first to start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {messages.map((msg) => (
                            <MessageItem
                                key={msg.id}
                                message={msg}
                                onReply={(m) => setReplyTo(m)}
                                onDelete={handleDelete}
                                onBan={handleBanUser}
                                onRestrict={handleRestrictUser}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Input Area */}
            {/* Input Area or Restriction Notice */}
            <div className="container max-w-5xl mx-auto">
                {isRestricted && !isAdmin ? (
                    <div className="p-4 m-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 text-slate-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-bold">Only admins can send messages in this community.</span>
                    </div>
                ) : (
                    <MessageInput
                        onSend={handleSend}
                        replyTo={replyTo ? {
                            id: replyTo.id,
                            user: replyTo.profiles?.display_name || 'User',
                            content: replyTo.content || 'File Attachment'
                        } : null}
                        onCancelReply={() => setReplyTo(null)}
                    />
                )}
            </div>
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Unlock Community Chat"
                description="Join the conversation with other students. Upgrade to PRO to send messages, ask questions, and share resources in global communities."
                feature="Interactive Community"
            />
        </div>
    );
}
