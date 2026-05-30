import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    LayoutGrid,
    CheckCircle2,
    Clock,
    Calculator,
    Target,
    HelpCircle,
    ChevronRight,
    Search,
    Beaker,
    TrendingUp,
    Zap,
    Scale,
    Atom,
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
    { id: 'overview', label: 'Pattern Overview' },
    { id: 'scoring', label: 'CISIA Scoring System' },
    { id: 'structure-i', label: 'TOLC-I Structure' },
    { id: 'structure-f', label: 'TOLC-F Structure' },
    { id: 'structure-med', label: 'TOLC-MED Structure' },
    { id: 'english', label: 'The English Section' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the penalty for a wrong answer in the TOLC?', answer: 'In almost all standard TOLC exams (TOLC-I, TOLC-F, TOLC-E), a wrong answer results in a -0.25 point penalty. This discourages blind guessing.' },
    { question: 'Is the English section scored the same way?', answer: 'No. The 30-question English proficiency section at the end of most TOLC exams does NOT have a penalty for wrong answers. A correct answer is +1 point, and both wrong and blank answers are 0 points. You should always guess on the English section.' },
    { question: 'Can I jump between different sections during the exam?', answer: 'No. This is a critical structural element of the CBT (Computer-Based Test). Each section has its own strict countdown timer. Once the time for "Mathematics" is up, that section locks permanently, and you are forced to move to the next section.' },
    { question: 'Can I finish a section early and use that time for another section?', answer: 'No. If you finish the 20 questions of Mathematics in 15 minutes (out of the 50 allotted), you can move to the next section early, but you DO NOT carry over the saved time. The extra 35 minutes disappear.' },
    { question: 'How is the TOLC-MED scored differently?', answer: 'TOLC-MED introduced an "Equalized Score" (Punteggio Equalizzato). Because the exam is drawn from a randomized database, some students might get slightly harder questions than others. The equalization algorithm mathematically adjusts your raw score based on the statistical difficulty of the specific questions you received.' },
    { question: 'How many answer choices does each question have?', answer: 'Every question in a standard TOLC has 5 multiple-choice options (A, B, C, D, E), with only one correct answer.' },
    { question: 'What happens if I leave a question blank?', answer: 'A blank (unanswered) question awards exactly 0 points. It neither helps nor hurts your score. Statistically, if you can eliminate at least two wrong options, making an educated guess is mathematically favorable despite the -0.25 penalty.' },
    { question: 'Is there a minimum score required to pass?', answer: 'CISIA itself does not set a "passing" score; they merely calculate your result. The minimum score required for admission is determined entirely by the individual university and the specific degree program you are applying to (indicated in their Bando).' },
    { question: 'Does the exam format differ if I take TOLC@HOME?', answer: 'No. The structure, number of questions, time limits per section, and scoring matrix are exactly identical whether you take the test at home or in a university computer lab.' },
    { question: 'How long does the entire test take?', answer: 'It varies by type, but generally lasts between 90 and 115 minutes for the core sections, plus an additional 15 minutes for the optional English section at the end.' }
];

