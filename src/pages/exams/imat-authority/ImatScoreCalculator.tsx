import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import Layout from '@/components/Layout';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { 
    Calculator, 
    ArrowRight, 
    Target, 
    AlertTriangle, 
    CheckCircle, 
    XCircle, 
    HelpCircle,
    TrendingUp,
    MapPin,
    BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';

const ImatScoreCalculator: React.FC = () => {
    const navigate = useNavigate();
    const [correct, setCorrect] = useState<number | ''>('');
    const [incorrect, setIncorrect] = useState<number | ''>('');
    const [blank, setBlank] = useState<number | ''>('');
    const [score, setScore] = useState<number | null>(null);

    const calculateScore = () => {
        const c = Number(correct) || 0;
        const i = Number(incorrect) || 0;
        const b = Number(blank) || 0;
        
        if (c + i + b > 60) {
            alert('Total questions cannot exceed 60.');
            return;
        }
        
        const finalScore = (c * 1.5) - (i * 0.4);
        setScore(Number(finalScore.toFixed(2)));
    };

    return (
        <Layout variant="public">
        <div className="bg-gray-50 min-h-screen">
            <SEOHead 
                title="IMAT Score Calculator 2026: Calculate Your Ranking | Italostudy"
                description="Calculate your IMAT score instantly with our interactive tool. Learn the +1.5/-0.4 scoring formula, negative marking strategies, and historical cutoffs for all Italian medical universities."
                keywords="imat score calculator, imat scoring system, imat negative marking, imat 2026 cutoff, imat total marks, how is imat scored"
            />

            {/* Hero Section */}
            <div className="bg-white border-b pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
                            <Calculator className="w-4 h-4" /> Official MUR Formula
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                            IMAT Score Calculator & Negative Marking Strategy
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Stop guessing your score. Use our interactive calculator to find your exact raw score based on the official +1.5 / -0.4 Italian Ministry formula. Then, read our 3500-word deep dive into how to beat negative marking.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Content Column */}
                    <div className="lg:col-span-2">
                        
                        {/* Interactive Calculator App */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Target className="w-6 h-6 text-emerald-600" /> Calculate Your Raw Score
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Correct Answers (+1.5)</label>
                                    <input 
                                        type="number" 
                                        min="0" max="60"
                                        value={correct}
                                        onChange={(e) => setCorrect(e.target.value ? Number(e.target.value) : '')}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                                        placeholder="0 - 60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Incorrect Answers (-0.4)</label>
                                    <input 
                                        type="number" 
                                        min="0" max="60"
                                        value={incorrect}
                                        onChange={(e) => setIncorrect(e.target.value ? Number(e.target.value) : '')}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                                        placeholder="0 - 60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blank Answers (0.0)</label>
                                    <input 
                                        type="number" 
                                        min="0" max="60"
                                        value={blank}
                                        onChange={(e) => setBlank(e.target.value ? Number(e.target.value) : '')}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                                        placeholder="0 - 60"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <button 
                                    onClick={calculateScore}
                                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                                >
                                    Calculate
                                </button>
                                
                                {score !== null && (
                                    <div className="text-center sm:text-right">
                                        <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Your Total Score</div>
                                        <div className="text-4xl font-extrabold text-gray-900">
                                            {score} <span className="text-xl text-gray-400 font-medium">/ 90</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Long Form Article */}
                        <article className="prose prose-lg prose-emerald max-w-none">
                            <h2>The Scoring Mechanism: How is the IMAT Graded?</h2>
                            <p>
                                The International Medical Admissions Test (IMAT) is a strictly regulated, multiple-choice examination. Unlike holistic admission systems in the US or UK where your high school GPA, extracurriculars, or personal statement matter, the Italian system is ruthlessly egalitarian: <strong>Your admission is based 100% on your raw IMAT score.</strong>
                            </p>
                            <p>
                                The exam consists of 60 questions. Each question presents five multiple-choice options (A, B, C, D, E), and there is always only one correct answer. The Italian Ministry of University and Research (MUR) applies a specific formula designed to heavily penalize "blind guessing."
                            </p>
                            <ul>
                                <li><strong>Correct Answer:</strong> You are awarded exactly <strong>+1.5 points</strong>.</li>
                                <li><strong>Incorrect Answer:</strong> You are penalized by <strong>-0.4 points</strong>.</li>
                                <li><strong>Omitted (Blank) Answer:</strong> You receive exactly <strong>0 points</strong>.</li>
                            </ul>
                            <p>
                                Because there are 60 questions, the absolute maximum score you can achieve is 90 points (60 × 1.5). The absolute minimum score you can achieve is -24 points (60 × -0.4). 
                            </p>

                            <hr />

                            <h2>The Psychology of Negative Marking (-0.4)</h2>
                            <p>
                                Many students vastly underestimate the psychological and statistical impact of the -0.4 penalty. To understand how to approach the IMAT, we need to do some basic game theory.
                            </p>
                            <h3>The "Blind Guess" Fallacy</h3>
                            <p>
                                Suppose you are running out of time and have 10 questions left. You decide to blindly guess on all 10 questions. Because there are 5 options per question, your statistical probability of guessing correctly is 20% (1/5).
                            </p>
                            <ul>
                                <li>Statistically, you will get 2 questions correct: 2 × 1.5 = +3.0 points.</li>
                                <li>Statistically, you will get 8 questions wrong: 8 × -0.4 = -3.2 points.</li>
                                <li><strong>Net Result:</strong> -0.2 points.</li>
                            </ul>
                            <p>
                                Blind guessing in the IMAT actually results in a statistical loss. This is entirely intentional by the MUR. They do not want students gambling their way into medical school. If you cannot eliminate at least two options, <strong>you must leave the question blank.</strong>
                            </p>

                            <h3>The "Educated Guess" Strategy</h3>
                            <p>
                                Now, suppose you can confidently eliminate 3 of the 5 options. You are now tossing a coin between the 2 remaining options (a 50% probability). Let's say you do this for 10 questions.
                            </p>
                            <ul>
                                <li>Statistically, you get 5 correct: 5 × 1.5 = +7.5 points.</li>
                                <li>Statistically, you get 5 incorrect: 5 × -0.4 = -2.0 points.</li>
                                <li><strong>Net Result:</strong> +5.5 points.</li>
                            </ul>
                            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 my-6">
                                <p className="text-emerald-800 m-0"><strong>The Golden Rule of IMAT:</strong> If you can eliminate 3 out of 5 options, you should always guess. If you can eliminate only 1 or 2 options, the risk profile shifts, and you should likely leave the question blank.</p>
                            </div>

                            <hr />

                            <h2>Historical Cutoffs: What Score Do You Actually Need?</h2>
                            <p>
                                There is no universal "passing mark" for the IMAT. Admission is based entirely on a national ranking system. Every university has a specific number of seats. Once the exam is graded, all students are ranked from highest to lowest score. 
                            </p>
                            <p>
                                The "cutoff" score is simply the score of the <em>last person</em> admitted to a specific university in that specific year. Cutoffs fluctuate wildly based on two factors: the difficulty of the exam that year, and the popularity of the university.
                            </p>
                            
                            <h3>The Tier System of Universities</h3>
                            <p>While cutoffs change yearly, Italian universities generally fall into three tiers of competitiveness based on location and historical prestige.</p>
                            
                            <ol>
                                <li><strong>Tier 1: The Northern Giants (High Cutoffs)</strong>
                                    <p>Universities like the University of Milan (La Statale), University of Bologna, and Sapienza University of Rome are the most requested. They are in famous cities, boast hundreds of years of history, and have massive international student populations. A "safe" score for these universities is historically above <strong>52.0 points</strong> (Non-EU).</p>
                                </li>
                                <li><strong>Tier 2: The Mid-Sized Cities (Medium Cutoffs)</strong>
                                    <p>Universities such as the University of Pavia, Turin, and Naples Federico II. These are excellent, highly respected institutions but have slightly less international name recognition than Milan or Rome. A "safe" score here is historically around <strong>45.0 - 48.0 points</strong> (Non-EU).</p>
                                </li>
                                <li><strong>Tier 3: The Southern Universities (Lower Cutoffs)</strong>
                                    <p>Universities located in southern Italy, such as Messina, Bari, and Campania Luigi Vanvitelli. These universities offer the exact same degree, but due to their location further from the economic centers of the north, they receive fewer first-choice applications. A "safe" score for these universities is historically around <strong>35.0 - 40.0 points</strong> (Non-EU).</p>
                                </li>
                            </ol>

                            <hr />

                            <h2>EU vs Non-EU Ranking Systems</h2>
                            <p>
                                If you are an international student reading this (like an <Link to="/imat-exam-for-indian-students" className="text-emerald-600 hover:underline">Indian student applying for IMAT</Link>), you must understand that the ranking system works differently for you than it does for European citizens.
                            </p>
                            <h3>The Non-EU System</h3>
                            <p>
                                Non-EU students do not compete in a massive national ranking list against everyone else. Instead, you compete <strong>only against other Non-EU students who applied to the exact same first-choice university as you.</strong> 
                            </p>
                            <p>
                                When you do your Universitaly Pre-Enrollment in April/May, your first choice is binding. If you choose the University of Milan, and Milan has 25 seats for Non-EU students, you are competing exclusively against the other Non-EU candidates who also chose Milan as their first choice. If you do not score in the top 25 of that specific group, you are rejected, even if your score was high enough to get into Messina or Bari.
                            </p>
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
                                <p className="text-red-800 m-0"><strong>Strategic Advice:</strong> If you are a Non-EU applicant and you are scoring around 35-40 on your mock exams, do not choose Milan or Rome as your first choice. You will be rejected. Choose a southern university where your 40 points guarantee you a seat.</p>
                            </div>

                            <hr />

                            <h2>Conclusion: How to Use Your Mock Scores</h2>
                            <p>
                                Using this calculator is just the first step. You should be taking full-length, timed mock exams every single week. After you calculate your score, analyze your errors. Did you lose points because of lack of knowledge, or because you made "blind guesses" that penalized you -0.4 points?
                            </p>
                            <p>
                                To maximize your score, check out our deep dive into the <Link to="/imat-biology-syllabus-2026" className="text-emerald-600 hover:underline">IMAT Biology Syllabus</Link> and our guide on beating the new <Link to="/imat-logical-reasoning-guide-2026" className="text-emerald-600 hover:underline">IMAT Logical Reasoning format</Link>.
                            </p>

                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-24 self-start">
                            <KnowledgeHubSidebar examType="imat" />
                        </div>
                    </div>

                </div>
            </div>

            <CTASection />
        </div>
        </Layout>
    );
};

export default ImatScoreCalculator;
