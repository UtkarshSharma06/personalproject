import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
    Users,
    Search,
    Shield,
    ShieldAlert,
    MessageSquare,
    MessageSquareOff,
    Ban,
    CheckCircle2,
    Loader2,
    Trash2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface Profile {
    id: string;
    email: string; // Note: Email might not be in public view unless exposure is enabled, usually auth.users is simpler but profiles is safer. 
    // If email is null in profiles, we might need to rely on username.
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    role: string;
    subscription_tier: string | null;
    community_enabled: boolean;
    is_banned: boolean;
    created_at: string;
}

export default function UserManager() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data as any[] as Profile[]);
        } catch (error: any) {
            toast({
                title: "Error fetching users",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleCommunity = async (userId: string, currentStatus: boolean, username: string) => {
        try {
            const { error } = await (supabase as any)
                .from('profiles')
                .update({ community_enabled: !currentStatus })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(u => u.id === userId ? { ...u, community_enabled: !currentStatus } : u));
            toast({
                title: !currentStatus ? "Community Access Restored" : "Community Access Restricted",
                description: `Updated access for ${username}`
            });
        } catch (error: any) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
        }
    };

    const handleToggleBan = async (userId: string, currentStatus: boolean, username: string) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'BAN'} ${username}? This will restrict their login access.`)) return;

        try {
            const { error } = await (supabase as any)
                .from('profiles')
                .update({ is_banned: !currentStatus })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(u => u.id === userId ? { ...u, is_banned: !currentStatus } : u));
            toast({
                title: !currentStatus ? "User Banned" : "User Unbanned",
                description: `${username} has been ${!currentStatus ? 'banned' : 'restored'}.`
            });
        } catch (error: any) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
        }
    };

    const handleDeleteUser = async (userId: string, username: string) => {
        if (!confirm(`Are you sure you want to PERMANENTLY DELETE ${username}? This action is irreversible and will remove all their data.`)) return;

        // Final safety check
        if (!confirm(`Please confirm again: DELETE ${username} permanently?`)) return;

        try {
            const { error } = await supabase.rpc('delete_user_by_admin', { target_user_id: userId });

            if (error) throw error;

            setUsers(users.filter(u => u.id !== userId));
            toast({
                title: "User Deleted",
                description: `${username} has been permanently removed.`
            });
        } catch (error: any) {
            console.error('Delete user error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to delete user",
                variant: "destructive"
            });
        }
    };

    const handleUpdateTier = async (userId: string, newTier: string, userName: string) => {
        try {
            // Map subscription tier to selected_plan
            const planMap: Record<string, string> = {
                'initiate': 'explorer',
                'elite': 'pro',
                'global': 'elite'
            };

            const { error } = await supabase
                .from('profiles')
                .update({
                    subscription_tier: newTier,
                    selected_plan: planMap[newTier] || 'explorer'
                })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "Tier Updated",
                description: `${userName}'s subscription tier has been updated to ${newTier.toUpperCase()}.`,
            });

            fetchUsers();
        } catch (error: any) {
            console.error('Update tier error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to update subscription tier",
                variant: "destructive"
            });
        }
    };

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        return (
            (user.display_name?.toLowerCase() || '').includes(query) ||
            (user.username?.toLowerCase() || '').includes(query) ||
            (user.email?.toLowerCase() || '').includes(query)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-card p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-border">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users by name, username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-bold">{users.length}</span> Total Users
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No users found matching "{searchQuery}"
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`
                                group flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition-all
                                ${user.is_banned ? 'bg-destructive/5 border-destructive/20' : 'bg-white dark:bg-card border-slate-100 dark:border-border hover:border-indigo-200'}
                            `}
                        >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                    <AvatarImage src={user.avatar_url || undefined} />
                                    <AvatarFallback className="font-bold bg-indigo-50 text-indigo-600">
                                        {(user.display_name || user.username || '?')[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900 dark:text-slate-100">
                                            {user.display_name || 'Unknown'}
                                        </h3>
                                        {user.role === 'admin' && (
                                            <Badge variant="default" className="bg-indigo-600 text-[10px] uppercase">Admin</Badge>
                                        )}
                                        {user.is_banned && (
                                            <Badge variant="destructive" className="text-[10px] uppercase">Banned</Badge>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <span className="font-mono text-xs">@{user.username || 'user'}</span>
                                        {user.email && <span className="text-xs opacity-50">• {user.email}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                                {/* Subscription Tier Selector */}
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plan</span>
                                    <select
                                        value={user.subscription_tier || 'initiate'}
                                        onChange={(e) => handleUpdateTier(user.id, e.target.value, user.display_name || user.username || 'User')}
                                        disabled={user.role === 'admin'}
                                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="initiate">Initiate</option>
                                        <option value="elite">Elite</option>
                                        <option value="global">Global</option>
                                    </select>
                                </div>

                                {/* Community Toggler */}
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${user.community_enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {user.community_enabled ? 'Chat Active' : 'Chat Restricted'}
                                        </span>
                                        <Switch
                                            checked={user.community_enabled}
                                            onCheckedChange={() => handleToggleCommunity(user.id, user.community_enabled, user.display_name || user.username || 'User')}
                                            disabled={user.role === 'admin'}
                                        />
                                    </div>
                                </div>

                                {/* Ban Button */}
                                <Button
                                    variant={user.is_banned ? "default" : "ghost"}
                                    size="sm"
                                    className={user.is_banned ? "bg-emerald-600 hover:bg-emerald-700" : "text-destructive hover:bg-destructive/10"}
                                    onClick={() => handleToggleBan(user.id, user.is_banned, user.display_name || user.username || 'User')}
                                    disabled={user.role === 'admin'}
                                >
                                    {user.is_banned ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
                                    {user.is_banned ? "Unban User" : "Ban"}
                                </Button>

                                {/* Delete Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(user.id, user.display_name || user.username || 'User')}
                                    disabled={user.role === 'admin'}
                                    title="Permanently Delete User"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
