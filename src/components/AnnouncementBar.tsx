import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkVisibility = async () => {
            // 1. Check if on native app
            try {
                const { Device } = await import('@capacitor/device');
                const info = await Device.getInfo();
                if (info.platform === 'android' || info.platform === 'ios') {
                    setIsVisible(false);
                    return;
                }
            } catch (e) {
                // Not native
            }

            // 2. Check dismissal
            const isDismissed = localStorage.getItem('announcement-dismissed');
            if (!isDismissed) {
                setIsVisible(true);
            }
        };

        checkVisibility();
    }, []);

    const handleDismiss = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(false);
        localStorage.setItem('announcement-dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white group relative z-[100]">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-3">
                {/* Visual indicator (optional/static) */}
                <div className="hidden sm:flex w-8 h-8 rounded-lg bg-white/20 items-center justify-center border border-white/30 shrink-0">
                    <Smartphone size={16} className="text-white" />
                </div>

                {/* Text section */}
                <p className="flex-1 text-[9px] sm:text-xs font-black uppercase tracking-[0.05em] sm:tracking-[0.1em] text-center leading-tight">
                    Get the <span className="text-amber-300">ItaloStudy Android App</span>
                    <span className="hidden sm:inline"> for a smoother experience</span>
                </p>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* NAVIGATE LINK - Visible on all screens now */}
                    <Link
                        to="/download-app"
                        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-white/30 active:scale-95 transition-all shadow-lg"
                    >
                        APK <Download size={10} />
                    </Link>

                    <button
                        onClick={handleDismiss}
                        className="p-1 sm:p-1.5 hover:bg-white/20 rounded-full transition-colors relative z-[101]"
                        aria-label="Dismiss announcement"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
