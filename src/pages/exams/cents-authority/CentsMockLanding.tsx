import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { 
    Calendar, 
    Clock, 
    Globe, 
    Play, 
    ChevronRight, 
    Zap, 
    Target, 
    ShieldCheck, 
    Loader2, 
    Sparkles,
    Trophy,
    ArrowRight,
    Lock,
    BarChart3,
    FileText,
    Medal,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInHours, differenceInMinutes, isAfter, isBefore } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import SEOHead from '@/components/seo/SEOHead';
import { centsLinks } from '@/lib/nav-links';
import { Link } from 'react-router-dom';

export default function CentsMockLanding() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<string[]>([]);
    const [isRegistering, setIsRegistering] = useState<string | null>(null);

    useEffect(() => {
        fetchSessions();
        if (user) {
            fetchRegistrations();
        }
    }, [user]);

    const fetchSessions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('mock_sessions')
            .select('*')
            .eq('is_active', true)
            .eq('exam_type', 'cent-s-prep')
            .order('start_time', { ascending: false });

        if (error) {
            console.error('Error fetching sessions:', error);
        } else if (data) {
            const now = new Date();
            const processed = data.map((s: any) => {
                const startTime = new Date(s.start_time);
                const endTime = new Date(s.end_time);
                const isLive = isBefore(startTime, now) && isAfter(endTime, now);
                const isPast = isAfter(now, endTime);
                return {
                    ...s,
                    isLive,
                    isPast,
                    isUpcoming: !isLive && !isPast
                };
            });
            setSessions(processed);
        }
        setLoading(false);
    };

    const fetchRegistrations = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('session_registrations')
            .select('session_id')
            .eq('user_id', user.id);

        if (data) {
            setRegistrations(data.map((r: any) => r.session_id));
        }
    };

    const handleStartAction = (session: any) => {
        if (!user) {
            window.location.href = `https://app.italostudy.com/auth?redirect=cent-s-mock-test-free-2026`;
            return;
        }

        if (session.isPast) {
            const params = new URLSearchParams({
                session_id: session.id,
                exam_type: 'cent-s-prep'
            });
            navigate(`/mock-guidelines?${params.toString()}`);
        } else if (registrations.includes(session.id)) {
            navigate(`/waiting-room/${session.id}`);
        } else {
            handleRegister(session.id);
        }
    };

    const handleRegister = async (sessionId: string) => {
        if (!user || isRegistering) return;
        setIsRegistering(sessionId);
        const { error } = await supabase
            .from('session_registrations')
            .insert({
                user_id: user.id,
                session_id: sessionId
            });

        if (!error) {
            setRegistrations([...registrations, sessionId]);
            toast({
                title: "All set!",
                description: "You're registered for this mock test.",
            });
        }
        setIsRegistering(null);
    };

    // Only show past mocks
    const displaySessions = sessions.filter(s => s.isPast);

    return (
        <Layout variant="public">
            <SEOHead 
                title="CEnT-S Mock Test 2026 – Free Official Simulation & Ranking"
                description="Take the free CEnT-S mock test 2026. Realistic 110-minute simulation with 55 questions, +1/-0.25 scoring, and national ranking. Practice for CISIA English Test Science."
                keywords="cent-s mock test, cent s mock test, cents mock test, cents mock exam, cent-s practice test, cent s practice test, cent-s test simulation, cent-s simulator, cent-s preparation, italostudy"
            />

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What exactly is the CENT-S exam?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "CENT-S (CISIA English Test Science) is the primary entrance examination used by top-tier Italian universities for admission to English-taught STEM Bachelor's degrees. It evaluates a student's proficiency in core scientific disciplines including Mathematics, Physics, Chemistry, and Biology, alongside Logic and Verbal Comprehension."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is the structure and question count of the CENT-S?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "The exam is composed of 55 multiple-choice questions. These are strategically divided into sections: Mathematics (20 questions), Logic (10 questions), Physics (10 questions), Chemistry (10 questions), and Biology (5 questions), with an integrated Verbal Comprehension component."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How long is the CENT-S exam and how is time managed?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "The total duration is 110 minutes. Crucially, the exam is section-timed, meaning you have a specific time quota for each subject. Once a section's time expires, you cannot return to it. Our simulations perfectly replicate this section-clock logic."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is the scoring and penalty system for CENT-S?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Scoring follows the official CISIA standard: +1 point for every correct answer, 0 points for questions left blank, and a negative penalty of -0.25 points for every incorrect answer. This makes strategic guessing a vital skill for success."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Are calculators or periodic tables allowed during the test?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "No, the official CENT-S is a 'no-resource' exam. You are not permitted to use calculators, periodic tables, or external notes. Our mock platform highlights this by disabling such tools and providing a digital scratchpad instead."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Which universities in Italy require the CENT-S exam?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Major institutions like the University of Milan, University of Rome Tor Vergata, University of Padua, and many others use the CENT-S for their English-language Engineering and Science programs. Always check the specific call for applications (Bando) of your target university."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How realistic are the Italostudy CENT-S mock tests?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our simulations are built using years of exam data to mirror the exact question-style, difficulty parameters, and digital interface of the actual CISIA platform. Students often report that our mocks are the closest experience to the real test day."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How can I access my CENT-S mock results and analysis?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Immediately upon submission, you receive a comprehensive Performance Report. This includes your raw score, scaled score, section-wise accuracy, and a predicted national ranking based on our community data."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is the best way to prepare for the CENT-S Science sections?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Consistent practice with full-length simulations is key. We recommend taking at least 5-10 mock tests to adapt to the 110-minute pressure and identifying your weakest sections (e.g., Physics or Logic) for targeted review."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "is the CENT-S exam held online or in-person?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "The CENT-S is primarily delivered as a 'TOLC@HOME' online proctored exam or 'TOLC@UNI' at university computer labs. Our platform is optimized to prepare you for either format by mimicking the computer-based testing environment."
                            }
                        }
                    ]
                })}
            </script>

            
            <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
                
                {/* Clean, Non-Intimidating Hero */}
                <div className="relative pt-12 md:pt-24 pb-16 md:pb-32 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white border-b border-indigo-100">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100/50 rounded-full text-indigo-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6 md:mb-8">
                                <Sparkles size={14} className="text-indigo-600" />
                                Expert-Led CENT-S Preparation
                            </div>
                            
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6 md:mb-8">
                                Practice with Confidence. <br/>
                                <span className="text-indigo-600">Succeed with Style.</span>
                            </h1>
                            
                            <p className="text-sm md:text-xl text-slate-600 font-medium mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                                Our simulations aren't just about numbers—they're about giving you the clarity and practice you need to master the CENT-S exam comfortably.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                                <div className="flex items-center gap-2.5 text-slate-500 text-sm font-semibold">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <Users size={16} className="text-indigo-600" />
                                    </div>
                                    <span>Joined by 12,000+ Students</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-500 text-sm font-semibold">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <ShieldCheck size={16} className="text-emerald-600" />
                                    </div>
                                    <span>Realistic Simulation Interface</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid - Clean & Industrial */}
                <div className="py-16 md:py-24 border-b border-slate-100 bg-slate-50/50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
                            {[
                                { 
                                    title: "Real Test Environment", 
                                    desc: "Our platform looks and feels just like the real CISIA portal, so you'll know exactly what to expect.",
                                    icon: Globe,
                                    color: "indigo"
                                },
                                { 
                                    title: "Timed & Sectioned", 
                                    desc: "The full 110-minute experience with section-wise locking, helping you manage your time effectively.",
                                    icon: Clock,
                                    color: "blue"
                                },
                                { 
                                    title: "National Ranking", 
                                    desc: "See how you compare with other students through our predicted ranking system.",
                                    icon: Trophy,
                                    color: "amber"
                                },
                                { 
                                    title: "Detailed Explanations", 
                                    desc: "Get clear, step-by-step solutions for every question to help you learn from your mistakes.",
                                    icon: FileText,
                                    color: "emerald"
                                }
                            ].map((f, i) => (
                                <div key={i} className="flex gap-5 group items-start">
                                    <div className={`w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:border-indigo-600 transition-colors`}>
                                        <f.icon className="text-slate-900 group-hover:text-indigo-600 transition-colors" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 mb-2 truncate md:whitespace-normal">{f.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Gallery Area */}
                <div id="simulators" className="py-12 md:py-24">
                    <div className="container mx-auto px-4">
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 max-w-6xl mx-auto">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Simulator Gallery</h2>
                                <p className="text-sm md:text-base text-slate-500 font-medium">Select a simulation to start practicing under real exam conditions.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                                    {displaySessions.length > 0 ? "Archive sessions available" : "Checking availability..."}
                                </span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
                                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Getting everything ready for you...</p>
                            </div>
                        ) : (
                            <div className="max-w-6xl mx-auto">
                                {displaySessions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {displaySessions.map((session, i) => (
                                            <SimulatorCard 
                                                key={session.id} 
                                                session={session} 
                                                index={displaySessions.length - i}
                                                isNewest={i === 0}
                                                onAction={() => handleStartAction(session)} 
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                                        <p className="text-slate-400 font-bold">The exam archive is currently being updated. Please check back later!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Cluster */}
                <div className="py-24 bg-[#0f172a] text-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
                                    <BarChart3 size={14} />
                                    Your Performance Dashboard
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                                    Learn from Every Mistake. <br/>
                                    Improve with Every Test.
                                </h2>
                                <p className="text-slate-400 font-medium mb-10 leading-relaxed text-lg">
                                    We go beyond simple scores. We analyze your performance to help you identify exactly where you need to improve to reach your target ranking.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        { title: "Score Scaling", desc: "See how your raw performance translates to the final competitive scale." },
                                        { title: "Time Management", desc: "Identify which parts of the test are taking too long and where to speed up." },
                                        { title: "Personal Progress", desc: "Track your improvement over time as you work through different simulations." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                                <p className="text-sm text-slate-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="relative group">
                                <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative bg-slate-800/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 overflow-hidden">
                                     <div className="flex items-center justify-between mb-8">
                                         <div className="flex gap-2">
                                             <div className="w-3 h-3 rounded-full bg-rose-500" />
                                             <div className="w-3 h-3 rounded-full bg-amber-500" />
                                             <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                         </div>
                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Practice Dashboard</span>
                                     </div>
                                     <div className="space-y-6">
                                         <div className="h-4 w-3/4 bg-slate-700/50 rounded-xl" />
                                         <div className="flex gap-4">
                                            <div className="h-20 flex-1 bg-indigo-500/20 rounded-2xl border border-indigo-500/30" />
                                            <div className="h-20 flex-1 bg-slate-700/50 rounded-2xl" />
                                         </div>
                                         <div className="h-4 w-full bg-slate-700/50 rounded-xl" />
                                         <div className="h-4 w-2/3 bg-slate-700/50 rounded-xl" />
                                         <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                 <Trophy size={16} className="text-yellow-400" />
                                                 <span className="text-xs font-black uppercase tracking-widest">Projected Score: 44.2</span>
                                             </div>
                                             <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                 <div className="h-full w-[88%] bg-indigo-500" />
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Links Cluster */}
                <div className="py-24 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Everything You Need to Know</h2>
                            <p className="text-slate-500 font-medium max-w-xl mx-auto">Explore our detailed guides on the CENT-S exam to stay ahead of the curve.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {centsLinks.map((link, i) => {
                                const isStatic = ['/cent-s-mock', '/cent-s-exam-preparation-book-pdf', '/cent-s'].includes(link.path) || link.path.startsWith('http');
                                const Tag = isStatic ? 'a' : Link;
                                const linkProps = isStatic ? { href: link.path } : { to: link.path };
                                return (
                                    <Tag key={i} {...linkProps as any} className="group flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                                                <FileText size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="font-black text-slate-700 text-sm group-hover:text-slate-900">{link.label}</span>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </Tag>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* FAQ Section - Semantic SEO */}
                <div className="py-24 bg-slate-50 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
                            <p className="text-slate-500 font-medium">Everything you need to know about the CENT-S exam and our simulations.</p>
                        </div>
                        <div className="grid gap-6">
                            {[
                                { 
                                    q: "What exactly is the CENT-S exam?", 
                                    a: "CENT-S (CISIA English Test Science) is the official entrance examination for international students applying to English-taught STEM degrees in Italy. It tests your proficiency in Mathematics, Logic, Physics, Chemistry, and Biology." 
                                },
                                { 
                                    q: "What is the exam structure and question count?", 
                                    a: "The test consists of 55 questions in total. This includes Mathematics (20), Logic (10), Physics (10), Chemistry (10), and Biology (5), designed to assess high-school level scientific competency." 
                                },
                                { 
                                    q: "How does the section-timing work?", 
                                    a: "The total time is 110 minutes, but it is strictly allocated per section. You cannot jump between subjects once a section's time is up. Our simulations feature an identical section-clock to train your pacing." 
                                },
                                { 
                                    q: "How is the final score calculated?", 
                                    a: "CISIA uses a +1/-0.25 scoring model. Correct answers earn 1 point, while incorrect ones subtract 0.25. Leaving a question blank results in 0 points. This penalizes blind guessing." 
                                },
                                { 
                                    q: "Can I use any external tools like calculators?", 
                                    a: "No. Calculators, periodic tables, and formulas sheets are strictly prohibited in the real CENT-S. You must rely on mental math and provided digital scratchpads, which we replicate in our mocks." 
                                },
                                { 
                                    q: "Which universities accept the CENT-S score?", 
                                    a: "The CENT-S is accepted by major Italian universities for English programs in Engineering, Biotech, and pure sciences. Popular choices include the University of Milan and Rome Tor Vergata." 
                                },
                                { 
                                    q: "Are the mock tests on Italostudy official?", 
                                    a: "While we are an independent preparation platform, our simulations are expertly crafted to match the question style, difficulty, and technical environment of the official CISIA exams perfectly." 
                                },
                                { 
                                    q: "How will the performance analysis help me?", 
                                    a: "Our advanced dashboard reveals your score benchmarks and provides a predicted national ranking, showing you exactly where you stand compared to thousands of other international applicants." 
                                },
                                { 
                                    q: "Is there a strategy for the Physics and Logic sections?", 
                                    a: "Logic requires rapid pattern recognition, while Physics focuses on fundamental laws. We recommend taking multiple simulations to identify which formulas you need to memorize for these high-speed sections." 
                                },
                                { 
                                    q: "How do I start my first CENT-S simulation?", 
                                    a: "Simply browse our Simulator Gallery above, click 'Start Mock' on any available test, and follow the guidelines. You'll enter a proctored-style environment for the ultimate test prep experience." 
                                }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                                    <h3 className="font-black text-slate-900 mb-4">{faq.q}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Semantic Keyword Cluster */}
                <div className="py-12 bg-white border-t border-slate-50">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 opacity-30 grayscale hover:opacity-100 transition-opacity duration-500">
                            {[
                                "CENT-S Italy", "STEM entrance Italy", "TOLC-S English", "CISIA Science Test", 
                                "Study in Italy STEM", "Engineering Italy Entrance", "Biotech Italy Admission",
                                "Physics Mock CENT-S", "Logic Preparation CENT-S", "Chemistry Past Papers CENT-S",
                                "CENT-S Mock Test Free", "CISIA Official Simulations", "English Science Test Syllabus"
                            ].map((kw, i) => (
                                <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kw}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
}

function SimulatorCard({ session, index, onAction, isNewest }: { session: any, index: number, onAction: () => void, isNewest: boolean }) {
    return (
        <div className={cn(
            "group bg-white rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-100 p-6 md:p-8 flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 relative overflow-hidden",
            isNewest && "border-indigo-600 ring-4 ring-indigo-50 shadow-2xl"
        )}>
            {/* Index & Badge */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Simulator #{index.toString().padStart(2, '0')}
                </div>
                {isNewest ? (
                    <div className="px-3 py-1 bg-indigo-600 rounded-full text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">
                        New
                    </div>
                ) : (
                    <div className="px-3 py-1 bg-slate-100 rounded-full text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Archive
                    </div>
                )}
            </div>

            {/* Content */}
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 leading-[1.2] group-hover:text-indigo-600 transition-colors">
                {session.title}
            </h3>

            <div className="space-y-4 mb-8 md:mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Clock size={14} className="text-slate-400" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        110 Minutes / Sectioned
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Target size={14} className="text-slate-400" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        55 Questions / +1/-0.25 Scoring
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Medal size={14} className="text-slate-400" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Ranking & Analysis Enabled
                    </span>
                </div>
            </div>

            <Button 
                onClick={onAction}
                className={cn(
                    "w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95",
                    "bg-indigo-600 text-white hover:bg-indigo-700"
                )}
            >
                Start Simulation
            </Button>
        </div>
    );
}
