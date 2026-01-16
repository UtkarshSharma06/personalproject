import { useEffect, useState } from "react";
import { Plus, Hash, Users, Search, MoreVertical, Pencil, Trash, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Community {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    created_by: string;
}

interface CommunitySidebarProps {
    activeCommunityId: string | null;
    onSelectCommunity: (id: string) => void;
}

export function CommunitySidebar({ activeCommunityId, onSelectCommunity }: CommunitySidebarProps) {
    const { user, profile } = useAuth() as any;
    const { toast } = useToast();
    const [communities, setCommunities] = useState<Community[]>([]);
    const [unreadMentions, setUnreadMentions] = useState<Record<string, number>>({});
    const [newCommunityName, setNewCommunityName] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [editingCommunity, setEditingCommunity] = useState<Community | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCommunities();
        fetchUnreadMentions();

        // Subscribe to new mentions
        const channel = supabase
            .channel('mention_notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_mentions',
                    filter: `user_id=eq.${user?.id}`
                },
                () => {
                    fetchUnreadMentions();
                }
            )
            .subscribe();

        // Subscribe to Community Updates (Create/Delete/Update)
        const communityChannel = supabase
            .channel('communities_sidebar')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'communities'
                },
                (payload: any) => {
                    if (payload.eventType === 'INSERT') {
                        setCommunities(prev => [...prev, payload.new as Community]);
                    } else if (payload.eventType === 'DELETE') {
                        setCommunities(prev => prev.filter(c => c.id !== payload.old.id));
                        if (activeCommunityId === payload.old.id) onSelectCommunity(null as any);
                    } else if (payload.eventType === 'UPDATE') {
                        setCommunities(prev => prev.map(c => c.id === payload.new.id ? payload.new as Community : c));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(communityChannel);
        };
    }, [user?.id, activeCommunityId, onSelectCommunity]);

    const fetchCommunities = async () => {
        const { data, error } = await (supabase as any)
            .from('communities')
            .select('*')
            .order('created_at', { ascending: true });

        if (data) {
            setCommunities(data);
            // Don't auto-select on mobile - let user choose
        }
    };

    const fetchUnreadMentions = async () => {
        if (!user) return;
        const { data } = await (supabase as any)
            .from('chat_mentions')
            .select('community_id')
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (data) {
            const counts: Record<string, number> = {};
            data.forEach((m: any) => {
                counts[m.community_id] = (counts[m.community_id] || 0) + 1;
            });
            setUnreadMentions(counts);
        }
    };

    const handleSaveCommunity = async () => {
        if (!newCommunityName.trim() || !user) return;

        setIsCreating(true);
        try {
            let imageUrl = editingCommunity?.image_url || null;

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

            if (editingCommunity) {
                const { data, error } = await (supabase as any)
                    .from('communities')
                    .update({
                        name: newCommunityName.trim(),
                        image_url: imageUrl
                    })
                    .eq('id', editingCommunity.id)
                    .select()
                    .single();

                if (error) throw error;
                setCommunities(prev => prev.map(c => c.id === data.id ? data : c));
                toast({ title: "Success", description: "Community updated!" });
            } else {
                const { data, error } = await (supabase as any)
                    .from('communities')
                    .insert({
                        name: newCommunityName.trim(),
                        created_by: user.id,
                        image_url: imageUrl
                    })
                    .select()
                    .single();

                if (error) throw error;
                setCommunities(prev => [...prev, data]);
                onSelectCommunity(data.id);
                toast({ title: "Success", description: "Community created!" });
            }

            setIsDialogOpen(false);
            setNewCommunityName("");
            setSelectedImage(null);
            setEditingCommunity(null);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteCommunity = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this community?")) return;

        try {
            const { error } = await (supabase as any).from('communities').delete().eq('id', id);
            if (error) throw error;

            setCommunities(prev => prev.filter(c => c.id !== id));
            if (activeCommunityId === id) onSelectCommunity("");
            toast({ title: "Deleted", description: "Community deleted." });
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
        }
    };

    return (
        <div className="w-80 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black/20 flex flex-col">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-black text-xl text-slate-900 dark:text-slate-100 tracking-tight">Chats</h2>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (open) {
                        // Check subscription tier
                        const tier = profile?.subscription_tier?.toLowerCase();
                        const isPremium = tier === 'elite' || tier === 'global' || profile?.role === 'admin' || profile?.role === 'consultant';

                        if (!isPremium) {
                            setIsUpgradeDialogOpen(true);
                            return;
                        }
                    }
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingCommunity(null);
                        setNewCommunityName("");
                        setSelectedImage(null);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCommunity ? "Edit Community" : "Create New Community"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Community Name</label>
                                <Input
                                    placeholder="e.g. IELTS Study Group"
                                    value={newCommunityName}
                                    onChange={(e) => setNewCommunityName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cover Image (Optional)</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                                />
                            </div>
                            <Button
                                onClick={handleSaveCommunity}
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                                disabled={isCreating || !newCommunityName.trim()}
                            >
                                {isCreating ? "Saving..." : (editingCommunity ? "Save Changes" : "Create Community")}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Refined Upgrade Dialog */}
                <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
                    <DialogContent className="p-0 overflow-hidden border-none max-w-lg rounded-[2rem] bg-transparent">
                        <div className="relative w-full bg-slate-950 p-10 overflow-hidden border border-white/10 rounded-[2rem]">
                            {/* Animated Background Orbs */}
                            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[80px]" />
                            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[80px]" />

                            <div className="relative z-10 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 backdrop-blur-md rounded-full border border-indigo-500/20 mb-6">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none">Premium Feature</span>
                                </div>

                                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter leading-tight italic uppercase">
                                    BUILD YOUR <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">COMMUNITY.</span>
                                </h2>

                                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 max-w-[280px] mx-auto">
                                    Creating study groups and specialized chats is exclusive to Exam Prep & Global plans.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                                        <Zap className="w-5 h-5 text-amber-400" />
                                        <span className="text-[10px] font-black text-white/70 uppercase">Instant Chat</span>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                                        <Shield className="w-5 h-5 text-indigo-400" />
                                        <span className="text-[10px] font-black text-white/70 uppercase">Study Groups</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={() => {
                                            setIsUpgradeDialogOpen(false);
                                            navigate('/community/upgrade');
                                        }}
                                        className="h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase rounded-xl tracking-wide group shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                                    >
                                        Upgrade Now
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsUpgradeDialogOpen(false)}
                                        className="text-slate-500 hover:text-white font-bold text-xs uppercase"
                                    >
                                        Maybe later
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search (Visual only for now) */}
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search"
                        className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 h-9 rounded-xl focus-visible:ring-offset-0 focus-visible:ring-indigo-500/20"
                    />
                </div>
            </div>

            {/* Community List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {communities.map((community) => (
                    <button
                        key={community.id}
                        onClick={() => {
                            onSelectCommunity(community.id);
                            setUnreadMentions(prev => ({ ...prev, [community.id]: 0 }));
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${activeCommunityId === community.id
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-100'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${activeCommunityId === community.id ? 'bg-indigo-200 dark:bg-indigo-500/20 text-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                            {community.image_url ? (
                                <img src={community.image_url} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <Hash className="h-5 w-5" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 text-left flex justify-between items-center">
                            <div className="truncate">
                                <h3 className="font-bold text-sm truncate">{community.name}</h3>
                                <p className="text-xs opacity-60 truncate">Active today</p>
                            </div>
                            {user && (community.created_by === user.id || profile?.role === 'admin') && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                setEditingCommunity(community);
                                                setNewCommunityName(community.name);
                                                setIsDialogOpen(true);
                                            }}>
                                                <Pencil className="mr-2 h-3 w-3" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => handleDeleteCommunity(community.id, e)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash className="mr-2 h-3 w-3" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {unreadMentions[community.id] > 0 && (
                                <div className="h-5 min-w-[1.25rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                    @{unreadMentions[community.id] > 9 ? '9+' : unreadMentions[community.id]}
                                </div>
                            )}
                        </div>
                    </button>
                ))}
                {communities.length === 0 && (
                    <div className="text-center p-4 text-sm text-muted-foreground">
                        No communities found. Create one!
                    </div>
                )}
            </div>
        </div>
    );
}
