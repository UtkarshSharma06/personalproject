import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    BrainCircuit,
    Beaker,
    Atom,
    Calculator,
    CheckCircle2,
    Zap,
    Target,
    HelpCircle,
    ChevronRight,
    Search,
    Star,
    Globe,
    TrendingUp,
    Sparkles,
    Briefcase,
    Stethoscope,
    Microscope,
    PenTool
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
    { id: 'overview', label: 'TOLC Overview' },
    { id: 'tolc-med', label: 'TOLC-MED (Medicine)' },
    { id: 'tolc-i', label: 'TOLC-I (Engineering)' },
    { id: 'tolc-e', label: 'TOLC-E (Economics)' },
    { id: 'tolc-f', label: 'TOLC-F (Pharmacy)' },
    { id: 'tolc-su', label: 'TOLC-SU (Humanities)' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the most difficult section across all TOLC exams?', answer: 'The difficulty varies by exam type, but students consistently report that the Logic and Reading Comprehension sections are the most challenging due to strict time limits. For scientific tests like TOLC-MED and TOLC-F, Biology and Chemistry require extensive memorization and deep conceptual understanding.' },
    { question: 'Does the TOLC syllabus change every year?', answer: 'The fundamental core syllabus defined by CISIA remains relatively stable year over year. However, the exact weightings, question distributions, and occasionally specific sub-topics are updated in the annual ministerial decrees. It is crucial to always refer to the latest CISIA syllabus guidelines for your specific test year.' },
    { question: 'Is the TOLC-I syllabus the same as the CEnT-S syllabus?', answer: 'They share significant overlap, particularly in basic Mathematics and Physics, as both are designed for engineering and science admissions. However, CEnT-S has its own unique structural elements, whereas TOLC-I places a heavier emphasis on specialized logical reasoning paradigms developed by CISIA.' },
    { question: 'Do I need to study Italian History for TOLC-SU?', answer: 'Yes, the TOLC-SU (Humanities) includes sections on Knowledge and Skills acquired in high school, which often encompasses Italian history, literature, philosophy, and civic education. General knowledge of European and world history is also highly beneficial.' },
    { question: 'Are calculators allowed for the math and physics sections in TOLC-I or TOLC-F?', answer: 'No. The use of calculators, smartwatches, or any electronic calculation devices is strictly prohibited during all TOLC exams. You must rely entirely on mental math, estimation techniques, and scratch paper provided by the test center (or your own if taking TOLC@HOME under strict proctoring).' },
    { question: 'How detailed is the Biology section in TOLC-MED compared to IMAT?', answer: 'The Biology syllabus for TOLC-MED is extremely similar to the IMAT syllabus, as both are regulated by the Italian Ministry of University and Research (MUR). You must master cell biology, genetics, human anatomy, physiology, and bioenergetics at a very detailed, upper-secondary (A-Level/IB) standard.' },
    { question: 'What kind of math is expected in the TOLC-E (Economics)?', answer: 'TOLC-E Mathematics covers algebra, linear equations, basic geometry, polynomials, and an introduction to statistics and probability. It does not typically require advanced calculus, but you must be exceptionally fast and accurate in interpreting graphs and numerical data.' },
    { question: 'How is the English section evaluated in the TOLC?', answer: 'Most TOLC exams include a final English proficiency section consisting of 30 questions. While this section rarely contributes to your core admission score, universities use it to assess whether you need to take an Additional Learning Obligation (OFA) course in English during your first year.' },
    { question: 'Can I use IMAT preparation books to study for TOLC-MED or TOLC-F?', answer: 'Yes, absolutely. Because the scientific syllabus (Biology, Chemistry, Physics, Math) overlaps almost entirely, high-quality IMAT resources are excellent for TOLC-MED and TOLC-F preparation. You just need to ensure you also practice specific CISIA-style logic questions.' },
    { question: 'What is the best way to study for the Logic sections?', answer: 'The most effective strategy is repetitive practice with past papers and simulated mocks. Focus on identifying argument structures, numerical reasoning patterns, and the underlying logic of syllogisms. Speed reading is also a critical skill to develop.' }
];

