import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, FileText, Zap, Brain, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const TermsSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:border-amber-100 transition-all mb-8 group"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
        </div>
        <div className="text-slate-500 font-bold leading-relaxed space-y-4 text-sm">
            {children}
        </div>
    </motion.div>
);

export default function Terms() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500/10">
            <SEO
                title="Terms of Service | ItaloStudy"
                description="The legal protocol governing the usage of the ItaloStudy intelligent ecosystem and educational tools."
            />

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-2 group text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Scale className="text-amber-600" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Usage Protocol v1.0</span>
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
                        Terms of <span className="text-amber-600">Service.</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-tight">
                        By initializing the ItaloStudy protocol, you agree to adhere to the standards of academic integrity and usage defined below.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    <TermsSection icon={Zap} title="Service Scope">
                        <p>ItaloStudy provides an intelligent educational platform for exam preparation (IMAT, SAT, IELTS, CEnT-S). Our services include:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Real-time Expert Tutoring & Item Generation</li>
                            <li>Performance Analytics & Diagnostic Simulations</li>
                            <li>Community Modules & Collaborative Workspaces</li>
                        </ul>
                    </TermsSection>

                    <TermsSection icon={Brain} title="Academic Integrity">
                        <p>Users must maintain high standards of academic honesty. The platform is designed for preparation and learning, not for dynamic assistance during official exam administrations. Usage of ItaloStudy to automate cheating or bypass exam security protocols is strictly prohibited.</p>
                    </TermsSection>

                    <TermsSection icon={Cpu} title="Learning Engine Disclaimer">
                        <p>Our learning engines strive for 99.9% accuracy, but given the nature of dynamic educational intelligence:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>System-generated explanations are for educational guidance and should be cross-referenced with official blueprints.</li>
                            <li>Diagnostic scores are predictive estimates, not guarantees of final exam results.</li>
                        </ul>
                    </TermsSection>

                    <TermsSection icon={FileText} title="Intellectual Property">
                        <p>All training materials, UI architecture, and proprietary logic are the intellectual property of ItaloStudy. Unauthorized scraping, replication, or commercial distribution of platform contents is a violation of our global copyright protocols.</p>
                    </TermsSection>

                    <TermsSection icon={Zap} title="Subscription & Billing">
                        <p>ItaloStudy offers premium subscription plans for advanced exam preparation. By subscribing, you agree that:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Payments are processed securely via our global partners (Stripe, Paddle, Razorpay).</li>
                            <li>Automatic renewal is enabled by default for recurring plans. You can disable this in your account settings.</li>
                            <li>Cancellation of a subscription can be done at any time. You will maintain premium access until the end of your current billing period.</li>
                        </ul>
                    </TermsSection>

                    <TermsSection icon={ShieldAlert} title="Account Security">
                        <p>Users are responsible for maintaining the confidentiality of their credentials and Multi-Factor Authentication (MFA) setup. Sharing account access with unauthorized third parties is prohibited and may lead to immediate protocol termination.</p>
                    </TermsSection>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Last Updated: January 2026</p>
                </div>
            </main>

            {/* Floating Action */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
                <Link to="/">
                    <Button className="bg-slate-900 hover:bg-black text-white rounded-full px-10 h-14 font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 active:scale-95 transition-all">
                        Accept & Continue
                    </Button>
                </Link>
            </div>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-50 blur-[150px] rounded-full opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-50 blur-[150px] rounded-full opacity-30" />
            </div>
        </div>
    );
}
