import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import {
    MessageSquare, Users, Sparkles, Search,
    MoreVertical, Plus, ChevronLeft, Check, X,
    Hash, Shield, Award, Clock, ArrowRight,
    Pin, Loader2, Info, Camera, Phone, Search as SearchIcon, ArrowLeft
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import ChatInterface from "@/components/chat/ChatInterface";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function MobileCommunity() {
    const { user, profile } = useAuth() as any;
    const { toast } = useToast();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // App State
    const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'chats' | 'new' | 'requests'>('chats');
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Data State
    const [communities, setCommunities] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

    // Context Menu State
    const [longPressedChat, setLongPressedChat] = useState<string | null>(null);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

    // Create Community State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newCommunityName, setNewCommunityName] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Parallelize all independent initial loads
            const [allCommsRes, membershipsRes, ownedCommsRes] = await Promise.all([
                (supabase as any).from('communities').select('*').order('name'),
                (supabase as any).from('community_members').select('community_id, is_pinned, status').eq('user_id', user.id),
                (supabase as any).from('communities').select('id').eq('created_by', user.id)
            ]);

            const allComms = allCommsRes.data || [];
            setCommunities(allComms);

            if (membershipsRes.data) {
                const joined = new Set<string>(membershipsRes.data.filter((m: any) => m.status === 'approved' || m.status === 'member').map((m: any) => m.community_id));
                const pinned = new Set<string>(membershipsRes.data.filter((m: any) => m.is_pinned).map((m: any) => m.community_id));

                // Creators are members
                allComms.forEach((c: any) => { if (c.created_by === user.id) joined.add(c.id); });

                setJoinedIds(joined);
                setPinnedIds(pinned);
            }

            if (ownedCommsRes.data && ownedCommsRes.data.length > 0) {
                const { data: pending } = await (supabase as any)
                    .from('community_members')
                    .select('*, profiles:user_id(display_name, avatar_url), communities:community_id(name)')
                    .in('community_id', ownedCommsRes.data.map((c: any) => c.id))
                    .eq('status', 'pending');
                setRequests(pending || []);
            }

            // Unread counts (Mocked for now)
            setUnreadCounts({});

        } catch (e) {
            console.error("Community Load Error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = async (id: string, isPrivate: boolean) => {
        const status = isPrivate ? 'pending' : 'approved';
        const { error } = await (supabase as any).from('community_members').insert({
            community_id: id,
            user_id: user.id,
            status: status
        });

        if (!error) {
            toast({ title: isPrivate ? "Request Sent" : "Joined!", description: isPrivate ? "Admin approval required." : "You can now chat." });
            if (!isPrivate) setJoinedIds(new Set([...joinedIds, id]));
            else loadData(); // Refresh requests
        }
    };

    const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
        if (action === 'approved') {
            await (supabase as any).from('community_members').update({ status: 'approved' }).eq('id', requestId);
        } else {
            await (supabase as any).from('community_members').delete().eq('id', requestId);
        }
        setRequests(prev => prev.filter(r => r.id !== requestId));
        toast({ title: action === 'approved' ? "Authorized" : "Denied" });
    };

    const handlePinChat = async () => {
        if (!longPressedChat) return;
        const isPinned = pinnedIds.has(longPressedChat);
        try {
            const { error } = await (supabase as any)
                .from('community_members')
                .update({ is_pinned: !isPinned })
                .eq('community_id', longPressedChat)
                .eq('user_id', user.id);

            if (error) throw error;

            setPinnedIds(prev => {
                const next = new Set(prev);
                if (isPinned) next.delete(longPressedChat);
                else next.add(longPressedChat);
                return next;
            });
            setIsContextMenuOpen(false);
            toast({ title: isPinned ? "Chat Unpinned" : "Chat Pinned" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to update pin status", variant: "destructive" });
        }
    };

    const handleMarkRead = async () => {
        if (!longPressedChat) return;
        try {
            await (supabase as any).rpc('update_read_status', { p_community_id: longPressedChat });
            setUnreadCounts(prev => ({ ...prev, [longPressedChat]: 0 }));
            setIsContextMenuOpen(false);
            toast({ title: "Marked as Read" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to mark read", variant: "destructive" });
        }
    };

    const handleExitGroup = async () => {
        if (!longPressedChat) return;
        try {
            const { error } = await (supabase as any)
                .from('community_members')
                .delete()
                .eq('community_id', longPressedChat)
                .eq('user_id', user.id);

            if (error) throw error;

            setJoinedIds(prev => {
                const next = new Set(prev);
                next.delete(longPressedChat);
                return next;
            });
            setIsContextMenuOpen(false);
            toast({ title: "Left Group" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to leave group", variant: "destructive" });
        }
    };

    const handleSaveCommunity = async () => {
        if (!newCommunityName.trim() || !user) return;

        setIsCreating(true);
        try {
            let imageUrl = null;

            if (selectedImage) {
                const fileExt = selectedImage.name.split('.').pop();
                const filePath = `covers/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('community-uploads')
                    .upload(filePath, selectedImage);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('community-uploads')
                    .getPublicUrl(filePath);
                imageUrl = data.publicUrl;
            }

            const { data, error } = await (supabase as any)
                .from('communities')
                .insert({
                    name: newCommunityName.trim(),
                    created_by: user.id,
                    image_url: imageUrl,
                    is_private: isPrivate
                })
                .select()
                .single();

            if (error) throw error;
            setCommunities(prev => [...prev, data]);
            setJoinedIds(prev => new Set([...prev, data.id]));
            toast({ title: "Success", description: "Community protocol established!" });

            setIsCreateDialogOpen(false);
            setNewCommunityName("");
            setSelectedImage(null);
            setIsPrivate(false);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    };

    if (activeCommunityId) {
        return (
            <div className="fixed inset-0 z-[100] bg-background">
                <ChatInterface
                    communityId={activeCommunityId}
                    onBack={() => {
                        setActiveCommunityId(null);
                        loadData(); // Update unread counts
                    }}
                />
            </div>
        );
    }

    const filteredComms = communities.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'chats') return matchesSearch && joinedIds.has(c.id);
        if (activeTab === 'new') return matchesSearch && !joinedIds.has(c.id);
        return false;
    });

    const sortedChats = [...filteredComms].sort((a, b) => {
        const aP = pinnedIds.has(a.id) ? 1 : 0;
        const bP = pinnedIds.has(b.id) ? 1 : 0;
        return bP - aP;
    });

    return (
        <div className="flex flex-col h-full bg-background">
            {/* WhatsApp Header */}
            <header className="bg-primary dark:bg-card text-white pt-12 pb-0 shadow-sm shrink-0">
                <div className="px-4 pb-4 flex justify-between items-center">
                    {!isSearchVisible ? (
                        <>
                            <h1 className="text-xl font-bold tracking-tight">Study Squads</h1>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/10 rounded-full h-9 w-9"
                                    onClick={() => {
                                        const canCreate = ['elite', 'global', 'admin', 'consultant'].includes(profile?.subscription_tier || profile?.role);
                                        if (!canCreate) {
                                            toast({ title: "Restricted", description: "Upgrade to Elite or Global to create communities", variant: "destructive" });
                                            return;
                                        }
                                        setIsCreateDialogOpen(true);
                                    }}
                                >
                                    <Plus size={24} strokeWidth={2.5} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/10 rounded-full h-9 w-9"
                                    onClick={() => setIsSearchVisible(true)}
                                >
                                    <Search size={22} strokeWidth={2} />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 w-full bg-background/10 rounded-xl px-3 py-1 animate-in slide-in-from-right duration-300">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white h-8 w-8 hover:bg-transparent"
                                onClick={() => {
                                    setIsSearchVisible(false);
                                    setSearchQuery("");
                                }}
                            >
                                <ArrowLeft size={20} />
                            </Button>
                            <Input
                                autoFocus
                                placeholder="Search squads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white h-8 w-8"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X size={18} />
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex items-center text-white/60 font-bold text-[13px] uppercase tracking-wide">
                    <button className="px-4 pb-3"><Users size={20} /></button>
                    <button
                        onClick={() => setActiveTab('chats')}
                        className={cn(
                            "flex-1 pb-3 text-center border-b-[3px] transition-all",
                            activeTab === 'chats' ? "text-white border-white" : "border-transparent"
                        )}
                    >
                        Chats
                        {Object.values(unreadCounts).some(v => v > 0) && (
                            <span className="ml-2 bg-white text-primary rounded-full text-[10px] px-1.5 py-0.5 align-middle">
                                {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('new')}
                        className={cn(
                            "flex-1 pb-3 text-center border-b-[3px] transition-all",
                            activeTab === 'new' ? "text-white border-white" : "border-transparent"
                        )}
                    >
                        New
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={cn(
                            "flex-1 pb-3 text-center border-b-[3px] transition-all",
                            activeTab === 'requests' ? "text-white border-white" : "border-transparent"
                        )}
                    >
                        Requests
                        {requests.length > 0 && <span className="ml-2 bg-rose-500 text-white rounded-full text-[10px] px-1.5 py-0.5 align-middle">{requests.length}</span>}
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto bg-white dark:bg-[#111b21] custom-scrollbar">
                {activeTab === 'requests' ? (
                    <div className="px-4 space-y-4 pt-4">
                        {requests.length === 0 ? (
                            <div className="text-center py-20 opacity-30 flex flex-col items-center">
                                <Shield size={48} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">All Entry Protocols Verified</p>
                            </div>
                        ) : requests.map(req => (
                            <Card key={req.id} className="bg-secondary/20 border-border/40 rounded-[2rem] p-5 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                                        <AvatarImage src={req.profiles?.avatar_url} />
                                        <AvatarFallback>{req.profiles?.display_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-sm uppercase tracking-tight truncate">{req.profiles?.display_name}</h4>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Join: <span className="text-primary">{req.communities?.name}</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleRequestAction(req.id, 'approved')} className="flex-1 h-12 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase">Authorize</Button>
                                    <Button onClick={() => handleRequestAction(req.id, 'rejected')} variant="outline" className="flex-1 h-12 rounded-xl border-rose-500/20 text-rose-500 font-black text-[10px] uppercase">Deny</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-border/10 dark:divide-[#202c33]">
                        {sortedChats.length === 0 ? (
                            <div className="text-center py-20 opacity-20 flex flex-col items-center">
                                <MessageSquare size={48} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    {activeTab === 'chats' ? 'No active transmissions' : 'No new sectors localized'}
                                </p>
                            </div>
                        ) : sortedChats.map((c) => (
                            activeTab === 'chats' ? (
                                <ChatRow
                                    key={c.id}
                                    chat={c}
                                    unreadCount={unreadCounts[c.id] || 0}
                                    isPinned={pinnedIds.has(c.id)}
                                    onClick={() => setActiveCommunityId(c.id)}
                                    onLongPress={() => {
                                        setLongPressedChat(c.id);
                                        setIsContextMenuOpen(true);
                                    }}
                                />
                            ) : (
                                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                                    <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                                        <AvatarImage src={c.image_url} />
                                        <AvatarFallback>{c.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[16px] text-foreground">{c.name}</h3>
                                        <p className="text-[13px] text-muted-foreground truncate">{c.description || "Active study group"}</p>
                                    </div>
                                    <Button
                                        onClick={() => handleJoin(c.id, c.is_private)}
                                        size="sm"
                                        className="bg-primary hover:bg-primary/90 text-white rounded-full h-8 px-4 text-xs font-bold"
                                    >
                                        {c.is_private ? "Request" : "Follow"}
                                    </Button>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </main>


            {/* Context Menu Sheet */}
            <Sheet open={isContextMenuOpen} onOpenChange={setIsContextMenuOpen}>
                <SheetContent side="bottom" className="rounded-t-[1.5rem] p-6 pb-12">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Chat Options</SheetTitle>
                        <SheetDescription>Manage this conversation</SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4">
                        <Button variant="outline" className="justify-start gap-4 h-14 text-base font-semibold border-slate-200 dark:border-white/10" onClick={handlePinChat}>
                            <Pin size={20} className={longPressedChat && pinnedIds.has(longPressedChat) ? "fill-current" : ""} />
                            {longPressedChat && pinnedIds.has(longPressedChat) ? "Unpin Chat" : "Pin Chat"}
                        </Button>
                        <Button variant="outline" className="justify-start gap-4 h-14 text-base font-semibold border-slate-200 dark:border-white/10" onClick={handleMarkRead}>
                            <Check size={20} /> Mark as Read
                        </Button>
                        <Button variant="ghost" className="justify-start gap-4 h-14 text-base font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20" onClick={handleExitGroup}>
                            <X size={20} /> Exit Group
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
            {/* Create Community Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-0 shadow-2xl bg-background/95 backdrop-blur-xl p-6 sm:p-8 mx-0 sm:mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-center">New Squad</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Squad Name</label>
                            <Input
                                placeholder="e.g. IELTS Warriors"
                                value={newCommunityName}
                                onChange={(e) => setNewCommunityName(e.target.value)}
                                className="h-14 rounded-2xl bg-secondary/20 border-border/10 focus:border-primary focus:ring-0 text-lg font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cover Image</label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                                className="h-14 pt-3 rounded-2xl bg-secondary/20 border-border/10 cursor-pointer file:text-primary file:font-bold file:border-0 file:bg-transparent file:mr-4"
                            />
                        </div>

                        {(['elite', 'global', 'admin', 'consultant'].includes(profile?.subscription_tier?.toLowerCase() || '') || profile?.role === 'admin') && (
                            <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-2xl border border-border/5">
                                <input
                                    type="checkbox"
                                    id="isPrivateMobile"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isPrivateMobile" className="text-xs font-bold uppercase tracking-wide cursor-pointer flex-1">
                                    Private Squad <span className="block text-[9px] text-muted-foreground normal-case opacity-70">Approval required to join</span>
                                </label>
                            </div>
                        )}

                        <Button
                            onClick={handleSaveCommunity}
                            disabled={isCreating || !newCommunityName.trim()}
                            className="w-full h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 mt-2"
                        >
                            {isCreating ? <Loader2 className="animate-spin" /> : "Establish Protocol"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

// Helper component for long-press
const ChatRow = ({ chat, unreadCount, isPinned, onClick, onLongPress }: any) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPressRef = useRef(false);

    const handleStart = () => {
        isLongPressRef.current = false;
        timerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            if (navigator.vibrate) navigator.vibrate(50);
            onLongPress();
        }, 500);
    };

    const handleEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleCancel = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleClick = (e: any) => {
        if (isLongPressRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        onClick();
    };

    return (
        <div
            onClick={handleClick}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            onTouchMove={handleCancel}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleCancel}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/5 active:bg-secondary/10 transition-colors select-none"
        >
            <Avatar className="h-12 w-12 cursor-pointer">
                <AvatarImage src={chat.image_url} className="object-cover" />
                <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold">{chat.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 border-b border-border/5 pb-3">
                <div className="flex justify-between items-baseline mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="text-[16px] font-normal text-foreground truncate">{chat.name}</h3>
                        {isPinned && <Pin size={12} className="text-muted-foreground/40 rotate-45 shrink-0" />}
                    </div>
                    <span className={cn("text-[11px] font-medium", unreadCount > 0 ? "text-[#25d366]" : "text-muted-foreground")}>
                        Yesterday
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-[13px] text-muted-foreground truncate max-w-[85%] flex items-center gap-1">
                        <Check size={14} className="text-blue-500" />
                        {chat.description || "Active community group"}
                    </p>
                    {unreadCount > 0 && (
                        <div className="min-w-[20px] h-5 rounded-full bg-[#25d366] text-white text-[10px] font-bold flex items-center justify-center px-1">
                            {unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
