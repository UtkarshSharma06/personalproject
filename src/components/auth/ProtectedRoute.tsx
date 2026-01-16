import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth() as any;
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Role-based protection
    if (allowedRoles && profile && !allowedRoles.includes(profile.role || 'user')) {
        // Redirect to the most appropriate "Home" for their role
        if (profile.role === 'consultant') {
            return <Navigate to="/consultant/dashboard" replace />;
        }
        if (profile.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
