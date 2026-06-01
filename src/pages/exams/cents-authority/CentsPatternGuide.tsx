import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    Target,
    HelpCircle,
    Clock,
    Zap,
    CheckCircle2,
    ListOrdered,
    Percent,
    XCircle,
    Sparkles,
    Grid,
    MousePointer2
} from 'lucide-react';
import FAQSchema from '@/components/seo/FAQSchema';
import CTASection from '@/components/exams/CTASection';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import { Button } from '@/components/ui/button';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'scoring', label: 'Scoring System' },
    { id: 'distribution', label: 'Question Distribution' },
    { id: 'strategy', label: 'Structural Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the full form of CENT-S?', answer: 'CENT-S stands for CISIA English Test – Science. It is the standardized entrance examination for scientific degree programs in Italy taught in English.' },
    { question: 'How many questions are in the CENT-S?', answer: 'There are a total of 55 multiple-choice questions in the CENT-S exam.' },
    { question: 'What is the total duration of the CENT-S?', answer: 'The exam lasts for 110 minutes, with specific time limits for each of the five sections.' },
    { question: 'Does the CENT-S have negative marking?', answer: 'Yes, every incorrect answer results in a deduction of 0.25 points. Correct answers earn 1 point, and unanswered questions score 0.' },
    { question: 'What are the five sections in CENT-S?', answer: 'The sections are: Mathematics (15 Qs), Reasoning on Texts & Data (15 Qs), Biology (10 Qs), Chemistry (10 Qs), and Physics (5 Qs).' },
    { question: 'Is the CENT-S taken on paper or computer?', answer: 'The CENT-S is a Computer-Based Test (CBT) that can be taken either at a university (@UNI) or at home (@HOME) depending on the session.' },
    { question: 'Which section has the most weight?', answer: 'Mathematics and Reasoning on Texts & Data have the highest weight, with 15 questions each, together making up over 50% of the total score.' },
    { question: 'Can I use a calculator during the CENT-S?', answer: 'No, the use of calculators, mobile phones, or any other electronic devices is strictly prohibited.' },
    { question: 'What is the registration fee for CENT-S?', answer: 'The registration fee for each CENT-S attempt is €55.00, payable during the online registration process on the CISIA portal.' },
    { question: 'When are the CENT-S results published?', answer: 'Since it is a computer-based test, you can see your raw score immediately after the exam. Official normalized scores are typically available within 15 days.' }
];

