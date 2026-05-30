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
        <section className="pt-16 pb-24 relative bg-[#fcfcfc] border-b border-[#eaeaea]">
            <div className="container mx-auto px-6 max-w-[1200px] relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="mb-4"
                    >
                        <h2 className="text-[32px] md:text-[40px] font-bold text-[#333333] leading-tight mb-4">
                            <EditableText
                                fieldKey="global_challenge_title"
                                fallback={t('landing.global_challenge.title') + ' ' + t('landing.global_challenge.title_highlight')}
                            />
                        </h2>
                        <p className="text-[16px] text-[#555555] max-w-2xl mx-auto leading-relaxed">
                            <EditableText fieldKey="global_challenge_description" fallback={t('landing.global_challenge.description')} multiline />
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">

                    {/* LEFT COLUMN: ACTIVE USERS REVEAL */}
                    <div className="relative group">
                        <div className="bg-white border border-[#eaeaea] rounded-2xl p-6 h-full flex flex-col justify-center items-center overflow-hidden relative shadow-sm">
                            <ActiveUsersReveal />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LIVE QUIZ CHALLENGE */}
                    <div className="relative">
                        <div className="bg-[#f8f9fe] border border-[#eaeaea] rounded-2xl p-8 md:p-10 h-full flex flex-col relative z-10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
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
                                        <div className="flex justify-between items-start mb-6 border-b border-[#eaeaea] pb-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#e84b3c] animate-pulse" />
                                                    <span className="text-[12px] font-bold text-[#e84b3c]">
                                                        <EditableText fieldKey="quiz_live_badge" fallback={t('landing.global_challenge.quiz.live_badge')} />
                                                    </span>
                                                </div>
                                                <div className="text-[14px] text-[#555555]">
                                                    {t('landing.global_challenge.quiz.question_count', { current: currentQ + 1, total: QUESTIONS.length })}
                                                </div>
                                            </div>

                                            <div className="bg-[#f4f7ff] px-4 py-2 rounded-[8px] flex flex-col items-end border border-[#5a4bda]/20">
                                                <span className="text-[10px] font-semibold text-[#5a4bda] uppercase tracking-wider">
                                                    <EditableText fieldKey="quiz_subject_label" fallback={t('landing.global_challenge.quiz.subject_label')} />
                                                </span>
                                                <span className="text-[#333333] font-bold text-[14px] flex items-center gap-1 mt-1">
                                                    {React.createElement(QUESTIONS[currentQ].icon, { className: "w-4 h-4 text-[#5a4bda]" })}
                                                    {QUESTIONS[currentQ].subject}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Question Area */}
                                        <div className="flex-1 mb-8">
                                            <h4 className="text-[20px] md:text-[24px] font-bold text-[#333333] leading-snug mb-6">
                                                {QUESTIONS[currentQ].question}
                                            </h4>

                                            <div className="space-y-3">
                                                {QUESTIONS[currentQ].options.map((opt, i) => {
                                                    let stateClass = "border-[#eaeaea] bg-white hover:border-[#5a4bda]/30 text-[#555555]";

                                                    if (selectedOption === i) {
                                                        stateClass = "border-[#5a4bda] bg-[#f4f7ff] text-[#5a4bda]";
                                                    }

                                                    if (hasSubmitted) {
                                                        if (i === QUESTIONS[currentQ].correct) {
                                                            stateClass = "border-[#2e7d32] bg-[#edf7ed] text-[#2e7d32] font-semibold";
                                                        } else if (selectedOption === i) {
                                                            stateClass = "border-[#d32f2f] bg-[#fdeded] text-[#d32f2f]";
                                                        } else {
                                                            stateClass = "opacity-50 border-[#eaeaea] cursor-not-allowed text-[#888888]";
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleSelect(i)}
                                                            disabled={hasSubmitted}
                                                            className={cn(
                                                                "w-full text-left p-4 rounded-xl border transition-colors duration-150 font-medium text-[15px] flex items-center gap-4",
                                                                stateClass
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full border flex items-center justify-center text-[14px] font-bold transition-colors",
                                                                selectedOption === i ? "border-[#5a4bda] bg-[#5a4bda] text-white" : "border-[#eaeaea] text-[#888888]"
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
                                                    className="w-full h-12 bg-[#5a4bda] text-white rounded-[4px] font-semibold text-[16px] hover:bg-[#483ab8] transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-none"
                                                >
                                                    <EditableText fieldKey="quiz_check_answer_btn" fallback={t('landing.global_challenge.quiz.check_answer')} /> <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-300 fade-in">
                                                    <div className={cn(
                                                        "p-3 rounded-[4px] text-[14px] font-semibold flex items-center justify-center gap-2",
                                                        selectedOption === QUESTIONS[currentQ].correct
                                                            ? "bg-[#edf7ed] text-[#2e7d32] border border-[#c8e6c9]"
                                                            : "bg-[#fdeded] text-[#d32f2f] border border-[#ffcdd2]"
                                                    )}>
                                                        {selectedOption === QUESTIONS[currentQ].correct
                                                            ? <><Award className="w-4 h-4" /> <EditableText fieldKey="quiz_outstanding_label" fallback={t('landing.global_challenge.quiz.outstanding')} /></>
                                                            : <EditableText fieldKey="quiz_nice_try_label" fallback={t('landing.global_challenge.quiz.nice_try')} />}
                                                    </div>
                                                    <Button
                                                        onClick={handleNext}
                                                        className="w-full h-12 bg-[#333333] text-white rounded-[4px] font-semibold text-[16px] hover:bg-black transition-all group shadow-none"
                                                    >
                                                        {currentQ < QUESTIONS.length - 1
                                                            ? <EditableText fieldKey="quiz_next_challenge_btn" fallback={t('landing.global_challenge.quiz.next_challenge')} />
                                                            : <EditableText fieldKey="quiz_see_results_btn" fallback={t('landing.global_challenge.quiz.see_results')} />
                                                        } <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                                            <div className="relative w-24 h-24 rounded-full bg-[#f8f9fe] border border-[#eaeaea] flex items-center justify-center shadow-sm">
                                                <Award className="w-12 h-12 text-[#5a4bda]" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full border border-[#eaeaea] shadow-sm">
                                                <span className="text-xl">🏆</span>
                                            </div>
                                        </div>

                                        <h3 className="text-[28px] font-bold text-[#333333] mb-2 leading-tight">
                                            <EditableText fieldKey="quiz_complete_title" fallback={t('landing.global_challenge.quiz.complete_title')} />
                                        </h3>
                                        <p className="text-[#555555] text-[15px] mb-8 max-w-xs mx-auto">
                                            {t('landing.global_challenge.quiz.score_summary', { score, total: QUESTIONS.length })}
                                        </p>

                                        <div className="flex gap-4 w-full">
                                            <Button
                                                onClick={resetQuiz}
                                                variant="outline"
                                                className="flex-1 h-12 rounded-[4px] border border-[#eaeaea] font-semibold text-[15px] hover:bg-[#fcfcfc] text-[#555555] shadow-none"
                                            >
                                                <EditableText fieldKey="quiz_try_again_btn" fallback={t('landing.global_challenge.quiz.try_again')} />
                                            </Button>
                                            <Button
                                                onClick={onPracticeMore}
                                                className="flex-1 h-12 bg-[#5a4bda] text-white rounded-[4px] font-semibold text-[15px] hover:bg-[#483ab8] shadow-none"
                                            >
                                                <EditableText fieldKey="quiz_practice_more_btn" fallback={t('landing.global_challenge.quiz.practice_more')} />
                                            </Button>
                                        </div>

                                        <div className="mt-8 bg-[#f4f7ff] text-[#5a4bda] px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-2">
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
                            className="absolute -bottom-14 left-0 right-0 text-center"
                        >
                            <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#888888] bg-white px-6 py-3 rounded-full border border-[#eaeaea] shadow-sm transition-colors cursor-default">
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
