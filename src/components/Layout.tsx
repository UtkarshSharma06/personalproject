import { ReactNode, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useAuth } from '@/lib/auth';

const AnnouncementBar = lazy(() => import('./AnnouncementBar'));

interface LayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    showHeader?: boolean;
    variant?: 'public';
    subNavigation?: ReactNode;
}

export default function Layout({
    children,
    showFooter = true,
    showHeader = true,
    variant = 'public',
    subNavigation
}: LayoutProps) {
    const location = useLocation();
    const { profile } = useAuth() as any;
    const isAdmin = profile?.role === 'admin' || profile?.role === 'sub_admin';

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Global Announcement System */}
            <Suspense fallback={null}>
                <AnnouncementBar />
            </Suspense>

            {showHeader && <PublicNavbar subNavigation={subNavigation} />}
            
            <main className={cn(
                "flex-1 relative",
                showHeader && "pt-24"
            )}>
                {children}
            </main>

            {showFooter && <Footer />}
        </div>
    );
}