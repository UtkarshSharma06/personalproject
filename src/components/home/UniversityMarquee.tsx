import { useTranslation } from 'react-i18next';

const UniversityMarquee = () => {
    const { t } = useTranslation();

    return (
        <section className="py-12 md:py-8 bg-white overflow-hidden relative z-20 border-b border-[#eaeaea]">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="flex flex-col items-center gap-6">
                    <span className="text-[16px] md:text-[18px] font-bold text-[#333333] text-center mb-2">
                        {t('landing.university_marquee.badge', 'Students who studied from our platform are studying in')}
                    </span>
                    
                    <div className="relative w-full overflow-hidden">
                        {/* Gradient Fades - Reduced for Mobile */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
                        
                        <div className="flex w-max animate-uni-marquee-global group hover:[animation-play-state:paused] will-change-transform">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-12 md:gap-32 px-6 md:px-16">
                                    {[
                                        { name: "Sapienza Rome", src: "/Spienza.webp" },
                                        { name: "Uni of Milan", src: "/milano.webp" },
                                        { name: "Uni of Bologna", src: "/bologana.webp" },
                                        { name: "Uni of Pavia", src: "/Pavia.webp" },
                                        { name: "Uni of Padua", src: "/Padua.webp" }
                                    ].map((uni, j) => (
                                        <div key={`${i}-${j}`} className="flex-shrink-0 transition-all duration-300 cursor-default">
                                            <img 
                                                src={uni.src} 
                                                alt={uni.name} 
                                                className="h-12 md:h-16 w-auto object-contain pointer-events-none select-none filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
                                                loading="lazy"
                                                draggable={false}
                                                onContextMenu={(e) => e.preventDefault()}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes uni-marquee-global {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-uni-marquee-global {
                    animation: uni-marquee-global 30s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default UniversityMarquee;
