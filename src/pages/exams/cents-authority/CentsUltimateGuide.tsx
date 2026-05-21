import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    Target,
    Trophy,
    Clock,
    FileText,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    Download,
    Users,
    ChevronRight,
    Sparkles,
    HelpCircle,
    BarChart3,
    ShieldCheck,
    Zap,
    Star,
    Quote,
    Search
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import EditableText from '@/components/cms/EditableText';
import EditableFile from '@/components/cms/EditableFile';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import { CENTS_CLUSTER } from '@/lib/seo-links';
import { getCourseSchema, getBreadcrumbSchema } from '@/utils/seo-schemas';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'audience', label: 'Who Should Take It' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'pattern', label: 'Exam Pattern' },
    { id: 'cutoff', label: 'Cutoff Trends' },
    { id: 'strategy', label: 'Preparation Strategy' },
    { id: 'mock-test', label: 'Mock Tests' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    {
        question: "What exactly is the CENT-S Exam?",
        answer: "The CENT-S (CISIA English Test – Science) is the standardized entrance exam for English-taught Bachelor's degrees in scientific, technological, and economic fields in Italy. It has replaced the English TOLC-I, TOLC-E, and TOLC-F for many universities."
    },
    {
        question: "Is CENT-S mandatory for international students?",
        answer: "Yes, it is the primary selection tool for English-taught STEM and Economic programs. For many top-tier universities, your CENT-S score (often normalized) determines your ranking for admission."
    },
    {
        question: "How does the difficulty of CENT-S compare to IMAT?",
        answer: "While IMAT is for Medicine and includes General Knowledge, the CENT-S is strictly STEM-focused. It prioritizes Mathematics and Reasoning on Texts and Data, which together account for over 50% of the exam weight."
    },
    {
        question: "What is a competitive score for CENT-S?",
        answer: "The exam consists of 55 questions. A raw score of 42+ out of 55 is generally considered highly competitive for top programs, though the final score is often normalized based on session difficulty."
    },
    {
        question: "When are the CENT-S exam sessions?",
        answer: "CENT-S is held throughout the year in four macro-periods (Nov-Jan, Feb-Mar, Apr-Jun, and Jul-Sep). You can typically take the test once per month, and universities usually consider your best score."
    },
    {
        question: "Which subjects should I prioritize?",
        answer: "Mathematics and Reasoning on Texts and Data are critical, as they have the highest number of questions (15 each). Biology, Chemistry, and Physics follow, requiring strong conceptual understanding."
    },
    {
        question: "Does ItaloStudy offer specific mocks for the CENT-S?",
        answer: "Yes! Our mocks are designed to replicate the official CISIA interface and question style, focusing on the 5-section structure and the 110-minute time limit."
    },
    {
        question: "Can I take the exam remotely?",
        answer: "Yes, the CENT-S can be taken either at a university test center (@UNI) or remotely from home (@HOME), depending on the university's regulations."
    },
    {
        question: "What is the negative marking scheme?",
        answer: "Every correct answer adds +1 point, every wrong answer deducts -0.25 points, and unattempted questions give 0 points."
    },
    {
        question: "What is normalization?",
        answer: "Since CENT-S is taken across multiple sessions, CISIA uses a normalization coefficient to ensure fairness, adjusting scores based on the average performance in a specific test session."
    }
];

