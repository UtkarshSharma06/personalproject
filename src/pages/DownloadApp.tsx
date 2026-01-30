import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export default function DownloadApp() {
    const APK_DOWNLOAD_URL = "https://jyjhpqtqbwtxxgijxetq.supabase.co/storage/v1/object/public/apk-files/italostudy-v1.0.0-release.apk";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#8B5CF6] overflow-hidden relative flex items-center justify-center p-8">
            {/* Background Glow Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(168,85,247,0.4)_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.3)_0%,transparent_50%)] pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="text-center space-y-6">
                    {/* Title Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-3"
                    >
                        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tight leading-none">
                            DOWNLOAD APP
                        </h1>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide">
                            ITALOSTUDY OFFICIAL APP
                        </h2>
                    </motion.div>

                    {/* Download Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="pt-4 pb-12"
                    >
                        <a
                            href={APK_DOWNLOAD_URL}
                            download="italostudy-v1.0.0-release.apk"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-gray-900 text-white rounded-2xl font-black text-base uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <div className="bg-[#A4C639] p-2 rounded-lg">
                                <Download size={20} className="text-black" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs opacity-80">Download</div>
                                <div className="text-sm">Android APK</div>
                            </div>
                        </a>
                    </motion.div>

                    {/* Phone Mockups - Recreating exact layout from image */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative flex items-end justify-center gap-4 lg:gap-6 flex-wrap px-4"
                    >
                        {/* Left Phone - Dashboard (Tilted Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50, rotate: -12 }}
                            animate={{ opacity: 1, x: 0, rotate: -8 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="relative transform origin-bottom"
                            style={{ marginBottom: '-20px' }}
                        >
                            <div className="w-52 lg:w-64 h-[420px] lg:h-[520px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                                <img
                                    src="/screenshot-dashboard.jpg"
                                    alt="Dashboard"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Center Phone - Quiz (Slightly tilted, higher) */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="relative transform origin-bottom"
                            style={{ marginBottom: '20px' }}
                        >
                            <div className="w-52 lg:w-64 h-[420px] lg:h-[520px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transform rotate-2">
                                <img
                                    src="/screenshot-quiz.jpg"
                                    alt="Quiz"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Right Center Phone - Study Portal (Slight tilt) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30, rotate: 6 }}
                            animate={{ opacity: 1, x: 0, rotate: 4 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="relative transform origin-bottom"
                            style={{ marginBottom: '-10px' }}
                        >
                            <div className="w-52 lg:w-64 h-[420px] lg:h-[520px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                                <img
                                    src="/screenshot-study.jpg"
                                    alt="Study Portal"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Far Right Phone - Analytics (Tilted Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, rotate: 12 }}
                            animate={{ opacity: 1, x: 0, rotate: 10 }}
                            transition={{ duration: 1, delay: 0.9 }}
                            className="relative transform origin-bottom hidden xl:block"
                            style={{ marginBottom: '-30px' }}
                        >
                            <div className="w-52 lg:w-64 h-[420px] lg:h-[520px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                                <img
                                    src="/screenshot-analytics.jpg"
                                    alt="Analytics"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
