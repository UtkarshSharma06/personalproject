import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    ClipboardList,
    CreditCard,
    UserPlus,
    CheckCircle2,
    Zap,
    Scale,
    TrendingUp,
    ChevronRight,
    Target,
    HelpCircle,
    Globe,
    AlertCircle,
    Sparkles,
    MousePointer2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQSchema from '@/components/seo/FAQSchema';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import EditableText from '@/components/cms/EditableText';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import { centsLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'steps', label: 'Registration Steps' },
    { id: 'checklist', label: 'Document Checklist' },
    { id: 'fees', label: 'Fees & Payment' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'How do I register for the CENT-S?', answer: 'Registration is done through the official CISIA portal. You must create an account, select the CENT-S module, choose a date/test center, and pay the €30 fee.' },
    { question: 'Is the CENT-S registration different from University application?', answer: "Yes. Registering for the CENT-S only books the exam. You must also apply to your specific university's 'Bando' (Call for Admission) separately." },
    { question: 'What is the registration fee for CENT-S?', answer: 'The standardized fee is €30 per attempt. This must be paid via credit card or bank transfer on the CISIA portal.' },
    { question: 'Can I register for multiple dates at once?', answer: 'No. You can only have one active CENT-S registration at a time. After sitting the exam, you can register for a new date in the following macro-period.' },
    { question: 'Do I need my passport to register?', answer: 'Yes. You will need your passport number (or EU identity card) to create your CISIA profile.' },
    { question: 'What is a "Codice Fiscale"?', answer: 'It is an Italian tax code. International students can often generate a temporary one on the CISIA portal during registration.' },
    { question: 'Can I cancel my registration and get a refund?', answer: 'Refunds are generally not provided for cancellations. However, some universities may allow you to reschedule if you notify them well in advance.' },
    { question: 'How do I know my registration is successful?', answer: 'You will receive a confirmation email from CISIA and a "Ricevuta" (Receipt) will be available in your personal area on the portal.' },
    { question: 'When do I select my university preference?', answer: 'You select your university during the "Bando" application phase on the university portal, not during the CENT-S registration on CISIA.' },
    { question: 'What is the deadline for the Summer registration?', answer: 'Registration typically closes 7-10 days before the specific exam date, but popular slots in July and August fill up weeks in advance.' }
];

export default function CentsRegistration() {
    const { getField } = usePageContent('cent-s-registration-2026');
    const [activeSection, setActiveSection] = React.useState('overview');

    React.useEffect(() => {
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

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
    };

    return (
        <CmsPageWrapper slug="cent-s-registration-2026">
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
                    title="CENT-S Registration 2026: Step-by-Step CISIA Guide"
                    description="How to register for the CENT-S 2026. Step-by-step guide to the CISIA portal, registration fees, deadlines, and Italian university application links."
                    keywords="cent-s registration 2026, cisia portal registration, cent-s fee payment, study italy registration guide, tolc-s registration"
                />

                <FAQSchema items={faqs} />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* Sidebar Hub */}
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="cents" />
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
                                        {getField('hero_headline', 'CENT-S 2026 Registration Guide')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The CENT-S registration process is managed by the CISIA consortium. Following the correct steps ensures your score is transmitted to your chosen universities.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'portal', label: 'Portal', value: 'CISIA', icon: Globe },
                                            { key: 'fee', label: 'Fee', value: '€30', icon: CreditCard },
                                            { key: 'attempt', label: 'Attempts', value: 'Multiple', icon: TrendingUp },
                                            { key: 'status', label: 'Status', value: 'Open', icon: CheckCircle2 }
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

                                {/* Steps */}
                                <section id="steps" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <UserPlus className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Step-by-Step Registration</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { title: 'Create CISIA Account', desc: 'Register on the official CISIA website using your personal details and passport number.' },
                                            { title: 'Select Exam Type', desc: "Choose 'CENT-S' from the available exam list. Ensure you don't accidentally select the Italian TOLC-I or TOLC-S." },
                                            { title: 'Book Slot', desc: 'Choose a date and test mode (at home or at a university computer lab).' },
                                            { title: 'Pay Registration Fee', desc: 'Complete the €30 payment via the secure portal to finalize your booking.' }
                                        ].map((step, i) => (
                                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 items-start group hover:border-indigo-600 transition-colors">
                                                <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 group-hover:bg-indigo-600 transition-colors">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 mb-1">{step.title}</h4>
                                                    <p className="text-sm text-slate-500 font-medium">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Checklist */}
                                <section id="checklist" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <ClipboardList className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Registration Checklist</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600"><MousePointer2 size={150} /></div>
                                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-900">Required Information:</h4>
                                                {[
                                                    { key: 'passport', label: 'Valid Passport or ID Card' },
                                                    { key: 'fiscal', label: 'Codice Fiscale (Tax Code)' },
                                                    { key: 'email', label: 'Active Personal Email' },
                                                    { key: 'card', label: 'Credit/Debit Card for €30 Fee' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        <EditableText fieldKey={`check_item_${item.key}`} as="span">
                                                            {getField(`check_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                                <h4 className="text-slate-900 font-black mb-2 flex items-center gap-2">
                                                    <AlertCircle size={18} className="text-amber-600" />
                                                    International Tip
                                                </h4>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                    If you are a Non-EU student, ensure the data you enter on CISIA matches your passport exactly, as this information will be cross-referenced during your visa application.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Fees */}
                                <section id="fees" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5"><CreditCard size={200} /></div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <Zap className="text-indigo-400" />
                                                Fees & Payment Mode
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                The registration fee is standardized at **€30.00**. This must be paid for each attempt you make. Payments are processed securely via the PagoPA system or major international credit cards.
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <h4 className="text-indigo-400 font-black text-xl mb-3">No Refunds</h4>
                                                    <p className="text-slate-300 text-sm leading-relaxed">
                                                        CISIA does not typically offer refunds for missed or cancelled sessions. Double-check your availability before confirming the payment.
                                                    </p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <h4 className="text-emerald-400 font-black text-xl mb-3">Payment Receipt</h4>
                                                    <p className="text-slate-300 text-sm leading-relaxed">
                                                        Always download and print your "Ricevuta di Pagamento" from the portal. You may need to show this at the test center.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="bg-slate-200 p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
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

                                <section className="pt-12 border-t border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Explore the Full CENT-S Cluster 📚</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {centsLinks.map((link, i) => (
                                            <Link key={i} to={link.path} className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors text-sm">{link.label}</span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={18} />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="registration_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


