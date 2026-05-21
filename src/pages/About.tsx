import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Mail, Target, Award, Rocket, Building2, ShieldCheck, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';

const InfoSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all mb-6"
    >
        <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Icon size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
        <div className="text-slate-600 leading-relaxed space-y-4 text-base">
            {children}
        </div>
    </motion.div>
);

export default function About() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <SEO
                title={`${t('about.title')} | ItaloStudy`}
                description="Learn about ItaloStudy, our mission to simplify global entrance exams, and our founder Utkarsh Kumar Sharma."
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "ItaloStudy",
                    "url": "https://italostudy.com",
                    "logo": "https://italostudy.com/logo.webp",
                    "description": "Empowering students through data-driven academic excellence and simplified university admissions for Italian Universities.",
                    "founder": {
                        "@type": "Person",
                        "name": "Utkarsh Kumar Sharma"
                    },
                    "sameAs": [
                        "https://www.instagram.com/italostudy",
                        "https://www.youtube.com/@italostudy"
                    ]
                }}
            />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-2 group text-slate-500 hover:text-indigo-600 transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('common.back')}</span>
                    </Link>
                    <Link to="/" className="flex items-center">
                        <img src="/logo.webp" alt="ItaloStudy" className="h-8 w-auto grayscale contrast-125" />
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 md:mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6">
                        <Building2 size={14} />
                        Corporate Profile
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                        {t('about.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                        Empowering students through data-driven academic excellence and simplified university admissions.
                    </p>
                </motion.div>

                <div className="grid gap-6">
                    <InfoSection icon={Target} title={t('about.mission_title')}>
                        <p>{t('about.mission_desc1')}</p>
                        <p>{t('about.mission_desc2')}</p>
                    </InfoSection>

                    <InfoSection icon={Rocket} title={t('about.do_title')}>
                        <p>{t('about.do_desc')}</p>
                        <div className="grid sm:grid-cols-2 gap-4 mt-2">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-1">{t('about.do_item1')}</h3>
                                <p className="text-sm text-slate-500">{t('about.do_item1_desc')}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-1">{t('about.do_item2')}</h3>
                                <p className="text-sm text-slate-500">{t('about.do_item2_desc')}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-1">{t('about.do_item3')}</h3>
                                <p className="text-sm text-slate-500">{t('about.do_item3_desc')}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-1">{t('about.do_item4')}</h3>
                                <p className="text-sm text-slate-500">{t('about.do_item4_desc')}</p>
                            </div>
                        </div>
                    </InfoSection>

                    <InfoSection icon={User} title={t('about.leadership_title')}>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-1">
                                <p className="mb-4">
                                    <strong>ItaloStudy</strong> {t('about.leadership_desc1')}
                                </p>
                                <p className="text-slate-600">
                                    {t('about.leadership_desc2')}
                                </p>
                            </div>
                        </div>
                    </InfoSection>

                    <div className="grid md:grid-cols-2 gap-6">
                        <InfoSection icon={MapPin} title={t('about.office_title')}>
                            <address className="not-italic text-slate-600">
                                {t('about.office_address').split(', ').map((line, i) => (
                                    <span key={i} className="block">{line}</span>
                                ))}
                            </address>
                        </InfoSection>

                        <InfoSection icon={Mail} title={t('about.contact_title')}>
                            <p>{t('about.contact_desc')}</p>
                            <a
                                href="mailto:contact@italostudy.com"
                                className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors mt-2"
                            >
                                contact@italostudy.com
                                <ArrowLeft size={16} className="rotate-180" />
                            </a>
                        </InfoSection>
                    </div>

                    <InfoSection icon={ShieldCheck} title={t('about.commitment_title')}>
                        <p>{t('about.commitment_desc')}</p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg">
                                <Globe2 size={14} /> Global Excellence
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg">
                                <ShieldCheck size={14} /> Data Privacy
                            </div>
                        </div>
                    </InfoSection>
                </div>

                <footer className="mt-20 text-center border-t border-slate-200 pt-12">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} ItaloStudy. {t('footer.rights')}
                    </p>
                </footer>
            </main>

            {/* Subtle background element */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        </div>
    );
}
