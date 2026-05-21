import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const PrivacySection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:border-indigo-100 transition-all mb-8 group"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
        </div>
        <div className="text-slate-500 font-bold leading-relaxed space-y-4 text-sm">
            {children}
        </div>
    </motion.div>
);

export default function Privacy() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/10">
            <SEO
                title="Privacy Policy | ItaloStudy"
                description="Learn about how ItaloStudy protects your data and manages your academic privacy."
            />

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-2 group text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Shield className="text-indigo-600" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Privacy Protocol v1.0</span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-20 pb-40 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">
                        Privacy <span className="text-indigo-600">Protection.</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-tight">
                        Your academic journey is protected by our global security architecture. We prioritize transparency and data sovereignty for every student.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    <PrivacySection icon={Eye} title="Data Collection">
                        <p>We collect information necessary to provide our intelligent academic ecosystem. This includes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Account Identification (Email, Display Name)</li>
                            <li>Academic Profile (Target Exams, Performance Metrics)</li>
                            <li>Interaction Logs (Practice Session Results, Tutoring Sessions)</li>
                        </ul>
                    </PrivacySection>

                    <PrivacySection icon={Database} title="Smart Processing & Privacy">
                        <p>ItaloStudy utilizes advanced neural networks to personalize your learning experience. Your data is used to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Calibrate Adaptive Difficulty Algorithms</li>
                            <li>Generate Personalized Study Recommendations</li>
                            <li>Train Internal Performance Analysis Models (Anonymized)</li>
                        </ul>
                    </PrivacySection>

                    <PrivacySection icon={Lock} title="Data Sovereignty">
                        <p>We respect your ownership of academic data. Our protocols ensure that:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Personal data is never sold to third-party marketing entities.</li>
                            <li>Encryption-at-rest is applied to all sensitive database records.</li>
                            <li>Users maintain the right to export or delete their academic history.</li>
                        </ul>
                    </PrivacySection>

                    <PrivacySection icon={Globe} title="Regional Compliance">
                        <p>ItaloStudy adheres to international data protection standards, including GDPR. Whether you are studying in Europe, Asia, or the Americas, we apply the highest level of privacy protection to your account regardless of geographic location.</p>
                    </PrivacySection>

                    <PrivacySection icon={UserCheck} title="Service Transparency">
                        <p>We utilize trusted infrastructure partners including Supabase (Database), Vercel (Hosting), and industry-leading providers for our learning engine. Each partner is selected based on their commitment to enterprise-grade security and compliance.</p>
                    </PrivacySection>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Last Updated: January 2026</p>
                </div>
            </main>

            {/* Floating Action */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
                <Link to="/">
                    <Button className="bg-slate-900 hover:bg-black text-white rounded-full px-10 h-14 font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 active:scale-95 transition-all">
                        Back to Academy
                    </Button>
                </Link>
            </div>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 blur-[150px] rounded-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-50 blur-[150px] rounded-full opacity-30" />
            </div>
        </div>
    );
}
