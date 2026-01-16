import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Users, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExamIMAT() {
    return (
        <div className="min-h-screen bg-[#f0f4f8] font-sans">
            {/* Header */}
            <div className="bg-white dark:bg-card border-b-2 border-slate-900 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/" className="inline-flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Back to Home
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="bg-gradient-to-br from-indigo-600 to-blue-600 border-b-2 border-slate-900">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/30 mb-6">
                            <Target className="w-4 h-4 text-white" />
                            <span className="font-black text-white uppercase tracking-widest text-sm">Italy Medical Entrance</span>
                        </div>

                        <h1 className="text-6xl font-black text-white mb-6 tracking-tight">IMAT Preparation</h1>
                        <p className="text-2xl text-white/90 font-medium mb-8 max-w-2xl">
                            Master the International Medical Admissions Test for Italian universities
                        </p>

                        <Link to="/auth">
                            <Button className="h-16 px-8 text-lg font-black bg-yellow-400 hover:bg-yellow-300 text-slate-900 dark:text-slate-100 border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all">
                                Start IMAT Prep
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Exam Overview */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-4 gap-6 mb-20">
                    {[
                        { icon: Clock, label: 'Duration', value: '100 min', color: 'bg-blue-100', iconColor: 'text-blue-600' },
                        { icon: BookOpen, label: 'Questions', value: '60', color: 'bg-green-100', iconColor: 'text-green-600' },
                        { icon: Users, label: 'Candidates', value: '12K+', color: 'bg-purple-100', iconColor: 'text-purple-600' },
                        { icon: Target, label: 'Seats', value: '~1,500', color: 'bg-orange-100', iconColor: 'text-orange-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-card p-6 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl border-2 border-slate-900 flex items-center justify-center mb-4`}>
                                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                            </div>
                            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 dark:text-slate-100">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Syllabus */}
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-8">Exam Structure 📚</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { name: 'General Knowledge & Logic', questions: '22', icon: '🧠', color: 'blue' },
                            { name: 'Biology', questions: '18', icon: '🧬', color: 'green' },
                            { name: 'Chemistry', questions: '12', icon: '⚗️', color: 'purple' },
                            { name: 'Physics & Mathematics', questions: '8', icon: '⚡', color: 'orange' },
                        ].map((section, i) => (
                            <div key={i} className="bg-white dark:bg-card p-8 rounded-[2rem] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">{section.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 dark:text-slate-100">{section.name}</h3>
                                            <span className="text-sm font-bold text-slate-500">{section.questions} Questions</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg border-2 border-slate-900 bg-${section.color}-100 text-${section.color}-900 font-black text-xs`}>
                                        {section.questions}Q
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 py-20">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[3rem] p-12 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-center">
                    <h2 className="text-4xl font-black text-white mb-4">Ready to Start?</h2>
                    <p className="text-xl text-white/90 font-medium mb-8">Join thousands preparing for IMAT</p>
                    <Link to="/auth">
                        <Button className="h-16 px-10 text-lg font-black bg-yellow-400 hover:bg-yellow-300 text-slate-900 dark:text-slate-100 border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all">
                            Begin IMAT Prep
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
