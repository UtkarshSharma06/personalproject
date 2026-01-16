import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { User, Lock, MessageCircle, Save, Loader2, CreditCard, GraduationCap, ShieldCheck, Key } from 'lucide-react';

export default function Settings() {
    const { user, profile } = useAuth() as any;
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form States
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [isActivating, setIsActivating] = useState(false);

    // Initial Load
    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || "");
            setUsername(profile.username || "");
        }
    }, [profile]);

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            // 1. Update Username & Community Setting
            const updates: any = {
                id: user.id,
                display_name: displayName,
                username: username,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            // 2. Update Password if provided
            if (password) {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                const { error: pwError } = await supabase.auth.updateUser({ password: password });
                if (pwError) throw pwError;
                setPassword("");
                setConfirmPassword("");
            }

            toast({ title: "Success", description: "Settings updated successfully." });

        } finally {
            setLoading(false);
        }
    };

    const handleActivateConsultant = async () => {
        if (!accessCode) return;
        setIsActivating(true);
        try {
            // 1. Verify and Use Code
            const { data: codeData, error: codeError } = await supabase
                .from('consultant_access_codes')
                .select('*')
                .eq('code', accessCode.toUpperCase().trim())
                .single();

            if (codeError || !codeData) throw new Error("Invalid access code.");
            if (codeData.is_used) throw new Error("This code has already been used.");
            if (new Date(codeData.expires_at) < new Date()) throw new Error("This code has expired.");

            // 2. Update Profile Role
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: 'consultant' })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // 3. Mark Code as Used
            const { error: updateCodeError } = await supabase
                .from('consultant_access_codes')
                .update({ is_used: true, used_by: user.id })
                .eq('id', codeData.id);

            if (updateCodeError) throw updateCodeError;

            toast({ title: "Protocol Activated", description: "You are now recognized as an Admission Consultant." });
            setAccessCode("");
            window.location.reload();

        } catch (error: any) {
            toast({ title: "Activation Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsActivating(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">Account Settings</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Manage your profile and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Subscription Plan */}
                    <Card className="p-8 rounded-[2rem] border-2 border-slate-100 dark:border-border border-b-4 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Subscription Plan</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Your current access tier</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-muted rounded-2xl border border-slate-100 dark:border-border">
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                                    {profile?.selected_plan === 'explorer' ? 'Explorer Plan' :
                                        profile?.selected_plan === 'pro' ? 'Exam Prep Plan' :
                                            profile?.selected_plan === 'elite' ? 'Global Admission Plan' :
                                                'No Plan Selected'}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                    {profile?.selected_plan === 'elite' ? 'Apply University Service' :
                                        profile?.selected_plan === 'pro' ? 'Full Study Access' :
                                            'Essential Daily Practice'}
                                </p>
                            </div>
                            <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-9" onClick={() => navigate('/onboarding')}>
                                Change Plan
                            </Button>
                        </div>
                    </Card>

                    {/* Public Profile */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-500" />
                                Public Profile
                            </CardTitle>
                            <CardDescription>How you appear to others in the community.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Display Name</Label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Username (for tagging)</Label>
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    placeholder="username"
                                />
                                <p className="text-xs text-muted-foreground">Only lowercase letters, numbers, and underscores.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Lock className="h-5 w-5 text-indigo-500" />
                                Security
                            </CardTitle>
                            <CardDescription>Update your password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave empty to keep current"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm New Password</Label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Consultant Activation */}
                    {profile?.role !== 'consultant' && profile?.role !== 'admin' && (
                        <Card className="p-8 rounded-[2rem] border-2 border-indigo-100 dark:border-indigo-900 border-b-4 shadow-xl shadow-indigo-100/50 bg-indigo-50/10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Consultant Protocol</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Activate Expert Access</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Code</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                placeholder="XXXX-XXXX"
                                                value={accessCode}
                                                onChange={(e) => setAccessCode(e.target.value)}
                                                className="pl-10 rounded-xl border-slate-200"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleActivateConsultant}
                                            disabled={isActivating || !accessCode}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black px-6"
                                        >
                                            {isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Activate"}
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                        Enter the unique security code provided by the administrator to unlock the expert dashboard.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Mission Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-indigo-500" />
                                Mission Configuration
                            </CardTitle>
                            <CardDescription>Your current target exam and platform settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Exam</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                                        {profile?.selected_exam?.replace('-prep', '').replace('-academic', '') || "Not Selected"}
                                    </p>
                                </div>
                                <GraduationCap className="h-5 w-5 text-slate-300" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleUpdateProfile} disabled={loading} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 font-bold">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
