-- Migration: secure_test_completion
-- Description: Moves test scoring logic to the server to prevent client-side manipulation.

CREATE OR REPLACE FUNCTION public.complete_test_secure(p_test_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_test RECORD;
    v_exam RECORD;
    v_scoring JSONB;
    v_correct INTEGER := 0;
    v_wrong INTEGER := 0;
    v_skipped INTEGER := 0;
    v_final_score FLOAT := 0;
    v_max_possible_score FLOAT;
    v_score_percentage INTEGER;
BEGIN
    -- 1. Get test details
    SELECT * INTO v_test FROM public.tests WHERE id = p_test_id AND user_id = auth.uid();
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Test not found or access denied';
    END IF;

    -- 2. Get exam scoring config
    SELECT * INTO v_exam FROM public.exams WHERE slug = v_test.exam_type;
    IF NOT FOUND THEN
        -- Fallback to default scoring if exam not found
        v_scoring := '{"correct": 1, "incorrect": 0, "skipped": 0}'::jsonb;
    ELSE
        v_scoring := v_exam.scoring;
    END IF;

    -- 3. Calculate statistics from questions table
    SELECT 
        COUNT(*) FILTER (WHERE user_answer = correct_index) as correct,
        COUNT(*) FILTER (WHERE user_answer IS NOT NULL AND user_answer != correct_index) as wrong,
        COUNT(*) FILTER (WHERE user_answer IS NULL) as skipped
    INTO v_correct, v_wrong, v_skipped
    FROM public.questions
    WHERE test_id = p_test_id;

    -- 4. Calculate score based on exam config
    v_final_score := (v_correct * (v_scoring->>'correct')::float) + 
                     (v_wrong * (v_scoring->>'incorrect')::float) + 
                     (v_skipped * (v_scoring->>'skipped')::float);

    v_max_possible_score := ((v_correct + v_wrong + v_skipped) * (v_scoring->>'correct')::float);
    
    IF v_max_possible_score > 0 THEN
        v_score_percentage := ROUND((v_final_score / v_max_possible_score) * 100);
    ELSE
        v_score_percentage := 0;
    END IF;

    -- 5. Update test record
    UPDATE public.tests
    SET 
        status = 'completed',
        completed_at = now(),
        score = v_score_percentage,
        correct_answers = v_correct,
        wrong_answers = v_wrong,
        skipped_answers = v_skipped,
        active_session_id = NULL,
        last_heartbeat_at = NULL
    WHERE id = p_test_id;

    RETURN jsonb_build_object(
        'status', 'success',
        'score', v_score_percentage,
        'correct', v_correct,
        'wrong', v_wrong,
        'skipped', v_skipped
    );
END;
$$;
