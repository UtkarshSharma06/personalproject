import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Shield, ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function MobileAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    // MFA State
    const [requiresMFA, setRequiresMFA] = useState(false);
    const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
    const [mfaCode, setMfaCode] = useState("");
    const [mfaError, setMfaError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user, signIn, signUp, signInWithGoogle, mfa, signOut } = useAuth() as any;
    const navigate = useNavigate();

    // Auto-redirect if user gets logged in (e.g. by native Google Auth)
    useEffect(() => {
        if (user) {
            navigate('/mobile/dashboard');
        }
    }, [user, navigate]);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                const { data, error } = await signIn(email, password);
                if (error) throw error;

                // Check if MFA is required
                const session = data?.session;
                if (session) {
                    const currentAAL = session.authenticator_assurance_level;
                    const { data: factorsData } = await mfa.listFactors();
                    const totpFactor = factorsData?.all?.find((f: any) => f.factor_type === 'totp' && f.status === 'verified');

                    if (totpFactor && currentAAL !== 'aal2') {
                        setMfaFactorId(totpFactor.id);
                        setRequiresMFA(true);
                        setIsLoading(false);
                        return;
                    }
                }

                toast({ title: "Login Successful", description: "Welcome back!" });
                navigate('/dashboard');
            } else {
                const { error } = await signUp(email, password, displayName);
                if (error) throw error;
                toast({ title: "Account Created", description: "Let's get started!" });
                navigate('/onboarding');
            }
        } catch (error: any) {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = async () => {
        setIsLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) {
                toast({
                    title: "Authentication Error",
                    description: error.message,
                    variant: "destructive",
                });
            }
            // Note: If successful, the useEffect above handles the redirect
        } finally {
            setIsLoading(false);
        }
    };

    const handleMFAVerify = async () => {
        if (!mfaFactorId) return;
        if (mfaCode.length !== 6) {
            setMfaError("ENTER 6-DIGIT CODE");
            return;
        }

        setIsLoading(true);
        setMfaError("");
        try {
            const { error } = await mfa.challengeAndVerify(mfaFactorId, mfaCode);
            if (error) {
                setMfaError("INVALID CODE");
                toast({ title: "Verification Failed", description: "Code is incorrect", variant: "destructive" });
            } else {
                toast({ title: "MFA Verified", description: "Welcome back!" });
                setRequiresMFA(false);
                navigate('/dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMFACancel = () => {
        signOut();
        setRequiresMFA(false);
        setMfaCode("");
        setMfaError("");
    };

    return (
        <div className="flex flex-col min-h-screen bg-background p-8 pb-12 animate-in fade-in duration-500">
            {/* Native Header */}
            <header className="pt-10 mb-12 flex items-center gap-4 relative">
                <button onClick={() => navigate('/')} className="p-2 -ml-2 text-muted-foreground"><ChevronLeft /></button>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">{isLogin ? 'Sign In' : 'Sign Up'}</h1>
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Student Access</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                {!isLogin && (
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-muted-foreground ml-2 tracking-widest">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="YOUR FULL NAME"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="pl-12 h-14 bg-secondary/20 border-border/40 rounded-2xl font-bold text-xs uppercase"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground ml-2 tracking-widest">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-14 bg-secondary/20 border-border/40 rounded-2xl font-bold text-xs uppercase"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-muted-foreground ml-2 tracking-widest">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="password"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 h-14 bg-secondary/20 border-border/40 rounded-2xl font-bold text-xs"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        disabled={isLoading}
                        className="w-full h-16 bg-primary text-white hover:bg-primary/90 font-black text-xs uppercase tracking-widest rounded-[2rem] shadow-xl shadow-primary/20 active:scale-95 transition-all"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                    </Button>
                </div>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50"></div></div>
                    <div className="relative flex justify-center text-[9px] font-black uppercase text-muted-foreground"><span className="bg-background px-4">or continue with</span></div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogle}
                    className="w-full h-14 rounded-2xl border-border/50 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:bg-secondary/20"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21.35 11.1h-9.17v2.98h5.24c-.22 1.17-.88 2.16-1.87 2.82v2.34h3.03c1.77-1.63 2.79-4.04 2.79-6.84 0-.69-.06-1.35-.19-1.99z" className="text-[#4285F4]" />
                        <path fill="currentColor" d="M12.18 21.02c2.58 0 4.75-.85 6.33-2.31l-3.03-2.34c-.85.57-1.94.91-3.3.91-2.48 0-4.58-1.67-5.33-3.92H3.69v2.46C5.26 18.96 8.47 21.02 12.18 21.02z" className="text-[#34A853]" />
                        <path fill="currentColor" d="M6.85 13.36a5.45 5.45 0 0 1 0-3.41V7.49H3.69c-1.64 3.25-1.64 7.12 0 10.38l3.16-2.46z" className="text-[#FBBC05]" />
                        <path fill="currentColor" d="M12.18 5.76c1.37-.03 2.68.49 3.65 1.42l2.71-2.71C16.89 2.91 14.62 1.95 12.18 2c-3.71 0-6.91 2.06-8.49 5.49l3.16 2.46c.75-2.25 2.85-3.92 5.33-3.92z" className="text-[#EA4335]" />
                    </svg>
                    Continue with Google
                </Button>
            </form>

            <footer className="mt-12 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[10px] font-black text-primary uppercase tracking-widest"
                >
                    {isLogin ? "New Student? Create Account" : "Already have an account? Sign In"}
                </button>
                <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
                    <Shield size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                </div>
            </footer>

            {/* MFA SECURITY OVERLAY */}
            <Dialog open={requiresMFA} onOpenChange={(open) => !open && handleMFACancel()}>
                <DialogContent className="w-[92%] max-w-[340px] bg-background border-border/40 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden">
                    <DialogHeader className="items-center text-center space-y-3">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                            <ShieldCheck className="w-7 h-7 text-primary" />
                        </div>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Security Check</DialogTitle>
                        <DialogDescription className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-relaxed px-2">
                            Enter the 6-digit code from your authenticator app to authorize this device.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 flex flex-col items-center space-y-6">
                        <InputOTP
                            maxLength={6}
                            value={mfaCode}
                            onChange={(val) => {
                                setMfaCode(val);
                                setMfaError("");
                            }}
                        >
                            <InputOTPGroup className="gap-1.5">
                                {[0, 1, 2, 3, 4, 5].map((idx) => (
                                    <InputOTPSlot
                                        key={idx}
                                        index={idx}
                                        className="w-9 h-12 bg-secondary/20 border-border/40 rounded-xl text-lg font-black text-primary focus:ring-primary"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>

                        {mfaError && (
                            <span className="text-[9px] font-black text-destructive uppercase tracking-widest animate-pulse">
                                {mfaError}
                            </span>
                        )}

                        <Button
                            onClick={handleMFAVerify}
                            disabled={isLoading || mfaCode.length < 6}
                            className="w-full h-14 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Authorize Link'}
                        </Button>

                        <button
                            onClick={handleMFACancel}
                            className="text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            Cancel Authentication
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
