import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
    Microscope, FlaskConical, Zap, Info, Maximize2,
    RotateCcw, Calculator, Brain, ChevronRight, Atom,
    Box, Loader2, X, AlertTriangle, Compass, Activity, PanelLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModelCanvas } from '@/components/labs/ModelCanvas';
import { DNAHelix } from '@/components/labs/subjects/biology/DNAHelix';
import { Button } from '@/components/ui/button';

export default function MobileLabs() {
    const { toast } = useToast();
    const [activeSubject, setActiveSubject] = useState('biology');
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
    const [dbModels, setDbModels] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    useEffect(() => { fetchModels(); }, []);

    const fetchModels = async () => {
        setIsLoading(true);
        const { data } = await (supabase as any).from('lab_models').select('*');
        if (data) {
            setDbModels(data);
            const first = data.find((m: any) => (m.subject || '').toLowerCase().includes(activeSubject));
            if (first) setSelectedModelId(first.id);
        }
        setIsLoading(false);
    };

    const currentModels = useMemo(() => {
        return dbModels.filter(m => (m.subject || '').toLowerCase().includes(activeSubject));
    }, [dbModels, activeSubject]);

    const currentModel = currentModels.find(m => m.id === selectedModelId) || currentModels[0];

    const subjects = [
        { id: 'biology', name: 'Bio', icon: Microscope },
        { id: 'chemistry', name: 'Chem', icon: FlaskConical },
        { id: 'physics', name: 'Phys', icon: Zap },
        { id: 'math', name: 'Math', icon: Calculator }
    ];

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden relative">
            {/* Immersive Viewport */}
            <div className="absolute inset-0 z-0">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-50">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : !currentModel ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-50 text-slate-500 font-black uppercase tracking-[0.2em]">
                        Sector Offline
                    </div>
                ) : (
                    <ModelCanvas environmentType={activeSubject as any}>
                        <DNAHelix />
                    </ModelCanvas>
                )}
            </div>

            {/* Briefing Toggle - Floating */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                    className={`rounded-2xl backdrop-blur-md border ${isLibraryOpen ? 'bg-primary text-white border-primary' : 'bg-white/10 text-white border-white/10'}`}
                >
                    <PanelLeft className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className={`rounded-2xl backdrop-blur-md border ${isInfoOpen ? 'bg-primary text-white border-primary' : 'bg-white/10 text-white border-white/10'}`}
                >
                    <Info className="w-5 h-5" />
                </Button>
            </div>

            {/* Information Overlay */}
            <AnimatePresence>
                {isInfoOpen && currentModel && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="absolute bottom-24 inset-x-4 z-30 p-6 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl"
                    >
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Subject IQ</h3>
                        <p className="text-xs font-bold text-slate-300 leading-relaxed mb-4">{currentModel.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {currentModel.concepts?.map((c: string) => (
                                <span key={c} className="px-2 py-1 bg-white/5 rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/5">{c}</span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar Library */}
            <AnimatePresence>
                {isLibraryOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsLibraryOpen(false)}
                            className="absolute inset-0 z-[40] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                            className="absolute inset-y-0 left-0 w-[80%] z-[50] bg-slate-900 border-r border-white/10 p-6 flex flex-col gap-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-tighter">Lab <span className="text-primary">Vault</span></h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsLibraryOpen(false)}><X /></Button>
                            </div>

                            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                                {subjects.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSubject(s.id)}
                                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeSubject === s.id ? 'bg-primary text-white' : 'bg-white/5 text-slate-400'}`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                                {currentModels.map(sim => (
                                    <button
                                        key={sim.id}
                                        onClick={() => { setSelectedModelId(sim.id); setIsLibraryOpen(false); }}
                                        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${selectedModelId === sim.id ? 'bg-primary border-transparent' : 'bg-white/5 border-white/5'}`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Box size={20} /></div>
                                        <div className="text-left shrink-0 max-w-[150px]">
                                            <h4 className="text-sm font-black uppercase tracking-tight truncate">{sim.model_title}</h4>
                                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">Sim Model VR</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
