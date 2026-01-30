import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DownloadApp() {
    const APK_DOWNLOAD_URL = "https://jyjhpqtqbwtxxgijxetq.supabase.co/storage/v1/object/public/apk-files/italostudy-v1.0.0-release.apk";

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background Image - Full Page */}
            <img
                src="/download-app-bg.png"
                alt="Download App"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Download Button Overlay - Positioned below "ITALOSTUDY OFFICIAL APP" */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center" style={{ marginTop: '15%' }}>
                    <Button
                        className="h-16 px-12 bg-white text-purple-700 rounded-full font-black text-lg uppercase tracking-wider shadow-2xl hover:bg-purple-50 hover:scale-105 active:scale-95 transition-all"
                        asChild
                    >
                        <a href={APK_DOWNLOAD_URL} download="italostudy-v1.0.0-release.apk">
                            <Download size={24} className="mr-2" />
                            Download APK
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
