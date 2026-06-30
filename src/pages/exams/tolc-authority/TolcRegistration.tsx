import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    UserPlus,
    CheckCircle2,
    Laptop,
    CreditCard,
    ChevronRight,
    HelpCircle,
    Building2,
    AlertCircle,
    Image as ImageIcon,
    Mail,
    FileText
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { tolcLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Registration Overview' },
    { id: 'step-1', label: 'Step 1: CISIA Account' },
    { id: 'step-2', label: 'Step 2: Booking' },
    { id: 'step-3', label: 'Step 3: Payment' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Where do I register for the TOLC exam?', answer: 'You must register exclusively on the official CISIA portal (cisiaonline.it) in the "Reserved Area" (Area Riservata). You do not book the exam directly through the university website.' },
    { question: 'What documents do I need to register?', answer: 'To create a CISIA account, you will need a valid email address, your Fiscal Code (Codice Fiscale) if you have one, and a recent passport-style digital photo. You will also need a valid ID (passport or national ID card) on the day of the exam.' },
    { question: 'How much is the registration fee?', answer: 'The standard registration fee for all TOLC variants is €30. This is paid directly to CISIA during the booking process.' },
    { question: 'Can I pay the fee with a non-Italian credit card?', answer: 'Yes, the CISIA payment gateway (usually PagoPA or a standard credit card processor) accepts major international credit cards like Visa and Mastercard.' },
    { question: 'What happens if I upload a bad photo during registration?', answer: 'If your uploaded photo does not clearly show your face (like a passport photo), the university commission may reject it on the day of the exam, and you will not be allowed to take the test. Ensure the photo is recent, clear, and has a plain background.' },
    { question: 'Can I change my exam date after I have booked and paid?', answer: 'Yes, but only under strict conditions. You can cancel your booking and receive a "credit" for another date, but you must do this before the registration deadline for your original exam date (usually one week prior). If you miss the deadline, your €30 is lost.' },
    { question: 'Do I need a Codice Fiscale (Italian Tax Code) to register?', answer: 'Italian citizens have one automatically. Non-Italian students can generate a temporary alphanumeric code during the CISIA registration process if they do not yet possess an official Codice Fiscale.' },
    { question: 'I booked a TOLC@HOME but my computer broke. What do I do?', answer: 'If you fail to connect on the day of the exam due to technical issues, you are marked as absent and lose the €30 fee. It is your strict responsibility to ensure your hardware meets the SEB (Safe Exam Browser) requirements prior to the exam.' },
    { question: 'Do I need to register on Universitaly as well?', answer: 'If you are a Non-EU student requiring a visa, yes. You must do the pre-enrollment on Universitaly. However, this is a completely separate process from booking the actual TOLC exam on the CISIA website.' },
    { question: 'When does registration close for a specific date?', answer: 'Registration typically closes exactly one week (7 days) before the scheduled exam date, usually at a specific time (e.g., 2:00 PM Italian time). Never wait until the last minute.' }
];

export default function TolcRegistration() {
    const { getField } = usePageContent('tolc-registration-2026');
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
        <CmsPageWrapper slug="tolc-registration-2026">
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
                    title="How to Register for TOLC 2026: Step-by-Step Guide"
                    description="A complete step-by-step walkthrough on how to register for the TOLC exam on the CISIA portal, pay the €30 fee, upload photos, and book your session."
                    keywords="TOLC registration, how to book TOLC, CISIA reserved area, TOLC payment, TOLC Codice Fiscale, book TOLC@HOME"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'TOLC Guide', item: '/tolc-exam-ultimate-guide-2026' },
                        { name: 'TOLC Registration 2026', item: '/tolc-registration-2026' }
                    ])]}
                    />

                <FAQSchema items={faqs} />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="tolc" />
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-[120px]">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <UserPlus size={12} className="text-indigo-600" />
                                        CISIA Portal Guide
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'TOLC Registration Process 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Booking a TOLC exam can be confusing because the test is required by universities, but administered entirely by a third party (CISIA). You will not find the booking button on your university's website; you must create an account on the CISIA portal. This guide provides a step-by-step walkthrough to ensure you avoid common bureaucratic mistakes—like uploading an invalid photo or missing a payment deadline—that could cost you your exam seat.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'platform', label: 'Platform', value: 'CISIA', icon: Laptop },
                                            { key: 'fee', label: 'Exam Fee', value: '€30', icon: CreditCard },
                                            { key: 'deadline', label: 'Closes', value: '7 Days Prior', icon: AlertCircle },
                                            { key: 'req', label: 'Required', value: 'ID & Photo', icon: ImageIcon }
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

                                {/* Step 1 */}
                                <section id="step-1" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center font-black text-rose-600 text-xl shrink-0">1</div>
                                        <h2 className="text-3xl font-black text-slate-900">Create your CISIA Account</h2>
                                    </div>
                                    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm mb-8">
                                        <p className="text-slate-600 leading-relaxed font-medium mb-6">
                                            The very first thing you must do is visit <strong>cisiaonline.it</strong> and navigate to the "Area Riservata Test TOLC" to register as a new user.
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 bg-rose-50 p-2 rounded-lg"><Mail className="text-rose-600" size={20} /></div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Email & Basic Info</h4>
                                                    <p className="text-sm text-slate-600">Provide a secure email address. You will need to verify this email immediately to activate the account.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 bg-rose-50 p-2 rounded-lg"><FileText className="text-rose-600" size={20} /></div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Codice Fiscale (Tax Code)</h4>
                                                    <p className="text-sm text-slate-600">If you are an international student without an official Italian Codice Fiscale, the system will offer an option to automatically generate a temporary one based on your name, birth date, and country of origin.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 bg-rose-50 p-2 rounded-lg"><ImageIcon className="text-rose-600" size={20} /></div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">The Digital Photo (CRITICAL)</h4>
                                                    <p className="text-sm text-slate-600">You must upload a passport-style photo. <strong>Do not upload selfies, heavily filtered photos, or photos with others.</strong> If the photo does not clearly identify you, the university commission will deny your entry on test day.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Step 2 */}
                                <section id="step-2" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center font-black text-indigo-600 text-xl shrink-0">2</div>
                                        <h2 className="text-3xl font-black text-slate-900">Booking the Exam</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <EditableText fieldKey="booking_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('booking_desc', "Once inside your Area Riservata, select 'Prenotazione TOLC' (Book TOLC). You will be presented with a massive database of available dates across Italy.")}
                                            </EditableText>
                                            <ul className="space-y-3 text-sm text-slate-700">
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                                    <span><strong>Select the Variant:</strong> Ensure you pick the exact correct test (e.g., English TOLC-F). Taking the Italian version by mistake invalidates your application.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                                    <span><strong>Select Delivery:</strong> Choose between TOLC@HOME (if available) or TOLC@UNI.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                                    <span><strong>Select University:</strong> You can take the test at University A, and use the score to apply to University B. Just pick the location/date most convenient for you.</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <Card className="p-8 bg-indigo-50 border-indigo-100 border-2 rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                                <Building2 size={150} className="text-indigo-900" />
                                            </div>
                                            <h4 className="text-indigo-900 font-black mb-4">University Quotas</h4>
                                            <p className="text-sm text-indigo-800 font-medium leading-relaxed">
                                                Seats for TOLC@UNI are physically limited by the size of the computer lab. During peak summer months, seats at popular universities disappear within hours of the calendar opening. Book weeks in advance.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Step 3 */}
                                <section id="step-3" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center font-black text-emerald-600 text-xl shrink-0">3</div>
                                        <h2 className="text-3xl font-black text-slate-900">Payment & Confirmation</h2>
                                    </div>
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <CreditCard size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                                <CreditCard className="text-emerald-400" />
                                                The €30 Registration Fee
                                            </h3>
                                            <p className="text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
                                                Your booking is not confirmed until payment is processed. You can usually pay via Credit Card (Visa/Mastercard) or through the Italian PagoPA system.
                                            </p>
                                            
                                            <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                                    <AlertCircle className="text-amber-400" size={18} />
                                                    The "Ricevuta" (Receipt)
                                                </h4>
                                                <p className="text-sm text-slate-300 leading-relaxed">
                                                    Upon successful payment, you will receive a <strong>Ricevuta di Avvenuto Pagamento</strong> in your reserved area. You MUST download and print this receipt. You are required to show it (along with your ID) to the commission on the day of the exam.
                                                </p>
                                            </div>
                                        </div>
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
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Explore the Full TOLC Cluster 📚</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tolcLinks.map((link, i) => (
                                            <Link key={i} to={link.path} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{link.label}</span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="tolc_registration_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
