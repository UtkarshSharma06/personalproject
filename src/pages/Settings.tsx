import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
    User,
    Lock,
    Save,
    Loader2,
    CreditCard,
    GraduationCap,
    ShieldCheck,
    Key,
    Smartphone,
    X,
    ChevronRight,
    Camera,
    Check,
    Brain,
    Zap,
    Sparkles,
    MessageSquare
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { ImageCropper } from '@/components/ui/ImageCropper';
import MFAGuide from '../components/MFAGuide';
import { useCurrency } from '@/hooks/useCurrency';

export default function Settings() {
    const { user, profile, refreshProfile } = useAuth() as any;
    const isGoogleUser = user?.app_metadata?.provider === 'google';
    const navigate = useNavigate();
    const { toast } = useToast();
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(false);

    // Form States
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [isActivating, setIsActivating] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Image Cropper State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // UI View State
    const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'security' | 'subscription' | 'consultant' | 'mfa'>('main');

    // MFA States
    const { mfa } = useAuth();
    const [factors, setFactors] = useState<any[]>([]);
    const [isMFAEnabled, setIsMFAEnabled] = useState(false);
    const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState<any>(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifyingMFA, setIsVerifyingMFA] = useState(false);
    const [isMFAGuideOpen, setIsMFAGuideOpen] = useState(false);
    const [mfaPurpose, setMfaPurpose] = useState<'enroll' | 'unenroll'>('enroll');
    const [unenrollFactorId, setUnenrollFactorId] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || "");
            setUsername(profile.username || "");
            setAvatarUrl(profile.avatar_url || null);
            fetchMFAFactors();
        }
    }, [profile]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
                setIsCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        setIsCropperOpen(false);
        setIsUploading(true);
        try {
            const fileExt = 'jpg';
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, croppedBlob);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            toast({ title: "Success", description: "Profile picture updated!" });
        } catch (error: any) {
            toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsUploading(false);
            setSelectedImage(null);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const updates: any = {
                id: user.id,
                display_name: displayName,
                username: username,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            if (!isGoogleUser && password) {
                if (password !== confirmPassword) throw new Error("Passwords do not match");
                const { error: pwError } = await supabase.auth.updateUser({ password: password });
                if (pwError) throw pwError;
                setPassword("");
                setConfirmPassword("");
            }

            toast({ title: "Success", description: "Settings updated successfully." });
            setActiveSection('main');
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlan = async (planId: string) => {
        if (!user) return;
        setLoading(true);
        try {
            const tierMap: Record<string, string> = {
                'explorer': 'initiate',
                'pro': 'elite',
                'elite': 'global'
            };

            const { error } = await supabase
                .from('profiles')
                .update({
                    selected_plan: planId,
                    subscription_tier: tierMap[planId] || 'initiate'
                })
                .eq('id', user.id);

            if (error) throw error;

            toast({ title: "Plan Updated", description: `You have switched to the ${planId.toUpperCase()} plan.` });
            refreshProfile();
            setActiveSection('main');
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const fetchMFAFactors = async () => {
        const { data, error } = await mfa.listFactors();
        if (error) {
            console.error("Error listing MFA factors:", error);
            return;
        }
        setFactors(data.all || []);
        setIsMFAEnabled(data.all?.some((f: any) => f.status === 'verified') || false);
    };

    const handleEnrollMFA = async () => {
        setMfaPurpose('enroll');
        setIsEnrollDialogOpen(true);
        const { data, error } = await mfa.enroll();
        // ... rest of enroll logic

        if (error) {
            if (error.message?.includes("A factor with the family name for user already sett up") || error.code === 'factor_type_not_supported') {
                // If it already exists, refresh the factors and close the dialog
                // The user probably needs to verify the existing one or delete it
                await fetchMFAFactors();
                setIsEnrollDialogOpen(false);
                toast({
                    title: "Action Required",
                    description: "An unverified security factor already exists. Please complete verification or remove it first.",
                    variant: "destructive"
                });
                return;
            }
            toast({ title: "Enrollment Failed", description: error.message, variant: "destructive" });
            setIsEnrollDialogOpen(false);
            return;
        }
        setEnrollmentData(data);
    };

    const handleVerifyExisting = (factor: any) => {
        setMfaPurpose('enroll');
        setEnrollmentData(factor);
        setIsEnrollDialogOpen(true);
    };

    const handleVerifyMFA = async () => {
        if (!enrollmentData || verificationCode.length !== 6) return;
        setIsVerifyingMFA(true);
        try {
            const { error } = await mfa.challengeAndVerify(enrollmentData.id, verificationCode);
            if (error) throw error;

            if (mfaPurpose === 'unenroll' && unenrollFactorId) {
                const { error: unenrollError } = await mfa.unenroll(unenrollFactorId);
                if (unenrollError) throw unenrollError;
                toast({ title: "MFA Disabled", description: "Security factor removed successfully." });
            } else {
                toast({ title: "MFA Activated", description: "Your account is now protected." });
            }

            setIsEnrollDialogOpen(false);
            setEnrollmentData(null);
            setUnenrollFactorId(null);
            setVerificationCode("");
            fetchMFAFactors();
        } catch (error: any) {
            toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsVerifyingMFA(false);
        }
    };

    const handleUnenrollMFA = async (factorId: string) => {
        const factor = factors.find(f => f.id === factorId);
        if (!factor) return;

        if (!confirm("Disable MFA? This reduces your account security.")) return;

        try {
            // Check current AAL
            const { data: aalData } = await mfa.getAAL();

            // If factor is verified and we are at AAL1, we MUST verify first
            if (factor.status === 'verified' && aalData?.currentLevel === 'aal1') {
                setMfaPurpose('unenroll');
                setUnenrollFactorId(factorId);
                setEnrollmentData(factor);
                setIsEnrollDialogOpen(true);
                toast({
                    title: "Action Required",
                    description: "Please verify your identity with your MFA code before disabling security."
                });
                return;
            }

            const { error } = await mfa.unenroll(factorId);
            if (error) throw error;

            toast({ title: "MFA Disabled", description: "Security downgraded." });
            fetchMFAFactors();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleActivateConsultant = async () => {
        if (!accessCode) return;
        setIsActivating(true);
        try {
            const { data: codeData, error: codeError } = await supabase
                .from('consultant_access_codes')
                .select('*')
                .eq('code', accessCode.toUpperCase().trim())
                .single();

            if (codeError || !codeData) throw new Error("Invalid access code.");
            if (codeData.is_used) throw new Error("This code has already been used.");

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: 'consultant' })
                .eq('id', user.id);

            if (profileError) throw profileError;

            const { error: updateCodeError } = await supabase
                .from('consultant_access_codes')
                .update({ is_used: true, used_by: user.id })
                .eq('id', codeData.id);

            if (updateCodeError) throw updateCodeError;

            toast({ title: "Protocol Activated", description: "You are now recognized as an Admission Consultant." });
            setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
            toast({ title: "Activation Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsActivating(false);
        }
    };

    const SettingItem = ({ icon: Icon, title, subtitle, onClick, color = "indigo", danger = false }: any) => (
        <button
            onClick={onClick}
            className="w-full h-20 flex items-center gap-4 px-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-rose-50 text-rose-600' : `bg-${color}-50 text-${color}-600`
                }`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left overflow-hidden">
                <h3 className={`font-bold text-sm ${danger ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>{title}</h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest truncate">{subtitle}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
    );

    const SubPageHeader = ({ title, subtitle }: any) => (
        <div className="flex items-center gap-4 px-6 py-8 border-b border-slate-100 dark:border-white/5">
            <button onClick={() => setActiveSection('main')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={24} />
            </button>
            <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{title}</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#020617] lg:p-10 p-4">
                <div className="max-w-xl mx-auto space-y-6">

                    {activeSection === 'main' ? (
                        <>
                            {/* Profile Header Card */}
                            <Card className="p-8 rounded-[2.5rem] border-0 shadow-2xl shadow-indigo-500/5 bg-white dark:bg-slate-950 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="relative group/avatar">
                                        <div className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-white/5 overflow-hidden shadow-xl bg-slate-100 flex items-center justify-center">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-10 h-10 text-slate-300" />
                                            )}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 w-8 h-8 bg-[#00a884] rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-transform"
                                        >
                                            <Camera size={14} />
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-tight">
                                            {displayName || username || "Protocol Agent"}
                                        </h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{username ? `@${username}` : 'Citizen'}</p>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Plan</p>
                                            <div className="inline-flex w-fit items-center px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                {profile?.selected_plan === 'elite' ? 'Global Admission (Elite)' :
                                                    profile?.selected_plan === 'pro' ? 'Exam Prep (Pro)' :
                                                        profile?.selected_plan === 'explorer' ? 'Explorer' :
                                                            "Onboarding"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Settings List */}
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-indigo-500/5 bg-white dark:bg-slate-950 overflow-hidden divide-y divide-slate-100 dark:divide-white/5">
                                <SettingItem
                                    icon={User}
                                    title="Personal Info"
                                    subtitle="Display Name & Identity"
                                    onClick={() => setActiveSection('profile')}
                                    color="blue"
                                />
                                <SettingItem
                                    icon={Key}
                                    title="Account Security"
                                    subtitle={isGoogleUser ? "Managed by Google" : "Change Password & Credentials"}
                                    onClick={() => setActiveSection('security')}
                                    color="indigo"
                                />
                                <SettingItem
                                    icon={Smartphone}
                                    title="Two-Factor Auth"
                                    subtitle={isMFAEnabled ? "Active Protection" : "Setup Extra Security"}
                                    onClick={() => setActiveSection('mfa')}
                                    color="emerald"
                                />
                                <SettingItem
                                    icon={CreditCard}
                                    title="Membership Plan"
                                    subtitle="Billing & Tiers"
                                    onClick={() => setActiveSection('subscription')}
                                    color="violet"
                                />
                                {profile?.role !== 'consultant' && profile?.role !== 'admin' && (
                                    <SettingItem
                                        icon={ShieldCheck}
                                        title="Consultant Protocol"
                                        subtitle="Expert Activation"
                                        onClick={() => setActiveSection('consultant')}
                                        color="rose"
                                    />
                                )}
                            </Card>

                            {/* WhatsApp-style Contact Section */}
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-[#25d366]/5 bg-white dark:bg-slate-950 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#25d366]/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                                <div className="p-6 flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-[#25d366]/10 flex items-center justify-center text-[#25d366]">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Need Assistance?</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Support & Inquiries</p>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 space-y-4 relative z-10">
                                    <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-[#25d366]/30 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Support Channel</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-[#25d366] rounded-full animate-pulse" />
                                                <span className="text-[9px] font-black text-[#25d366] uppercase tracking-widest">24h Protocol</span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">info.italostudy@gmail.com</p>
                                    </div>
                                    <Button
                                        onClick={() => navigate('/contact')}
                                        className="w-full h-12 bg-[#25d366] hover:bg-[#20bd5c] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#25d366]/20 active:scale-[0.98]"
                                    >
                                        Open Communication Hub
                                    </Button>
                                </div>
                            </Card>
                        </>
                    ) : activeSection === 'profile' ? (
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-indigo-500/5 bg-white dark:bg-slate-950 overflow-hidden">
                            <SubPageHeader title="Personal" subtitle="Identity Management" />
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Display Name</Label>
                                        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</Label>
                                        <Input value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-xl h-12" />
                                    </div>
                                </div>
                                <Button onClick={handleUpdateProfile} disabled={loading} className="w-full h-12 bg-slate-900 dark:bg-white dark:text-black rounded-xl font-bold uppercase tracking-widest text-xs">
                                    {loading ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Profile
                                </Button>
                            </div>
                        </Card>
                    ) : activeSection === 'security' ? (
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-indigo-500/5 bg-white dark:bg-slate-950 overflow-hidden">
                            <SubPageHeader title="Security" subtitle="Credential Protocol" />
                            <div className="p-8 space-y-6">
                                {isGoogleUser ? (
                                    <div className="space-y-6 text-center py-4">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 dark:border-white/5">
                                            <svg className="w-8 h-8" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Google Managed</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
                                                Your security settings are handled via Google. Update your password in your Google account.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 rounded-xl h-12" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 rounded-xl h-12" />
                                                </div>
                                            </div>
                                        </div>
                                        <Button onClick={handleUpdateProfile} disabled={loading} className="w-full h-12 bg-slate-900 dark:bg-white dark:text-black rounded-xl font-bold uppercase tracking-widest text-xs">
                                            {loading ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            Update Credentials
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ) : activeSection === 'consultant' ? (
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-indigo-500/5 bg-white dark:bg-slate-950 overflow-hidden">
                            <SubPageHeader title="Protocol" subtitle="Consultant Activation" />
                            <div className="p-8 space-y-6">
                                <div className="p-6 bg-indigo-50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 text-center">
                                    <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">Enter Activation Code</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Provide your expert credentials</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Code</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="XXXX-XXXX" className="pl-10 rounded-xl h-12" />
                                    </div>
                                </div>
                                <Button onClick={handleActivateConsultant} disabled={isActivating || !accessCode} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs">
                                    {isActivating ? <Loader2 className="animate-spin" /> : "Activate Status"}
                                </Button>
                            </div>
                        </Card>
                    ) : activeSection === 'mfa' ? (
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-indigo-500/5 bg-white dark:bg-slate-950 overflow-hidden">
                            <SubPageHeader title="MFA" subtitle="Two-Factor Security" />
                            <div className="p-8 text-center space-y-6">
                                <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center ${isMFAEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    <Smartphone size={40} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                                        {isMFAEnabled ? 'Status: Protected' : 'Status: High Risk'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-2 max-w-[280px] mx-auto">
                                        Multi-Factor Authentication adds an extra layer of security to your protocol.
                                    </p>
                                </div>
                                <div className="pt-2 space-y-3">
                                    <div className="space-y-4">
                                        {factors.length > 0 ? (
                                            factors.map((factor: any) => (
                                                <div key={factor.id} className="flex items-center justify-between p-6 bg-emerald-50/10 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${factor.status === 'verified' ? 'bg-emerald-100' : 'bg-amber-100'
                                                            }`}>
                                                            <Smartphone className={`w-5 h-5 ${factor.status === 'verified' ? 'text-emerald-600' : 'text-amber-600'
                                                                }`} />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Authenticator</p>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${factor.status === 'verified' ? 'text-emerald-600' : 'text-amber-600'
                                                                }`}>
                                                                {factor.status === 'verified' ? 'Active' : 'Unverified'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {factor.status !== 'verified' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleVerifyExisting(factor)}
                                                                className="h-8 text-[9px] font-black uppercase tracking-widest border-amber-200 text-amber-600 hover:bg-amber-50"
                                                            >
                                                                Complete Setup
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" onClick={() => handleUnenrollMFA(factor.id)} className="text-rose-500 hover:bg-rose-50 rounded-full">
                                                            <X size={18} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <Button onClick={handleEnrollMFA} className="w-full h-12 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-xl font-bold uppercase tracking-widest text-xs">
                                                Setup 2FA
                                            </Button>
                                        )}
                                    </div>
                                    <Button variant="ghost" onClick={() => setIsMFAGuideOpen(true)} className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
                                        How it works?
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ) : activeSection === 'subscription' ? (
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-indigo-500/5 bg-white dark:bg-slate-950 overflow-hidden">
                            <SubPageHeader title="Plans" subtitle="Selection & Tiers" />
                            <div className="p-6 space-y-4">
                                {[
                                    {
                                        id: 'explorer',
                                        name: 'Explorer Plan',
                                        icon: Brain,
                                        color: 'slate',
                                        desc: 'Essential daily study habit.',
                                        price: 0,
                                        features: ['10-15 Questions Daily', 'Basic Stats', 'Sample Intro Videos']
                                    },
                                    {
                                        id: 'pro',
                                        name: 'Exam Prep Plan',
                                        icon: Zap,
                                        color: 'indigo',
                                        desc: 'Everything for exam confidence.',
                                        price: 5,
                                        features: ['Unlimited Practice', 'Full Simulations', 'Detailed Explanations', 'Full Learning Library']
                                    },
                                    {
                                        id: 'elite',
                                        name: 'Global Admission Plan',
                                        icon: Sparkles,
                                        color: 'amber',
                                        desc: 'Full support to university.',
                                        price: 10,
                                        features: ['Everything in Pro', 'Admission Strategy', 'Visa & Paperwork support', 'Elite Priority']
                                    }
                                ].map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`p-6 rounded-3xl border-2 transition-all ${profile?.selected_plan === plan.id
                                            ? 'bg-emerald-50/10 border-emerald-500/50 dark:bg-emerald-500/5'
                                            : 'bg-slate-50/50 border-slate-100 dark:bg-white/5 dark:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-2xl bg-${plan.color === 'slate' ? 'slate-100' : plan.id === 'pro' ? 'indigo-100' : 'amber-100'} flex items-center justify-center`}>
                                                <plan.icon className={`w-6 h-6 text-${plan.color === 'slate' ? 'slate-600' : plan.id === 'pro' ? 'indigo-600' : 'amber-600'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{plan.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        {plan.price > 0 ? (
                                                            <>
                                                                <span className="text-[10px] font-black text-slate-400 line-through uppercase tracking-widest">{formatPrice(plan.price)}</span>
                                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">FREE</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Free</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{plan.desc}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                                                    </div>
                                                    <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {profile?.selected_plan === plan.id ? (
                                            <Button disabled className="w-full h-10 bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                                                <Check className="mr-2 h-3.5 w-3.5" /> Active Plan
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleUpdatePlan(plan.id)}
                                                disabled={loading}
                                                className="w-full h-10 bg-slate-900 dark:bg-white dark:text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#00a884] dark:hover:bg-[#00a884] dark:hover:text-white transition-colors"
                                            >
                                                {loading ? <Loader2 className="animate-spin" /> : "Switch to Plan"}
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-8 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#00a884] rounded-full animate-pulse" />
                                        Note to Agent
                                    </h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                        Your protocol status is globally synchronized. All features are currently unlocked under Beta Authorization phase. Switching plans will take immediate effect across all simulation nodes.
                                    </p>
                                </div>
                                <div className="pt-4 text-center">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-relaxed">
                                        All plans are currently free during our Beta Protocol phase.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : null}

                    {/* App Footer Info */}
                    <div className="text-center pb-12">
                        <p className="text-[9px] font-black text-slate-300 dark:text-white/10 uppercase tracking-[0.4em]">Protocol Version 2.0.4</p>
                    </div>
                </div>
            </div>

            {/* Cropper Integration */}
            {isCropperOpen && selectedImage && (
                <ImageCropper
                    image={selectedImage}
                    circular={true}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setIsCropperOpen(false);
                        setSelectedImage(null);
                    }}
                />
            )}

            {/* MFA Enrollment Dialog */}
            <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[2rem] border-0 shadow-2xl bg-white dark:bg-slate-950 p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase text-center">Security Protocol</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-2">
                            {enrollmentData?.totp?.qr_code
                                ? "Scan the code with your authenticator app"
                                : "Enter the code from your authenticator app"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center space-y-8 py-4">
                        {enrollmentData?.totp?.qr_code ? (
                            <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                <img
                                    src={enrollmentData.totp.qr_code}
                                    alt="MFA QR Code"
                                    className="w-48 h-48"
                                />
                            </div>
                        ) : enrollmentData && (
                            <div className="p-6 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/20 text-center max-w-[280px]">
                                <Smartphone className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                                    If you haven't scanned the QR code yet, please delete this factor and start over.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4 w-full">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center block">Verification Code</Label>
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(value) => setVerificationCode(value)}
                                >
                                    <InputOTPGroup className="gap-2">
                                        <InputOTPSlot index={0} className="w-10 h-12 rounded-xl text-lg font-black bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10" />
                                        <InputOTPSlot index={1} className="w-10 h-12 rounded-xl text-lg font-black bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10" />
                                        <InputOTPSlot index={2} className="w-10 h-12 rounded-xl text-lg font-black bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10" />
                                        <InputOTPSlot index={3} className="w-10 h-12 rounded-xl text-lg font-black bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10" />
                                        <InputOTPSlot index={4} className="w-10 h-12 rounded-xl text-lg font-black bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10" />
                                        <InputOTPSlot index={5} className="w-10 h-12 rounded-xl text-lg font-black bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10" />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-center">
                        <Button
                            onClick={handleVerifyMFA}
                            disabled={verificationCode.length !== 6 || isVerifyingMFA}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
                        >
                            {isVerifyingMFA ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <MFAGuide open={isMFAGuideOpen} onOpenChange={setIsMFAGuideOpen} />
        </Layout>
    );
}
