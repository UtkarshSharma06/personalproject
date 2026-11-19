-- ==============================================================================
-- ITALOSTUDY SECURITY AUDIT HARDENING MIGRATION
-- Migration: 20261115000000_security_audit_hardening.sql
-- Description: Comprehensive database-level defenses against client-side bypasses,
--              IDOR vulnerabilities, privilege escalation, and unauthorized updates.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CRITICAL: PREVENT DIRECT CLIENT-SIDE UPDATES TO SENSITIVE PROFILE COLUMNS
--    Blocks unauthorized updates to: selected_plan, subscription_tier, 
--    subscription_expiry_date, role, is_consultant from the client browser console.
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.protect_sensitive_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_is_admin BOOLEAN := FALSE;
BEGIN
    -- Allow service_role (backend edge functions / webhooks) to modify everything
    IF current_user = 'service_role' OR auth.role() = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Check if current authenticated user is an administrator
    IF v_caller_id IS NOT NULL THEN
        SELECT (role IN ('admin', 'sub_admin')) INTO v_is_admin
        FROM public.profiles
        WHERE id = v_caller_id;
    END IF;

    -- If caller is admin, allow modification
    IF v_is_admin THEN
        RETURN NEW;
    END IF;

    -- For normal users, prohibit modifying subscription and privilege fields
    IF NEW.selected_plan IS DISTINCT FROM OLD.selected_plan THEN
        RAISE EXCEPTION 'Access Denied: Changing selected_plan requires verified server-side payment processing.';
    END IF;

    IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
        RAISE EXCEPTION 'Access Denied: Changing subscription_tier requires verified server-side payment processing.';
    END IF;

    IF NEW.subscription_expiry_date IS DISTINCT FROM OLD.subscription_expiry_date THEN
        RAISE EXCEPTION 'Access Denied: Changing subscription_expiry_date requires verified server-side payment processing.';
    END IF;

    IF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Access Denied: You cannot elevate user roles.';
    END IF;

    IF NEW.is_consultant IS DISTINCT FROM OLD.is_consultant THEN
        RAISE EXCEPTION 'Access Denied: Changing consultant status requires authorization protocol.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_sensitive_profile_fields ON public.profiles;

CREATE TRIGGER trg_protect_sensitive_profile_fields
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_sensitive_profile_fields();

-- ------------------------------------------------------------------------------
-- 2. SECURE EXPLORER / FREE DOWNGRADE RPC
--    Allows authenticated users to legitimately switch their profile to Explorer.
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.switch_to_explorer_plan()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_user_id UUID := auth.uid();
BEGIN
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Authentication required.');
    END IF;

    -- Temporarily set context to bypass trigger if needed or perform update
    UPDATE public.profiles
    SET selected_plan = 'explorer',
        subscription_tier = 'explorer',
        updated_at = NOW()
    WHERE id = v_user_id;

    RETURN jsonb_build_object('success', true, 'message', 'Switched to Explorer plan.');
END;
$$;

GRANT EXECUTE ON FUNCTION public.switch_to_explorer_plan() TO authenticated;

-- ------------------------------------------------------------------------------
-- 3. CRITICAL: REVOKE DIRECT CLIENT EXECUTION OF UNVERIFIED verify_payment
--    Client must NOT be able to call verify_payment directly with fake IDs.
--    Only backend edge functions (verify-dodo-payment, razorpay-webhook) can run it.
-- ------------------------------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.proname = 'verify_payment'
    ) THEN
        REVOKE EXECUTE ON FUNCTION public.verify_payment(UUID, TEXT) FROM anon, authenticated, public;
        GRANT EXECUTE ON FUNCTION public.verify_payment(UUID, TEXT) TO service_role;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. HIGH: HARDEN RPC FUNCTIONS AGAINST IDOR (USE auth.uid() INTERNALLY)
--    check_practice_limit, check_mock_limit, can_view_expert_explanations,
--    check_concierge_access, get_unread_counts, has_unread_messages.
-- ------------------------------------------------------------------------------

