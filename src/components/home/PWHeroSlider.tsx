import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PWHeroSlider() {
    const { t } = useTranslation();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const banners = [
        {
            id: 1,
            title: t('about.hero.banner1.title', "ItaloStudy App"),
            imageMobile: "/1stmobilemain.webp",
            imageDesktop: "/1stmain.webp",
            link: "https://app.italostudy.com/auth"
        },
        {
            id: 2,
            title: t('about.hero.banner2.title', "ItaloStudy Store"),
            imageMobile: "/prepare2.webp", 
            imageDesktop: "/Prepare.webp",
            link: "https://store.italostudy.com"
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
                    {banners.map((banner) => (
                        <div key={banner.id} className="flex-[0_0_100%] min-w-0 relative">
                            <a href={banner.link} className="block w-full">
                                {/* Desktop/Mobile Image */}
                                <div className="w-full relative bg-slate-100 aspect-[3000/1333] md:aspect-[2880/544]">
                                    <picture>
                                        <source media="(max-width: 767px)" srcSet={banner.imageMobile} />
                                        <img 
                                            src={banner.imageDesktop} 
                                            className="absolute inset-0 w-full h-full object-cover object-center"
                                            alt={banner.title} 
                                        />
                                    </picture>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons (visible on hover or on desktop) */}
                <button 
                    onClick={scrollPrev}
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-30"
                >
                    <ChevronLeft className="w-8 h-8 drop-shadow-sm" />
                </button>
                <button 
                    onClick={scrollNext}
                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-30"
                >
                    <ChevronRight className="w-8 h-8 drop-shadow-sm" />
                </button>
            </div>

            {/* Dots underneath the slider like PW */}
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
