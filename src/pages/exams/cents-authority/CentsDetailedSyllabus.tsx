import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    BrainCircuit,
    Calculator,
    Zap,
    Target,
    Beaker,
    Atom,
    CheckCircle2,
    Sparkles,
    Search,
    HelpCircle,
    ChevronRight,
    Scale
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

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'math-logic', label: 'Math & Logic' },
    { id: 'reading', label: 'Reading' },
    { id: 'sciences', label: 'Sciences' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What subjects are covered in the CENT-S?', answer: 'The CENT-S typically includes four major modules: Mathematics, Logical Reasoning, Reading Comprehension, and Sciences (Biology, Chemistry, and Physics).' },
    { question: 'Is the Math section harder than the IMAT?', answer: 'The CENT-S Math section is often more extensive, covering a broader range of algebraic and geometric principles, as it is used for Engineering and Science faculties.' },
    { question: 'How many questions are in the Biology section?', answer: 'The number varies by module, but typically you can expect 10-15 high-level questions covering cytology, genetics, and anatomy.' },
    { question: 'What is the "Reading Comprehension" section testing?', answer: 'It tests your ability to extract meaning from complex scientific and technical texts, evaluating your scientific literacy and vocabulary.' },
    { question: 'Are calculators allowed in the Math section?', answer: 'No. Like all major Italian entrance exams, the CENT-S is strictly a no-calculator test.' },
    { question: 'Do I need to study all three sciences (Bio, Chem, Phys)?', answer: 'Yes, the "Sciences" section is usually a blend of all three, requiring a solid foundation in fundamental principles of each.' },
    { question: 'Is the syllabus standardized across all universities?', answer: 'Yes, the CISIA consortium ensures that the CENT-S syllabus remains consistent, regardless of which university you are applying to.' },
    { question: 'What is the best study resource for CENT-S Math?', answer: 'We recommend using A-Level Math textbooks (specifically Pure Math) combined with Italian "AlphaTest" or specialized CENT-S simulators.' },
    { question: 'How detailed is the Organic Chemistry requirement?', answer: 'You should be comfortable with functional groups, nomenclature, and the basics of reaction mechanisms (substitution, addition).' },
    { question: 'Does the exam include General Knowledge?', answer: 'The CENT-S focuses more on scientific literacy and logic than on "Trivia" style general knowledge, making it more technical than the IMAT Section 1.' }
];

export default function CentsDetailedSyllabus() {
    const { getField } = usePageContent('cent-s-syllabus-2026');
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
        <CmsPageWrapper slug="cent-s-syllabus-2026">
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
                    title="CENT-S Detailed Syllabus 2026: Section-by-Section Breakdown"
                    description="Complete CENT-S 2026 syllabus guide. Detailed breakdown of Math, Logical Reasoning, Sciences, and Reading Comprehension requirements for Italian STEM degrees."
                    keywords="cent-s syllabus 2026, cent-s math topics, cent-s science requirements, cisia syllabus, study italy engineering syllabus"
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
                                        {getField('hero_headline', 'CENT-S 2026 Detailed Syllabus')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The CENT-S is a technical-scientific assessment. Mastery of its specific modules is required for admission to Engineering, Physics, and Data Science programs in Italy.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'q', label: 'Questions', value: '55 MCQ', icon: Target },
                                            { key: 'time', label: 'Timing', value: '110 Min', icon: Zap },
                                            { key: 'lang', label: 'Language', value: 'English', icon: BookOpen },
                                            { key: 'status', label: 'Status', value: 'Updated', icon: CheckCircle2 }
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

                                {/* Math & Logic */}
                                <section id="math-logic" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Calculator className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Mathematics & Logical Reasoning</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <EditableText fieldKey="math_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('math_desc', "This is the most heavily weighted section. It tests advanced algebraic manipulation, trigonometric identities, and geometric principles. The logic portion focuses on analytical and numerical reasoning.")}
                                            </EditableText>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'algebra', label: 'Algebra and Analytic Geometry' },
                                                    { key: 'trig', label: 'Trigonometry and Functions' },
                                                    { key: 'stats', label: 'Probability and Statistics' },
                                                    { key: 'analyt', label: 'Analytical Reasoning puzzles' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-indigo-500" />
                                                        <EditableText fieldKey={`math_item_${item.key}`} as="span">
                                                            {getField(`math_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Card className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                                <BrainCircuit size={150} />
                                            </div>
                                            <h4 className="text-indigo-400 font-black mb-4">The 50/50 Rule</h4>
                                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                                Mathematics and Reasoning together account for 30 out of 55 questions. If you don't hit 80% accuracy in these "logic" sections, it's difficult to secure a high ranking.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Reading Comprehension */}
                                <section id="reading" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Search className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Scientific Reading Comprehension</h2>
                                    </div>
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-900">Core Evaluation Skills:</h4>
                                                {[
                                                    { key: 'vocab', label: 'Technical and scientific vocabulary' },
                                                    { key: 'infer', label: 'Inferring logical conclusions from text' },
                                                    { key: 'summary', label: 'Synthesizing complex information' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        <EditableText fieldKey={`read_item_${item.key}`} as="span">
                                                            {getField(`read_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                                <h4 className="text-emerald-900 font-black mb-2">Section Strategy</h4>
                                                <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                                                    Do not spend more than 15 minutes on this section. The goal is to identify keywords and main arguments quickly to save time for Math.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Sciences */}
                                <section id="sciences" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Beaker className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Physical & Life Sciences</h2>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { title: 'Biology', icon: Beaker, topics: ['Cell Biology', 'Genetics', 'Metabolism'], color: 'text-rose-600' },
                                            { title: 'Chemistry', icon: Atom, topics: ['Molarity', 'Acids/Bases', 'Organic'], color: 'text-emerald-600' },
                                            { title: 'Physics', icon: Scale, topics: ['Mechanics', 'Optics', 'Circuits'], color: 'text-indigo-600' }
                                        ].map((science, i) => (
                                            <Card key={i} className="p-6 border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-slate-900 transition-colors">
                                                <science.icon className={`${science.color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
                                                <h4 className="font-black text-slate-900 mb-4">{science.title}</h4>
                                                <ul className="space-y-2">
                                                    {science.topics.map((topic, j) => (
                                                        <li key={j} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{topic}</li>
                                                    ))}
                                                </ul>
                                            </Card>
                                        ))}
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

                                <CTASection fieldKeyPrefix="syllabus_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


