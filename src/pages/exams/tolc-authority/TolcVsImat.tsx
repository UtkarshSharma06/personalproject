import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    Swords,
    CheckCircle2,
    CalendarDays,
    BookOpen,
    Languages,
    Target,
    ChevronRight,
    HelpCircle,
    Building2,
    Scale,
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { tolcLinks } from '@/lib/nav-links';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'The Core Difference' },
    { id: 'format', label: 'Format & Delivery' },
    { id: 'scoring', label: 'Scoring Systems' },
    { id: 'choice', label: 'Which Should You Take?' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Is the TOLC-MED easier than the IMAT?', answer: 'Not necessarily. While the IMAT has more questions (60 vs 50), the TOLC-MED forces a strict time limit on each individual section, making time management much harder. Furthermore, TOLC-MED uses an equalized scoring algorithm, making it harder to predict a safe cutoff.' },
    { question: 'Can I take the TOLC-MED instead of the IMAT to study Medicine in English?', answer: 'No. The IMAT (International Medical Admissions Test) is strictly required for public English-taught medical degrees in Italy. The TOLC-MED is required for Italian-taught medical degrees.' },
    { question: 'Are there any English-taught degrees that accept the TOLC?', answer: 'Yes! While Medicine requires the IMAT, many Engineering, Economics, and Pharmacy degrees taught in English accept specific English TOLC variants (e.g., English TOLC-I or English TOLC-E).' },
    { question: 'Can I use my IMAT score for an Italian medical degree?', answer: 'No. The systems are completely separate. If you want to apply to both English and Italian medical degrees, you must take both the IMAT and the TOLC-MED.' },
    { question: 'Is the biology syllabus the same for both exams?', answer: 'Almost identical. Both exams are based on the Italian Ministry of Education\'s high school science curriculum. Studying Biology for the IMAT will perfectly prepare you for the Biology section of the TOLC-MED.' },
    { question: 'How does the negative marking compare?', answer: 'Both exams punish guessing, but slightly differently. The IMAT penalizes wrong answers by -0.4 points. The TOLC penalizes wrong answers by -0.25 points.' },
    { question: 'Can I take both exams in the same year?', answer: 'Yes, absolutely. Many students take the TOLC-MED in the spring/summer as a backup, and then sit for the IMAT in September.' },
    { question: 'Which exam has a higher Non-EU quota?', answer: 'Generally, Italian-taught degrees (using TOLC) have more total seats available, but also more domestic competition. English-taught degrees (using IMAT) have highly restricted Non-EU quotas, making them statistically more competitive for international students.' }
];

