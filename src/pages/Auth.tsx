import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Brain, Mail, Lock, User, Sparkles, Loader2, ShieldAlert, Shield } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
    const [searchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [requiresMFA, setRequiresMFA] = useState(false);
    const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
    const [mfaCode, setMfaCode] = useState("");

    const { user, signIn, signUp, signInWithGoogle, resetPassword, mfa } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (searchParams.get('banned') === 'true') {
            toast({
                title: "Access Denied",
                description: "you are banned contact- 05sharmautkarsh@gmail.com",
                variant: "destructive",
                duration: Infinity,
            });
        }
    }, [searchParams]);

    useEffect(() => {
        if (user && !isLoading && !requiresMFA) {
            navigate('/dashboard');
        }
    }, [user, navigate, isLoading, requiresMFA]);

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        try {
            emailSchema.parse(email);
        } catch (e) {
            if (e instanceof z.ZodError) {
                newErrors.email = e.errors[0].message;
            }
        }

        try {
            passwordSchema.parse(password);
        } catch (e) {
            if (e instanceof z.ZodError) {
                newErrors.password = e.errors[0].message;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            emailSchema.parse(email);
        } catch (e) {
            if (e instanceof z.ZodError) {
                setErrors({ email: e.errors[0].message });
                return;
            }
        }

        setIsLoading(true);
        try {
            const { error } = await resetPassword(email);
            if (error) {
                toast({
                    title: 'Reset failed',
                    description: error.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Email sent!',
                    description: 'Check your inbox for the password reset link.',
                });
                setIsForgotPassword(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (isLogin) {
                const { data, error } = await signIn(email, password);
                if (error) {
                    toast({
                        title: 'Sign in failed',
                        description: error.message === 'Invalid login credentials'
                            ? 'Invalid email or password. Please try again.'
                            : error.message,
                        variant: 'destructive',
                    });
                } else {
                    // Check if user has MFA enabled using the returned session
                    const session = data?.session;

                    if (session) {
                        // Check the current assurance level
                        const currentAAL = session.authenticator_assurance_level;

                        // Get available factors
                        const { data: factorsData } = await mfa.listFactors();
                        const totpFactor = factorsData?.all?.find((f: any) => f.factor_type === 'totp' && f.status === 'verified');

                        // If user has MFA enrolled but current AAL is not aal2, require MFA challenge
                        if (totpFactor && currentAAL !== 'aal2') {
                            setMfaFactorId(totpFactor.id);
                            setRequiresMFA(true);
                            setIsLoading(false);
                            return;
                        }
                    }

                    toast({
                        title: 'Welcome back!',
                        description: 'You have successfully signed in.',
                    });
                    navigate('/dashboard');
                }
            } else {
                const { data, error } = await signUp(email, password, displayName);
                if (error) {
                    toast({
                        title: 'Sign up failed',
                        description: error.message.includes('already registered')
                            ? 'This email is already registered. Please sign in instead.'
                            : error.message,
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: 'Account created!',
                        description: 'Welcome to Italostudy. Let\'s get started!',
                    });
                    navigate('/onboarding');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };


    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error: any) {
            toast({
                title: 'Sign in failed',
                description: error.message,
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    const handleMFAVerify = async () => {
        if (!mfaFactorId || mfaCode.length !== 6) return;
        setIsLoading(true);
        try {
            const { error } = await mfa.challengeAndVerify(mfaFactorId, mfaCode);
            if (error) {
                toast({
                    title: 'Verification failed',
                    description: 'Invalid code. Please try again.',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Welcome back!',
                    description: 'MFA verified successfully.',
                });
                navigate('/dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen lg:overflow-hidden bg-slate-50 dark:bg-muted flex selection:bg-indigo-100 selection:text-indigo-900 font-sans overflow-y-auto lg:overflow-y-hidden">
            {/* Left side - Branding (Sleek Modern) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white dark:bg-card border-r border-slate-100 dark:border-border justify-center items-center h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#f1f5f9_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#eef2ff_0%,transparent_50%)]" />

                <div className="relative z-10 flex flex-col justify-center px-24 max-w-2xl">
                    <div className="flex items-center gap-4 mb-12">
                        <img src="/logo.png" alt="Italostudy Logo" className="h-12 w-auto object-contain" />
                    </div>

                    <h1 className="text-7xl font-black text-slate-900 dark:text-slate-100 mb-10 leading-[0.9] tracking-tighter uppercase">
                        Mastery <br />
                        <span className="text-indigo-600">Simulated.</span>
                    </h1>

                    <p className="text-xl text-slate-400 font-bold mb-16 max-w-lg leading-relaxed tracking-tight">
                        Experience the most advanced AI-driven preparation ecosystem for global academic success.
                    </p>

                    <div className="space-y-4">
                        {[
                            { text: 'Dynamic Adaptive Testing', color: 'bg-indigo-50', textCol: 'text-indigo-600' },
                            { text: 'Live AI Proctoring System', color: 'bg-slate-50', textCol: 'text-slate-600' },
                            { text: 'Deep Performance Analytics', color: 'bg-indigo-50', textCol: 'text-indigo-600' },
                        ].map((feature, i) => (
                            <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl border border-slate-50 bg-white dark:bg-card shadow-sm hover:border-slate-200 dark:border-border transition-all w-fit cursor-default group`}>
                                <div className={`p-2.5 rounded-2xl ${feature.color} border border-transparent group-hover:border-slate-100 dark:border-border transition-all`}>
                                    <Sparkles className={`w-4 h-4 ${feature.textCol}`} />
                                </div>
                                <span className="font-black text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-widest">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - Auth Form (Sleek Modern) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden bg-slate-50 dark:bg-muted h-full">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Logo Branding */}
                    <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
                        <img src="/logo.png" alt="Italostudy Logo" className="h-10 w-auto object-contain" />
                    </div>

                    {searchParams.get('banned') === 'true' && (
                        <div className="mb-6 sm:mb-8 p-5 sm:p-6 bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 rounded-[1.5rem] sm:rounded-3xl animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center gap-4 text-red-600 dark:text-red-400">
                                <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                                <div>
                                    <h3 className="font-black uppercase tracking-widest text-[10px] sm:text-xs mb-0.5 sm:mb-1">Access Suspended</h3>
                                    <p className="text-[10px] sm:text-xs font-medium opacity-90 leading-relaxed">
                                        Account restricted. Contact support: 05sharmautkarsh@gmail.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-card rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 lg:p-12 border border-slate-100 dark:border-border shadow-2xl shadow-indigo-100/50 max-h-[95vh] overflow-y-auto no-scrollbar">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tighter">
                                {requiresMFA ? 'Security Verification' : (isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Get Started'))}
                            </h2>
                            <p className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">
                                {requiresMFA ? 'Enter code from your authenticator app' : (isForgotPassword ? 'Enter your email to receive a recovery link' : (isLogin ? 'Sign in to your Italostudy account' : 'Join the Italostudy community'))}
                            </p>

                            {!isForgotPassword && (
                                <div className="mt-6 flex justify-center">
                                    <Link
                                        to="/consultant/activate"
                                        className="group flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-2xl transition-all"
                                    >
                                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Certified Expert Gateway</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-14 bg-slate-50 dark:bg-muted border-2 border-slate-100 dark:border-border rounded-xl flex items-center justify-center gap-3 transition-all cursor-not-allowed opacity-60"
                                disabled={true}
                            >
                                <svg className="w-5 h-5 grayscale" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="text-[#4285F4]" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="text-[#34A853]" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" className="text-[#FBBC05]" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="text-[#EA4335]" />
                                </svg>
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    Continue with Google (Coming Soon)
                                </span>
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100 dark:border-border" />
                                </div>
                                <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest">
                                    <span className="bg-white dark:bg-card px-4 text-slate-300">Or use email</span>
                                </div>
                            </div>

                        </div>

                        {!isForgotPassword && !requiresMFA && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                            <Input
                                                type="text"
                                                placeholder="FULL NAME"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="pl-12 h-12 bg-slate-50 dark:bg-muted border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-black text-[11px] uppercase tracking-widest placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="EMAIL ADDRESS"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setErrors(prev => ({ ...prev, email: undefined }));
                                            }}
                                            className="pl-12 h-12 bg-slate-50 dark:bg-muted border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-black text-[11px] uppercase tracking-widest placeholder:text-slate-300"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[9px] font-black text-rose-500 ml-1 uppercase tracking-widest">{errors.email}</p>}
                                </div>

                                <div className="space-y-1">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input
                                            type="password"
                                            placeholder="PASSWORD"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setErrors(prev => ({ ...prev, password: undefined }));
                                            }}
                                            className="pl-12 h-12 bg-slate-50 dark:bg-muted border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-bold text-[11px] placeholder:text-slate-300"
                                        />
                                    </div>
                                    {errors.password && <p className="text-[9px] font-black text-rose-500 ml-1 uppercase tracking-widest">{errors.password}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-all mt-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                                </Button>
                            </form>
                        )}

                        {isForgotPassword && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-1">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="EMAIL ADDRESS"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setErrors(prev => ({ ...prev, email: undefined }));
                                            }}
                                            className="pl-12 h-12 bg-slate-50 dark:bg-muted border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-black text-[11px] uppercase tracking-widest placeholder:text-slate-300"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[9px] font-black text-rose-500 ml-1 uppercase tracking-widest">{errors.email}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-all mt-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Recovery Link'}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => setIsForgotPassword(false)}
                                    className="w-full text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest pt-2"
                                >
                                    Back to Login
                                </button>
                            </form>
                        )}

                        {requiresMFA && (
                            <div className="space-y-8">
                                <div className="flex justify-center p-6 bg-slate-50 dark:bg-muted rounded-2xl border border-slate-100 dark:border-border">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-emerald-600" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Enter 6-Digit Code</p>
                                        <div className="flex justify-center">
                                            <InputOTP
                                                maxLength={6}
                                                value={mfaCode}
                                                onChange={setMfaCode}
                                            >
                                                <InputOTPGroup className="gap-2">
                                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-50 dark:bg-muted border-none rounded-xl text-lg font-black text-indigo-600 focus:ring-2 focus:ring-indigo-100"
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleMFAVerify}
                                        disabled={isLoading || mfaCode.length !== 6}
                                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-all mt-6"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRequiresMFA(false);
                                            setMfaCode("");
                                            setMfaFactorId(null);
                                        }}
                                        className="w-full text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest pt-2"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="text-center pt-4">
                            {!isForgotPassword && !requiresMFA && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setErrors({});
                                    }}
                                    className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest block w-full mb-3"
                                >
                                    {isLogin ? "New to Italostudy? Sign Up" : 'Already have an account? Sign In'}
                                </button>
                            )}

                            {isLogin && !isForgotPassword && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(true);
                                        setErrors({});
                                    }}
                                    className="text-[9px] font-black text-indigo-600 hover:text-indigo-700 transition-all uppercase tracking-widest"
                                >
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 text-center pt-6 border-t border-slate-50 dark:border-border">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                            By continuing, you agree to our <br />
                            <span className="text-indigo-600 underline cursor-pointer">Italostudy Protocols</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