export default function CentsPatternGuide() {
    const { getField } = usePageContent('cent-s-exam-pattern-2026');
    const [activeSection, setActiveSection] = React.useState('overview');

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120;
            const allSections = [{ id: 'overview', label: 'Overview' }, ...sections];
            for (const section of allSections) {
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
        <CmsPageWrapper slug="cent-s-exam-pattern-2026">
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
                    title="CENT-S Exam Pattern 2026 – Scoring, Timing & Section Details"
                    description="Master the CENT-S (CISIA English Test – Science) 2026 exam pattern. Detailed analysis of 55 questions, 110-minute timing, and +1/-0.25 scoring system."
                    keywords="CENT-S exam pattern 2026, CISIA English Test Science, CENT-S marks distribution, CENT-S negative marking, CENT-S timing"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'CEnT-S Guide', item: '/cent-s-exam-ultimate-guide' },
                        { name: 'CEnT-S Exam Pattern 2026', item: '/cent-s-exam-pattern-2026' }
                    ])]}
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

                                {/* Hero Section */}
                                <section id="overview" className="scroll-mt-[120px]">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                        Official 2026 Academic Roadmap
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
                                        {getField('hero_headline', 'CEnT-S 2026 Exam Pattern & Structure')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', "The CENT-S (CISIA English Test – Science) is the newly introduced standardized entrance examination for English-taught Bachelor's degree programs in scientific, technological, and economic fields in Italy. Replacing the former English TOLC-I, TOLC-E, and TOLC-F exams, the CENT-S consolidates various scientific disciplines into a single, streamlined assessment. Understanding this new format is essential for students targeting scientific excellence at major Italian universities.")}
                                    </EditableText>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
                                    {[
                                        { key: 'mode', label: 'Exam Mode', value: 'CBT (@UNI / @HOME)', icon: MousePointer2, color: 'text-blue-600', bg: 'bg-blue-50' },
                                        { key: 'total_qs', label: 'Total Questions', value: '55 MCQs', icon: ListOrdered, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        { key: 'duration', label: 'Total Duration', value: '110 Minutes', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
                                    ].map((item, i) => (
                                        <Card key={i} className={`p-6 md:p-8 border-none shadow-sm flex items-center md:flex-col text-left md:text-center gap-4 md:gap-0 ${item.bg}`}>
                                            <item.icon className={`${item.color} mb-0 md:mb-4 shrink-0`} size={32} />
                                            <div>
                                                <EditableText fieldKey={`stat_label_${item.key}`} as="div" className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                                                    {getField(`stat_label_${item.key}`, item.label)}
                                                </EditableText>
                                                <EditableText fieldKey={`stat_val_${item.key}`} as="div" className={`text-xl md:text-2xl font-black ${item.color}`}>
                                                    {getField(`stat_val_${item.key}`, item.value)}
                                                </EditableText>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <div className="space-y-16">

                                    {/* Scoring System */}
                                    <section id="scoring" className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] scroll-mt-[120px]">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="bg-rose-100 p-3 rounded-2xl">
                                                <Percent className="text-rose-600" size={32} />
                                            </div>
                                            <EditableText fieldKey="scoring_title" as="h2" className="text-2xl md:text-3xl font-black text-slate-900">
                                                {getField('scoring_title', 'CEnT-S Scoring System Explained')}
                                            </EditableText>
                                        </div>

                                        <EditableText fieldKey="scoring_desc" multiline as="p" className="text-base md:text-lg text-slate-600 leading-relaxed mb-10 font-medium">
                                            {getField('scoring_desc', 'The CENT-S uses a precise scoring system tailored for scientific accuracy. Each of the 55 multiple-choice questions has five options (A-E) with only one correct choice. The scoring formula is designed to discourage random guessing: +1 point for every correct answer, -0.25 points for every incorrect answer, and 0 points for unanswered questions. CISIA also applies a normalization process to the raw scores, ensuring that the difficulty level is consistent across different test sessions. Strategic non-answering remains a key tactic—only commit to an answer if you can logically eliminate at least two options to tilt the statistical probability in your favor.')}
                                        </EditableText>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                            <div className="bg-emerald-50 p-6 md:p-8 rounded-2xl border border-emerald-100 flex items-start gap-4">
                                                <CheckCircle2 className="text-emerald-600 shrink-0 mt-1" size={24} />
                                                <div>
                                                    <EditableText fieldKey="correct_val" as="div" className="text-2xl md:text-3xl font-black text-emerald-700">
                                                        {getField('correct_val', '+1 Point')}
                                                    </EditableText>
                                                    <EditableText fieldKey="correct_label" as="div" className="font-bold text-slate-500 mb-2">
                                                        {getField('correct_label', 'Per Correct Answer')}
                                                    </EditableText>
                                                    <EditableText fieldKey="correct_desc" multiline as="p" className="text-xs md:text-sm opacity-80">
                                                        {getField('correct_desc', 'Maximise your raw score by securing sections where you are strongest. Mathematics (15 Qs) and Reasoning (15 Qs) form the bulk of the CENT-S, accounting for over 50% of the total questions.')}
                                                    </EditableText>
                                                </div>
                                            </div>
                                            <div className="bg-rose-50 p-6 md:p-8 rounded-2xl border border-rose-100 flex items-start gap-4">
                                                <XCircle className="text-rose-600 shrink-0 mt-1" size={24} />
                                                <div>
                                                    <EditableText fieldKey="incorrect_val" as="div" className="text-2xl md:text-3xl font-black text-rose-700">
                                                        {getField('incorrect_val', '-0.25 Points')}
                                                    </EditableText>
                                                    <EditableText fieldKey="incorrect_label" as="div" className="font-bold text-slate-500 mb-2">
                                                        {getField('incorrect_label', 'Per Incorrect Answer')}
                                                    </EditableText>
                                                    <EditableText fieldKey="incorrect_desc" multiline as="p" className="text-xs md:text-sm opacity-80">
                                                        {getField('incorrect_desc', 'On the CEnT-S, a random guess with no elimination has a statistically expected return of -0.2 points per attempt (1 in 5 chance correct). This is a net negative — meaning random guessing actively lowers your score. Apply the two-elimination rule before committing to any answer.')}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center font-bold text-slate-600 uppercase tracking-widest text-sm">
                                            <EditableText fieldKey="unattempted_label" as="div">
                                                {getField('unattempted_label', 'Unattempted Questions Score 0 — Strategic Skipping Is a Legitimate Tactic on the CEnT-S')}
                                            </EditableText>
                                        </div>
                                    </section>

                                    {/* Question Distribution */}
                                    <section id="distribution" className="scroll-mt-[120px]">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="bg-blue-100 p-3 rounded-2xl">
                                                <Grid className="text-blue-600" size={32} />
                                            </div>
                                            <EditableText fieldKey="dist_title" as="h2" className="text-3xl font-black text-slate-900">
                                                {getField('dist_title', 'Marks Distribution by Section')}
                                            </EditableText>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { key: 'math', subject: 'Mathematics', qs: 15, time: 40, weight: 'Heavyweight', color: 'bg-rose-500' },
                                                { key: 'reasoning', subject: 'Reasoning on Texts & Data', qs: 15, time: 30, weight: 'High Logic', color: 'bg-amber-500' },
                                                { key: 'bio', subject: 'Biology', qs: 10, time: 15, weight: 'Strategic', color: 'bg-emerald-500' },
                                                { key: 'chem', subject: 'Chemistry', qs: 10, time: 15, weight: 'Tactical', color: 'bg-indigo-500' },
                                                { key: 'phys', subject: 'Physics', qs: 5, time: 10, weight: 'Niche', color: 'bg-slate-500' }
                                            ].map((row, i) => (
                                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-6">
                                                    <div className="flex items-center gap-4 min-w-[200px]">
                                                        <div className={`w-3 h-12 rounded-full ${row.color}`} />
                                                        <div>
                                                            <EditableText fieldKey={`dist_subject_${row.key}`} as="div" className="text-lg font-black text-slate-900">
                                                                {getField(`dist_subject_${row.key}`, row.subject)}
                                                            </EditableText>
                                                            <EditableText fieldKey={`dist_weight_${row.key}`} as="div" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                {getField(`dist_weight_${row.key}`, row.weight)}
                                                            </EditableText>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-12 text-right">
                                                        <div>
                                                            <EditableText fieldKey={`dist_qs_${row.key}`} as="div" className="text-2xl font-black text-slate-900">
                                                                {getField(`dist_qs_${row.key}`, row.qs.toString())}
                                                            </EditableText>
                                                            <div className="text-[10px] font-black text-slate-400 uppercase">Questions</div>
                                                        </div>
                                                        <div>
                                                            <EditableText fieldKey={`dist_time_${row.key}`} as="div" className="text-2xl font-black text-indigo-600">
                                                                {getField(`dist_time_${row.key}`, `${row.time}m`)}
                                                            </EditableText>
                                                            <div className="text-[10px] font-black text-slate-400 uppercase">Time Allotted</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Strategy */}
                                    <section id="strategy" className="scroll-mt-[120px]">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="bg-amber-100 p-3 rounded-2xl">
                                                <Zap className="text-amber-600" size={32} />
                                            </div>
                                            <EditableText fieldKey="strat_title" as="h2" className="text-3xl font-black text-slate-900">
                                                {getField('strat_title', 'Structural Success Strategy')}
                                            </EditableText>
                                        </div>
                                        <div className="bg-slate-900 text-white rounded-[3rem] p-10 md:p-14 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                                <Target size={200} />
                                            </div>
                                            <div className="relative z-10 max-w-2xl">
                                                <EditableText fieldKey="strat_headline" as="h3" className="text-2xl md:text-4xl font-black mb-8 leading-tight">
                                                    {getField('strat_headline', 'Master the "Time per Section" Constraint')}
                                                </EditableText>
                                                <EditableText fieldKey="strat_desc" multiline as="p" className="text-slate-300 text-lg md:text-xl font-medium mb-12 leading-relaxed">
                                                    {getField('strat_desc', 'The CENT-S is modular. Once the time for a section expires, you **cannot** go back to it. Mastering the transition between sections is as important as knowing the scientific content.')}
                                                </EditableText>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 font-bold text-emerald-400">
                                                        <CheckCircle2 size={24} />
                                                        <EditableText fieldKey="strat_tip_1" as="span">
                                                            {getField('strat_tip_1', 'Do not linger on logic puzzles; skip and return within the same section time.')}
                                                        </EditableText>
                                                    </div>
                                                    <div className="flex items-center gap-4 font-bold text-amber-400">
                                                        <CheckCircle2 size={24} />
                                                        <EditableText fieldKey="strat_tip_2" as="span">
                                                            {getField('strat_tip_2', 'Aim to finish Biology/Chemistry fast to bank time for calculations.')}
                                                        </EditableText>
                                                    </div>
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

                                    <CTASection fieldKeyPrefix="pattern_cta" />
                                </div>

                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}

