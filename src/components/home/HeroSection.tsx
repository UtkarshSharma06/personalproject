import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation, Trans } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const FlagBadge = ({ country, className }: { country: 'italy' | 'turkey' | 'pakistan' | 'india' | 'uk' | 'poland' | 'germany' | 'hungary'; className?: string }) => {
    const flags = {
        italy: (
            <svg viewBox="0 0 3 2" className="w-full h-full">
                <rect width="1" height="2" fill="#008C45" />
                <rect width="1" height="2" x="1" fill="#F4F5F0" />
                <rect width="1" height="2" x="2" fill="#CD212A" />
            </svg>
        ),
        turkey: (
            <svg viewBox="0 0 1200 800" className="w-full h-full">
                <rect width="1200" height="800" fill="#E30A17" />
                <circle cx="425" cy="400" r="200" fill="#FFF" />
                <circle cx="475" cy="400" r="160" fill="#E30A17" />
                <polygon points="580,400 610,435 590,390 635,375 580,365 525,375 570,390 550,435" fill="#FFF" transform="translate(100, 0) scale(1.2) rotate(-15, 580, 400)" />
            </svg>
        ),
        pakistan: (
            <svg viewBox="0 0 3 2" className="w-full h-full">
                <rect width="3" height="2" fill="#01411C" />
                <rect width="0.75" height="2" fill="#FFF" />
                <circle cx="1.875" cy="1" r="0.6" fill="#FFF" />
                <circle cx="2.025" cy="0.85" r="0.6" fill="#01411C" />
                <polygon points="2.1,0.7 2.18,0.85 2.35,0.85 2.22,0.95 2.27,1.1 2.1,1 1.93,1.1 1.98,0.95 1.85,0.85 2.02,0.85" fill="#FFF" />
            </svg>
        ),
        india: (
            <svg viewBox="0 0 3 2" className="w-full h-full">
                <rect width="3" height="0.66" fill="#FF9933" />
                <rect width="3" height="0.66" y="0.66" fill="#FFF" />
                <rect width="3" height="0.68" y="1.32" fill="#138808" />
                <circle cx="1.5" cy="1" r="0.2" stroke="#000080" strokeWidth="0.02" fill="none" />
                {[...Array(24)].map((_, i) => (
                    <line key={i} x1="1.5" y1="1" x2={1.5 + 0.2 * Math.cos(i * Math.PI / 12)} y2={1 + 0.2 * Math.sin(i * Math.PI / 12)} stroke="#000080" strokeWidth="0.01" />
                ))}
            </svg>
        ),
        uk: (
            <svg viewBox="0 0 60 30" className="w-full h-full">
                <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </svg>
        ),
        poland: (
            <svg viewBox="0 0 8 5" className="w-full h-full">
                <rect width="8" height="2.5" fill="#FFF" />
                <rect width="8" height="2.5" y="2.5" fill="#DC143C" />
            </svg>
        ),
        germany: (
            <svg viewBox="0 0 5 3" className="w-full h-full">
                <rect width="5" height="1" fill="#000" />
                <rect width="5" height="1" y="1" fill="#D00" />
                <rect width="5" height="1" y="2" fill="#FFCF00" />
            </svg>
        ),
        hungary: (
            <svg viewBox="0 0 2 1" className="w-full h-full">
                <rect width="2" height="0.333" fill="#CE2939" />
                <rect width="2" height="0.334" y="0.333" fill="#FFF" />
                <rect width="2" height="0.333" y="0.667" fill="#477050" />
            </svg>
        )
    };

    return (
        <div className={cn("inline-flex items-center justify-center overflow-hidden rounded-full aspect-square border border-white/20 bg-white/5 backdrop-blur-sm", className)}>
            <div className="w-full h-full scale-[1.4] flex items-center justify-center pointer-events-none">
                {flags[country]}
            </div>
        </div>
    );
};

interface HeroSectionProps {
    accentColor?: string;
}

/**
 * HeroSection — eagerly loaded (LCP element).
 * Styled after the Alpha97 responsive education website template:
 * two-column layout with animated right panel, deco shapes, floating stat cards.
 */
