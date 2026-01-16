import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export function usePlanAccess() {
    const { profile, user } = useAuth();
    const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({});
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const plan = profile?.selected_plan || 'explorer';
    const isExplorer = plan === 'explorer';
    const isPro = plan === 'pro' || plan === 'elite';
    const isElite = plan === 'elite';

    useEffect(() => {
        if (user) {
            fetchDailyPracticeCount();
        }
    }, [user]);

    const fetchDailyPracticeCount = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isoToday = today.toISOString();

        try {
            const [practiceRes, readingRes, listeningRes, writingRes] = await Promise.all([
                supabase.from('user_practice_responses').select('subject').eq('user_id', user?.id).gte('created_at', isoToday),
                supabase.from('reading_submissions').select('id').eq('user_id', user?.id).gte('created_at', isoToday).eq('status', 'completed'),
                supabase.from('listening_submissions').select('id').eq('user_id', user?.id).gte('created_at', isoToday).eq('status', 'completed'),
                supabase.from('writing_submissions').select('id').eq('user_id', user?.id).gte('submitted_at', isoToday).eq('status', 'completed')
            ]);

            const counts: Record<string, number> = {};
            let total = 0;

            if (practiceRes.data) {
                practiceRes.data.forEach((r: any) => {
                    counts[r.subject] = (counts[r.subject] || 0) + 1;
                    total++;
                });
            }

            // Treat each completed IELTS section as a full daily quota for that subject
            if (readingRes.data && readingRes.data.length > 0) {
                counts['Academic Reading'] = 15;
                total += 15;
            }
            if (listeningRes.data && listeningRes.data.length > 0) {
                counts['Listening'] = 15;
                total += 15;
            }
            if (writingRes.data && writingRes.data.length > 0) {
                counts['Academic Writing'] = 15;
                total += 15;
            }

            setSubjectCounts(counts);
            setTotalCount(total);
        } catch (err) {
            console.error('Error fetching daily count:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getSubjectCount = (subject: string) => {
        return subjectCounts[subject] || 0;
    };

    const getRemainingQuestions = (subject: string) => {
        if (!isExplorer) return 999;
        return Math.max(0, 15 - getSubjectCount(subject));
    };

    const hasReachedSubjectLimit = (subject: string) => {
        if (!isExplorer) return false;
        return getRemainingQuestions(subject) <= 0;
    };

    const checkAccess = (feature: 'practice' | 'explanations' | 'mocks' | 'chat', subject?: string) => {
        if (plan === 'elite') return true;

        switch (feature) {
            case 'practice':
                if (subject) return !hasReachedSubjectLimit(subject);
                return isExplorer ? totalCount < 45 : true; // Fallback total limit if no subject
            case 'explanations':
                return !isExplorer;
            case 'mocks':
                return !isExplorer;
            case 'chat':
                return true;
            default:
                return true;
        }
    };

    return {
        plan,
        isExplorer,
        isPro,
        isElite,
        totalCount,
        subjectCounts,
        practiceLimit: 15,
        getSubjectCount,
        getRemainingQuestions,
        hasReachedSubjectLimit,
        checkAccess,
        isLoading,
        refreshLimit: fetchDailyPracticeCount
    };
}
