-- Fix: Prevent store orders from overwriting user subscription plans
-- Date: 2026-04-29

CREATE OR REPLACE FUNCTION verify_payment(
    p_transaction_id UUID,
    p_provider_transaction_id TEXT,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_plan_id TEXT;
    v_user_id UUID;
    v_tier TEXT;
BEGIN
    -- Update transaction status and get details
    UPDATE transactions
    SET status = 'completed',
        provider_transaction_id = p_provider_transaction_id,
        metadata = p_metadata
    WHERE id = p_transaction_id AND user_id = auth.uid()
    RETURNING plan_id, user_id INTO v_plan_id, v_user_id;

    IF v_plan_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Transaction not found');
    END IF;

    -- ─── SPECIAL HANDLING FOR STORE ORDERS ───
    -- If this is a store order, we mark the transaction complete but DO NOT touch the profile plan
    IF v_plan_id = 'STORE_ORDER' THEN
        RETURN jsonb_build_object(
            'success', true, 
            'plan', v_plan_id,
            'is_store_order', true,
            'message', 'Store payment verified. Profile plan unchanged.'
        );
    END IF;

    -- Map plan to tier for backward compatibility
    -- global/elite -> global, pro -> pro, explorer -> free
    CASE v_plan_id
        WHEN 'global' THEN v_tier := 'global';
        WHEN 'elite' THEN v_tier := 'global';
        WHEN 'pro' THEN v_tier := 'pro';
        ELSE v_tier := 'free';
    END CASE;

    -- Update user's plan AND subscription_tier
    UPDATE profiles
    SET selected_plan = v_plan_id,
        subscription_tier = v_tier
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'success', true, 
        'plan', v_plan_id,
        'tier', v_tier,
        'message', 'Plan updated successfully'
    );
END;
$$;

-- Cleanup: Reset any users who accidentally got 'STORE_ORDER' as their plan
UPDATE profiles 
SET selected_plan = 'explorer', 
    subscription_tier = 'free' 
WHERE selected_plan = 'STORE_ORDER';
