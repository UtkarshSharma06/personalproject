import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface MandatoryFeedbackState {
    showFeedback: boolean;
    loading: boolean;
}

export function useMandatoryFeedback() {
    const { user } = useAuth();
    const [state, setState] = useState<MandatoryFeedbackState>({
        showFeedback: false,
        loading: true
    });

    useEffect(() => {
        checkFeedbackRequirement();
    }, [user]);

    const checkFeedbackRequirement = async () => {
        if (!user) {
            setState({ showFeedback: false, loading: false });
            return;
        }

        try {
            // Get user profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('created_at, has_submitted_initial_feedback')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            // Check if user has already submitted feedback
            if (profile?.has_submitted_initial_feedback) {
                setState({ showFeedback: false, loading: false });
                return;
            }

            // Calculate days since signup
            const createdAt = new Date(profile?.created_at || user.created_at);
            const now = new Date();
            const daysSinceSignup = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

            // Show feedback modal if >= 2 days and hasn't submitted
            setState({
                showFeedback: daysSinceSignup >= 2,
                loading: false
            });
        } catch (error) {
            console.error('Error checking feedback requirement:', error);
            setState({ showFeedback: false, loading: false });
        }
    };

    const markFeedbackComplete = () => {
        setState({ showFeedback: false, loading: false });
    };

    return {
        showFeedback: state.showFeedback,
        loading: state.loading,
        markFeedbackComplete,
        refreshCheck: checkFeedbackRequirement
    };
}