export default function HeroSection({ }: HeroSectionProps) {
    const { t } = useTranslation();

    useEffect(() => {
        const el = document.getElementById('hero-root');
        if (el) {
            requestAnimationFrame(() => {
                el.classList.add('hero-visible');
            });
        }
    }, []);

    return (
        <div
            id="hero-root"
            className="hero-two-col"
            style={{
                opacity: 0,
                transition: 'opacity 0.6s ease',
            }}
        >
            {/* ── Decorative background blobs (reference: .home::before / .home::after) ── */}
            <span className="hero-blob hero-blob--blue" aria-hidden="true" />
            <span className="hero-blob hero-blob--orange" aria-hidden="true" />

            {/* ── Decorative floating shapes ── */}
            <span className="hero-shape hero-shape--1" aria-hidden="true">
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                    <circle cx="36" cy="36" r="36" fill="url(#sh1)" />
                    <defs>
                        <radialGradient id="sh1" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </span>
            <span className="hero-shape hero-shape--2" aria-hidden="true">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <rect width="52" height="52" rx="14" fill="url(#sh2)" />
                    <defs>
                        <radialGradient id="sh2" cx="50%" cy="50%" r="70%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </span>
            <span className="hero-shape hero-shape--3" aria-hidden="true">
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                    <circle cx="55" cy="55" r="55" fill="url(#sh3)" />
                    <defs>
                        <radialGradient id="sh3" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </span>
            <span className="hero-shape hero-shape--4" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <polygon points="14,0 28,28 0,28" fill="#f59e0b" fillOpacity="0.4" />
                </svg>
            </span>

            {/* ══════════════ LEFT — Text Content ══════════════ */}
            <div className="hero-left">
                {/* Subtitle badge — reference: .section-subtitle */}
                <p className="hero-subtitle">
                    {t('landing.hero.title_sub', 'The Smartest Way to Pass Your Italian Entrance Exam')}
                </p>

                {/* Main heading — reference: .main-heading + .underline-img */}
                <h1 className="hero-heading">
                    <EditableText
                        fieldKey="hero_headline_prefix"
                        fallback={t('landing.hero.title_prefix', 'Ace Your Exam')}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500"
                    />
                    {' '}
                    <span className="hero-heading-accent relative">
                        <EditableText
                            fieldKey="hero_headline_accent"
                            fallback={t('landing.hero.title_highlight', 'with Smart Prep')}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600"
                        />
                        <span className="hero-underline-bar" aria-hidden="true" />
                    </span>
                </h1>

                {/* Description — reference: .section-text */}
                <p className="hero-text">
                    <Trans
                        i18nKey="landing.hero.description"
                        components={{
                            0: <span />,
                            1: <span className="text-indigo-600 font-bold uppercase">{t('landing.hero.exam_placeholder')}</span>,
                            2: <span />
                        }}
                    />
                </p>

                {/* CTA Group — reference: .home-btn-group */}
                <div className="hero-btn-group">
                    <a href="https://app.italostudy.com/auth" className="hero-btn-wrapper flex-1 max-w-[160px] md:max-w-none">
                        <Button
                            className="hero-btn hero-btn--primary w-full"
                            id="hero-cta-primary"
                        >
                            <EditableText
                                fieldKey="hero_cta_primary"
                                fallback={t('landing.hero.cta_start', 'Start FREE')}
                            />
                            <span className="hero-btn-square" aria-hidden="true" />
                        </Button>
                    </a>

                    <Link to="/blog">
                        <Button
                            variant="outline"
                            className="hero-btn hero-btn--secondary"
                            id="hero-cta-secondary"
                        >
                            <EditableText
                                fieldKey="hero_cta_secondary"
                                fallback={t('landing.hero.cta_blog', 'Explore Blog')}
                            />
                            <span className="hero-btn-square" aria-hidden="true" />
                        </Button>
                    </Link>
                </div>

                {/* European Flags Cluster - Left Side (Aligned with right-side flags) */}
                <div className="absolute top-[20%] -right-12 hero-flag hero-drift-left hidden lg:flex">
                    <FlagBadge country="italy" className="w-7 h-7 md:w-10 md:h-10" />
                </div>
                <div className="absolute top-[35%] -right-12 hero-flag hero-drift-right hidden lg:flex">
                    <FlagBadge country="poland" className="w-7 h-7 md:w-9 md:h-9" />
                </div>
                <div className="absolute top-[50%] -right-12 hero-flag hero-drift-left hidden lg:flex">
                    <FlagBadge country="germany" className="w-7 h-7 md:w-9 md:h-9" />
                </div>
                <div className="absolute top-[65%] -right-12 hero-flag hero-drift-right hidden lg:flex">
                    <FlagBadge country="hungary" className="w-7 h-7 md:w-9 md:h-9" />
                </div>
            </div>

            {/* ══════════════ RIGHT — Animated Visual Panel ══════════════ */}
            <div className="hero-right" aria-hidden="true">
                {/* Main visual box */}
                <div className="hero-visual-box">
                    <img 
                        src="/images/hero/about-img-bg.webp" 
                        alt="" 
                        className="hero-visual-bg" 
                        onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes('ik.imagekit.io')) {
                                target.src = 'https://ik.imagekit.io/italostudy/hero/about-img-bg.webp';
                            }
                        }}
                    />
                    <img
                        src="/images/hero/banner-img.webp"
                        alt="Italostudy Premium Student"
                        className="hero-banner-img"
                        {...({ fetchpriority: "high" } as any)}
                        loading="eager"
                        onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes('ik.imagekit.io')) {
                                target.src = 'https://ik.imagekit.io/italostudy/hero/banner-img.webp';
                            }
                        }}
                    />
                </div>

                {/* Global Presence Flags - Right Side (Equally Spaced Vertical Column) */}
                <div className="absolute top-[20%] -right-6 hero-flag hero-drift-right hidden lg:flex">
                    <FlagBadge country="turkey" className="w-7 h-7 md:w-10 md:h-10" />
                </div>
                <div className="absolute top-[35%] -right-6 hero-flag hero-drift-left hidden lg:flex">
                    <FlagBadge country="india" className="w-7 h-7 md:w-10 md:h-10" />
                </div>
                <div className="absolute top-[50%] -right-6 hero-flag hero-drift-right hidden lg:flex">
                    <FlagBadge country="pakistan" className="w-7 h-7 md:w-10 md:h-10" />
                </div>
                <div className="absolute top-[65%] -right-6 hero-flag hero-drift-left hidden lg:flex">
                    <FlagBadge country="uk" className="w-7 h-7 md:w-10 md:h-10" />
                </div>
                {/* Floating stat card 1 — top-left — zigzag-1 */}
                <div className="hero-stat-card hero-stat-card--tl hero-float-1">
                    <span className="hero-stat-emoji">🧬</span>
                    <div>
                        <p className="hero-stat-value">
                            {t('landing.hero.stats.pass_rate', '98%')}
                        </p>
                        <p className="hero-stat-label">
                            {t('landing.hero.stats.pass_rate_label', 'Pass Rate')}
                        </p>
                    </div>
                </div>

                {/* Floating stat card 2 — top-right — zigzag-2 */}
                <div className="hero-stat-card hero-stat-card--tr hero-float-2">
                    <span className="hero-stat-emoji">📊</span>
                    <div>
                        <p className="hero-stat-value">
                            {t('landing.hero.stats.students', '5,000+')}
                        </p>
                        <p className="hero-stat-label">
                            {t('landing.hero.stats.students_label', 'students')}
                        </p>
                    </div>
                </div>

                {/* Floating stat card 3 — bottom-left — zigzag-3 */}
                <div className="hero-stat-card hero-stat-card--bl hero-float-3">
                    <span className="hero-stat-emoji">⚡</span>
                    <div>
                        <p className="hero-stat-value">
                            {t('landing.hero.stats.mock_exams', 'Expert-Led')}
                        </p>
                        <p className="hero-stat-label">
                            {t('landing.hero.stats.mock_exams_label', 'Mock Exams')}
                        </p>
                    </div>
                </div>

                {/* Floating stat card 4 — bottom-right — drop */}
                <div className="hero-stat-card hero-stat-card--br hero-drop">
                    <span className="hero-stat-emoji">🏆</span>
                    <div>
                        <p className="hero-stat-value">
                            {t('landing.hero.stats.prep_rank', '#1')}
                        </p>
                        <p className="hero-stat-label">
                            {t('landing.hero.stats.prep_rank_label', 'CEnT-S Prep')}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                /* ── Inline scoped styles for HeroSection ── */

                #hero-root.hero-visible {
                    opacity: 1 !important;
                }

                .hero-two-col {
                    position: relative;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 48px;
                    padding: 0 16px;
                    overflow: visible;
                    text-align: center;
                }

                @media (min-width: 1024px) {
                    .hero-two-col {
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        gap: 60px;
                        text-align: left;
                    }
                }

                /* ── Blobs ── */
                .hero-blob {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 0;
                }
                .hero-blob--blue {
                    top: -180px;
                    left: -300px;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(ellipse at center, hsla(234,90%,60%,0.18), transparent 70%);
                }
                .hero-blob--orange {
                    bottom: -180px;
                    right: -300px;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(ellipse at center, hsla(38,95%,55%,0.18), transparent 70%);
                }

                /* ── Deco shapes ── */
                .hero-shape {
                    position: absolute;
                    pointer-events: none;
                    z-index: 0;
                }
                .hero-shape--1 { top: 6%; left: 3%; animation: heroZigzag1 6s linear infinite; }
                .hero-shape--2 { bottom: 8%; left: 6%; animation: heroZigzag2 7s linear infinite; }
                .hero-shape--3 { top: 20%; right: 0; animation: heroZigzag3 8s linear infinite; }
                .hero-shape--4 { bottom: 12%; right: 8%; animation: heroDrop 3s infinite; }

                /* ── Floating Flags ── */
                .hero-flag {
                    position: absolute;
                    pointer-events: none;
                    z-index: 30;
                    transition: all 0.3s ease;
                }

                .hero-drift-left { animation: heroDriftLeft 8s ease-in-out infinite; }
                .hero-drift-right { animation: heroDriftRight 9s ease-in-out infinite; }

                @keyframes heroDriftLeft {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-10px, 5px) rotate(-5deg); }
                    66% { transform: translate(5px, -10px) rotate(5deg); }
                }

                @keyframes heroDriftRight {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(12px, -8px) rotate(8deg); }
                    66% { transform: translate(-8px, 12px) rotate(-8deg); }
                }

                /* ── LEFT side ── */
                .hero-left {
                    position: relative;
                    z-index: 10;
                    flex: 1;
                    max-width: 580px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                @media (min-width: 1024px) {
                    .hero-left { align-items: flex-start; }
                }

                .hero-subtitle {
                    display: inline-block;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: #fff;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    padding: 6px 18px;
                    border-radius: 999px;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.3);
                }

                .hero-heading {
                    color: #050e38;
                    font-size: clamp(36px, 6vw, 70px);
                    font-weight: 900;
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    margin: 0;
                }

                .hero-heading-accent {
                    position: relative;
                    display: inline-block;
                    color: #4f46e5;
                }

                .hero-underline-bar {
                    position: absolute;
                    bottom: -6px;
                    left: 0;
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: linear-gradient(90deg, #f59e0b, #ef4444);
                    transform: scaleX(1);
                    transform-origin: left;
                }

                .hero-text {
                    color: #6b7280;
                    font-size: clamp(14px, 1.8vw, 17px);
                    line-height: 1.7;
                    max-width: 480px;
                }

                /* ── Button Group ── */
                .hero-btn-group {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    gap: 8px;
                    justify-content: center;
                    margin-top: 8px;
                    width: 100%;
                }
                @media (min-width: 1024px) {
                    .hero-btn-group { 
                        justify-content: flex-start;
                        gap: 16px;
                    }
                }

                .hero-btn {
                    position: relative !important;
                    height: auto !important;
                    padding: 12px 20px !important;
                    border-radius: 10px !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.06em !important;
                    overflow: hidden !important;
                    border: none !important;
                    cursor: pointer;
                    transition: box-shadow 0.25s ease !important;
                    flex: 1;
                    max-width: 160px;
                }
                @media (min-width: 768px) {
                    .hero-btn {
                        padding: 16px 40px !important;
                        font-size: 14px !important;
                        max-width: none;
                    }
                }

                .hero-btn--primary {
                    background: #4f46e5 !important;
                    color: #fff !important;
                    box-shadow: 0 8px 28px rgba(79,70,229,0.35) !important;
                }
                .hero-btn--primary:hover {
                    background: #050e38 !important;
                    box-shadow: 0 12px 40px rgba(5,14,56,0.35) !important;
                }

                .hero-btn--secondary {
                    background: #050e38 !important;
                    color: #fff !important;
                    border: none !important;
                    box-shadow: 0 8px 24px rgba(5,14,56,0.2) !important;
                }
                .hero-btn--secondary:hover {
                    background: #4f46e5 !important;
                    box-shadow: 0 12px 36px rgba(79,70,229,0.3) !important;
                }

                /* animated square overlay on button hover — reference: .btn .square */
                .hero-btn-square {
                    position: absolute;
                    top: 50%;
                    right: 18px;
                    transform: translateY(-50%);
                    width: 36px;
                    height: 36px;
                    border-radius: 7px;
                    background: rgba(255,255,255,0.15);
                    transition: all 0.25s ease;
                    pointer-events: none;
                }
                .hero-btn:hover .hero-btn-square {
                    right: -2px;
                    width: 105%;
                    height: 105%;
                }

                /* ── RIGHT side — visual panel ── */
                .hero-right {
                    position: relative;
                    z-index: 10;
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    max-width: 520px;
                }

                .hero-visual-box {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                }

                .hero-visual-bg {
                    position: absolute;
                    width: 110%;
                    height: 110%;
                    object-fit: contain;
                    opacity: 0.8;
                    z-index: -1;
                    animation: heroPulse 4s ease-in-out infinite;
                }

                .hero-banner-img {
                    width: 100%;
                    height: auto;
                    max-height: 550px;
                    object-fit: contain;
                    filter: drop-shadow(0 20px 50px rgba(0,0,0,0.1));
                    z-index: 1;
                }

                @keyframes heroPulse {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                }

                /* ── Floating stat cards ── */
                .hero-stat-card {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #ffffff;
                    border: 1px solid rgba(99,102,241,0.12);
                    border-radius: 16px;
                    padding: 12px 18px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.10);
                    z-index: 20;
                    white-space: nowrap;
                }

                .hero-stat-card--tl { top: 10px;  left: -60px; }
                .hero-stat-card--tr { top: 10px;  right: -60px; }
                .hero-stat-card--bl { bottom: 30px; left: -50px; }
                .hero-stat-card--br { bottom: 30px; right: -40px; }

                @media (max-width: 767px) {
                    .hero-stat-card {
                        padding: 8px 12px;
                        gap: 6px;
                    }
                    .hero-stat-emoji { font-size: 20px; }
                    .hero-stat-value { font-size: 12px; }
                    .hero-stat-label { font-size: 9px; }

                    .hero-stat-card--tl { left: -35px; top: 20px; }
                    .hero-stat-card--tr { right: -35px; top: 20px; }
                    .hero-stat-card--bl { left: -30px; bottom: 40px; }
                    .hero-stat-card--br { right: -30px; bottom: 40px; }
                    
                    .hero-visual-box {
                        transform: scale(0.9);
                    }
                }

                .hero-stat-emoji {
                    font-size: 28px;
                    line-height: 1;
                }

                .hero-stat-value {
                    font-size: 15px;
                    font-weight: 900;
                    color: #050e38;
                    line-height: 1.2;
                }

                .hero-stat-label {
                    font-size: 11px;
                    font-weight: 600;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }

                /* ── Animations (mirrors animation.css from reference) ── */

                .hero-float-1 { animation: heroZigzag1 5s linear infinite; }
                .hero-float-2 { animation: heroZigzag2 5s linear infinite; }
                .hero-float-3 { animation: heroZigzag3 5s linear infinite; }
                .hero-drop    { animation: heroDrop 2.5s infinite; }

                @keyframes heroZigzag1 {
                    0%, 100% { transform: translate(0, 0); }
                    25%       { transform: translate(8px, 8px); }
                    50%       { transform: translate(4px, 4px); }
                    75%       { transform: translate(8px, -4px); }
                }

                @keyframes heroZigzag2 {
                    0%, 100% { transform: translate(0, 0); }
                    25%       { transform: translate(-8px, -8px); }
                    50%       { transform: translate(-4px, -4px); }
                    75%       { transform: translate(-8px, 4px); }
                }

                @keyframes heroZigzag3 {
                    0%, 100% { transform: translate(0, 0); }
                    25%       { transform: translate(-6px, -6px); }
                    50%       { transform: translate(-12px, -12px); }
                    75%       { transform: translate(-6px, -6px); }
                }

                @keyframes heroDrop {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40%                      { transform: translateY(-20px); }
                    60%                      { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
