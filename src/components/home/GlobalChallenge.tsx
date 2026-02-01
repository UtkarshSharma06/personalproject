import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActiveUsersReveal from './ActiveUsersReveal';
import { Button } from '@/components/ui/button';
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

// Interactive Data with updated badges
// Interactive Data with updated badges
const QUESTIONS: Question[] = [
    {
        subject: "Logic & Reasoning",
        icon: Brain,
        badge: "Rank Match",
        question: "If you are running a race and you pass the person in second place, what place are you in?",
        options: ["First", "Second", "Third", "Last"],
        correct: 1 // Second
    },
    {
        subject: "Mathematics",
        icon: Calculator,
        badge: "Speed Round",
        question: "If 2x + 5 = 15, what is the value of 3x - 1?",
        options: ["10", "14", "12", "15"],
        correct: 1 // x=5, so 3(5)-1 = 14
    },
    {
        subject: "Biology",
        icon: Dna,
        badge: "Daily Challenge",
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
        correct: 2 // Mitochondria
    },
    {
        subject: "Physics",
        icon: Atom,
        badge: "Concept Core",
        question: "What is the SI unit of Force?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        correct: 2 // Newton
    },
    {
        subject: "Chemistry",
        icon: FlaskConical,
        badge: "Lab Sprint",
        question: "What is the pH value of pure water at 25°C?",
        options: ["5", "7", "9", "14"],
        correct: 1 // 7
    }
];

// Countries list removed as it is no longer used

interface GlobalChallengeProps {
    onPracticeMore?: () => void;
}

const GlobalChallenge = ({ onPracticeMore }: GlobalChallengeProps) => {
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
        <section className="py-24 relative transform-gpu" style={{ background: 'hsl(0 0% 0%)' }}>
            {/* Dark Grid Background Pattern */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: `
                    linear-gradient(90deg, hsl(0 0% 95% / 0.25) 1px, transparent 1px) 0 0 / 10vmin 10vmin,
                    linear-gradient(hsl(0 0% 95% / 0.25) 1px, transparent 1px) 0 0 / 10vmin 10vmin
                `,
                mask: 'linear-gradient(-15deg, transparent 30%, white)',
                WebkitMask: 'linear-gradient(-15deg, transparent 30%, white)',
            }} />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -100px 0px" }} // Trigger earlier
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-6"
                    >
                        <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                            Live Competition
                        </span>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Global League</span>
                        </h2>
                        <p className="text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                            Compete with ambitious students worldwide in real-time.
                            Test your skills, earn badges, and climb the leaderboard.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">

                    {/* LEFT COLUMN: ACTIVE USERS REVEAL */}
                    <div className="relative group perspective-1000">
                        <div className="bg-slate-900/60 border border-slate-700/50 rounded-[2.5rem] p-6 h-full flex flex-col justify-center items-center overflow-hidden relative shadow-xl shadow-black/40 backdrop-blur-md">
                            <ActiveUsersReveal />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LIVE QUIZ CHALLENGE */}
                    <div className="relative">
                        {/* Reduced motion complexity */}
                        <div className="bg-slate-900/70 backdrop-blur-lg rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-700/50 p-8 md:p-10 h-full flex flex-col relative z-10">
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
                                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Live Challenge</span>
                                                </div>
                                                <div className="text-sm font-bold text-slate-400">Question {currentQ + 1} of {QUESTIONS.length}</div>
                                            </div>

                                            <div className="bg-indigo-500/10 px-4 py-2 rounded-2xl flex flex-col items-end border border-indigo-400/20">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Subject</span>
                                                <span className="text-indigo-300 font-bold text-sm flex items-center gap-1">
                                                    {React.createElement(QUESTIONS[currentQ].icon, { className: "w-4 h-4" })}
                                                    {QUESTIONS[currentQ].subject}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Question Area */}
                                        <div className="flex-1 mb-8">
                                            <h4 className="text-xl md:text-2xl font-bold text-white leading-snug mb-8">
                                                {QUESTIONS[currentQ].question}
                                            </h4>

                                            <div className="space-y-3">
                                                {QUESTIONS[currentQ].options.map((opt, i) => {
                                                    let stateClass = "border-slate-700 bg-slate-800/50 hover:bg-slate-700/70 hover:border-indigo-400/50 text-slate-200 shadow-sm";

                                                    if (selectedOption === i) {
                                                        stateClass = "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500 shadow-md";
                                                    }

                                                    if (hasSubmitted) {
                                                        if (i === QUESTIONS[currentQ].correct) {
                                                            stateClass = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-md";
                                                        } else if (selectedOption === i) {
                                                            stateClass = "border-rose-500 bg-rose-50 text-rose-700";
                                                        } else {
                                                            stateClass = "opacity-30 border-slate-700";
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
                                                                selectedOption === i ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-600 text-slate-400"
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
                                                    className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group transform-gpu"
                                                >
                                                    Check Answer <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                                                            ? <><Award className="w-4 h-4" /> Outstanding! You got it right.</>
                                                            : "Nice try! Keep going."}
                                                    </div>
                                                    <Button
                                                        onClick={handleNext}
                                                        className="w-full h-14 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-lg active:scale-[0.98] transition-all group transform-gpu"
                                                    >
                                                        {currentQ < QUESTIONS.length - 1 ? "Next Challenge" : "See Results"} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

                                        <h3 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Challenge Complete!</h3>
                                        <p className="text-slate-300 font-bold mb-10 max-w-xs mx-auto">
                                            You scored <span className="text-indigo-400 text-2xl">{score}</span> out of <span className="text-white">{QUESTIONS.length}</span> correct answers.
                                        </p>

                                        <div className="flex gap-4 w-full">
                                            <Button
                                                onClick={resetQuiz}
                                                variant="outline"
                                                className="flex-1 h-14 rounded-2xl border-2 border-slate-600 font-bold hover:border-slate-500 hover:bg-slate-800 text-slate-200"
                                            >
                                                Try Again
                                            </Button>
                                            <Button
                                                onClick={onPracticeMore}
                                                className="flex-1 h-14 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 shadow-xl shadow-white/20"
                                            >
                                                Practice More
                                            </Button>
                                        </div>

                                        <div className="mt-8 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                                            Top 10% of global participants today
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
                                👆 Try the live simulation
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
