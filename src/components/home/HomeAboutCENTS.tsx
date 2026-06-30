import { motion } from 'framer-motion';
import { Target, Info, BookOpen, Clock, Activity, ArrowRight } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';

const HomeAboutCENTS = () => {
    const { t } = useTranslation();

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="about-cents">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-8"
                    >
                        <Target className="w-4 h-4 text-emerald-600" />
                        <EditableText
                            fieldKey="about_cents_badge"
                            fallback={t('landing.about_cents.badge', 'Global Authority Cluster')}
                            className="text-[11px] font-black text-emerald-600 uppercase tracking-widest"
                        />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">
                        <EditableText
                            fieldKey="about_cents_title"
                            fallback={t('landing.about_cents.title', 'Ultimate Guide to the CENT-S Exam 2026')}
                        />
                    </h2>

                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-8">
                        <p>
                            <EditableText
                                fieldKey="about_cents_p1"
                                fallback={t('landing.about_cents.p1', "Navigating the landscape of medical entrance preparation Europe can be daunting, but for students aiming for Italian public universities, the CENT-S exam 2026 stands as the most critical milestone. Organized by CISIA, the CENT-S (CEnT-S) is the standard entrance qualification for international medical programs taught in English across Italy's most prestigious institutions, including Sapienza University of Rome and the University of Milan.")}
                                multiline
                            />
                        </p>

                        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 md:p-12 my-12">
                            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Info className="text-emerald-500" />
                                <EditableText
                                    fieldKey="about_cents_struct_title"
                                    fallback={t('landing.about_cents.struct_title', 'Exam Structure & Scoring')}
                                />
                            </h3>
                            <p className="mb-6">
                                <EditableText
                                    fieldKey="about_cents_struct_p1"
                                    fallback={t('landing.about_cents.struct_p1', 'The 2026 session of the CEnT-S follows a rigorous 90-minute format containing 60 multiple-choice questions. Understanding the weight of each section is key to your IMAT practice test strategy:')}
                                    multiline
                                />
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { key: 'bio', label: t('landing.about_cents.stat_bio_label', "Biology"), value: t('landing.about_cents.stat_bio_val', "23 Questions"), icon: <Activity className="w-4 h-4" /> },
                                    { key: 'chem', label: t('landing.about_cents.stat_chem_label', "Chemistry"), value: t('landing.about_cents.stat_chem_val', "15 Questions"), icon: <Activity className="w-4 h-4" /> },
                                    { key: 'phys', label: t('landing.about_cents.stat_phys_label', "Physics & Math"), value: t('landing.about_cents.stat_phys_val', "13 Questions"), icon: <Activity className="w-4 h-4" /> },
                                    { key: 'logic', label: t('landing.about_cents.stat_logic_label', "Logic & General Culture"), value: t('landing.about_cents.stat_logic_val', "9 Questions"), icon: <Activity className="w-4 h-4" /> }
                                ].map((item, i) => (
                                    <div key={item.key} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-slate-400">
                                                <EditableText fieldKey={`about_cents_stat_${item.key}_label`} fallback={item.label} />
                                            </p>
                                            <p className="text-sm font-bold text-slate-900">
                                                <EditableText fieldKey={`about_cents_stat_${item.key}_val`} fallback={item.value} />
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-sm text-emerald-800 font-bold">
                                <EditableText
                                    fieldKey="about_cents_scoring_note"
                                    fallback={t('landing.about_cents.scoring_note', 'Scoring System: +1 point for correct answers, -0.25 points for incorrect answers, and 0 points for skipped questions.')}
                                    multiline
                                />
                            </div>
                        </div>

                        <p>
                            <EditableText
                                fieldKey="about_cents_p2"
                                fallback={t('landing.about_cents.p2', 'At ItaloStudy, we provide a free mock exams suite specifically calibrated to the 2026 difficulty level. Unlike generic resources, our test engine mirrors the exact pressure and cognitive load of the official CISIA environment. Our database of over 10,000 practice questions ensures that no topic—from molecular biology to complex reasoning on texts—is left untouched.')}
                                multiline
                            />
                        </p>

                        <p>
                            <EditableText
                                fieldKey="about_cents_p3"
                                fallback={t('landing.about_cents.p3', "Preparing for the CENT-S exam 2026 requires more than just memorization; it demands strategic speed and precise accuracy. Our simulator's internal data shows that the 'Reasoning on Texts and Data' section remains the primary bottleneck for 85% of candidates. By integrating detailed analytics and adaptive difficulty, we help you master the nuances of the CISIA curriculum before you even walk into the test center.")}
                                multiline
                            />
                        </p>

                        <div className="flex flex-wrap gap-4 pt-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                                <Clock className="w-3.5 h-3.5" />
                                <EditableText
                                    fieldKey="about_cents_duration"
                                    fallback={t('landing.about_cents.duration', '90 Minutes Duration')}
                                />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                                <BookOpen className="w-3.5 h-3.5" />
                                <EditableText
                                    fieldKey="about_cents_questions"
                                    fallback={t('landing.about_cents.questions', '60 Multiple Choice Qs')}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 my-12">
                            <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                                <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                                    <EditableText
                                        fieldKey="about_cents_strat_title"
                                        fallback={t('landing.about_cents.strat_title', 'Section-Wise Strategy')}
                                    />
                                </h4>
                                <ul className="space-y-3 text-sm font-bold text-slate-600">
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" /> <EditableText fieldKey="about_cents_strat_1" fallback={t('landing.about_cents.strat_1', 'Logic: 1.5 mins per question. Focus on pattern recognition.')} /></li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" /> <EditableText fieldKey="about_cents_strat_2" fallback={t('landing.about_cents.strat_2', 'Biology: 45 seconds per question. Quick recall is key.')} /></li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" /> <EditableText fieldKey="about_cents_strat_3" fallback={t('landing.about_cents.strat_3', 'Chemistry: 1.2 mins per question. Calculations first.')} /></li>
                                </ul>
                            </div>
                            <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                                <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                                    <EditableText
                                        fieldKey="about_cents_score_title"
                                        fallback={t('landing.about_cents.score_title', "Safe Score Analysis")}
                                    />
                                </h4>
                                <p className="text-sm font-bold text-slate-600 mb-4">
                                    <EditableText
                                        fieldKey="about_cents_score_desc"
                                        fallback={t('landing.about_cents.score_desc', 'Historical data for 2024/2025 indicates:')}
                                    />
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest"><span className="text-slate-400"><EditableText fieldKey="about_cents_score_uni1_label" fallback={t('landing.about_cents.score_uni1_label', 'Sapienza/Milan')} /></span> <span className="text-indigo-600"><EditableText fieldKey="about_cents_score_uni1_val" fallback={t('landing.about_cents.score_uni1_val', '52+ Points')} /></span></div>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest"><span className="text-slate-400"><EditableText fieldKey="about_cents_score_uni2_label" fallback={t('landing.about_cents.score_uni2_label', 'Bologna/Pavia')} /></span> <span className="text-indigo-600"><EditableText fieldKey="about_cents_score_uni2_val" fallback={t('landing.about_cents.score_uni2_val', '48+ Points')} /></span></div>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest"><span className="text-slate-400"><EditableText fieldKey="about_cents_score_uni3_label" fallback={t('landing.about_cents.score_uni3_label', 'Other Public Unis')} /></span> <span className="text-indigo-600"><EditableText fieldKey="about_cents_score_uni3_val" fallback={t('landing.about_cents.score_uni3_val', '42+ Points')} /></span></div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mt-16 mb-6">
                            <EditableText
                                fieldKey="about_cents_fail_title"
                                fallback={t('landing.about_cents.fail_title', 'Why Students Fail the CENT-S Exam')}
                            />
                        </h3>
                        <p>
                            <EditableText
                                fieldKey="about_cents_fail_p1"
                                fallback={t('landing.about_cents.fail_p1', "Statistically, failure on the CENT-S exam 2026 is rarely due to a lack of scientific knowledge. Our analytics from 45,000+ mock attempts show that 68% of lost points come from 'Blind Guessing' and 'Time Fatigue.' Students often spend too long on a single logic puzzle, leaving them with less than 30 seconds for critical biology questions at the end of the paper.")}
                                multiline
                            />
                        </p>

                        <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] my-8">
                            <h4 className="flex items-center gap-2 text-rose-900 font-black uppercase tracking-widest text-sm mb-4">
                                <Target className="w-4 h-4" />
                                <EditableText
                                    fieldKey="about_cents_skip_title"
                                    fallback={t('landing.about_cents.skip_title', "The 'Aggressive Skipping' Method")}
                                />
                            </h4>
                            <p className="text-rose-800 text-sm font-bold mb-0 leading-relaxed">
                                <EditableText
                                    fieldKey="about_cents_skip_p1"
                                    fallback={t('landing.about_cents.skip_p1', "Our simulator trains you to identify and skip 'Time Vampire' questions instantly. In a penalty-based scoring system (-0.25), skipping a question is often more profitable than guessing.")}
                                    multiline
                                />
                            </p>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mt-16 mb-6">
                            <EditableText
                                fieldKey="about_cents_comp_title"
                                fallback={t('landing.about_cents.comp_title', 'CENT-S vs IMAT: A Difficulty Comparison')}
                            />
                        </h3>
                        <p>
                            <EditableText
                                fieldKey="about_cents_comp_p1"
                                fallback={t('landing.about_cents.comp_p1', "Many candidates ask: Is the CENT-S harder than the IMAT? While the syllabus is nearly identical, the CEnT-S (CISIA) format places a higher emphasis on Reasoning on Texts and Data. The IMAT traditionally featured more complex General Knowledge questions, whereas the 2026 CEnT-S focuses on the application of scientific principles in a time-sensitive environment.")}
                                multiline
                            />
                        </p>

                        <div className="pt-10 flex flex-col sm:flex-row gap-6">
                            <Link to="/syllabus" className="group flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-sm">
                                <EditableText
                                    fieldKey="about_cents_cta1"
                                    fallback={t('landing.about_cents.cta1', 'Explore the 2026 Syllabus')}
                                />
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="/resources" className="group flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-sm">
                                <EditableText
                                    fieldKey="about_cents_cta2"
                                    fallback={t('landing.about_cents.cta2', 'Access Free Study Resources')}
                                />
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeAboutCENTS;
