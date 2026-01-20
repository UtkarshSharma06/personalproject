-- Migration: Create RPC function to get top champions by practice questions solved
-- This function counts total practice questions answered by each user with real accuracy

-- Drop existing function first to allow changing return type
DROP FUNCTION IF EXISTS public.get_champions_by_questions_solved();

CREATE OR REPLACE FUNCTION public.get_champions_by_questions_solved()
RETURNS TABLE (
    user_id UUID,
    display_name TEXT,
    avatar_url TEXT,
    questions_solved BIGINT,
    total_questions BIGINT,
    accuracy NUMERIC,
    rank_position BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            p.id AS user_id,
            p.display_name,
            p.avatar_url,
            p.selected_exam,
            COUNT(DISTINCT upr.id) AS questions_solved,
            COUNT(DISTINCT CASE WHEN upr.is_correct = true THEN upr.id END) AS correct_answers
        FROM 
            public.profiles p
        LEFT JOIN 
            public.user_practice_responses upr ON upr.user_id = p.id
        WHERE 
            p.is_banned = false
            AND upr.is_correct IS NOT NULL
        GROUP BY 
            p.id, p.display_name, p.avatar_url, p.selected_exam
        HAVING 
            COUNT(DISTINCT upr.id) > 0
    ),
    exam_totals AS (
        SELECT 
            exam_type,
            COUNT(*) AS total_questions
        FROM 
            public.practice_questions
        GROUP BY 
            exam_type
    )
    SELECT 
        us.user_id,
        us.display_name,
        us.avatar_url,
        us.questions_solved,
        COALESCE(et.total_questions, 0) AS total_questions,
        ROUND((us.correct_answers::NUMERIC / NULLIF(us.questions_solved, 0)) * 100, 1) AS accuracy,
        ROW_NUMBER() OVER (ORDER BY us.questions_solved DESC) AS rank_position
    FROM 
        user_stats us
    LEFT JOIN 
        exam_totals et ON et.exam_type = us.selected_exam
    ORDER BY 
        us.questions_solved DESC
    LIMIT 10;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_champions_by_questions_solved() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_champions_by_questions_solved() TO service_role;
