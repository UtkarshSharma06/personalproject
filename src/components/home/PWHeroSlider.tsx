import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useTranslation } from 'react-i18next';

export default function PWHeroSlider() {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const banners = [
        {
            id: 1,
            title: "IMAT Cut-offs Analysis - Milan 74.9, Cagliari 65.1",
            imageMobile: "/mobile-1-cutoffs.webp",
            imageDesktop: "/desktop-1-cutoffs.webp",
            link: "/imat-cutoff-trends-2026"
        },
        {
            id: 2,
            title: "TIL-I Prep Now Live - Politecnico di Torino",
            imageMobile: "/mobile-2-til-i.webp",
            imageDesktop: "/desktop-2-til-i.webp",
            link: "/til-i-exam-guide-2026"
        },
        {
            id: 3,
            title: "CEnT-S 2027 Reasoning on Texts & Data Course",
            imageMobile: "/mobile-3-rtd-course.webp",
            imageDesktop: "/desktop-3-rtd-course.webp",
            link: "/courses"
        },
        {
            id: 4,
            title: "CEnT-S 2027 Preparation - All in One Place",
            imageMobile: "/mobile-4-cent-s-prep.webp",
            imageDesktop: "/desktop-4-cent-s-prep.webp",
            link: "https://app.italostudy.com/auth"
        },
        {
            id: 5,
            title: "Reasoning on Texts & Data Full Course - Save €5",
            imageMobile: "/mobile-5-rtd-price.webp",
            imageDesktop: "/desktop-5-rtd-price.webp",
            link: "/courses"
        },
        {
            id: 6,
            title: "Study in Italy - Costs & Scholarships from €156",
            imageMobile: "/mobile-6-costs.webp",
            imageDesktop: "/desktop-6-costs.webp",
            link: "/study-in-italy/tuition-fees-2026"
        }
    ];

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        
        // Auto-scroll
        const intervalId = setInterval(() => {
            emblaApi.scrollNext();
        }, 5000);
        
        return () => {
            emblaApi.off('select', onSelect);
            clearInterval(intervalId);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="relative w-full mx-auto bg-[#f6f4fa] pt-[80px] md:pt-[80px] pb-0">
            {/* The carousel container */}
            <div className="overflow-hidden w-full relative group" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {banners.map((banner) => {
                        const isExternal = banner.link.startsWith('http');
                        const content = (
                            <div className="w-full bg-slate-100 flex items-center justify-center">
                                <picture className="w-full">
                                    <source media="(max-width: 767px)" srcSet={banner.imageMobile} />
                                    <img 
                                        src={banner.imageDesktop} 
                                        className="w-full h-auto object-contain block"
                                        fetchPriority={banner.id === 1 ? "high" : "auto"}
                                        alt={banner.title} 
                                    />
                                </picture>
                            </div>
                        );

                        return (
                            <div key={banner.id} className="flex-[0_0_100%] min-w-0 relative">
                                {isExternal ? (
                                    <a href={banner.link} className="block w-full">
                                        {content}
                                    </a>
                                ) : (
                                    <Link to={banner.link} className="block w-full">
                                        {content}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Buttons (visible on hover or on desktop) */}
                <button 
                    onClick={scrollPrev}
                    aria-label="Previous slide"
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-30"
                >
                    <ChevronLeft className="w-8 h-8 drop-shadow-sm" />
                </button>
                <button 
                    onClick={scrollNext}
                    aria-label="Next slide"
                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-30"
                >
                    <ChevronRight className="w-8 h-8 drop-shadow-sm" />
                </button>
            </div>

            {/* Dots underneath the slider */}
            <div className="flex justify-center items-center gap-2.5 mt-4 pb-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === selectedIndex ? "bg-[#333333] scale-125" : "bg-slate-300 hover:bg-slate-400"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