export default function CentsUltimateGuide() {
    const navigate = useNavigate();
    const { getField } = usePageContent('cent-s-exam-ultimate-guide');
    const leadPdfUrl = getField('lead_pdf_url', '');
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
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
        <CmsPageWrapper slug="cent-s-exam-ultimate-guide">
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
                    title="CEnT-S Exam 2026: The Ultimate Preparation Guide & Free Resources"
                    description="The most complete CEnT-S 2026 preparation guide. Download free CEnT-S exam preparation book PDF, past papers, and syllabus. Access free full-length mock tests."
                    keywords="cent-s exam preparation book pdf free download, cent-s exam preparation book pdf, cent-s exam questions pdf, cent s mock test, cents mock test, cent-s syllabus, cents prep, cent-s practice test, cent-s past papers, italostudy"
                    faqs={faqs}
                    schemas={[
                        getCourseSchema('cents'),
                        getBreadcrumbSchema([
                            { name: 'Home', item: '/' },
                            { name: 'Guides', item: '/cent-s-exam-preparation-book-pdf' },
                            { name: 'CEnT-S 2026', item: '/cent-s-exam-ultimate-guide' }
                        ])
                    ]}
                />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen ">
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
                                <section id="overview" className="scroll-mt-48">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                        Official 2026 Academic Roadmap
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.2] md:leading-[1.1] mb-8 mt-4 md:mt-0">
                                        {getField('hero_headline', 'The Ultimate CENT-S 2026 Guide')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', 'Welcome to the definitive repository for CENT-S preparation. This represents our most comprehensive analysis yet, designed to take you from initial curiosity to 600+ score mastery.')}
                                    </EditableText>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'questions', label: 'Questions', value: '55 MCQs', icon: FileText },
                                            { key: 'time', label: 'Duration', value: '110 Mins', icon: Clock },
                                            { key: 'score', label: 'Max Raw Score', value: '55.0', icon: Target },
                                            { key: 'sections', label: 'Exam Sections', value: '5 Subjects', icon: Trophy }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform" size={24} />
                                                <EditableText fieldKey={`stat_val_${item.key}`} as="div" className="text-xl md:text-2xl font-black text-slate-900">
                                                    {getField(`stat_val_${item.key}`, item.value)}
                                                </EditableText>
                                                <EditableText fieldKey={`stat_label_${item.key}`} as="div" className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    {getField(`stat_label_${item.key}`, item.label)}
                                                </EditableText>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
                                        <EditableText fieldKey="overview_p1" multiline as="p" className="mb-4">
                                            {getField('overview_p1', "The CENT-S (CISIA English Test – Science) has become the definitive standardized entrance test for English-taught bachelor's degrees in engineering, science, and economics in Italy. Consolidating the previous English TOLC formats, this 55-question assessment evaluates technical aptitude and scientific foundations.")}
                                        </EditableText>
                                        <EditableText fieldKey="overview_p2" multiline as="p" className="mb-4">
                                            {getField('overview_p2', "This guide breaks down every aspect of the CENT-S, from its five core sections to the complex normalization system used by CISIA. Whether you're aiming for STEM programs at Bologna, Sapienza, or Padova, understanding the balance between high-weightage Logic/Math and specialized Science modules is key to securing admission.")}
                                        </EditableText>
                                        <p className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 font-medium text-base">
                                            <span className="font-bold">💡 Note:</span> If you are applying for Medicine and Surgery, you must take the <Link to="/imat-exam-ultimate-guide" className="text-indigo-600 font-bold hover:underline">IMAT Exam</Link>. Unsure which one is for you? Read our full <Link to="/imat-vs-cents-2026" className="text-indigo-600 font-bold hover:underline">IMAT vs CEnT-S Comparison</Link>.
                                        </p>
                                        <p className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 font-medium text-base mt-4">
                                            <span className="font-bold">📚 Free Study Materials:</span> Looking for the CEnT-S preparation book PDF? Access our <a href="/cent-s-exam-preparation-book-pdf" className="text-emerald-700 font-black hover:underline">Free CEnT-S Resources & PDF Hub</a> for official books, past papers, and study guides.
                                        </p>
                                    </div>
                                </section>

                                {/* Audience Section */}
                                <section id="audience" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Users size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <EditableText fieldKey="audience_title" as="h2" className="text-3xl md:text-4xl font-black mb-8 flex items-center gap-4">
                                                <Users className="text-indigo-400" />
                                                {getField('audience_title', 'Who Should Take the CENT-S?')}
                                            </EditableText>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" />
                                                        <EditableText fieldKey="audience_bullet_1" as="p" className="font-medium opacity-90 leading-relaxed">
                                                            {getField('audience_bullet_1', 'International students applying to English-taught degrees in Engineering, Information Technology, or Economics.')}
                                                        </EditableText>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" />
                                                        <EditableText fieldKey="audience_bullet_2" as="p" className="font-medium opacity-90 leading-relaxed">
                                                            {getField('audience_bullet_2', 'Aspiring scientists targeting specialized Bachelor’s programs in Biotechnology, Bioinformatics, or Chemistry.')}
                                                        </EditableText>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" />
                                                        <EditableText fieldKey="audience_bullet_3" as="p" className="font-medium opacity-90 leading-relaxed">
                                                            {getField('audience_bullet_3', 'EU and Non-EU candidates looking for a meritocratic, standardized entry into Italian scientific academia.')}
                                                        </EditableText>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" />
                                                        <EditableText fieldKey="audience_bullet_4" as="p" className="font-medium opacity-90 leading-relaxed">
                                                            {getField('audience_bullet_4', 'High school graduates with a strong STEM background who want to study their degree entirely in English.')}
                                                        </EditableText>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Syllabus Summary */}
                                <section id="syllabus" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <BookOpen className="text-amber-600" size={32} />
                                        </div>
                                        <div>
                                            <EditableText fieldKey="syllabus_summary_title" as="h2" className="text-4xl font-black text-slate-900 underline decoration-amber-400 underline-offset-8">
                                                {getField('syllabus_summary_title', 'Syllabus Summary 2026')}
                                            </EditableText>
                                        </div>
                                    </div>

                                    <div className="prose prose-lg text-slate-600 mb-8 max-w-none">
                                        <EditableText fieldKey="syllabus_summary_desc" multiline as="p">
                                            {getField('syllabus_summary_desc', "The CENT-S syllabus is divided into five specific sections, with Mathematics and Reasoning on Texts and Data being the most significant components, together representing 54% of the exam weight.")}
                                        </EditableText>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { key: 'logic_math', title: 'Logic & Mathematics', weight: '54%', focus: 'Reasoning on Data, Calculus, Stats', color: 'bg-green-50 text-green-700 border-green-100' },
                                            { key: 'bio_chem', title: 'Bio & Chemistry', weight: '36%', focus: 'General Bio, Organic, Inorganic', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                                            { key: 'physics', title: 'Physics', weight: '10%', focus: 'Mechanics, Optics, Thermodynamics', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-8 rounded-[2rem] border-2 ${item.color} flex flex-col justify-between h-full`}>
                                                <div>
                                                    <EditableText fieldKey={`syllabus_card_${item.key}_weight`} as="div" className="text-4xl font-black mb-2">
                                                        {getField(`syllabus_card_${item.key}_weight`, item.weight)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`syllabus_card_${item.key}_title`} as="h4" className="text-xl font-bold mb-4">
                                                        {getField(`syllabus_card_${item.key}_title`, item.title)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`syllabus_card_${item.key}_focus`} as="p" className="text-sm opacity-80 font-medium leading-relaxed">
                                                        {getField(`syllabus_card_${item.key}_focus`, item.focus)}
                                                    </EditableText>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8">
                                        <Button variant="link" onClick={() => navigate('/cent-s-syllabus-2026')} className="text-indigo-600 font-black p-0 h-auto group text-lg">
                                            <EditableText fieldKey="btn_syllabus" as="span">
                                                {getField('btn_syllabus', 'See Detailed Topic-Wise Breakdown & Weightage Table')}
                                            </EditableText>
                                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                    </div>
                                </section>

                                {/* Exam Pattern */}
                                <section id="pattern" className="scroll-mt-40 p-8 md:p-12 bg-white rounded-[2rem] md:rounded-[3rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                        <Target className="text-rose-500" />
                                        Decoding the Exam Pattern
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <EditableText fieldKey="exam_pattern_desc" multiline as="p" className="text-lg text-slate-600 leading-relaxed mb-8">
                                                {getField('exam_pattern_desc', 'The CENT-S consists of 55 multiple-choice questions to be completed in 110 minutes. This provides an average of 2 minutes per question—a pace that allows for careful analysis, especially in the data-heavy Reasoning section.')}
                                            </EditableText>
                                            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                                                <h4 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
                                                    <AlertCircle size={20} />
                                                    Scoring Dynamics
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white p-4 rounded-xl text-center">
                                                        <EditableText fieldKey="scoring_correct" as="div" className="text-2xl font-black text-green-600">
                                                            {getField('scoring_correct', '+1')}
                                                        </EditableText>
                                                        <div className="text-xs font-bold text-slate-400 uppercase">Correct</div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl text-center">
                                                        <EditableText fieldKey="scoring_wrong" as="div" className="text-2xl font-black text-rose-600">
                                                            {getField('scoring_wrong', '-0.25')}
                                                        </EditableText>
                                                        <div className="text-xs font-bold text-slate-400 uppercase">Wrong</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium italic mt-4">
                                                For a comparison of this marking scheme against the medical entrance exam, see our <Link to="/imat-exam-ultimate-guide" className="text-indigo-500 hover:underline">IMAT Marking Guide</Link>.
                                            </p>
                                        </div>

                                        <Card className="p-8 border-slate-900 border-2 bg-slate-50 relative">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                                                    <span className="font-black text-slate-900">Max Raw Score</span>
                                                    <EditableText fieldKey="stat_total_marks" as="span" className="text-2xl font-black text-indigo-600">
                                                        {getField('stat_total_marks', '55')}
                                                    </EditableText>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                                                    <span className="font-black text-slate-900">Total Duration</span>
                                                    <EditableText fieldKey="stat_total_duration" as="span" className="font-bold text-slate-600">
                                                        {getField('stat_total_duration', '110 Minutes')}
                                                    </EditableText>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                                                    <span className="font-black text-slate-900">Competitive Raw Score</span>
                                                    <EditableText fieldKey="stat_competitive_score" as="span" className="font-bold text-slate-600">
                                                        {getField('stat_competitive_score', '42+ out of 55')}
                                                    </EditableText>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => navigate('/cent-s-exam-pattern-2026')}
                                                className="w-full mt-8 bg-slate-900 text-white hover:bg-slate-800"
                                            >
                                                <EditableText fieldKey="btn_marking" as="span">
                                                    {getField('btn_marking', 'Explore Full Marking Analysis')}
                                                </EditableText>
                                            </Button>
                                        </Card>
                                    </div>
                                </section>

                                {/* Lead Capture PDF */}
                                <div className="bg-indigo-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-indigo-200">
                                    <div className="flex-1">
                                        <EditableText fieldKey="lead_asset_badge" as="div" className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                                            {getField('lead_asset_badge', 'Free Asset')}
                                        </EditableText>
                                        <EditableText fieldKey="lead_asset_title" as="h3" className="text-3xl font-black mb-4">
                                            {getField('lead_asset_title', 'CENT-S 2026 Quick Revision Notes')}
                                        </EditableText>
                                        <EditableText fieldKey="lead_asset_desc" multiline as="p" className="text-indigo-100 mb-6 text-lg">
                                            {getField('lead_asset_desc', 'Includes a summary of the 5 key sections, normalization formulas, and our exclusive STEM preparation roadmap.')}
                                        </EditableText>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex-1 backdrop-blur-sm placeholder:text-indigo-200 outline-none focus:ring-2 focus:ring-white/50"
                                            />
                                            <EditableFile fieldKey="lead_pdf_url" currentUrl={leadPdfUrl}>
                                                <Button
                                                    onClick={() => leadPdfUrl && window.open(leadPdfUrl, '_blank')}
                                                    className="bg-white text-indigo-600 hover:bg-indigo-50 h-auto py-4 px-8 rounded-2xl font-black shadow-lg"
                                                >
                                                    <Download className="mr-2" size={20} />
                                                    <EditableText fieldKey="btn_download_pdf" as="span">
                                                        {getField('btn_download_pdf', 'Get PDF Now')}
                                                    </EditableText>
                                                </Button>
                                            </EditableFile>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 h-64 bg-slate-100 rounded-2xl shadow-2xl rotate-6 transform translate-x-4 border-l-8 border-indigo-400 p-6 flex flex-col justify-between">
                                        <FileText className="text-indigo-600" size={48} />
                                        <div>
                                            <div className="h-2 w-full bg-slate-200 rounded-full mb-2"></div>
                                            <div className="h-2 w-2/3 bg-slate-200 rounded-full mb-2"></div>
                                            <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cutoff Trends */}
                                <section id="cutoff" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-violet-100 p-3 rounded-2xl">
                                            <BarChart3 className="text-violet-600" size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black text-slate-900 underline decoration-violet-400 underline-offset-8">Cutoff Trends Analysis</h2>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm mb-8">
                                        <EditableText fieldKey="cutoff_intro_desc" multiline as="p" className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                                            {getField('cutoff_intro_desc', 'With the transition to CENT-S, the historical TOLC raw scores are now being normalized. Competitive programs typically require a raw score in the top 10%, which translates to roughly 40-42 net points out of 55.')}
                                        </EditableText>

                                        <div className="space-y-8">
                                            {[
                                                { label: 'Moderate Rank', score: 35, color: 'bg-slate-200' },
                                                { label: 'High Rank', score: 40, color: 'bg-indigo-400' },
                                                { label: 'Elite Rank', score: 45, color: 'bg-indigo-600' }
                                            ].map((item, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-sm font-black text-slate-500">
                                                        <EditableText fieldKey={`cutoff_rank_${i}`} as="span">
                                                            {getField(`cutoff_rank_${i}`, item.label)}
                                                        </EditableText>
                                                        <EditableText fieldKey={`cutoff_score_${i}`} as="span">
                                                            {getField(`cutoff_score_${i}`, `Raw Score: ${item.score}/55`)}
                                                        </EditableText>
                                                    </div>
                                                    <div className="h-8 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                                        <div
                                                            className={`h-full ${item.color} flex items-center px-4 text-white font-black text-xs transition-all duration-1000`}
                                                            style={{ width: `${(item.score / 55) * 100}%` }}
                                                        >
                                                            {Math.round((item.score / 55) * 100)}% Accuracy
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <Card className="flex-1 p-8 border-slate-100 shadow-sm bg-gradient-to-br from-white to-slate-50">
                                            <TrendingUp className="text-indigo-600 mb-4" size={32} />
                                            <EditableText fieldKey="cutoff_rising_title" as="h4" className="text-xl font-black mb-2">
                                                {getField('cutoff_rising_title', 'Why are cutoffs rising?')}
                                            </EditableText>
                                            <EditableText fieldKey="cutoff_rising_desc" multiline as="p" className="text-sm text-slate-500 leading-relaxed">
                                                {getField('cutoff_rising_desc', 'Increased availability of high-quality digital prep tools, higher number of repeaters, and localized coaching are squeezing the competition at the top.')}
                                            </EditableText>
                                        </Card>
                                        <Card className="flex-1 p-8 border-slate-100 shadow-sm bg-gradient-to-br from-white to-slate-50">
                                            <ShieldCheck className="text-indigo-600 mb-4" size={32} />
                                            <EditableText fieldKey="safe_target_title" as="h4" className="text-xl font-black mb-2">
                                                {getField('safe_target_title', "What is a 'Safe' target?")}
                                            </EditableText>
                                            <EditableText fieldKey="safe_target_desc" multiline as="p" className="text-sm text-slate-500 leading-relaxed">
                                                {getField('safe_target_desc', 'Aim for a consistent 42+ net score in mocks. This gives you a safe buffer for normalization variations and admission into the most competitive public programs.')}
                                            </EditableText>
                                        </Card>
                                    </div>

                                    <Link to="/cent-s-cutoff-2026" className="inline-flex items-center mt-8 text-indigo-600 font-black hover:underline gap-2">
                                        <EditableText fieldKey="link_cutoff_graphs" as="span">
                                            {getField('link_cutoff_graphs', 'Check Expected Normalized Score Requirements')}
                                        </EditableText>
                                        <ChevronRight size={18} />
                                    </Link>
                                </section>

                                {/* Preparation Strategy */}
                                <section id="strategy" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Zap className="text-emerald-600" size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black text-slate-900">Proven Preparation Strategy</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="prose prose-lg text-slate-600 max-w-none">
                                            <EditableText fieldKey="strategy_intro_desc" multiline as="p">
                                                {getField('strategy_intro_desc', "Winning the CENT-S 2026 is 30% knowledge and 70% strategy. Most students fail because they study hard without studying right. Our 'Authority Framework' breaks your preparation into three non-negotiable phases.")}
                                            </EditableText>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            {[
                                                { key: 'phase1', icon: Star, title: "Phase 1: Math & Reasoning Mastery", desc: "Since these two sections make up the majority of the score, start early with technical Mathematics and data-driven reasoning. Focus on A-Level and SAT-level problem sets." },
                                                { key: 'phase2', icon: BarChart3, title: "Phase 2: Scientific Core", desc: "Broaden your scope to Biology, Chemistry, and Physics. Use the CISIA syllabus to target specific topics like organic mechanisms and thermodynamics." },
                                                { key: 'phase3', icon: Trophy, title: "Phase 3: Simulation & Normalization", desc: "Take timed mocks to build the 110-minute stamina. Focus on the raw-to-normalized conversion and optimize your 'smart skipping' strategy to minimize negative marks." }
                                            ].map((step, i) => (
                                                <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 items-start">
                                                    <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                                        <step.icon className="text-indigo-600" size={32} />
                                                    </div>
                                                    <div>
                                                        <EditableText fieldKey={`strategy_${step.key}_title`} as="h3" className="text-2xl font-black text-slate-900 mb-3">
                                                            {getField(`strategy_${step.key}_title`, step.title)}
                                                        </EditableText>
                                                        <EditableText fieldKey={`strategy_${step.key}_desc`} multiline as="p" className="text-slate-600 leading-relaxed font-medium">
                                                            {getField(`strategy_${step.key}_desc`, step.desc)}
                                                        </EditableText>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-12 bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] md:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                                        <h4 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-2">
                                            <Quote className="text-indigo-600" />
                                            Student Success Spotlight
                                        </h4>
                                        <EditableText fieldKey="success_spotlight_quote" multiline as="p" className="text-lg md:text-xl text-slate-600 italic leading-relaxed mb-6 font-medium">
                                            {getField('success_spotlight_quote', '"The biggest mistake I almost made was preparing for the CENT-S using old Medicine resources. Once I focused on advanced Math and technical data reasoning, my raw score improved from 28 to 44, which was enough for Bologna."')}
                                        </EditableText>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full"></div>
                                            <div>
                                                <EditableText fieldKey="success_spotlight_name" as="div" className="font-black text-slate-900">
                                                    {getField('success_spotlight_name', 'Marco Rossi')}
                                                </EditableText>
                                                <EditableText fieldKey="success_spotlight_title" as="div" className="text-sm font-bold text-slate-400">
                                                    {getField('success_spotlight_title', "International STEM Student ('25 Intake)")}
                                                </EditableText>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Mock Test Section */}
                                <section id="mock-test" className="scroll-mt-[120px]">
                                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 p-12 opacity-10">
                                            <Target size={300} />
                                        </div>
                                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                                            <EditableText fieldKey="mock_test_title" as="h2" className="text-3xl md:text-5xl font-black mb-6">
                                                {getField('mock_test_title', 'Master the Computer-Based Test')}
                                            </EditableText>
                                            <EditableText fieldKey="mock_test_desc" multiline as="p" className="text-lg md:text-xl font-medium mb-10 leading-relaxed">
                                                {getField('mock_test_desc', "Don't let the real exam be your first time in a timed digital environment. Our Free Mock Series uses the exact same interface as the official CISIA portal.")}
                                            </EditableText>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                                {[
                                                    'Real-Time Leaderboard',
                                                    'Section-Wise Analytics',
                                                    'AI-Powered Solution Guides',
                                                    'Rank Percentile Estimation'
                                                ].map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl border border-white/20">
                                                        <CheckCircle2 size={16} className="text-indigo-300" />
                                                        <span className="text-sm font-bold">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                onClick={() => navigate('/cent-s-mock')}
                                                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black h-auto py-5 px-10 text-xl rounded-2xl shadow-xl hover:-translate-y-1 transition-all"
                                            >
                                                <EditableText fieldKey="btn_mock_series" as="span">
                                                    {getField('btn_mock_series', 'Try CENT-S Mock Interface')}
                                                </EditableText>
                                            </Button>
                                        </div>
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="bg-slate-200 p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="text-lg md:text-xl font-black text-slate-900 mb-4 flex gap-4">
                                                    <span className="text-indigo-600">Q{i + 1}:</span>
                                                    <EditableText fieldKey={`faq_q_${i}`} as="div">
                                                        {getField(`faq_q_${i}`, faq.question)}
                                                    </EditableText>
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-6 md:pl-12 border-l-2 border-slate-50 text-sm md:text-base">
                                                    <EditableText fieldKey={`faq_a_${i}`} multiline as="div">
                                                        {getField(`faq_a_${i}`, faq.answer)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Internal Links Cluster */}
                                <section className="pt-20 border-t border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">
                                        Continue Strengthening Your Authority 📚
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {CENTS_CLUSTER.map((link, i) => (
                                            <Link
                                                key={i}
                                                to={link.href}
                                                className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between"
                                            >
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                                                    {link.title}
                                                </span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="pillar_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


