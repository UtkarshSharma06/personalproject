import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Clock, MessageSquare, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const ContactSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl hover:border-white/20 transition-all mb-8"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Icon size={24} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
        </div>
        <div className="text-slate-400 font-bold leading-relaxed space-y-4 text-sm">
            {children}
        </div>
    </motion.div>
);

export default function Contact() {
    return (
        <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-indigo-500/30">
            <SEO
                title="Contact Us | ItaloStudy"
                description="Get in touch with the ItaloStudy team for support, admissions guidance, or business inquiries."
            />

            {/* Header */}
            <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-2 group text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return to Base</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <MessageSquare className="text-indigo-500" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Communication Hub v1.0</span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-20 pb-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                        Get in <span className="text-indigo-500">Touch.</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-tight">
                        Our specialized mission support team is ready to assist you with any questions regarding admissions, technical support, or program details.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <ContactSection icon={Mail} title="Direct Support">
                        <p>For all inquiries, from technical assistance to partnership proposals, reach out to us via our central communication channel:</p>
                        <a
                            href="mailto:info.italostudy@gmail.com"
                            className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 block transition-all group"
                        >
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Central Email</p>
                            <p className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">info.italostudy@gmail.com</p>
                        </a>
                    </ContactSection>

                    <ContactSection icon={Clock} title="Response Protocol">
                        <p>We operate with high-precision responsiveness to ensure no student is left behind.</p>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">SLO Target</p>
                                <p className="text-lg font-black text-emerald-400">Response within 24 Hours</p>
                            </div>
                        </div>
                        <p className="text-[12px] italic">Note: Our global team processes inquiries 7 days a week to support students in every time zone.</p>
                    </ContactSection>
                </div>

                <div className="mt-12 space-y-8">
                    <ContactSection icon={Globe} title="Global Operations">
                        <p>ItaloStudy is a decentralized academic ecosystem supporting students across 30+ countries. Our digital-first infrastructure ensures you have access to elite admission insights regardless of your geographic location.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {['Milan', 'London', 'Berlin', 'Global Support'].map(loc => (
                                <div key={loc} className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-tight text-white/60">{loc}</p>
                                </div>
                            ))}
                        </div>
                    </ContactSection>
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 text-white/20">
                        <Heart size={14} className="animate-pulse text-indigo-500/50" />
                        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Built for the future of education</p>
                    </div>
                </div>
            </main>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full opacity-30" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[150px] rounded-full opacity-20" />
            </div>
        </div>
    );
}
