import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    // Strict Access Control List
    const ALLOWED_ADMINS = ['info.italostudy@gmail.com', '05sharmautkarsh@gmail.com'];
    const isAdminRole = profile?.role === 'admin';

    if (!user || !user.email || (!ALLOWED_ADMINS.includes(user.email) && !isAdminRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