export default function TolcVsImat() {
    const { getField } = usePageContent('tolc-vs-imat-2026');
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
        <CmsPageWrapper slug="tolc-vs-imat-2026">
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
                    title="TOLC vs IMAT 2026: Which Exam Should You Take?"
                    description="A detailed comparison between the CISIA TOLC (TOLC-MED, TOLC-I) and the IMAT. Understand differences in syllabus, English vs Italian degrees, and scoring."
                    keywords="TOLC vs IMAT, TOLC-MED vs IMAT, difference between TOLC and IMAT, study medicine in Italy exam, IMAT alternative"
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
                                        <Swords size={12} className="text-indigo-600" />
                                        The Ultimate Comparison
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'TOLC vs IMAT')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "International students looking to study in Italy are often confused by the alphabet soup of entrance exams. The two most dominant testing systems are the IMAT (International Medical Admissions Test) and the CISIA TOLC. Choosing the wrong exam means applying for the wrong degree. This guide breaks down the core differences in language, structure, and admissions logic so you can choose the right path.")}
                                    </EditableText>

                                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                                        <Card className="p-8 bg-indigo-50 border-indigo-200 border-2 rounded-[2rem]">
                                            <h3 className="text-2xl font-black text-indigo-900 mb-2">The TOLC System</h3>
                                            <p className="text-indigo-800 text-sm font-medium leading-relaxed mb-4">
                                                A massive, decentralized family of exams (TOLC-I, TOLC-E, TOLC-MED) managed by CISIA. Primarily used for Italian-taught degrees, though English variants exist for Engineering and Economics.
                                            </p>
                                        </Card>
                                        <Card className="p-8 bg-emerald-50 border-emerald-200 border-2 rounded-[2rem]">
                                            <h3 className="text-2xl font-black text-emerald-900 mb-2">The IMAT System</h3>
                                            <p className="text-emerald-800 text-sm font-medium leading-relaxed mb-4">
                                                A single, centralized, high-stakes exam managed directly by the Italian Ministry of Education. Exclusively used for English-taught Medicine and Surgery degrees in public universities.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Format & Delivery */}
                                <section id="format" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-slate-200 p-3 rounded-2xl">
                                            <BookOpen className="text-slate-700" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Format & Delivery</h2>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="p-6 font-bold text-slate-900">Feature</th>
                                                    <th className="p-6 font-bold text-indigo-700 bg-indigo-50/50">TOLC</th>
                                                    <th className="p-6 font-bold text-emerald-700 bg-emerald-50/50">IMAT</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-6 text-slate-900 font-bold">Exam Date</td>
                                                    <td className="p-6 text-slate-600 bg-indigo-50/30">Multiple sessions (Feb - Nov)</td>
                                                    <td className="p-6 text-slate-600 bg-emerald-50/30">One single day in September</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-6 text-slate-900 font-bold">Delivery Method</td>
                                                    <td className="p-6 text-slate-600 bg-indigo-50/30">Computer-Based (CBT) only</td>
                                                    <td className="p-6 text-slate-600 bg-emerald-50/30">Paper-Based only</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-6 text-slate-900 font-bold">Time Management</td>
                                                    <td className="p-6 text-slate-600 bg-indigo-50/30">Strict per-section timers (Locked)</td>
                                                    <td className="p-6 text-slate-600 bg-emerald-50/30">100 minutes total (Free movement)</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-6 text-slate-900 font-bold">Location</td>
                                                    <td className="p-6 text-slate-600 bg-indigo-50/30">At home or at a university lab</td>
                                                    <td className="p-6 text-slate-600 bg-emerald-50/30">In-person at designated test centers worldwide</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* Scoring */}
                                <section id="scoring" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Scale size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                                                <Scale className="text-amber-400" />
                                                Scoring Mechanics
                                            </h2>
                                            
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                                                    <h4 className="font-black text-amber-400 text-xl mb-4">TOLC Penalty</h4>
                                                    <ul className="space-y-3 text-sm text-slate-300">
                                                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400"/> +1.0 for correct answers</li>
                                                        <li className="flex items-center gap-2"><AlertCircle size={16} className="text-rose-400"/> -0.25 for incorrect answers</li>
                                                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-400"/> 0.0 for blanks</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                                                    <h4 className="font-black text-emerald-400 text-xl mb-4">IMAT Penalty</h4>
                                                    <ul className="space-y-3 text-sm text-slate-300">
                                                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400"/> +1.5 for correct answers</li>
                                                        <li className="flex items-center gap-2"><AlertCircle size={16} className="text-rose-400"/> -0.4 for incorrect answers</li>
                                                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-400"/> 0.0 for blanks</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-400 mt-6 italic">
                                                Note: TOLC-MED utilizes a complex "Equalization Algorithm" that adjusts your raw score based on the statistical difficulty of your specific test variant. IMAT does not do this; everyone takes the exact same paper exam on the exact same day.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Which Should You Take */}
                                <section id="choice" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Target className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Which Should You Take?</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-4 items-start">
                                            <Building2 className="text-emerald-600 shrink-0" size={24} />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-1">Take the IMAT if...</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    You explicitly want to study Medicine or Dentistry entirely in English at a public Italian university. There is no alternative route for this specific goal.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-4 items-start">
                                            <Languages className="text-indigo-600 shrink-0" size={24} />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-1">Take the TOLC-MED if...</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    You speak fluent Italian (C1 level) and want to study Medicine or Dentistry in Italian.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4 items-start">
                                            <Building2 className="text-amber-600 shrink-0" size={24} />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-1">Take the English TOLC-I / TOLC-E if...</h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    You want to study Engineering, Computer Science, or Economics in English at top universities like Politecnico di Torino, Sapienza, or Bologna.
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

                                <CTASection fieldKeyPrefix="tolc_vs_imat_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
