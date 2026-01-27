import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Target, Zap, Clock, User, Award } from 'lucide-react';
import { Card } from "@/components/ui/card";

// Mock data generator since we don't have a direct "get user profile" RPC for public users yet.
// In a real app, we would fetch this from Supabase.
const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-full bg-[#020617] text-white p-6 animate-in fade-in duration-500 pb-20">
            <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent text-white/60 hover:text-white"
            >
                <ArrowLeft className="mr-2" /> Back to Base
            </Button>

            <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full border-4 border-amber-500/50 p-1 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.2)] relative">
                    <div className="absolute -top-4 -right-4 bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border-2 border-[#020617]">
                        Elite
                    </div>
                    <div className="w-full h-full rounded-full bg-secondary overflow-hidden">
                        <User className="w-full h-full p-6 text-white/20" />
                    </div>
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight">Cadet {id?.substring(0, 5)}</h1>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Intelligence Division</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="bg-white/5 border-white/10 p-4 flex flex-col items-center justify-center">
                    <Trophy className="text-amber-500 mb-2" size={24} />
                    <span className="text-2xl font-black">98.5%</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Accuracy</span>
                </Card>
                <Card className="bg-white/5 border-white/10 p-4 flex flex-col items-center justify-center">
                    <Zap className="text-amber-500 mb-2" size={24} />
                    <span className="text-2xl font-black">42</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Day Streak</span>
                </Card>
                <Card className="bg-white/5 border-white/10 p-4 flex flex-col items-center justify-center">
                    <Target className="text-emerald-500 mb-2" size={24} />
                    <span className="text-2xl font-black">1,240</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Solved</span>
                </Card>
                <Card className="bg-white/5 border-white/10 p-4 flex flex-col items-center justify-center">
                    <Clock className="text-cyan-500 mb-2" size={24} />
                    <span className="text-2xl font-black">85h</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Training</span>
                </Card>
            </div>

            <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/40 rounded-[2rem] p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Award className="text-amber-400" />
                    <h3 className="text-lg font-black uppercase tracking-tight">Achievements</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Zap size={18} className="text-amber-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xs uppercase">Rapid Fire</h4>
                            <p className="text-[9px] text-white/40">Solved 100 questions in 1 hour</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Target size={18} className="text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xs uppercase">Sharp Shooter</h4>
                            <p className="text-[9px] text-white/40">100% Accuracy in Biology</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
