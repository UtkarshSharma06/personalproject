import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';

const RefundSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:border-rose-100 transition-all mb-8 group"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
        </div>
        <div className="text-slate-500 font-bold leading-relaxed space-y-4 text-sm">
            {children}
        </div>
    </motion.div>
);

export default function Refund() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-500/10">
            <SEO
                title="Refund Policy | ItaloStudy"
                description="Our commitment to transparency: Read the ItaloStudy refund and cancellation policy."
            />

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-2 group text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <RefreshCw className="text-rose-600" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Refund Protocol v1.0</span>
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
                        Refund <span className="text-rose-600">Policy.</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-tight">
                        We value your trust. Our refund policy is designed to be fair, transparent, and aligned with global consumer protection standards.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    <RefundSection icon={Clock} title="7-Day Satisfaction Guarantee">
                        <p>At ItaloStudy, we stand by the quality of our academic resources. If you are not satisfied with our premium services, you are eligible for a full refund within the first 7 days of your initial subscription purchase.</p>
                        <p>This "No Questions Asked" guarantee applies to your first billing cycle to ensure you have ample time to test our intelligent learning ecosystem.</p>
                    </RefundSection>

                    <RefundSection icon={AlertCircle} title="Eligibility Criteria">
                        <p>To qualify for a refund, the following conditions must be met:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>The request must be submitted via our official support channel within 7 calendar days of purchase.</li>
                            <li>The user must not have completed more than 2 full mock exams or downloaded more than 5 premium resources.</li>
                            <li>Refunds do not apply to renewal payments unless cancelled before the renewal date.</li>
                        </ul>
                    </RefundSection>

                    <RefundSection icon={ShieldCheck} title="Processing Protocol">
                        <p>Once your refund request is approved:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>The refund will be processed back to your original payment method (Stripe, PayPal, Razorpay, or Cashfree).</li>
                            <li>Processing times take between 5-10 business days depending on your financial institution.</li>
                            <li>Your premium access will be downgraded to the 'Explorer' (Free) tier immediately upon processing.</li>
                        </ul>
                    </RefundSection>

                    <RefundSection icon={Heart} title="Cancellation Policy">
                        <p>You may cancel your subscription at any time through your Account Settings. Upon cancellation:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You will retain access to premium features until the end of your current billing period.</li>
                            <li>No further charges will be applied to your payment method.</li>
                            <li>We do not provide pro-rated refunds for the remaining days in a billing cycle after the 7-day guarantee period.</li>
                        </ul>
                    </RefundSection>
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-300">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Contact contact@italostudy.com for refund requests.</p>
                    </div>
                </div>
            </main>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-50 blur-[150px] rounded-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 blur-[150px] rounded-full opacity-30" />
            </div>
        </div>
    );
}