-- 4.1 Practice Limit Check
CREATE OR REPLACE FUNCTION public.check_practice_limit(user_uuid UUID DEFAULT NULL)
RETURNS JSON 
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_target_user UUID;
    v_is_admin BOOLEAN := FALSE;
    user_plan TEXT;
    today_count INTEGER;
    daily_limit INTEGER;
BEGIN
    IF v_caller_id IS NULL THEN
        RETURN json_build_object('allowed', false, 'remaining', 0, 'limit', 15, 'used', 0, 'plan', 'explorer', 'error', 'Unauthenticated');
    END IF;

    -- Check admin status if requesting for a different user
    IF user_uuid IS NOT NULL AND user_uuid != v_caller_id THEN
        SELECT (role IN ('admin', 'sub_admin')) INTO v_is_admin FROM public.profiles WHERE id = v_caller_id;
        IF v_is_admin THEN
            v_target_user := user_uuid;
        ELSE
            -- Reject spoofing; force target to authenticated caller
            v_target_user := v_caller_id;
        END IF;
    ELSE
        v_target_user := v_caller_id;
    END IF;

    -- Get target user's plan
    SELECT LOWER(COALESCE(selected_plan, 'explorer')) INTO user_plan 
    FROM public.profiles WHERE id = v_target_user;
    
    daily_limit := CASE
        WHEN user_plan IN ('global', 'elite', 'pro', 'global admission plan') THEN 999999
        ELSE 15
    END;
    
    SELECT COUNT(*)::INTEGER INTO today_count
    FROM public.user_practice_responses
    WHERE user_id = v_target_user
      AND created_at::DATE = CURRENT_DATE;
    
    RETURN json_build_object(
        'allowed', today_count < daily_limit,
        'remaining', GREATEST(0, daily_limit - today_count),
        'limit', daily_limit,
        'used', today_count,
        'plan', user_plan
    );
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.check_practice_limit(UUID) TO authenticated;

-- 4.2 Mock Exam Limit Check
CREATE OR REPLACE FUNCTION public.check_mock_limit(user_uuid UUID DEFAULT NULL)
RETURNS JSON 
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_target_user UUID;
    v_is_admin BOOLEAN := FALSE;
    user_plan TEXT;
    month_count INTEGER;
    monthly_limit INTEGER;
BEGIN
    IF v_caller_id IS NULL THEN
        RETURN json_build_object('allowed', false, 'remaining', 0, 'limit', 1, 'used', 0, 'plan', 'explorer', 'error', 'Unauthenticated');
    END IF;

    IF user_uuid IS NOT NULL AND user_uuid != v_caller_id THEN
        SELECT (role IN ('admin', 'sub_admin')) INTO v_is_admin FROM public.profiles WHERE id = v_caller_id;
        IF v_is_admin THEN
            v_target_user := user_uuid;
        ELSE
            v_target_user := v_caller_id;
        END IF;
    ELSE
        v_target_user := v_caller_id;
    END IF;

    SELECT LOWER(COALESCE(selected_plan, 'explorer')) INTO user_plan 
    FROM public.profiles WHERE id = v_target_user;
    
    monthly_limit := CASE
        WHEN user_plan IN ('global', 'elite', 'global admission plan') THEN 999999
        ELSE 1
    END;
    
    SELECT COUNT(*)::INTEGER INTO month_count
    FROM public.tests
    WHERE user_id = v_target_user
      AND (is_mock = TRUE OR test_type = 'mock')
      AND created_at >= DATE_TRUNC('month', CURRENT_DATE);
    
    RETURN json_build_object(
        'allowed', month_count < monthly_limit,
        'remaining', GREATEST(0, monthly_limit - month_count),
        'limit', monthly_limit,
        'used', month_count,
        'plan', user_plan
    );
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.check_mock_limit(UUID) TO authenticated;

-- 4.3 Expert Explanations Check
CREATE OR REPLACE FUNCTION public.can_view_expert_explanations(user_uuid UUID DEFAULT NULL)
RETURNS TABLE (
    allowed BOOLEAN,
    plan TEXT,
    reason TEXT
) 
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_target_user UUID;
    v_is_admin BOOLEAN := FALSE;
    v_user_plan TEXT;
    v_has_access BOOLEAN;
