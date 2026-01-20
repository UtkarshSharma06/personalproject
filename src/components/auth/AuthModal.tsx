import { useState, useEffect, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Loader2, Shield, Check } from 'lucide-react';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion, AnimatePresence } from 'framer-motion';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const SuccessBackground = memo(() => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={i}
                initial={{
                    opacity: 0,
                    scaleY: 0,
                    x: `${Math.random() * 100}%`,
                    y: '50%'
                }}
                animate={{
                    opacity: [0, 1, 0],
                    scaleY: [0, 20, 0],
                    y: ['50%', '-150%'],
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "circIn",
                    delay: Math.random() * 1.5
                }}
                className="absolute w-[1px] h-32 bg-gradient-to-t from-transparent via-indigo-400 to-transparent blur-[1px]"
            />
        ))}
    </div>
));
SuccessBackground.displayName = 'SuccessBackground';

const AuthGradients = memo(() => (
    <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <motion.div
            animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl mix-blend-multiply filter"
        />
        <motion.div
            animate={{
                rotate: [360, 0],
                scale: [1, 1.3, 1],
            }}
            transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl mix-blend-multiply filter"
        />
    </div>
));
AuthGradients.displayName = 'AuthGradients';

const FloatingElements = memo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {[...Array(isMobile ? 3 : 5)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        y: [100, -100],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 1.5
                    }}
                    className="absolute w-8 h-8 border border-indigo-200/50 rounded-lg backdrop-blur-sm"
                    style={{
                        left: `${10 + i * 20}%`,
                        top: '100%'
                    }}
                />
            ))}
        </div>
    );
});
FloatingElements.displayName = 'FloatingElements';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [requiresMFA, setRequiresMFA] = useState(false);
    const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
    const [mfaCode, setMfaCode] = useState("");

    const { signIn, signUp, signOut, resetPassword, signInWithGoogle, mfa } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setIsLogin(true);
            setEmail('');
            setPassword('');
            setDisplayName('');
            setIsForgotPassword(false);
            setErrors({});
            setIsSuccess(false);
            if (requiresMFA) {
                signOut();
            }
        }
    }, [isOpen, requiresMFA, signOut]);

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

    const handleSuccess = (destination: string) => {
        setIsSuccess(true);
        setTimeout(() => {
            navigate(destination);
            onClose();
        }, 2000);
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

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) {
                toast({
                    title: 'Google sign in failed',
                    description: error.message,
                    variant: 'destructive',
                });
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
                    handleSuccess('/dashboard');
                }
            } else {
                const { error } = await signUp(email, password, displayName);
                if (error) {
                    toast({
                        title: 'Sign up failed',
                        description: error.message.includes('already registered')
                            ? 'This email is already registered. Please sign in instead.'
                            : error.message,
                        variant: 'destructive',
                    });
                } else {
                    handleSuccess('/onboarding');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMFAVerify = async () => {
        if (!mfaFactorId) return;

        if (mfaCode.length !== 6) {
            toast({
                title: 'Incomplete Code',
                description: 'Please enter the full 6-digit security code.',
                variant: 'destructive',
            });
            return;
        }

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
                handleSuccess('/dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0 overflow-visible">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                    style={{ perspective: 1000 }}
                    className="relative"
                >
                    {/* 3D Animated Card Container */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-card border border-white/20 shadow-2xl transform-gpu transition-transform hover:scale-[1.02] duration-500">

                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative flex flex-col items-center justify-center p-12 min-h-[450px] overflow-hidden text-center"
                                >
                                    {/* Hyper-Drive Warp Streaks */}
                                    <SuccessBackground />

                                    <DialogHeader className="sr-only">
                                        <DialogTitle>Authentication Successful</DialogTitle>
                                    </DialogHeader>

                                    {/* Holographic Scanner Beam */}
                                    <motion.div
                                        initial={{ top: '-10%' }}
                                        animate={{ top: '110%' }}
                                        transition={{ duration: 1.5, repeat: 2, ease: "linear" }}
                                        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20 pointer-events-none"
                                    />

                                    <div className="relative z-10">
                                        {/* Quantum Checkmark */}
                                        <div className="relative">
                                            <motion.div
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                                                className="w-24 h-24 bg-white dark:bg-slate-900 border-4 border-indigo-500 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] rotate-12"
                                            >
                                                <Check className="w-12 h-12 text-indigo-500 stroke-[4px]" />
                                            </motion.div>

                                            {/* Glow Rings */}
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1.5, opacity: 0 }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.6,
                                                        ease: "easeOut"
                                                    }}
                                                    className="absolute inset-0 border-2 border-indigo-400/30 rounded-3xl"
                                                />
                                            ))}
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="mt-10"
                                        >
                                            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                                <motion.span
                                                    animate={{ opacity: [1, 0.5, 1] }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                >
                                                    Access Granted
                                                </motion.span>
                                            </h2>
                                            <div className="mt-4 flex flex-col items-center gap-2">
                                                <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">
                                                    Initiating Neural Link...
                                                </p>
                                                <div className="w-32 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ x: '-100%' }}
                                                        animate={{ x: '100%' }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Transition Overlay (Flash) */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.5, delay: 1.8 }}
                                        className="absolute inset-0 bg-white dark:bg-slate-900 z-50 pointer-events-none"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div key="auth-form" exit={{ opacity: 0, scale: 0.95 }}>
                                    {/* Animated Background Gradients */}
                                    <AuthGradients />

                                    {/* Floating 3D Elements */}
                                    <FloatingElements />

                                    {/* Content Header */}
                                    <div className="relative z-10 p-8 pb-6 bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-white/10">
                                        <DialogHeader>
                                            <DialogTitle className="text-3xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tighter">
                                                {requiresMFA ? 'Security Check' : (isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Get Started'))}
                                            </DialogTitle>
                                            <DialogDescription className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">
                                                {requiresMFA ? 'Enter your 2FA Code' : (isForgotPassword ? 'Recover your account' : (isLogin ? 'Sign in to continue' : 'Join Italostudy today'))}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </div>

                                    <div className="p-8 relative z-10">
                                        {requiresMFA ? (
                                            <div className="space-y-6">
                                                <div className="flex justify-center">
                                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                                        < Shield className="w-6 h-6 text-emerald-600" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-center">
                                                    <InputOTP maxLength={6} value={mfaCode} onChange={setMfaCode}>
                                                        <InputOTPGroup className="gap-2">
                                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                                <InputOTPSlot
                                                                    key={index}
                                                                    index={index}
                                                                    className="w-10 h-12 bg-slate-50 dark:bg-muted border rounded-xl text-lg font-black text-indigo-600 focus:ring-2 focus:ring-indigo-100 hover:bg-slate-100 transition-colors"
                                                                />
                                                            ))}
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </div>
                                                <Button
                                                    onClick={handleMFAVerify}
                                                    disabled={isLoading}
                                                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                                >
                                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
                                                </Button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        signOut();
                                                    }}
                                                    className="w-full text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest pt-2"
                                                >
                                                    Back to Login
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {isForgotPassword ? (
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
                                                                    className="pl-12 h-11 bg-slate-50 dark:bg-muted border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-bold text-base md:text-[11px] placeholder:text-slate-300"
                                                                />
                                                            </div>
                                                            {errors.email && <p className="text-[9px] font-black text-rose-500 ml-1 uppercase tracking-widest">{errors.email}</p>}
                                                        </div>

                                                        <Button
                                                            type="submit"
                                                            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
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
                                                ) : (
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
                                                                        className="pl-12 h-11 bg-slate-50 dark:bg-muted border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-black text-base md:text-[11px] uppercase tracking-widest placeholder:text-slate-300"
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
                                                                    className="pl-12 h-11 bg-slate-50 dark:bg-muted border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-black text-base md:text-[11px] uppercase tracking-widest placeholder:text-slate-300"
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
                                                                    className="pl-12 h-11 bg-slate-50 dark:bg-muted border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-bold text-base md:text-[11px] placeholder:text-slate-300"
                                                                />
                                                            </div>
                                                            {errors.password && <p className="text-[9px] font-black text-rose-500 ml-1 uppercase tracking-widest">{errors.password}</p>}
                                                        </div>

                                                        <Button
                                                            type="submit"
                                                            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all mt-2"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                                                        </Button>


                                                        <div className="relative my-6">
                                                            <div className="absolute inset-0 flex items-center">
                                                                <span className="w-full border-t border-slate-100 dark:border-white/5" />
                                                            </div>
                                                            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]">
                                                                <span className="bg-white dark:bg-card px-4 text-slate-300 uppercase tracking-widest">or continue with</span>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            onClick={handleGoogleSignIn}
                                                            variant="outline"
                                                            className="w-full h-11 border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all group relative overflow-hidden"
                                                            disabled={isLoading}
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div className="relative flex items-center justify-center gap-3">
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                                        className="text-[#4285F4]"
                                                                    />
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                                        className="text-[#34A853]"
                                                                    />
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                                        className="text-[#FBBC05]"
                                                                    />
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                                        className="text-[#EA4335]"
                                                                    />
                                                                </svg>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Continue with Google</span>
                                                            </div>
                                                        </Button>

                                                        <div className="flex items-center justify-between pt-2">
                                                            <div className="flex-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setIsLogin(!isLogin);
                                                                        setErrors({});
                                                                    }}
                                                                    className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest text-left"
                                                                >
                                                                    {isLogin ? "Need an account?" : 'Have an account?'}
                                                                </button>
                                                            </div>
                                                            {isLogin && (
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
                                                    </form>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
