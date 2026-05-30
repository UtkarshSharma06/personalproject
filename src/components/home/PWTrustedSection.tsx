import { Play, FileText, HeadphonesIcon, FileQuestion } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function PWTrustedSection() {
    const { t } = useTranslation();
    return (
        <section 
            className="w-full relative lg:min-h-[460px] overflow-visible pb-16 lg:pb-24 bg-[#f6f4fa]"
        >
            {/* Background Artifacts */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Decorative blob top right */}
                <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-200/50 rounded-full blur-[100px]" />
                {/* Decorative blob bottom left */}
                <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-indigo-200/50 rounded-full blur-[80px]" />
                
                {/* Dotted patterns */}
                <svg className="absolute top-[20%] left-[10%] w-24 h-24 text-slate-400/40" fill="currentColor" viewBox="0 0 100 100">
                    <pattern id="dots-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#dots-pattern)" />
                </svg>

                <svg className="absolute bottom-[40%] right-[20%] w-32 h-32 text-indigo-400/20" fill="currentColor" viewBox="0 0 100 100">
                    <pattern id="dots-pattern-2" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#dots-pattern-2)" />
                </svg>
            </div>
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
                <div className="relative pt-0 pb-4 md:pt-2 md:pb-7 lg:pt-4 lg:pb-12 flex flex-col xl:flex-row items-center text-center xl:text-left gap-10">
                    
                    {/* Left Content */}
                    <div className="flex flex-col items-center xl:items-start mt-6 xl:mt-0 xl:w-[65%]">
                        <h2 className="text-[32px] md:text-[40px] font-bold text-[#1b2124] md:leading-[50px] mb-4">
                            {t('about.trusted.title_europe', "Europe's")} <span className="text-[#5a4bda]">{t('about.trusted.title_trusted', "Trusted &")}</span><br />
                            <span className="text-[#5a4bda]">{t('about.trusted.title_affordable', "Affordable")}</span><br />
                            {t('about.trusted.title_platform', "Educational Platform")}
                        </h2>
                        <p className="text-[14px] md:text-[16px] text-[#4b4b4b] leading-[1.6] mb-8 max-w-[420px] mx-auto lg:mx-0">
                            {t('about.trusted.subtitle_p1', "Unlock your potential by signing up with ItaloStudy-")}<br className="hidden md:inline"/>
                            {t('about.trusted.subtitle_p2', "The most affordable learning solution")}
                        </p>
                        <button
                            onClick={() => window.location.href = 'https://app.italostudy.com/auth'}
                            className="w-full sm:w-auto bg-[#5a4bda] hover:bg-[#4b3dbd] text-white font-semibold rounded-md px-10 py-3 text-[16px] transition-colors shadow-sm"
                        >
                            {t('about.trusted.get_started', "Get Started")}
                        </button>
                    </div>

                    {/* Right Graphic area */}
                    <div className="w-full xl:w-[70%] mb-10 xl:mb-0 flex justify-center xl:justify-end items-center">
                        <img 
                            src="/pwtrust.webp" 
                            alt="ItaloStudy Trusted Platform" 
                            className="w-full h-[200px] md:h-[280px] xl:h-[350px] object-contain"
                        />
                    </div>
                </div>

                {/* Stats / Features Row */}
                <div className="-mt-8 relative z-30 shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded bg-white py-2 px-1 sm:px-2 border border-[#f5f5f5]">
                    <div className="grid grid-cols-2 justify-items-center content-center sm:grid-cols-4 gap-1 sm:gap-0 divide-x divide-slate-100">
                        {/* Stat 1 */}
                        <div className="flex justify-center items-center w-full flex-col text-center flex-wrap gap-1 bg-white py-1">
                            <div className="text-[#ff4b4b] flex items-center justify-center mb-0.5">
                                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                            </div>
                            <div>
                                <h3 className="text-[#1b2124] font-semibold text-[13px] md:text-[14px]">{t('about.trusted.stat1_title', "Video Lectures")}</h3>
                                <p className="text-[#3D3D3D] font-medium text-[11px] md:text-[12px]">{t('about.trusted.stat1_desc', "Interactive classes")}</p>
                            </div>
                        </div>
                        {/* Stat 2 */}
                        <div className="flex justify-center items-center w-full flex-col text-center flex-wrap gap-1 bg-white py-1">
                            <div className="text-[#4b7cff] flex items-center justify-center mb-0.5">
                                <FileText className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h3 className="text-[#1b2124] font-semibold text-[13px] md:text-[14px]">{t('about.trusted.stat2_title', "100+")}</h3>
                                <p className="text-[#3D3D3D] font-medium text-[11px] md:text-[12px]">{t('about.trusted.stat2_desc', "simulated mocks")}</p>
                            </div>
                        </div>
                        {/* Stat 3 */}
                        <div className="flex justify-center items-center w-full flex-col text-center flex-wrap gap-1 bg-white py-1">
                            <div className="text-[#f2994a] flex items-center justify-center mb-0.5">
                                <FileQuestion className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h3 className="text-[#1b2124] font-semibold text-[13px] md:text-[14px]">{t('about.trusted.stat2_title', "Questions Practiced")}</h3>
                                <p className="text-[#3D3D3D] font-medium text-[11px] md:text-[12px]">{t('about.trusted.stat3_desc', "Over 50k+ questions solved.")}</p>
                            </div>
                        </div>
                        {/* Stat 4 */}
                        <div className="flex justify-center items-center w-full flex-col text-center flex-wrap gap-1 bg-white py-1">
                            <div className="text-[#9b51e0] flex items-center justify-center mb-0.5">
                                <HeadphonesIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h3 className="text-[#1b2124] font-semibold text-[13px] md:text-[14px]">{t('about.trusted.stat4_title', "24 x 7 support")}</h3>
                                <p className="text-[#3D3D3D] font-medium text-[11px] md:text-[12px]">{t('about.trusted.stat4_desc', "Available anytime")}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </motion.div>
        </section>
    );
}
