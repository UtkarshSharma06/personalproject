import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    ClipboardCheck,
    CreditCard,
    Globe,
    FileText,
    CheckCircle2,
    ChevronRight,
    HelpCircle,
    UserPlus,
    Monitor,
    Star,
    AlertCircle,
    Zap,
    ShieldCheck,
    Sparkles,
    Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { imatLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'portal', label: 'Universitaly Portal' },
    { id: 'university-portal', label: 'University Portal' },
    { id: 'payment', label: 'Payment' },
    { id: 'support', label: 'Support' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'When does IMAT registration usually open?', answer: 'Registration typically opens in early to mid-September, just 3-4 weeks before the exam date. The window is short, usually lasting about 10-14 days.' },
    { question: 'Where do I register for the IMAT?', answer: 'Official registration must be completed on the Universitaly.it portal. You must create an account and follow the ministerial procedures.' },
    { question: 'What is the registration fee for IMAT?', answer: 'The fee is approximately €130-€150 (approx. $140-$165), depending on ministerial updates. This is paid directly via the Universitaly portal during registration.' },
    { question: 'Can I choose my exam center?', answer: 'Yes, you can choose from various international test centers (London, New York, Dubai, etc.) or centers within Italy. Seats are first-come, first-served.' },
    { question: 'How do I pick my university preferences?', answer: 'During registration on Universitaly, you must list your university choices in order of preference (1st choice, 2nd choice, etc.).' },
    { question: 'Can I change my preferences after registration?', answer: 'No. Once the registration window closes, your university preferences are final and cannot be altered.' },
    { question: 'What documents do I need for registration?', answer: 'You primarily need a valid passport (or ID card for EU students) and a credit/debit card for the payment.' },
    { question: 'I made a mistake in my registration, what should I do?', answer: 'You can usually edit your details as long as the registration window is open. After it closes, you must contact the exam helpdesk immediately.' },
    { question: 'Do I get a confirmation email?', answer: 'Yes, both Universitaly and the payment processor will send confirmation emails. Ensure you save your "Registered Candidate" PDF.' },
    { question: 'What is the "Dichiarazione di Valore" (DoV)?', answer: 'The DoV is not needed for registration itself, but it is required for your final enrollment at the university after passing the exam.' }
];