export default function TolcPatternGuide() {
    const { getField } = usePageContent('tolc-pattern-2026');
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
        <CmsPageWrapper slug="tolc-pattern-2026">
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
                    title="TOLC Exam Pattern & Scoring System 2026 Explained"
                    description="A detailed breakdown of the TOLC exam pattern, section timings, negative marking rules, and the CISIA equalized scoring algorithm for TOLC-MED, TOLC-I, and TOLC-F."
                    keywords="TOLC exam pattern, TOLC scoring system, TOLC negative marking, TOLC-MED equalized score, CISIA test structure, TOLC time limit"
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
                                        <LayoutGrid size={12} className="text-indigo-600" />
                                        Official Format & Rules
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'TOLC Exam Pattern & Scoring')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Understanding what to study is only half the battle. The TOLC is a highly structured, strict Computer-Based Test (CBT). It features rigidly segmented time limits, negative marking for incorrect guesses, and zero ability to return to previous sections once a timer expires. Furthermore, depending on the TOLC variant you take, the weighting of subjects changes drastically. This guide breaks down the mechanical structure of the exams and explains exactly how CISIA calculates your final score.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'format', label: 'Test Format', value: 'CBT only', icon: LayoutGrid },
                                            { key: 'options', label: 'Options/Q', value: '5 Choices', icon: Target },
                                            { key: 'penalty', label: 'Wrong Answer', value: '-0.25 Pts', icon: Scale },
                                            { key: 'timer', label: 'Navigation', value: 'Locked', icon: Clock }
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

                                {/* Scoring System */}
                                <section id="scoring" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Calculator className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">The Core Scoring Matrix</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                        All standard TOLC exams (TOLC-I, TOLC-F, TOLC-E) use the same baseline scoring matrix for their core scientific and logical sections. It is explicitly designed to punish random guessing. 
                                    </p>

                                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                                        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                            <div className="text-3xl font-black text-emerald-600 mb-2">+1.0</div>
                                            <div className="font-bold text-emerald-900">Correct Answer</div>
                                        </div>
                                        <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-center">
                                            <div className="text-3xl font-black text-slate-600 mb-2">0.0</div>
                                            <div className="font-bold text-slate-900">Blank Answer</div>
                                        </div>
                                        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                                            <div className="text-3xl font-black text-rose-600 mb-2">-0.25</div>
                                            <div className="font-bold text-rose-900">Wrong Answer</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <Scale size={100} />
                                        </div>
                                        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <Zap className="text-amber-400" />
                                            The TOLC-MED Equalized Score
                                        </h4>
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                            TOLC-MED uses a more complex algorithm. Because the test is drawn from a database, two students testing on the same day get different questions. To ensure fairness, CISIA calculates a "Coefficient of Difficulty" for every single question. 
                                        </p>
                                        <p className="text-slate-300 text-sm leading-relaxed font-bold">
                                            Equalized Score = Raw Score + Difficulty Coefficient.
                                        </p>
                                        <p className="text-slate-400 text-xs mt-4">
                                            This means if you answer a statistically difficult question correctly, you are rewarded more than if you answer an easy question correctly.
                                        </p>
                                    </div>
                                </section>

                                {/* Structure: TOLC-I */}
                                <section id="structure-i" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <TrendingUp className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Structure: TOLC-I (Engineering)</h2>
                                    </div>
                                    
                                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="p-4 font-bold text-slate-900">Section</th>
                                                    <th className="p-4 font-bold text-slate-900">Questions</th>
                                                    <th className="p-4 font-bold text-slate-900">Time Limit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Calculator size={16} className="text-indigo-500"/> Mathematics</td>
                                                    <td className="p-4 text-slate-900 font-bold">20</td>
                                                    <td className="p-4 text-slate-600">50 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Target size={16} className="text-emerald-500"/> Logic</td>
                                                    <td className="p-4 text-slate-900 font-bold">10</td>
                                                    <td className="p-4 text-slate-600">20 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Beaker size={16} className="text-amber-500"/> Sciences</td>
                                                    <td className="p-4 text-slate-900 font-bold">10</td>
                                                    <td className="p-4 text-slate-600">20 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Search size={16} className="text-rose-500"/> Verbal Comprehension</td>
                                                    <td className="p-4 text-slate-900 font-bold">10</td>
                                                    <td className="p-4 text-slate-600">20 minutes</td>
                                                </tr>
                                                <tr className="bg-indigo-50 border-t-2 border-indigo-100">
                                                    <td className="p-4 text-indigo-900 font-black">TOTAL (Core)</td>
                                                    <td className="p-4 text-indigo-900 font-black">50</td>
                                                    <td className="p-4 text-indigo-900 font-black">110 minutes</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* Structure: TOLC-F */}
                                <section id="structure-f" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <Beaker className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Structure: TOLC-F (Pharmacy/Bio)</h2>
                                    </div>
                                    
                                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="p-4 font-bold text-slate-900">Section</th>
                                                    <th className="p-4 font-bold text-slate-900">Questions</th>
                                                    <th className="p-4 font-bold text-slate-900">Time Limit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Beaker size={16} className="text-emerald-500"/> Biology</td>
                                                    <td className="p-4 text-slate-900 font-bold">15</td>
                                                    <td className="p-4 text-slate-600">20 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Beaker size={16} className="text-amber-500"/> Chemistry</td>
                                                    <td className="p-4 text-slate-900 font-bold">15</td>
                                                    <td className="p-4 text-slate-600">20 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Calculator size={16} className="text-indigo-500"/> Math & Physics</td>
                                                    <td className="p-4 text-slate-900 font-bold">7</td>
                                                    <td className="p-4 text-slate-600">12 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Target size={16} className="text-rose-500"/> Logic</td>
                                                    <td className="p-4 text-slate-900 font-bold">7</td>
                                                    <td className="p-4 text-slate-600">12 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Search size={16} className="text-cyan-500"/> Logic</td>
                                                    <td className="p-4 text-slate-900 font-bold">6</td>
                                                    <td className="p-4 text-slate-600">8 minutes</td>
                                                </tr>
                                                <tr className="bg-amber-50 border-t-2 border-amber-100">
                                                    <td className="p-4 text-amber-900 font-black">TOTAL (Core)</td>
                                                    <td className="p-4 text-amber-900 font-black">50</td>
                                                    <td className="p-4 text-amber-900 font-black">72 minutes</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="mt-4 text-sm text-slate-500 font-medium">Notice the extreme time pressure in TOLC-F. You have less than 1.5 minutes per question across the entire exam.</p>
                                </section>

                                {/* Structure: TOLC-MED */}
                                <section id="structure-med" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Target className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Structure: TOLC-MED (Medicine)</h2>
                                    </div>
                                    
                                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="p-4 font-bold text-slate-900">Section</th>
                                                    <th className="p-4 font-bold text-slate-900">Questions</th>
                                                    <th className="p-4 font-bold text-slate-900">Time Limit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Search size={16} className="text-cyan-500"/> Reading Comprehension & Knowledge</td>
                                                    <td className="p-4 text-slate-900 font-bold">7</td>
                                                    <td className="p-4 text-slate-600">15 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Beaker size={16} className="text-emerald-500"/> Biology</td>
                                                    <td className="p-4 text-slate-900 font-bold">15</td>
                                                    <td className="p-4 text-slate-600">25 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Atom size={16} className="text-amber-500"/> Chemistry & Physics</td>
                                                    <td className="p-4 text-slate-900 font-bold">15</td>
                                                    <td className="p-4 text-slate-600">25 minutes</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-700 font-medium flex items-center gap-2"><Calculator size={16} className="text-indigo-500"/> Mathematics & Reasoning</td>
                                                    <td className="p-4 text-slate-900 font-bold">13</td>
                                                    <td className="p-4 text-slate-600">25 minutes</td>
                                                </tr>
                                                <tr className="bg-rose-50 border-t-2 border-rose-100">
                                                    <td className="p-4 text-rose-900 font-black">TOTAL (Core)</td>
                                                    <td className="p-4 text-rose-900 font-black">50</td>
                                                    <td className="p-4 text-rose-900 font-black">90 minutes</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* The English Section */}
                                <section id="english" className="scroll-mt-[120px]">
                                    <div className="p-8 bg-slate-100 rounded-[2rem] border border-slate-200">
                                        <h2 className="text-2xl font-black text-slate-900 mb-4">The Optional/Mandatory English Section</h2>
                                        <p className="text-slate-600 leading-relaxed font-medium mb-6">
                                            Immediately after the core exam finishes, the system will automatically start the English Proficiency Section. It consists of <strong>30 questions to be answered in 15 minutes</strong>.
                                        </p>
                                        <ul className="space-y-3 text-sm text-slate-700">
                                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> No negative marking (-0 points for mistakes).</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Does not typically impact your main admission ranking.</li>
                                            <li className="flex items-center gap-2"><AlertCircle size={16} className="text-amber-500" /> Used by universities to determine if you need remedial English classes (OFA).</li>
                                        </ul>
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

                                <CTASection fieldKeyPrefix="tolc_pattern_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
