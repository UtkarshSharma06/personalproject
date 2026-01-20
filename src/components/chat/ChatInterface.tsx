import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { MessageItem, Message } from "./MessageItem";
import { MessageInput } from "./MessageInput";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Hash, Users, ChevronLeft, Lock, Unlock, Shield, Trash2, Ban, Pin, Phone, Video, Mic, Search, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useNavigate } from "react-router-dom";
import { VoiceCallView } from "./VoiceCallView";
import { ImageLightbox } from "./ImageLightbox";
import { Input } from "@/components/ui/input";

interface ChatInterfaceProps {
    communityId: string;
    onBack?: () => void;
}

export default function ChatInterface({ communityId, onBack }: ChatInterfaceProps) {
    const { user, profile } = useAuth() as any;
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [reactions, setReactions] = useState<Record<string, any[]>>({});
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
    const viewedMessageIds = useRef<Set<string>>(new Set());
    const isAdmin = profile?.role === 'admin';
    const navigate = useNavigate();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const { isExplorer } = usePlanAccess();

    const [isConnected, setIsConnected] = useState(false);
    const [accessStatus, setAccessStatus] = useState<'loading' | 'member' | 'pending' | 'rejected' | 'none' | 'approved'>('loading');
    const [creatorName, setCreatorName] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [memberCount, setMemberCount] = useState<number>(0);
    const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);
    const [activeCall, setActiveCall] = useState<any>(null);
    const [isCalling, setIsCalling] = useState(false);
    const [livekitToken, setLivekitToken] = useState<string | null>(null);

    // Image Lightbox state
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    // View state (Chat, Media, Links)
    const [activeTab, setActiveTab] = useState<'chat' | 'media' | 'links'>('chat');

    // Image Error State
    const [imageError, setImageError] = useState(false);

    // Fetch community details & Access Status
    useEffect(() => {
        const fetchDetails = async () => {
            if (!user) return;
            setAccessStatus('loading');

            // 1. Get Community Info
            const { data: commData } = await (supabase as any)
                .from('communities')
                .select('name, image_url, is_restricted, is_private, created_by, member_count, pinned_message_id, profiles:created_by(display_name)')
                .eq('id', communityId)
                .single();

            if (commData) {
                setCommunityName(commData.name);
                setCommunityImage(commData.image_url);
                setIsRestricted(commData.is_restricted || false);
                setIsPrivate(commData.is_private || false);
                setCreatorName(commData.profiles?.display_name || "Unknown");
                setIsCreator(commData.created_by === user.id);
                setMemberCount(commData.member_count || 0);

                if (commData.pinned_message_id) {
                    fetchPinnedMessage(commData.pinned_message_id);
                } else {
                    setPinnedMessage(null);
                }

                // Check for active call
                const { data: callData } = await (supabase as any)
                    .from('community_calls')
                    .select('*')
                    .eq('community_id', communityId)
                    .eq('is_active', true)
                    .maybeSingle();

                if (callData) setActiveCall(callData);

                // 2. Check Membership
                if (commData.created_by === user.id || profile?.role === 'admin') {
                    setAccessStatus('member');
                } else {
                    const { data: memberData } = await (supabase as any)
                        .from('community_members')
                        .select('status')
                        .eq('community_id', communityId)
                        .eq('user_id', user.id)
                        .single();

                    if (memberData) {
                        setAccessStatus(memberData.status); // 'pending', 'approved' -> 'member' logic handled below? No, status is 'approved' in db
                    } else {
                        setAccessStatus('none');
                    }
                }
            }
        };
        fetchDetails();
    }, [communityId, user, profile]);

    const incrementView = async (msgId: string) => {
        if (viewedMessageIds.current.has(msgId)) return;
        viewedMessageIds.current.add(msgId);
        try {
            await (supabase as any).rpc('increment_message_view', { p_message_id: msgId });
        } catch (e) {
            // Silently fail view increment
        }
    };

    const fetchMessages = async () => {
        if (!communityId) return;
        setIsLoading(true);
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
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Fetch reactions for these messages
            const messageIds = data?.map((m: any) => m.id) || [];
            if (messageIds.length > 0) {
                const { data: reactData } = await supabase
                    .from('message_reactions')
                    .select('*')
                    .in('message_id', messageIds);

                const reactMap: Record<string, any[]> = {};
                reactData?.forEach(re => {
                    if (!reactMap[re.message_id]) reactMap[re.message_id] = [];
                    reactMap[re.message_id].push(re);
                });
                setReactions(reactMap);
            }

            if (data) {
                const formatted = data.map((msg: any) => {
                    const profileData = msg.profiles;
                    const validProfile = {
                        display_name: profileData?.display_name || 'User',
                        avatar_url: profileData?.avatar_url,
                        username: profileData?.username
                    };
                    return { ...msg, profiles: validProfile };
                });
                setMessages(formatted);
                if (formatted.length > 0) {
                    lastMessageTimeRef.current = formatted[formatted.length - 1].created_at;
                }
                setTimeout(scrollToBottom, 100);

                // Increment views for others' messages on initial load
                data.forEach((msg: any) => {
                    if (msg.user_id !== user?.id && !viewedMessageIds.current.has(msg.id)) {
                        incrementView(msg.id);
                    }
                });
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // 1. Fetch messages, Realtime, and Polling
    useEffect(() => {
        // Guard: wait until community details and access status are initialized
        if (accessStatus === 'loading') return;

        let isMounted = true;

        // Reset state on change
        processedMessageIds.current.clear();
        lastMessageTimeRef.current = null;
        setMessages([]);
        setReactions({}); // Clear reactions on community change
        setIsLoading(true);

        const fetchNewMessages = async () => {
            if (!lastMessageTimeRef.current || !isMounted) return;

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
                        uniqueNew.forEach((m: any) => {
                            processedMessageIds.current.add(m.id);
                            if (m.user_id !== user?.id) incrementView(m.id);
                        });
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

        // Subscribe to Pinned Message changes on community
        const pinnedChannel = supabase
            .channel(`community_pins_${communityId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'communities',
                filter: `id=eq.${communityId}`
            }, (payload: any) => {
                if (payload.new.pinned_message_id) {
                    fetchPinnedMessage(payload.new.pinned_message_id);
                } else {
                    setPinnedMessage(null);
                }
                if (payload.new.member_count !== undefined) {
                    setMemberCount(payload.new.member_count);
                }
            })
            .subscribe();

        const channel = supabase
            .channel(`public:community_messages:${communityId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'community_messages',
                    filter: `community_id=eq.${communityId}`
                },
                async (payload: any) => {
                    const eventType = payload.eventType; // or payload.event based on supabase version, usually payload.eventType in realtime-js, but supabase-js wraps it. Let's inspect typical structure or handle safely.
                    // Supabase js client typically exposes payload.eventType

                    if (eventType === 'INSERT') {
                        const newMsg = payload.new;
                        if (processedMessageIds.current.has(newMsg.id)) return;
                        if (newMsg.user_id === user?.id) return;
                        fetchNewMessages();
                    } else if (eventType === 'UPDATE') {
                        // Handle Soft Delete or Edit
                        const updatedId = payload.new.id;

                        // We need the full relational data for the updated message to display strictly correct info
                        // But for speed, if it's just 'is_deleted', we can patch it locally.

                        if (payload.new.is_deleted) {
                            setMessages(prev => prev.map(m =>
                                m.id === updatedId
                                    ? { ...m, is_deleted: true, content: null, file_url: null }
                                    : m
                            ));
                            return;
                        }

                        // If it's just a view count update, patch locally
                        if (payload.new.view_count !== undefined && !payload.new.content && !payload.new.file_url) {
                            setMessages(prev => prev.map(m => m.id === updatedId ? { ...m, view_count: payload.new.view_count } : m));
                            return;
                        }

                        // For content edits or other updates, fetch full
                        const fullMsg = await fetchSingleMessage(updatedId);
                        if (fullMsg) {
                            setMessages(prev => prev.map(m => m.id === updatedId ? fullMsg : m));
                        }

                    } else if (eventType === 'DELETE') {
                        // Handle Hard Delete
                        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
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

        // Reaction Subscription
        const reactionChannel = supabase
            .channel(`public:message_reactions:${communityId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'message_reactions'
                },
                (payload: any) => {
                    if (payload.eventType === 'INSERT') {
                        setReactions(prev => ({
                            ...prev,
                            [payload.new.message_id]: [...(prev[payload.new.message_id] || []), payload.new]
                        }));
                    } else if (payload.eventType === 'DELETE') {
                        setReactions(prev => {
                            const msgId = payload.old.message_id || Object.keys(prev).find(id => prev[id].some(r => r.id === payload.old.id));
                            if (!msgId) return prev;
                            return {
                                ...prev,
                                [msgId]: prev[msgId].filter(r => r.id !== payload.old.id)
                            };
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        setReactions(prev => ({
                            ...prev,
                            [payload.new.message_id]: prev[payload.new.message_id]?.map(r => r.id === payload.new.id ? payload.new : r) || [payload.new]
                        }));
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
            supabase.removeChannel(pinnedChannel);
            // supabase.removeChannel(callChannel); // This was commented out in the original code, keeping it commented.
            supabase.removeChannel(reactionChannel);
        };
    }, [communityId, user?.id, accessStatus]);

    const fetchSingleMessage = async (id: string): Promise<Message | null> => {
        const { data } = await (supabase as any)
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
            .eq('id', id)
            .single();

        if (data) {
            const profileData = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
            const validProfile = profileData || { display_name: 'Unknown User', avatar_url: null, username: 'unknown' };
            return {
                ...data,
                profiles: validProfile,
                reply_to: data.reply_to
            };
        }
        return null;
    };

    // Mark as read when community is opened or new messages arrive
    useEffect(() => {
        const markAsRead = async () => {
            if (!user || !communityId) return;
            try {
                await (supabase as any).rpc('update_read_status', { p_community_id: communityId });
            } catch (err) {
                console.error('Error updating read status:', err);
            }
        };

        markAsRead();
    }, [communityId, messages.length, user]);

    // LiveKit Token Management
    useEffect(() => {
        const fetchToken = async () => {
            if (isCalling && activeCall && !livekitToken) {
                try {
                    const { data, error } = await supabase.functions.invoke('get-livekit-token', {
                        body: {
                            roomName: activeCall.room_name,
                            participantName: profile?.display_name || user?.email?.split('@')[0] || 'User'
                        }
                    });

                    if (error) throw error;
                    console.log('LiveKit token response received');
                    const token = typeof data === 'string' ? data : data?.token;
                    if (!token || typeof token !== 'string') {
                        throw new Error('Valid token string not received from function');
                    }
                    setLivekitToken(token);
                } catch (error: any) {
                    console.error('Failed to fetch LiveKit token:', error);
                    toast({
                        title: "Connection Error",
                        description: "Failed to connect to the voice server. Please try again.",
                        variant: "destructive"
                    });
                    setIsCalling(false);
                }
            }
        };

        fetchToken();

        if (!isCalling) {
            setLivekitToken(null);
        }
    }, [isCalling, activeCall, user, profile]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setLivekitToken(null);
        };
    }, []);

    // Handle image click to open lightbox
    const handleImageClick = (imageUrl: string) => {
        const allImages = messages
            .filter(m => m.file_url && m.file_type?.startsWith('image/'))
            .map(m => m.file_url!);
        const clickedIndex = allImages.indexOf(imageUrl);
        setLightboxImages(allImages);
        setLightboxIndex(clickedIndex >= 0 ? clickedIndex : 0);
        setShowLightbox(true);
    };

    const fetchPinnedMessage = async (messageId: string) => {
        const { data, error } = await (supabase as any)
            .from('community_messages')
            .select(`
                *,
                profiles:user_id ( display_name, avatar_url, username )
            `)
            .eq('id', messageId)
            .single();

        if (data && !error) {
            setPinnedMessage(data);
        }
    };

    const handlePinMessage = async (messageId: string | null) => {
        if (!isCreator && !isAdmin) return;

        const { error } = await (supabase as any)
            .from('communities')
            .update({ pinned_message_id: messageId })
            .eq('id', communityId);

        if (error) {
            toast({ title: "Error", description: "Failed to pin message", variant: "destructive" });
        } else {
            toast({ title: messageId ? "Message Pinned" : "Message Unpinned" });
        }
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

            // 1. Parallelize File Upload and Link Preview Fetch
            const [fileResult, linkPreviewResult] = await Promise.all([
                (async () => {
                    if (!file) return null;
                    const fileExt = file.name.split('.').pop();
                    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage.from('community-uploads').upload(filePath, file);
                    if (uploadError) throw uploadError;
                    const { data: { publicUrl } } = supabase.storage.from('community-uploads').getPublicUrl(filePath);
                    return { url: publicUrl, type: file.type, name: file.name };
                })(),
                (async () => {
                    const urlMatch = content?.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/);
                    if (!urlMatch) return null;
                    try {
                        const url = urlMatch[0].startsWith('www.') ? `https://${urlMatch[0]}` : urlMatch[0];
                        const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
                        const data = await res.json();
                        if (data.status === 'success') {
                            const preview = {
                                title: data.data.title,
                                description: data.data.description,
                                image_url: data.data.image?.url,
                                url: data.data.url
                            };
                            // Update optimistic message locally for "instant" feel
                            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, link_preview: preview } : m));
                            return preview;
                        }
                    } catch (e) { /* silent fail */ }
                    return null;
                })()
            ]);

            fileUrl = fileResult?.url;
            fileType = fileResult?.type;
            fileName = fileResult?.name;
            const linkPreview = linkPreviewResult;

            // 3. Call RPC to insert message and mentions atomically
            const { data: messageId, error: insertError } = await (supabase as any)
                .rpc('send_community_message', {
                    p_community_id: communityId,
                    p_content: content,
                    p_file_url: fileUrl,
                    p_file_type: fileType,
                    p_file_name: fileName,
                    p_reply_to_id: optimisticMessage.reply_to_id,
                    p_mentioned_user_ids: mentionedIds,
                    p_link_preview: linkPreview
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

    const handleJoinPublic = async () => {
        try {
            const { error } = await (supabase as any)
                .from('community_members')
                .insert({
                    community_id: communityId,
                    user_id: user.id,
                    status: 'approved'
                });

            if (error) throw error;

            await (supabase as any).from('community_messages').insert({
                community_id: communityId,
                user_id: user.id,
                content: `Welcome to community, ${profile?.display_name || 'User'}`,
                recipient_id: user.id // Private to the user who joined
            });

            setAccessStatus('member');
            toast({ title: "Joined!", description: "You are now a member of this community." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to join community", variant: "destructive" });
        }
    };


    const handleJoinRequest = async () => {
        if (!user) return;
        try {
            const { error } = await (supabase as any)
                .from('community_members')
                .insert({
                    community_id: communityId,
                    user_id: user.id,
                    status: 'pending'
                });

            if (error) throw error;
            setAccessStatus('pending');
            toast({ title: "Request Sent", description: "The creator will review your request." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to send request", variant: "destructive" });
        }
    };

    const handleDeleteMessage = async (id: string) => {
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

    const scrollToMessage = (msgId: string | null) => {
        if (!msgId) return;
        const el = document.getElementById(`msg-${msgId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Visual feedback
            el.classList.add('animate-pulse', 'bg-emerald-50/50', 'dark:bg-emerald-900/20');
            setTimeout(() => {
                el.classList.remove('animate-pulse', 'bg-emerald-50/50', 'dark:bg-emerald-900/20');
            }, 2000);
        } else {
            toast({
                title: "Message not found",
                description: "This message is too old to be displayed in the current view."
            });
        }
    };

    const handleStartCall = async () => {
        if (activeCall) {
            setIsCalling(true);
            return;
        }

        const roomName = `comm_${communityId}_${Date.now()}`;
        try {
            const { data, error } = await (supabase as any)
                .from('community_calls')
                .insert({
                    community_id: communityId,
                    created_by: user.id,
                    room_name: roomName,
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;
            setActiveCall(data);
            setIsCalling(true);
        } catch (error: any) {
            toast({ title: "Call Error", description: "Failed to start call", variant: "destructive" });
        }
    };

    const handleEndCall = async () => {
        setIsCalling(false);
    };

    const handleEndSessionGlobal = async () => {
        if (!activeCall) return;
        try {
            const { error } = await (supabase as any)
                .from('community_calls')
                .update({ is_active: false, ended_at: new Date().toISOString() })
                .eq('id', activeCall.id);

            if (error) throw error;
            setActiveCall(null);
            setIsCalling(false);
            toast({ title: "Call Ended", description: "The community call has been ended." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to end session", variant: "destructive" });
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

    if (isLoading || accessStatus === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative overflow-hidden">
            {/* Background Pattern - WhatsApp Doodle Effect Simulation */}
            <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239ca3af' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                }}
            />

            {/* Chat Header */}
            <div className="h-16 flex items-center px-4 md:px-6 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-slate-200 dark:border-slate-700 z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-3 w-full">
                    {onBack && (
                        <Button variant="ghost" size="icon" className="md:hidden -ml-2 h-9 w-9 text-slate-600" onClick={onBack}>
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    )}
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-600">
                        {communityImage && !imageError ? (
                            <img
                                src={communityImage}
                                className="w-full h-full object-cover"
                                alt="Community"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <Hash className="h-5 w-5 text-slate-500" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer">
                        <h1 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-tight truncate">{communityName}</h1>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 truncate">
                            {isConnected ? (
                                <div className="flex items-center gap-2">
                                    <span>{creatorName ? `Created by ${creatorName}` : 'tap for group info'}</span>
                                    {memberCount > 0 && (
                                        <>
                                            <span className="h-0.5 w-0.5 rounded-full bg-slate-400" />
                                            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <span className="text-amber-600">Connecting...</span>
                            )}
                        </div>
                    </div>

                    {/* Search & Tabs & Admin Actions */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full h-9 w-9 ${showSearch ? 'text-emerald-500 bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'}`}
                            onClick={() => {
                                setShowSearch(!showSearch);
                                if (!showSearch) setSearchQuery("");
                            }}
                        >
                            <Search className="w-4 h-4" />
                        </Button>

                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full h-9 w-9 ${activeTab === 'chat' ? 'text-emerald-500 bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'}`}
                            onClick={() => setActiveTab('chat')}
                            title="Chat"
                        >
                            <Hash className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full h-9 w-9 ${activeTab === 'media' ? 'text-emerald-500 bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'}`}
                            onClick={() => setActiveTab('media')}
                            title="Media"
                        >
                            <ImageIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full h-9 w-9 ${activeTab === 'links' ? 'text-emerald-500 bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'}`}
                            onClick={() => setActiveTab('links')}
                            title="Links"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </Button>

                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

                        {isAdmin && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-full h-9 w-9 ${isRestricted ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                    onClick={toggleRestriction}
                                >
                                    {isRestricted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={handleDeleteCommunity}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Bar Overlay */}
                {showSearch && (
                    <div className="absolute inset-0 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center px-4 md:px-6 z-20 animate-in slide-in-from-top duration-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-2 text-slate-500"
                            onClick={() => setShowSearch(false)}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                autoFocus
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-[#2a3942] border-none focus-visible:ring-0 pl-10 h-10 rounded-lg text-sm"
                            />
                        </div>
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 text-slate-500 text-xs font-medium"
                                onClick={() => setSearchQuery("")}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area: Chat or Restricted UI */}
            {(accessStatus !== 'member' && accessStatus !== 'approved' && !isCreator && !isAdmin) ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/50 m-4 rounded-3xl border border-slate-200 dark:border-slate-800 z-10 relative">
                    <Shield className="w-16 h-16 text-emerald-500 mb-6 opacity-90" />
                    <h3 className="font-bold text-2xl mb-2 text-slate-900 dark:text-white tracking-tight">{isPrivate ? 'Private Community' : 'Join to View Messages'}</h3>
                    <p className="text-slate-500 mb-8 max-w-sm text-base leading-relaxed">
                        {isPrivate ? 'This community is private. You need to request access from the creator to join the conversation.' : 'Join this community to view messages and participate in conversations.'}
                    </p>

                    {accessStatus === 'pending' ? (
                        <Button disabled variant="secondary" className="bg-slate-200 text-slate-500 w-full max-w-xs font-bold rounded-xl h-12 text-sm uppercase tracking-wide">
                            Request Pending...
                        </Button>
                    ) : (
                        <Button
                            onClick={isPrivate ? handleJoinRequest : handleJoinPublic}
                            className="bg-[#00a884] hover:bg-[#008f6f] text-white w-full max-w-xs font-bold rounded-xl h-12 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wide"
                        >
                            {isPrivate ? 'Request to Join' : 'Join Community'}
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-16 py-4 space-y-1 relative z-10 scroll-smooth">
                        {/* Pinned Message Display */}
                        {pinnedMessage && (
                            <div
                                className="mb-4 sticky top-0 z-20 mx-auto max-w-2xl w-full cursor-pointer transition-transform active:scale-[0.98]"
                                onClick={() => scrollToMessage(pinnedMessage.id)}
                            >
                                <div className="bg-white/95 dark:bg-[#202c33]/95 backdrop-blur-md border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 shadow-md flex items-center gap-3">
                                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                        <Pin className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Pinned Message</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                                            <span className="font-bold mr-1">{pinnedMessage.profiles?.display_name}:</span>
                                            {pinnedMessage.content}
                                        </p>
                                    </div>
                                    {(isCreator || isAdmin) && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-slate-400 hover:text-red-500"
                                            onClick={() => handlePinMessage(null)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Filtered Messages Logic */}
                        {(() => {
                            const filteredMessages = messages.filter(msg => {
                                // Apply tab filters
                                if (activeTab === 'media') {
                                    if (!msg.file_url || !msg.file_type?.startsWith('image/') && !msg.file_type?.startsWith('video/')) {
                                        return false;
                                    }
                                } else if (activeTab === 'links') {
                                    const hasLink = msg.link_preview || (msg.content && msg.content.match(/https?:\/\/[^\s]+|www\.[^\s]+/));
                                    if (!hasLink) return false;
                                }

                                // Apply search filter
                                if (searchQuery) {
                                    const contentMatch = msg.content?.toLowerCase().includes(searchQuery.toLowerCase());
                                    const fileNameMatch = msg.file_name?.toLowerCase().includes(searchQuery.toLowerCase());
                                    if (!contentMatch && !fileNameMatch) return false;
                                }

                                // Don't show deleted messages
                                if (msg.is_deleted) return false;

                                return true;
                            });

                            if (filteredMessages.length === 0) {
                                return (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-20 px-4">
                                        <div className="bg-white/50 dark:bg-black/20 p-4 rounded-full mb-3 backdrop-blur-sm">
                                            {activeTab === 'media' ? <ImageIcon className="h-8 w-8 opacity-50" /> :
                                                activeTab === 'links' ? <LinkIcon className="h-8 w-8 opacity-50" /> :
                                                    <Hash className="h-8 w-8 opacity-50" />}
                                        </div>
                                        <p className="text-sm font-medium bg-white/50 dark:bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                                            {searchQuery ? 'No matching messages found' :
                                                activeTab === 'media' ? 'No media found in this chat' :
                                                    activeTab === 'links' ? 'No links found in this chat' :
                                                        'No messages here yet'}
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <div className="space-y-1 pb-2">
                                    {filteredMessages.map((msg) => (
                                        <div key={msg.id} id={`msg-${msg.id}`} className="transition-all duration-500 rounded-lg">
                                            <MessageItem
                                                message={msg}
                                                reactions={reactions[msg.id] || []}
                                                onReply={(m) => setReplyTo(m)}
                                                onDelete={handleDeleteMessage}
                                                onBan={handleBanUser}
                                                onRestrict={handleRestrictUser}
                                                isAdmin={isAdmin}
                                                isPinned={pinnedMessage?.id === msg.id}
                                                onPin={handlePinMessage}
                                                onUnpin={() => handlePinMessage(null)}
                                                onImageClick={handleImageClick}
                                                searchQuery={searchQuery}
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Input Area */}
                    <div className="z-20 bg-[#f0f2f5] dark:bg-[#202c33] p-2 md:p-3">
                        <div className="max-w-4xl mx-auto w-full">
                            {(!isPrivate && accessStatus === 'none' && !isCreator && !isAdmin) ? (
                                <Button
                                    onClick={handleJoinPublic}
                                    className="w-full bg-[#00a884] hover:bg-[#008f6f] text-white font-bold rounded-xl h-12 shadow-lg shadow-emerald-500/20"
                                >
                                    Join Community
                                </Button>
                            ) : (
                                isRestricted && !isAdmin ? (
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 flex items-center justify-center gap-2 text-slate-500 shadow-sm text-sm">
                                        <Lock className="w-4 h-4" />
                                        <span>Only admins can send messages.</span>
                                    </div>
                                ) : (
                                    <MessageInput
                                        onSend={handleSend}
                                        replyTo={replyTo ? { id: replyTo.id, user: replyTo.profiles?.display_name || 'User', content: replyTo.content || 'File' } : null}
                                        onCancelReply={() => setReplyTo(null)}
                                        disabled={isLoading}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </>
            )
            }

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Unlock Community Chat"
                description="Join the conversation with other students. Upgrade to PRO to send messages, ask questions, and share resources in global communities."
                feature="Interactive Community"
            />

            {/* Voice Call Overlay - Temporarily Disabled */}
            {/* {isCalling && activeCall && livekitToken && (
                <VoiceCallView
                    roomName={activeCall.room_name}
                    displayName={profile?.display_name || 'User'}
                    avatarUrl={profile?.avatar_url}
                    token={livekitToken}
                    serverUrl={import.meta.env.VITE_LIVEKIT_URL || 'wss://italostudy-vm5x8oiq.livekit.cloud'}
                    isCreator={activeCall.created_by === user.id || isAdmin}
                    onClose={handleEndCall}
                    onEndSession={handleEndSessionGlobal}
                />
            )} */}

            {/* Image Lightbox */}
            {
                showLightbox && lightboxImages.length > 0 && (
                    <ImageLightbox
                        images={lightboxImages}
                        initialIndex={lightboxIndex}
                        onClose={() => setShowLightbox(false)}
                    />
                )
            }
        </div >
    );
}
