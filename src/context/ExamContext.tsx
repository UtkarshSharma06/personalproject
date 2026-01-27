import React, { createContext, useContext, useState, useEffect } from 'react';
import { ExamConfig, EXAMS } from '../config/exams';
import { useAuth } from '../lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface ExamContextType {
    activeExam: ExamConfig;
    setActiveExam: (examId: string) => Promise<void>;
    isLoading: boolean;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { profile, loading: authLoading } = useAuth();
    const [activeExam, setActiveExamState] = useState<ExamConfig>(EXAMS['cent-s-prep']);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Sync from Profile or LocalStorage
    useEffect(() => {
        if (!authLoading) {
            const savedExamId = localStorage.getItem('activeExamId');
            const profileExamId = profile?.selected_exam;

            // Priority: Profile > LocalStorage > Default
            const targetExamId = profileExamId || savedExamId;

            if (targetExamId && EXAMS[targetExamId]) {
                setActiveExamState(EXAMS[targetExamId]);
            }
            setIsLoading(false);
        }
    }, [authLoading, profile?.selected_exam]);

    const setActiveExam = async (examId: string) => {
        if (EXAMS[examId]) {
            setActiveExamState(EXAMS[examId]);
            localStorage.setItem('activeExamId', examId);

            // Persist to Profile if logged in
            if (profile?.id) {
                const { error } = await supabase
                    .from('profiles')
                    .update({ selected_exam: examId })
                    .eq('id', profile.id);

                if (error) {
                    console.error('Error persisting exam selection:', error);
                }
            }
        }
    };

    return (
        <ExamContext.Provider value={{ activeExam, setActiveExam, isLoading: isLoading || authLoading }}>
            {children}
        </ExamContext.Provider>
    );
};

export const useExam = () => {
    const context = useContext(ExamContext);
    if (context === undefined) {
        throw new Error('useExam must be used within an ExamProvider');
    }
    return context;
};
