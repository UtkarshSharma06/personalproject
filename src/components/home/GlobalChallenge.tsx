import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActiveUsersReveal from './ActiveUsersReveal';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';
import { usePageContent } from '@/hooks/usePageContent';
import {
    Globe2, Award, ArrowRight, Brain, Calculator,
    Dna, Atom, FlaskConical, CheckCircle2, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Question {
    subject: string;
    icon: React.ElementType;
    badge: string;
    question: string;
    options: string[];
    correct: number; // Index of correct answer
}

interface GlobalChallengeProps {
    onPracticeMore?: () => void;
}

const GlobalChallenge = ({ onPracticeMore }: GlobalChallengeProps) => {
    const { t } = useTranslation();
    const { getField } = usePageContent('landing-global');

    // Interactive Data with updated badges
    const QUESTIONS: Question[] = [
        {
            subject: getField('quiz_q1_subject', t('landing.global_challenge.quiz.subjects.logic')),
            icon: Brain,
            badge: getField('quiz_q1_badge', t('landing.global_challenge.quiz.badges.rank_match')),
            question: getField('quiz_q1_question', t('landing.global_challenge.quiz.questions.logic')),
            options: [
                getField('quiz_q1_opt0', t('common.numbers.first', 'First')),
                getField('quiz_q1_opt1', t('common.numbers.second', 'Second')),
                getField('quiz_q1_opt2', t('common.numbers.third', 'Third')),
                getField('quiz_q1_opt3', t('common.numbers.last', 'Last'))
            ],
            correct: parseInt(getField('quiz_q1_correct', '1'))
        },
        {
            subject: getField('quiz_q2_subject', t('landing.global_challenge.quiz.subjects.math')),
            icon: Calculator,
            badge: getField('quiz_q2_badge', t('landing.global_challenge.quiz.badges.speed_round')),
            question: getField('quiz_q2_question', t('landing.global_challenge.quiz.questions.math')),
            options: [
                getField('quiz_q2_opt0', "10"),
                getField('quiz_q2_opt1', "14"),
                getField('quiz_q2_opt2', "12"),
                getField('quiz_q2_opt3', "15")
            ],
            correct: parseInt(getField('quiz_q2_correct', '1'))
        },
        {
            subject: getField('quiz_q3_subject', t('landing.global_challenge.quiz.subjects.biology')),
            icon: Dna,
            badge: getField('quiz_q3_badge', t('landing.global_challenge.quiz.badges.daily_challenge')),
            question: getField('quiz_q3_question', t('landing.global_challenge.quiz.questions.biology')),
            options: [
                getField('quiz_q3_opt0', "Nucleus"),
                getField('quiz_q3_opt1', "Ribosome"),
                getField('quiz_q3_opt2', "Mitochondria"),
                getField('quiz_q3_opt3', "Lysosome")
            ],
            correct: parseInt(getField('quiz_q3_correct', '2'))
        },
        {
            subject: getField('quiz_q4_subject', t('landing.global_challenge.quiz.subjects.physics')),
            icon: Atom,
            badge: getField('quiz_q4_badge', t('landing.global_challenge.quiz.badges.concept_core')),
            question: getField('quiz_q4_question', t('landing.global_challenge.quiz.questions.physics')),
            options: [
                getField('quiz_q4_opt0', "Joule"),
                getField('quiz_q4_opt1', "Watt"),
                getField('quiz_q4_opt2', "Newton"),
                getField('quiz_q4_opt3', "Pascal")
            ],
            correct: parseInt(getField('quiz_q4_correct', '2'))
        },
        {
            subject: getField('quiz_q5_subject', t('landing.global_challenge.quiz.subjects.chemistry')),
            icon: FlaskConical,
            badge: getField('quiz_q5_badge', t('landing.global_challenge.quiz.badges.lab_sprint')),
            question: getField('quiz_q5_question', t('landing.global_challenge.quiz.questions.chemistry')),
            options: [
                getField('quiz_q5_opt0', "5"),
                getField('quiz_q5_opt1', "7"),
                getField('quiz_q5_opt2', "9"),
                getField('quiz_q5_opt3', "14")
            ],
            correct: parseInt(getField('quiz_q5_correct', '1'))
        }
    ];

    // State
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // Handlers
    const handleSelect = (index: number) => {
        if (!hasSubmitted) setSelectedOption(index);
    };

    const handleCheck = () => {
        if (selectedOption === null) return;
        setHasSubmitted(true);
        if (selectedOption === QUESTIONS[currentQ].correct) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(prev => prev + 1);
            setSelectedOption(null);
            setHasSubmitted(false);
        } else {
            setShowResults(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQ(0);
        setSelectedOption(null);
        setHasSubmitted(false);
        setScore(0);
        setShowResults(false);
    };

    return (
        <section className="py-10 relative transform-gpu bg-white">
            {/* Soft Grid Background Pattern */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: `
                    linear-gradient(90deg, hsl(220 14% 100% / 0.05) 1px, transparent 1px) 0 0 / 10vmin 10vmin,
                    linear-gradient(hsl(220 14% 100% / 0.05) 1px, transparent 1px) 0 0 / 10vmin 10vmin
                `,
                mask: 'linear-gradient(-15deg, transparent 30%, white)',
                WebkitMask: 'linear-gradient(-15deg, transparent 30%, white)',
            }} />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -100px 0px" }} // Trigger earlier
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-6"
                    >
                        <EditableText fieldKey="global_challenge_badge" fallback={t('landing.global_challenge.badge')} className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4 inline-block" />
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            <EditableText
                                fieldKey="global_challenge_title"
                                fallback={t('landing.global_challenge.title') + ' ' + t('landing.global_challenge.title_highlight')}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500"
                            />
                        </h2>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            <EditableText fieldKey="global_challenge_description" fallback={t('landing.global_challenge.description')} multiline />
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">

                    {/* LEFT COLUMN: ACTIVE USERS REVEAL */}
                    <div className="relative group perspective-1000">
                        <div className="bg-white border border-white/5 rounded-[2.5rem] p-6 h-full flex flex-col justify-center items-center overflow-hidden relative shadow-sm backdrop-blur-md">
                            <ActiveUsersReveal />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LIVE QUIZ CHALLENGE */}
                    <div className="relative">
                        <div className="bg-white backdrop-blur-lg rounded-[2.5rem] shadow-xl border border-white/5 p-8 md:p-10 h-full flex flex-col relative z-10">
                            <AnimatePresence mode="wait">
                                {!showResults ? (
                                    <motion.div
                                        key="quiz"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }} // Faster transition
                                        className="h-full flex flex-col"
                                    >
                                        {/* Quiz Header */}
                                        <div className="flex justify-between items-start mb-8 border-b border-indigo-50 pb-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                                        <EditableText fieldKey="quiz_live_badge" fallback={t('landing.global_challenge.quiz.live_badge')} />
                                                    </span>
                                                </div>
                                                <div className="text-sm font-bold text-slate-400">
                                                    {t('landing.global_challenge.quiz.question_count', { current: currentQ + 1, total: QUESTIONS.length })}
                                                </div>
                                            </div>

                                            <div className="bg-indigo-500/10 px-4 py-2 rounded-2xl flex flex-col items-end border border-indigo-400/20">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                    <EditableText fieldKey="quiz_subject_label" fallback={t('landing.global_challenge.quiz.subject_label')} />
                                                </span>
                                                <span className="text-indigo-300 font-bold text-sm flex items-center gap-1">
                                                    {React.createElement(QUESTIONS[currentQ].icon, { className: "w-4 h-4" })}
                                                    {QUESTIONS[currentQ].subject}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Question Area */}
                                        <div className="flex-1 mb-8">
                                            <h4 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-8">
                                                {QUESTIONS[currentQ].question}
                                            </h4>

                                            <div className="space-y-3">
                                                {QUESTIONS[currentQ].options.map((opt, i) => {
                                                    let stateClass = "border-slate-100 bg-slate-50/50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 shadow-sm";

                                                    if (selectedOption === i) {
                                                        stateClass = "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500 shadow-md";
                                                    }

                                                    if (hasSubmitted) {
                                                        if (i === QUESTIONS[currentQ].correct) {
                                                            stateClass = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-md";
                                                        } else if (selectedOption === i) {
                                                            stateClass = "border-rose-500 bg-rose-50 text-rose-700";
                                                        } else {
                                                            stateClass = "opacity-40 border-slate-100 cursor-not-allowed";
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleSelect(i)}
                                                            disabled={hasSubmitted}
                                                            className={cn(
                                                                "w-full text-left p-4 rounded-2xl border-2 transition-colors duration-150 font-semibold text-sm flex items-center gap-4 active:scale-[0.99] transform-gpu",
                                                                stateClass
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-colors",
                                                                selectedOption === i ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-200 text-slate-400"
                                                            )}>
                                                                {String.fromCharCode(65 + i)}
                                                            </div>
                                                            <span className="flex-1">{opt}</span>

                                                            <div className="w-6 flex justify-end">
                                                                {hasSubmitted && i === QUESTIONS[currentQ].correct && (
                                                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                                )}
                                                                {hasSubmitted && selectedOption === i && i !== QUESTIONS[currentQ].correct && (
                                                                    <XCircle className="w-5 h-5 text-rose-600" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="mt-auto pt-2">
                                            {!hasSubmitted ? (
                                                <Button
                                                    onClick={handleCheck}
                                                    disabled={selectedOption === null}
                                                    className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed group transform-gpu"
                                                >
                                                    <EditableText fieldKey="quiz_check_answer_btn" fallback={t('landing.global_challenge.quiz.check_answer')} /> <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300 fade-in">
                                                    <div className={cn(
                                                        "p-4 rounded-2xl text-xs font-bold uppercase tracking-wide text-center flex items-center justify-center gap-2",
                                                        selectedOption === QUESTIONS[currentQ].correct
                                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                            : "bg-rose-100 text-rose-800 border border-rose-200"
                                                    )}>
                                                        {selectedOption === QUESTIONS[currentQ].correct
                                                            ? <><Award className="w-4 h-4" /> <EditableText fieldKey="quiz_outstanding_label" fallback={t('landing.global_challenge.quiz.outstanding')} /></>
                                                            : <EditableText fieldKey="quiz_nice_try_label" fallback={t('landing.global_challenge.quiz.nice_try')} />}
                                                    </div>
                                                    <Button
                                                        onClick={handleNext}
                                                        className="w-full h-14 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-lg active:scale-[0.98] transition-all group transform-gpu"
                                                    >
                                                        {currentQ < QUESTIONS.length - 1
                                                            ? <EditableText fieldKey="quiz_next_challenge_btn" fallback={t('landing.global_challenge.quiz.next_challenge')} />
                                                            : <EditableText fieldKey="quiz_see_results_btn" fallback={t('landing.global_challenge.quiz.see_results')} />
                                                        } <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-8"
                                    >
                                        <div className="relative mb-8">
                                            {/* Reduced blur radius for performance */}
                                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full" />
                                            <div className="relative w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 rotate-3">
                                                <Award className="w-12 h-12 text-white drop-shadow-md" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg rotate-12">
                                                <span className="text-2xl">🏆</span>
                                            </div>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                            <EditableText fieldKey="quiz_complete_title" fallback={t('landing.global_challenge.quiz.complete_title')} />
                                        </h3>
                                        <p className="text-slate-500 font-bold mb-10 max-w-xs mx-auto">
                                            {t('landing.global_challenge.quiz.score_summary', { score, total: QUESTIONS.length })}
                                        </p>

                                        <div className="flex gap-4 w-full">
                                            <Button
                                                onClick={resetQuiz}
                                                variant="outline"
                                                className="flex-1 h-14 rounded-2xl border-2 border-white/5 font-bold hover:border-slate-200 hover:bg-slate-50 text-slate-600"
                                            >
                                                <EditableText fieldKey="quiz_try_again_btn" fallback={t('landing.global_challenge.quiz.try_again')} />
                                            </Button>
                                            <Button
                                                onClick={onPracticeMore}
                                                className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                                            >
                                                <EditableText fieldKey="quiz_practice_more_btn" fallback={t('landing.global_challenge.quiz.practice_more')} />
                                            </Button>
                                        </div>

                                        <div className="mt-8 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                                            <EditableText fieldKey="quiz_top_percent_label" fallback={t('landing.global_challenge.quiz.top_percent')} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Floating CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute -bottom-16 left-0 right-0 text-center"
                        >
                            <span className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-sm transition-colors cursor-default">
                                👆 <EditableText fieldKey="quiz_simulation_hint" fallback={t('landing.global_challenge.quiz.simulation_hint')} />
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Background decorations removed - dark grid pattern is now the main background */}
        </section>
    );
};

export default memo(GlobalChallenge);
