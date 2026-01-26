import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Shield, ChevronLeft, Loader2 } from 'lucide-react';

export default function MobileAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signIn, signUp, signInWithGoogle } = useAuth() as any;
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                toast({ title: "Login Successful", description: "Welcome back!" });
                navigate('/dashboard');
            } else {
                const { error } = signUp(email, password, displayName);
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
            await signInWithGoogle();
        } catch (e: any) {
            toast({ title: "Sync failed", variant: "destructive" });
            setIsLoading(false);
        }
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
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale" alt="Google" />
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
                    <span className="text-[8px] font-black uppercase tracking-widest">Secure Connection</span>
                </div>
            </footer>
        </div>
    );
}