BEGIN
    IF v_caller_id IS NULL THEN
        RETURN QUERY SELECT FALSE, 'none'::TEXT, 'Unauthenticated'::TEXT;
        RETURN;
    END IF;

    IF user_uuid IS NOT NULL AND user_uuid != v_caller_id THEN
        SELECT (role IN ('admin', 'sub_admin')) INTO v_is_admin FROM public.profiles WHERE id = v_caller_id;
        IF v_is_admin THEN
            v_target_user := user_uuid;
        ELSE
            v_target_user := v_caller_id;
        END IF;
    ELSE
        v_target_user := v_caller_id;
    END IF;

    SELECT LOWER(COALESCE(selected_plan, 'explorer')) INTO v_user_plan 
    FROM public.profiles WHERE id = v_target_user;
    
    v_has_access := v_user_plan IN ('pro', 'elite', 'global', 'global admission plan');
    
    RETURN QUERY SELECT 
        v_has_access,
        v_user_plan,
        CASE 
            WHEN v_has_access THEN 'Access granted via ' || v_user_plan || ' plan.'
            ELSE 'Upgrade to Pro or Global plan to unlock expert video explanations.'
        END;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.can_view_expert_explanations(UUID) TO authenticated;

-- 4.4 Concierge Access Check
CREATE OR REPLACE FUNCTION public.check_concierge_access(user_uuid UUID DEFAULT NULL)
RETURNS JSON
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_target_user UUID;
    v_is_admin BOOLEAN := FALSE;
    v_user_plan TEXT;
    v_has_access BOOLEAN;
BEGIN
    IF v_caller_id IS NULL THEN
        RETURN json_build_object('allowed', false, 'plan', 'none', 'reason', 'Unauthenticated');
    END IF;

    IF user_uuid IS NOT NULL AND user_uuid != v_caller_id THEN
        SELECT (role IN ('admin', 'sub_admin')) INTO v_is_admin FROM public.profiles WHERE id = v_caller_id;
        IF v_is_admin THEN
            v_target_user := user_uuid;
        ELSE
            v_target_user := v_caller_id;
        END IF;
    ELSE
        v_target_user := v_caller_id;
    END IF;

    SELECT LOWER(COALESCE(selected_plan, 'explorer')) INTO v_user_plan 
    FROM public.profiles WHERE id = v_target_user;
    
    v_has_access := v_user_plan IN ('global', 'elite', 'global admission plan');

    RETURN json_build_object(
        'allowed', v_has_access,
        'plan', v_user_plan,
        'reason', CASE WHEN v_has_access THEN 'Access granted.' ELSE 'Upgrade to Global Admission Plan required.' END
    );
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.check_concierge_access(UUID) TO authenticated;