export default function TolcDetailedSyllabus() {
    const { getField } = usePageContent('tolc-detailed-syllabus-2026');
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
        <CmsPageWrapper slug="tolc-detailed-syllabus-2026">
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
                    title="TOLC Detailed Syllabus 2026: Complete Section-by-Section Guide"
                    description="The most comprehensive and detailed TOLC 2026 syllabus guide. Complete breakdown of TOLC-I, TOLC-E, TOLC-F, TOLC-MED, and TOLC-SU requirements for Italian university admissions."
                    keywords="TOLC syllabus 2026, TOLC-I syllabus, TOLC-E topics, TOLC-MED biology, TOLC-F chemistry, TOLC logical reasoning, CISIA test topics"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'TOLC Guide', item: '/tolc-exam-ultimate-guide-2026' },
                        { name: 'TOLC Syllabus 2026', item: '/tolc-syllabus-2026' }
                    ])]}
                    />

                <FAQSchema items={faqs} />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* Sidebar Hub */}
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="tolc" />
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-[120px]">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                        Official 2026 CISIA Framework
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'TOLC 2026 Detailed Master Syllabus')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The TOLC (Test OnLine CISIA) is not a single exam, but a diverse ecosystem of specialized university admission tests. Whether you are aiming for Engineering (TOLC-I), Economics (TOLC-E), Pharmacy (TOLC-F), Medicine (TOLC-MED), or Humanities (TOLC-SU), mastering the specific syllabus for your chosen track is the absolute prerequisite for success. This exhaustive guide breaks down every single topic, sub-topic, and competency tested across the major TOLC variants, providing you with a definitive roadmap for your 2026 preparation journey.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'variants', label: 'Exam Types', value: '10+ Variants', icon: BookOpen },
                                            { key: 'questions', label: 'Average Qs', value: '50 MCQ', icon: Target },
                                            { key: 'time', label: 'Avg Timing', value: '90-110 Min', icon: Zap },
                                            { key: 'status', label: 'Curriculum', value: '2026 Updated', icon: Star }
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

                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        Unlike monolithic exams, the CISIA consortium designs each TOLC to precisely measure the aptitude and foundational knowledge required for specific academic faculties. The syllabi are rigorous, aligning with the highest standards of European secondary education. Every question is dynamically pulled from a vast, secure proprietary database, meaning no two students take the exact same test. This randomized generation makes "question guessing" impossible and demands true, comprehensive mastery of the underlying syllabus. Below, we dissect the core subjects required for the most competitive TOLC examinations.
                                    </p>
                                </section>

                                {/* TOLC-MED Section */}
                                <section id="tolc-med" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Stethoscope className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">TOLC-MED: Medicine & Surgery</h2>
                                    </div>
                                    <div className="space-y-6 mb-8">
                                        <EditableText fieldKey="med_desc" multiline as="p" className="text-lg text-slate-600 font-medium leading-relaxed">
                                            {getField('med_desc', "The TOLC-MED is the gateway to Medical, Surgical, and Dentistry programs in Italy. The syllabus is arguably the most intensive of all TOLC variants, heavily prioritizing biological sciences and chemistry, while still demanding sharp logical reasoning and mathematical literacy. The structure typically includes Reading Comprehension/Knowledge acquired in studies, Biology, Chemistry & Physics, and Mathematics & Reasoning. The Biology section alone often determines the competitive edge.")}
                                        </EditableText>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Biology Syllabus Core</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                                Biology forms the backbone of the TOLC-MED. You are expected to demonstrate an advanced understanding of life at the molecular, cellular, and organismal levels. Rote memorization will not suffice; you must understand the interconnected physiological systems and biochemical pathways.
                                            </p>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'med_cell', label: 'Chemistry of living things & Cell Theory' },
                                                    { key: 'med_genetics', label: 'Molecular Genetics & Mendelian inheritance' },
                                                    { key: 'med_anatomy', label: 'Human Anatomy, Physiology & Immunology' },
                                                    { key: 'med_bioenergetics', label: 'Bioenergetics (Photosynthesis, Glycolysis)' },
                                                    { key: 'med_evolution', label: 'Biodiversity, Evolution & Ecology' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                                        <EditableText fieldKey={`med_item_${item.key}`} as="span">
                                                            {getField(`med_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Chemistry Syllabus Core</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                                The chemistry component evaluates your grasp of the macroscopic and microscopic properties of matter, thermodynamics, and organic compounds. Questions frequently involve multi-step stoichiometric calculations that must be solved rapidly without a calculator.
                                            </p>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'med_matter', label: 'Atomic structure, Isotopes & Periodic Trends' },
                                                    { key: 'med_bonds', label: 'Chemical Bonding (Covalent, Ionic, Metallic)' },
                                                    { key: 'med_stoichiometry', label: 'Stoichiometry, Moles & Concentration' },
                                                    { key: 'med_reactions', label: 'Redox Reactions, Acids, Bases & pH' },
                                                    { key: 'med_organic', label: 'Organic Chemistry: Functional Groups & Isomerism' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                                        <EditableText fieldKey={`med_chem_${item.key}`} as="span">
                                                            {getField(`med_chem_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                            <BrainCircuit className="text-rose-600" size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-rose-900 text-lg mb-2">Reading Comprehension & Reasoning</h4>
                                            <p className="text-sm text-rose-800 leading-relaxed">
                                                TOLC-MED dedicates a substantial portion of the exam to testing your ability to process complex texts, extract logical deductions, and solve quantitative puzzles. This section often separates the top percentile of students, as it relies on analytical skills developed through rigorous practice rather than textbook studying.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* TOLC-I Section */}
                                <section id="tolc-i" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Calculator className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">TOLC-I: Engineering & Applied Sciences</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 bg-indigo-50 border-indigo-100 border-2 rounded-[2.5rem] relative overflow-hidden group order-2 md:order-1">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                                <Calculator size={150} className="text-indigo-900" />
                                            </div>
                                            <h4 className="text-indigo-900 font-black mb-4">Exam weighting: 50 Questions (110 mins)</h4>
                                            <ul className="space-y-3 text-sm text-indigo-800 font-medium relative z-10">
                                                <li className="flex justify-between border-b border-indigo-100 pb-1"><span>Mathematics:</span> <span>20 Questions</span></li>
                                                <li className="flex justify-between border-b border-indigo-100 pb-1"><span>Logic:</span> <span>10 Questions</span></li>
                                                <li className="flex justify-between border-b border-indigo-100 pb-1"><span>Sciences:</span> <span>10 Questions</span></li>
                                                <li className="flex justify-between pb-1"><span>Verbal Comprehension:</span> <span>10 Questions</span></li>
                                            </ul>
                                            <p className="mt-6 text-xs text-indigo-700 leading-relaxed font-bold">
                                                *Mathematics dictates your success here. It constitutes 40% of the entire grade and sets the baseline for engineering aptitude.
                                            </p>
                                        </Card>
                                        <div className="space-y-6 order-1 md:order-2">
                                            <EditableText fieldKey="i_desc" multiline as="p" className="text-lg text-slate-600 font-medium leading-relaxed">
                                                {getField('i_desc', "The TOLC-I is the definitive assessment for prospective Engineering and hard science students. The syllabus is heavily skewed towards quantitative analysis, advanced algebra, geometry, and classical physics. The logic section here is deeply mathematical, focusing on pattern recognition and spatial reasoning rather than linguistic deduction.")}
                                            </EditableText>
                                            
                                            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Mathematics Syllabus</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'i_algebra', label: 'Arithmetic & Algebra (Polynomials, Systems)' },
                                                    { key: 'i_geometry', label: 'Analytic & Euclidean Geometry (Shapes, Trigonometry)' },
                                                    { key: 'i_functions', label: 'Functions (Logarithms, Exponentials)' },
                                                    { key: 'i_prob', label: 'Combinatorics, Probability & Statistics' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                                        <EditableText fieldKey={`i_item_${item.key}`} as="span">
                                                            {getField(`i_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 space-y-6">
                                        <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Sciences (Physics & Chemistry) Syllabus</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            While Mathematics dominates, the Sciences section ensures you have the physical intuition necessary for engineering. The physics syllabus centers heavily on mechanics (kinematics, dynamics, Newton's laws), thermodynamics, and basic electromagnetism. The chemistry portion is generally lighter than the TOLC-MED, focusing primarily on atomic structure, basic stoichiometry, and chemical nomenclature.
                                        </p>
                                    </div>
                                </section>

                                {/* TOLC-E Section */}
                                <section id="tolc-e" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <TrendingUp className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">TOLC-E: Economics & Business</h2>
                                    </div>
                                    
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 mb-8">
                                        <EditableText fieldKey="e_desc" multiline as="p" className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                            {getField('e_desc', "Designed for Economics, Business Administration, and Management faculties, the TOLC-E evaluates your ability to process data, read complex charts, comprehend long-form socio-economic texts, and solve logical puzzles. It notably excludes Biology, Chemistry, and Physics entirely, focusing solely on Mathematics, Logic, and Verbal Comprehension.")}
                                        </EditableText>
                                        
                                        <div className="grid md:grid-cols-3 gap-8">
                                            <div className="space-y-4">
                                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                                    <Search className="text-emerald-600" size={24} />
                                                </div>
                                                <h4 className="font-black text-slate-900">Verbal Comprehension</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Analysis of argumentative and expository texts. Tests your ability to extract meaning, identify the author's thesis, and understand vocabulary in context.
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                                    <BrainCircuit className="text-emerald-600" size={24} />
                                                </div>
                                                <h4 className="font-black text-slate-900">Logical Reasoning</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Syllogisms, necessary and sufficient conditions, deductive reasoning, and identifying logical fallacies. Demands rapid analytical processing.
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                                    <Calculator className="text-emerald-600" size={24} />
                                                </div>
                                                <h4 className="font-black text-slate-900">Mathematics</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Data interpretation, percentages, ratios, basic algebra, geometry, and introductory statistics. Highly focused on applied numeracy.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        The Mathematics section in the TOLC-E is generally considered less abstract than the TOLC-I, leaning heavily into practical mathematics, graphs, and statistics. You must be extremely comfortable calculating percentages, interpreting histograms, and solving rapid word problems.
                                    </p>
                                </section>

                                {/* TOLC-F Section */}
                                <section id="tolc-f" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <Beaker className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">TOLC-F: Pharmacy & Biosciences</h2>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                                        <div className="space-y-6">
                                            <EditableText fieldKey="f_desc" multiline as="p" className="text-lg text-slate-600 font-medium leading-relaxed">
                                                {getField('f_desc', "The TOLC-F is the standard for Pharmacy, Pharmaceutical Chemistry, and various biological science degrees. Structurally, it is very similar to the TOLC-MED, but places an even heavier emphasis on Chemistry and Biology, reflecting the nature of pharmaceutical studies.")}
                                            </EditableText>
                                            
                                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <Atom size={20} className="text-amber-600" />
                                                    The Chemistry Deep-Dive
                                                </h4>
                                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                                    For the TOLC-F, your organic chemistry knowledge must be impeccable. You will be tested on:
                                                </p>
                                                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> IUPAC Nomenclature</li>
                                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Functional groups and their reactions</li>
                                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Stereochemistry & Isomerism</li>
                                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Biomolecules (Carbs, Lipids, Proteins)</li>
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Biology & Physics</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                The Biology syllabus mirrors the comprehensive nature of the medical tests, requiring a detailed understanding of cellular structure, mitosis/meiosis, genetics, and human physiology. The Physics section acts as a supplementary competency test, covering fundamental mechanics, fluid dynamics, and basic thermodynamics. Mathematics is present but carries slightly less weight compared to the TOLC-I.
                                            </p>
                                            
                                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                                <h4 className="font-black text-amber-900 text-lg mb-2">Section Timing</h4>
                                                <p className="text-sm text-amber-800 leading-relaxed">
                                                    Time management is crucial in TOLC-F. You have approximately 1.5 minutes per question in the science sections. Mastery of concepts is not enough; you must train for rapid recall and execution.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* TOLC-SU Section */}
                                <section id="tolc-su" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <BookOpen size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <BookOpen className="text-indigo-400" />
                                                TOLC-SU: Humanities
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                The TOLC-SU evaluates aptitude for degrees in Humanities, Languages, Philosophy, and Literature. It completely discards the scientific and mathematical sections in favor of deep linguistic analysis, cultural knowledge, and logical deduction.
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                                    <BookOpen size={32} className="text-fuchsia-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Reading Comprehension</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">
                                                        The largest and most important section (30 questions). You will analyze various text types (literary, essay, journalistic) to evaluate reading skills, vocabulary, and syntactic understanding.
                                                    </p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                                    <Globe size={32} className="text-cyan-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Knowledge & Skills</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">
                                                        A uniquely broad section testing high school cultural knowledge. Includes history, geography, civic education, and general literature. It measures your overall cultural foundation.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Summary & Preparation */}
                                <section className="pt-12">
                                    <h2 className="text-3xl font-black text-slate-900 mb-6">How to Prepare Effectively</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                        Given the breadth of the CISIA syllabus across all these variants, a scattered approach to studying will lead to failure. You must adopt a highly structured methodology. First, identify the exact TOLC variant required by your target university. Second, download the official CISIA reference framework for that specific test. Third, utilize a platform like ItaloStudy that offers simulated mock exams matching the exact difficulty, timing, and syllabus weightings of the real test. Remember, the TOLC tests your speed just as much as your knowledge. 
                                    </p>
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

                                <CTASection fieldKeyPrefix="tolc_syllabus_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
