-- 1. DROP old conflicting versions first to avoid "function not unique" errors
DROP FUNCTION IF EXISTS public.send_community_message(UUID, TEXT, TEXT, TEXT, TEXT, UUID, UUID[]);
DROP FUNCTION IF EXISTS public.send_community_message(UUID, TEXT, TEXT, TEXT, TEXT, UUID, UUID[], JSONB, UUID);
DROP FUNCTION IF EXISTS public.get_unread_counts(UUID);

-- 2. Add fcm_token storage
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fcm_token TEXT;
CREATE INDEX IF NOT EXISTS idx_profiles_fcm_token ON public.profiles(fcm_token);

-- 3. Restore Community Messaging (Latest Signature)
CREATE OR REPLACE FUNCTION public.send_community_message(
    p_community_id UUID,
    p_content TEXT,
    p_file_url TEXT DEFAULT NULL,
    p_file_type TEXT DEFAULT NULL,
    p_file_name TEXT DEFAULT NULL,
    p_reply_to_id UUID DEFAULT NULL,
    p_mentioned_user_ids UUID[] DEFAULT ARRAY[]::UUID[],
    p_link_preview JSONB DEFAULT NULL,
    p_batch_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_message_id UUID;
    v_user_id UUID;
BEGIN
    INSERT INTO public.community_messages (
        community_id, user_id, content, file_url, file_type, file_name, reply_to_id, link_preview, batch_id
    ) VALUES (
        p_community_id, auth.uid(), p_content, p_file_url, p_file_type, p_file_name, p_reply_to_id, p_link_preview, p_batch_id
    ) RETURNING id INTO v_message_id;

    IF p_mentioned_user_ids IS NOT NULL AND array_length(p_mentioned_user_ids, 1) > 0 THEN
        FOREACH v_user_id IN ARRAY p_mentioned_user_ids
        LOOP
            IF v_user_id != auth.uid() THEN
                INSERT INTO public.chat_mentions (user_id, sender_id, community_id, message_id)
                VALUES (v_user_id, auth.uid(), p_community_id, v_message_id);
                PERFORM mark_user_mentioned(p_community_id, v_user_id);
            END IF;
        END LOOP;
    END IF;
    RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Restore Message Badges
CREATE OR REPLACE FUNCTION public.get_unread_counts(p_user_id UUID)
RETURNS TABLE (comm_id UUID, unread_count BIGINT, mention_status BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mem.community_id,
        COUNT(m.id) as unread_count,
        MAX(COALESCE(rs.has_unread_mention, false)) as mention_status
    FROM public.community_members mem
    JOIN public.community_messages m ON m.community_id = mem.community_id
    LEFT JOIN public.community_read_status rs ON (rs.community_id = mem.community_id AND rs.user_id = p_user_id)
    WHERE mem.user_id = p_user_id
        AND mem.status IN ('approved', 'member')
        AND m.user_id != p_user_id
        AND m.is_deleted = false
        AND m.created_at > COALESCE(rs.last_read_at, '1970-01-01Z'::TIMESTAMPTZ)
    GROUP BY mem.community_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Restore Read Status Tracking
CREATE OR REPLACE FUNCTION update_read_status(p_community_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.community_read_status (user_id, community_id, last_read_at, has_unread_mention)
    VALUES (auth.uid(), p_community_id, now(), false)
    ON CONFLICT (user_id, community_id)
    DO UPDATE SET last_read_at = now(), has_unread_mention = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION mark_user_mentioned(p_community_id UUID, p_mentioned_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.community_read_status (user_id, community_id, has_unread_mention)
    VALUES (p_mentioned_user_id, p_community_id, true)
    ON CONFLICT (user_id, community_id)
    DO UPDATE SET has_unread_mention = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant Permissions (Explicitly)
GRANT EXECUTE ON FUNCTION public.get_unread_counts(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.send_community_message(UUID, TEXT, TEXT, TEXT, TEXT, UUID, UUID[], JSONB, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_read_status(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mark_user_mentioned(UUID, UUID) TO authenticated, service_role;
