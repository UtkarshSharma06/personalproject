import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showReconnected, setShowReconnected] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowReconnected(true);
            setTimeout(() => setShowReconnected(false), 4000); // Auto remove after 4s
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowReconnected(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOnline) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white py-3 px-4 text-center z-[100] animate-in slide-in-from-bottom-10 shadow-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span className="font-black">System Alert:</span> No Internet Access
            </div>
        );
    }

    if (showReconnected) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-emerald-600 text-white py-3 px-4 text-center z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500 shadow-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="font-black">Status:</span> Connection Restored
            </div>
        );
    }

    return null;
}
