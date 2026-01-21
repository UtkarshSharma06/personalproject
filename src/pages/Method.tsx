import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Target, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

export default function Method() {
    const steps = [
        {
            number: '01',
            title: 'Diagnostic Phase',
            icon: Target,
            description: 'We identify your cognitive profile across all scientific domains with a comprehensive initial diagnostic assessment.',
            color: 'bg-slate-50',
            iconColor: 'text-slate-600'
        },
        {
            number: '02',
            title: 'Smart Logic Training',
            icon: Brain,
            description: 'Our proprietary learning engine generates personalized item sets targeting your specific architectural weaknesses.',
            color: 'bg-indigo-50',
            iconColor: 'text-indigo-600'
        },
        {
            number: '03',
            title: 'Cognitive Retention',
            icon: TrendingUp,
            description: 'Items reappear at mathematically optimal intervals to ensure permanent knowledge integration.',
            color: 'bg-slate-50',
            iconColor: 'text-slate-600'
        },
        {
            number: '04',
            title: 'Arena Simulations',
            icon: Zap,
            description: 'Execute high-pressure mock sessions under official exam conditions with live proctoring protocols.',
            color: 'bg-indigo-50',
            iconColor: 'text-indigo-600'
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-card font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <SEO
                title="Our Methodology | The ItaloStudy Standard"
                description="Discover our 4-step cognitive framework engineered to accelerate expertise in medical sciences. Diagnostic, Training, Retention, and Simulation."
                keywords="ItaloStudy Method, Cognitive Framework, Medical Exam Preparation, Smart Logic Training, Exam Simulation"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "ItaloStudy Methodology",
                    "description": "A multi-layered cognitive framework engineered to accelerate expertise in medical sciences.",
                    "url": "https://italostudy.com/method",
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://italostudy.com"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Methodology",
                                "item": "https://italostudy.com/method"
                            }
                        ]
                    }
                }}
            />
            {/* Header (Sleek Modern) */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-50 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-5">
                    <Link to="/" className="inline-flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Return to Base
                    </Link>
                </div>
            </div>

            {/* Hero (Sleek Modern) */}
            <section className="container mx-auto px-6 py-24 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(circle_at_50%_40%,#eef2ff_0%,transparent_70%)] opacity-50 -z-10" />

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 mb-8 animate-in slide-in-from-bottom-4 duration-700">
                    <Brain className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-black text-indigo-900 uppercase tracking-widest text-[9px]">Methodology Protocol</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-slate-100 mb-8 tracking-tighter leading-tight animate-in slide-in-from-bottom-8 duration-1000 uppercase">
                    The ITALOSTUDY <span className="text-indigo-600">Standard</span>
                </h1>
                <p className="text-xl text-slate-400 font-bold max-w-2xl mx-auto mb-6 tracking-tight leading-relaxed animate-in slide-in-from-bottom-12 duration-1000">
                    A multi-layered cognitive framework engineered to accelerate expertise in medical sciences.
                </p>
            </section>

            {/* Steps (Sleek Modern) */}
            <section className="container mx-auto px-6 pb-32">
                <div className="max-w-5xl mx-auto space-y-8">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-card p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-50 shadow-sm hover:border-slate-200 dark:border-border hover:shadow-2xl hover:shadow-indigo-50/50 transition-all duration-700 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                                <step.icon className="w-40 h-40" />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                                {/* Number Badge */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-slate-200">
                                        <span className="text-4xl font-black tracking-tighter">{step.number}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
                                        <div className={`w-14 h-14 md:w-16 md:h-16 ${step.color} rounded-2xl flex items-center justify-center border border-transparent group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500`}>
                                            <step.icon className="w-6 h-6 md:w-7 md:h-7" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase">{step.title}</h2>
                                    </div>
                                    <p className="text-lg text-slate-400 font-bold leading-relaxed tracking-tight max-w-2xl">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA (Sleek Modern) */}
            <section className="container mx-auto px-6 pb-24 md:pb-32">
                <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-16 lg:p-24 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(99,102,241,0.2),transparent_70%)]" />

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-none relative z-10 uppercase">Experience <br />The protocol</h2>
                    <p className="text-xl text-indigo-200/50 font-bold mb-12 max-w-2xl mx-auto uppercase tracking-widest text-sm relative z-10">
                        Join the elite tier of students using ITALOSTUDY.
                    </p>
                    <Link to="/auth" className="relative z-10">
                        <Button className="h-20 px-12 text-[11px] font-black bg-white dark:bg-card text-slate-900 dark:text-slate-100 rounded-2xl uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/10">
                            INITIALIZE ENROLLMENT
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
