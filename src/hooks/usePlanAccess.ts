import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export function usePlanAccess() {
    const { profile, user } = useAuth();
    const [practiceCount, setPracticeCount] = useState<number>(0);
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

        try {
            const { count, error } = await (supabase as any)
                .from('user_practice_responses')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user?.id)
                .gte('created_at', today.toISOString());

            if (!error) {
                setPracticeCount(count || 0);
            }
        } catch (err) {
            console.error('Error fetching daily count:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const checkAccess = (feature: 'practice' | 'explanations' | 'mocks' | 'chat') => {
        if (plan === 'elite') return true;

        switch (feature) {
            case 'practice':
                return isExplorer ? practiceCount < 15 : true;
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
        practiceCount,
        practiceLimit: 15,
        hasReachedPracticeLimit: isExplorer && practiceCount >= 15,
        checkAccess,
        isLoading,
        refreshLimit: fetchDailyPracticeCount
    };
}