-- 4.5 Unread Messages Counts Check
CREATE OR REPLACE FUNCTION public.get_unread_counts(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (comm_id UUID, unread_count BIGINT, mention_status BOOLEAN)
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_effective_id UUID := auth.uid();
BEGIN
    IF v_effective_id IS NULL THEN
        v_effective_id := p_user_id;
    END IF;

    IF v_effective_id IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT 
        mem.community_id,
        COUNT(m.id) as unread_count,
        MAX(COALESCE(rs.has_unread_mention, false)) as mention_status
    FROM public.community_members mem
    JOIN public.community_messages m ON m.community_id = mem.community_id
    LEFT JOIN public.community_read_status rs ON (rs.community_id = mem.community_id AND rs.user_id = v_effective_id)
    WHERE mem.user_id = v_effective_id
        AND mem.status IN ('approved', 'member')
        AND m.user_id != v_effective_id
        AND m.is_deleted = false
        AND m.created_at > GREATEST(COALESCE(rs.last_read_at, '1970-01-01Z'::TIMESTAMPTZ), mem.created_at)
    GROUP BY mem.community_id;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_unread_counts(UUID) TO authenticated;

-- 4.6 Global Unread Bell Check
CREATE OR REPLACE FUNCTION public.has_unread_messages(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_effective_id UUID := auth.uid();
    v_exists BOOLEAN := FALSE;
BEGIN
    IF v_effective_id IS NULL THEN
        v_effective_id := p_user_id;
    END IF;

    IF v_effective_id IS NULL THEN
        RETURN FALSE;
    END IF;

    SELECT EXISTS (
        SELECT 1 
        FROM public.community_members mem
        JOIN public.community_messages m ON m.community_id = mem.community_id
        LEFT JOIN public.community_read_status rs ON (rs.community_id = mem.community_id AND rs.user_id = v_effective_id)
        WHERE mem.user_id = v_effective_id
            AND mem.status IN ('approved', 'member')
            AND m.user_id != v_effective_id
            AND m.is_deleted = false
            AND m.created_at > GREATEST(COALESCE(rs.last_read_at, '1970-01-01Z'::TIMESTAMPTZ), mem.created_at)
    ) INTO v_exists;
    RETURN v_exists;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.has_unread_messages(UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- 5. SECURE CONSULTANT ACTIVATION RPC & ACCESS CODES RLS
--    Closes vulnerability where access codes were plaintext-readable and reused.
-- ------------------------------------------------------------------------------

-- Drop insecure policy exposing unused codes to anyone
DROP POLICY IF EXISTS "Anyone can check access codes" ON public.consultant_access_codes;
DROP POLICY IF EXISTS "Users can mark their own code as used" ON public.consultant_access_codes;
DROP POLICY IF EXISTS "Allow code activation" ON public.consultant_access_codes;

-- Restrict consultant_access_codes table strictly to admins
ALTER TABLE public.consultant_access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access on consultant codes"
ON public.consultant_access_codes
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'sub_admin')
    )
);

-- Secure RPC to verify and activate consultant without exposing plaintext codes
CREATE OR REPLACE FUNCTION public.verify_and_activate_consultant(
    p_code TEXT,
    p_display_name TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_user_email TEXT;
    v_code_record RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Authentication required.');
    END IF;

    SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;

    SELECT * INTO v_code_record 
    FROM public.consultant_access_codes 
    WHERE code = TRIM(p_code) 
      AND is_used = false 
      AND (protocol_id IS NULL OR LOWER(protocol_id) = LOWER(v_user_email))
    LIMIT 1;

    IF v_code_record.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or expired consultant access code.');
    END IF;

    -- Mark code as redeemed
    UPDATE public.consultant_access_codes 
    SET is_used = true, 
        used_by = v_user_id, 
        updated_at = NOW()
    WHERE id = v_code_record.id;

    -- Update profile securely via security definer
    UPDATE public.profiles
    SET role = 'consultant',
        is_consultant = true,
        full_name = COALESCE(NULLIF(TRIM(p_display_name), ''), full_name),
        display_name = COALESCE(NULLIF(TRIM(p_display_name), ''), display_name)
    WHERE id = v_user_id;

    RETURN jsonb_build_object('success', true, 'message', 'Consultant access activated successfully.');
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_and_activate_consultant(TEXT, TEXT) TO authenticated;

-- ------------------------------------------------------------------------------
-- 6. COMMUNITY ADMIN ACTIONS RLS
--    Ensure only admins can pin or delete messages from others.
-- ------------------------------------------------------------------------------

-- Ensure DELETE policy requires admin or ownership
DROP POLICY IF EXISTS "Users can delete messages" ON public.community_messages;

CREATE POLICY "Users can delete messages"
ON public.community_messages
FOR DELETE TO authenticated
USING (
    (auth.uid() = user_id)
    OR
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'sub_admin')
    )
);

-- Ensure UPDATE policy prevents non-admins from soft-deleting or modifying others' messages
DROP POLICY IF EXISTS "Users can update own messages" ON public.community_messages;

CREATE POLICY "Users can update own messages"
ON public.community_messages
FOR UPDATE TO authenticated
USING (
    (auth.uid() = user_id)
    OR
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'sub_admin')
    )
)
WITH CHECK (
    (auth.uid() = user_id)
    OR
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'sub_admin')
    )
);

-- ------------------------------------------------------------------------------
-- 7. REFRESH SCHEMA CACHE
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