export default function ImatRegistration() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-exam-registration-2026');
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <CmsPageWrapper slug="imat-exam-registration-2026">
            <Layout
                variant="public"
                subNavigation={
                    <PageNavigation
                        sections={sections}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                }
            >
                <SEOHead
                    title="IMAT Registration 2026: How to Register on Universitaly (Step-by-Step)"
                    description="Complete IMAT 2026 registration guide. Step-by-step walkthrough of the Universitaly portal, exam fee payment (€130), preference selection, and common mistakes to avoid."
                    keywords="IMAT registration 2026, how to register for IMAT, Universitaly portal guide, IMAT exam fees 2026, IMAT university preferences, IMAT 2026 registration process"
                />

                <FAQSchema items={faqs} />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* Sidebar Hub */}
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="imat" />
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-[120px]">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                        Official 2026 Academic Roadmap
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'IMAT 2026 Registration Process')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The registration process in Italy is a high-stakes bureaucratic procedure. Our guide breaks down the Universitaly requirements into actionable steps.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'portal', label: 'Platform', value: 'Universitaly', icon: Globe },
                                            { key: 'fee', label: 'Exam Fee', value: '€130 approx', icon: CreditCard },
                                            { key: 'deadline', label: 'Window', value: 'July 2026', icon: Activity },
                                            { key: 'verified', label: 'Status', value: 'Verified', icon: ShieldCheck }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                                <EditableText fieldKey={`stat_val_${item.key}`} as="div" className="text-2xl font-black text-slate-900">
                                                    {getField(`stat_val_${item.key}`, item.value)}
                                                </EditableText>
                                                <EditableText fieldKey={`stat_label_${item.key}`} as="div" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    {getField(`stat_label_${item.key}`, item.label)}
                                                </EditableText>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Universitaly Portal Section */}
                                <section id="portal" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Monitor className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">The Universitaly Interface</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden">
                                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                                            <div className="space-y-6">
                                                <h3 className="text-xl font-black text-slate-900 leading-tight">Navigating the "International Students" Area</h3>
                                                <p className="text-slate-600 font-medium leading-relaxed">
                                                    Universitaly is the central hub for all Italian higher education. During the July window, a specific "IMAT 2026" banner appears. You must register for an account using your legal name exactly as it appears on your passport.
                                                </p>
                                                <div className="space-y-4 pt-4">
                                                    {[
                                                        { label: 'Login Type', val: 'CIMEA / Universitaly ID' },
                                                        { label: 'Required Info', val: 'Passport Number & Photo' },
                                                        { label: 'Language', val: 'Italian / English Toggle' }
                                                    ].map((row, i) => (
                                                        <div key={i} className="flex justify-between border-b border-slate-50 pb-2">
                                                            <span className="text-xs font-black text-slate-400 uppercase">{row.label}</span>
                                                            <span className="text-sm font-bold text-slate-900">{row.val}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                                <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                                    <Star className="text-amber-500" size={18} />
                                                    Preference List Strategy
                                                </h4>
                                                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                                    You can list any number of universities, but only your **1st choice** determines your test location if you sit the exam in Italy. Once the window closes, your list is locked.
                                                </p>
                                                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                                    <div className="text-[10px] font-black text-indigo-600 uppercase mb-2">Pro Tip</div>
                                                    <p className="text-xs font-bold text-slate-900">
                                                        Always list your absolute "Dream School" first. The Italian ranking system favors those who qualify for their 1st choice immediately ("Assegnato").
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Individual University Portal Section */}
                                <section id="university-portal" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <Globe className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Individual University Portals</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12">
                                        <EditableText fieldKey="uni_portal_desc" multiline as="p" className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                            {getField('uni_portal_desc', "Many students mistakenly believe Universitaly is the only step. However, every Italian university (Pavia, Milan, Rome, etc.) has its own 'Segreteria Online' portal. You must often register on your 1st choice university portal BEFORE the exam to finalize your candidacy.")}
                                        </EditableText>
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-900">What to do on the University Portal:</h4>
                                                {[
                                                    { key: 'docs', label: 'Upload specific high school documents' },
                                                    { key: 'admin_fee', label: 'Pay the local "administrative fee" (if applicable)' },
                                                    { key: 'verify', label: 'Verify your data for the final enrollment ranking' },
                                                    { key: 'book_slot', label: 'Book the exam slot at that specific campus' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-amber-500" />
                                                        <EditableText fieldKey={`uni_portal_item_${item.key}`} as="span">
                                                            {getField(`uni_portal_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                                                <div className="text-xs font-black text-amber-600 uppercase mb-2">Important Note</div>
                                                <EditableText fieldKey="uni_portal_note" multiline as="p" className="text-xs font-bold text-slate-700 leading-relaxed">
                                                    {getField('uni_portal_note', "Missing the university portal deadline—even if you registered on Universitaly—can disqualify you. This is common for schools like Humanitas (private) and some public ones like Pavia or Milan.")}
                                                </EditableText>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Steps */}
                                <section id="steps" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <UserPlus className="text-indigo-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900">Operational Walkthrough</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { title: 'Universitaly Portal Signup', desc: 'Create your account on the official ministry portal. Ensure your name matches your passport exactly.', icon: UserPlus },
                                            { title: 'University Preference List', desc: 'Rank your choice of medical schools. Your 1st choice determines where you sit the exam (if in Italy).', icon: ClipboardCheck },
                                            { title: 'Test Center Selection', desc: 'Choose a global test center or an Italian university campus to sit the physical exam.', icon: Globe },
                                            { title: 'Final Submission & Fee', desc: 'Complete the payment to finalize your registration. Unpaid applications are automatically voided.', icon: CreditCard }
                                        ].map((step, i) => (
                                            <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-start gap-8">
                                                <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                                                    <step.icon size={28} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Step 0{i + 1}</div>
                                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{step.title}</h3>
                                                    <p className="text-slate-600 font-medium leading-relaxed">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Detailed Sections */}
                                <section id="payment" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <CreditCard size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <Zap className="text-indigo-400" />
                                                The Payment Protocol
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                Italy uses the "Mav" or "PagoPA" systems for internal payments, but for IMAT, the Universitaly portal follows a standard international credit card gateway. Ensure your card is enabled for international transactions.
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <CheckCircle2 size={32} className="text-emerald-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Confirmation Email</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">Save the PDF receipt generated after payment. You MUST bring a printed copy to the test center.</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <AlertCircle size={32} className="text-amber-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Non-Refundable</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">The €130 fee is strictly non-refundable regardless of exam attendance or visa status.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Support */}
                                <section id="support" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <HelpCircle className="text-amber-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900">Support & Common Errors</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { title: 'Portal Crashes', focus: 'Universitaly often experiences high load in the final 48 hours. Register early.', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                                            { title: 'Tax Code (Codice Fiscale)', focus: 'The portal generates a placeholder for international students. Do not panic.', color: 'bg-rose-50 border-rose-100 text-rose-700' },
                                            { title: 'Preference Locking', focus: 'Once you click "Confirm," you cannot swap your 1st and 2nd choices.', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
                                            { title: 'Verification Email', focus: 'Check your spam folder immediately. Your registration is not active without verification.', color: 'bg-amber-50 border-amber-100 text-amber-700' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-8 rounded-[2rem] border-2 ${item.color} flex flex-col justify-between h-full group hover:shadow-lg transition-all`}>
                                                <div>
                                                    <h4 className="text-xl font-bold mb-4 uppercase">{item.title}</h4>
                                                    <p className="text-sm opacity-80 font-medium leading-relaxed">{item.focus}</p>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="bg-slate-200 p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="text-xl font-black text-slate-900 mb-4 flex gap-4">
                                                    <span className="text-indigo-600">Q{i + 1}:</span>
                                                    <EditableText fieldKey={`faq_q_${i}`} as="div">
                                                        {getField(`faq_q_${i}`, faq.question)}
                                                    </EditableText>
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-12 border-l-2 border-slate-50">
                                                    <EditableText fieldKey={`faq_a_${i}`} multiline as="div">
                                                        {getField(`faq_a_${i}`, faq.answer)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Bottom Grid */}
                                <section className="pt-20 border-t border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Explore the Full IMAT Cluster 📚</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {imatLinks.map((link, i) => (
                                            <Link key={i} to={link.path} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{link.label}</span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="imat_reg_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


