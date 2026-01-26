import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { ChevronRight, Sparkles, BookOpen, Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MobileSubjects() {
    const { user } = useAuth();
    const { activeExam } = useExam();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && activeExam) fetchSubjectStats();
    }, [user, activeExam.id]);

    const fetchSubjectStats = async () => {
        const { data: perfData } = await (supabase as any)
            .from('topic_performance')
            .select('*')
            .eq('exam_type', activeExam.id);

        const masteryMap: Record<string, any> = {};
        if (perfData) {
            perfData.forEach((p: any) => {
                if (!masteryMap[p.subject]) masteryMap[p.subject] = { solved: 0, correct: 0 };
                masteryMap[p.subject].solved += p.total_questions;
                masteryMap[p.subject].correct += p.correct_answers;
            });
        }

        const subjectStats = activeExam.sections.map((section: any) => ({
            subject: section.name,
            icon: section.icon,
            color: section.color,
            accuracy: masteryMap[section.name]?.solved > 0
                ? Math.round((masteryMap[section.name].correct / masteryMap[section.name].solved) * 100)
                : 0,
            solved: masteryMap[section.name]?.solved || 0
        }));

        setStats(subjectStats);
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-full bg-background pb-32 animate-in fade-in duration-500">
            {/* Native Header Section */}
            <header className="p-8 pt-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Knowledge Repository</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight uppercase leading-none">{activeExam.id.split('-')[0]} <br /><span className="text-primary">Syllabus</span></h1>
                <p className="text-xs font-bold text-muted-foreground mt-4 opacity-60 uppercase tracking-tight">Mission curriculum & performance index</p>
            </header>

            {/* Subject Grid */}
            <div className="px-4 grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
                ) : (
                    stats.map((stat, i) => (
                        <Card
                            key={i}
                            onClick={() => navigate(`/mobile/dashboard?subject=${stat.subject}`)}
                            className="bg-secondary/20 border-border/40 rounded-[2.5rem] overflow-hidden active:scale-[0.98] transition-all group border-b-4 hover:border-primary/40"
                        >
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-background border border-border/50 flex items-center justify-center text-3xl shadow-sm group-hover:rotate-6 transition-transform">
                                    {stat.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-black text-lg uppercase tracking-tight">{stat.subject}</h3>
                                        <span className="text-[10px] font-black text-primary">{stat.accuracy}%</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${stat.accuracy}%` }} />
                                        </div>
                                        <span className="text-[8px] font-black text-muted-foreground uppercase opacity-60">{stat.solved} Missions</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30 group-hover:text-primary transition-colors" />
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Interactive Footer Banner */}
            <div className="px-4 mt-8">
                <div className="bg-foreground text-background p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><BookOpen size={80} /></div>
                    <h4 className="text-xl font-black uppercase tracking-tight relative z-10 leading-tight">Master <br />The Matrix</h4>
                    <p className="text-[10px] font-bold uppercase opacity-60 mt-2 relative z-10">Neural-link optimization enabled</p>
                    <Button variant="secondary" className="mt-4 rounded-xl bg-white text-black hover:bg-white/90 font-black text-[10px] uppercase tracking-widest px-6 h-10">Protocol Help</Button>
                </div>
            </div>
        </div>
    );
}
