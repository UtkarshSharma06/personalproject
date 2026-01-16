-- 1. FIX STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES ('admission-docs', 'admission-docs', false)
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

INSERT INTO storage.buckets (id, name, public)
VALUES ('community-uploads', 'community-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

-- 2. VERIFY BUCKETS (Run this to see if they exist)
-- SELECT id, name FROM storage.buckets;

-- ... rest of script ...

-- 5. FIX COLUMN UPDATES (Notifications)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admission_messages' AND column_name = 'is_read') THEN
        ALTER TABLE public.admission_messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admission_offers' AND column_name = 'is_read') THEN
        ALTER TABLE public.admission_offers ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. FIX STORAGE POLICIES (Using DO blocks to avoid "already exists" errors)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can view their own admission docs') THEN
        CREATE POLICY "Users can view their own admission docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'admission-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload their own admission docs') THEN
        CREATE POLICY "Users can upload their own admission docs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'admission-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Consultants can view all admission docs') THEN
        CREATE POLICY "Consultants can view all admission docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'admission-docs' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'consultant')));
    END IF;
END $$;

-- 3. FIX OFFERS RLS (DATABASE)
DROP POLICY IF EXISTS "Consultants manage offers" ON admission_offers;
DROP POLICY IF EXISTS "Consultants can view all offers" ON admission_offers;
CREATE POLICY "Consultants can view all offers" ON admission_offers FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (role = 'consultant' OR role = 'admin')));

DROP POLICY IF EXISTS "Consultants can insert offers" ON admission_offers;
CREATE POLICY "Consultants can insert offers" ON admission_offers FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (role = 'consultant' OR role = 'admin')));

DROP POLICY IF EXISTS "Consultants can delete offers" ON admission_offers;
CREATE POLICY "Consultants can delete offers" ON admission_offers FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (role = 'consultant' OR role = 'admin')));

-- 4. FIX STORAGE RLS (REQUIRED FOR ATTACHMENTS)
-- Allow consultants to upload to ANY folder in admission-docs
DROP POLICY IF EXISTS "Consultants can upload admission docs" ON storage.objects;
CREATE POLICY "Consultants can upload admission docs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'admission-docs' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'consultant' OR role = 'admin')));

DROP POLICY IF EXISTS "Consultants can view all admission docs" ON storage.objects;
CREATE POLICY "Consultants can view all admission docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'admission-docs' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'consultant')));

-- 5. FIX COMMON MIGRATION CONFLICTS (e.g. session_questions)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'session_questions' AND policyname = 'Anyone can view session questions') THEN
        NULL; 
    END IF;
END $$;

-- 7. FIX MESSAGES RLS
DROP POLICY IF EXISTS "Users can view their own application messages" ON admission_messages;
CREATE POLICY "Users can view their own application messages" ON admission_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admission_applications WHERE admission_applications.id = admission_messages.application_id AND admission_applications.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('admin', 'consultant')));

DROP POLICY IF EXISTS "Users can send messages to their applications" ON admission_messages;
CREATE POLICY "Users can send messages to their applications" ON admission_messages FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admission_applications WHERE admission_applications.id = application_id AND admission_applications.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('admin', 'consultant')));

DROP POLICY IF EXISTS "Users can mark messages as read" ON admission_messages;
CREATE POLICY "Users can mark messages as read" ON admission_messages FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admission_applications WHERE admission_applications.id = admission_messages.application_id AND admission_applications.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('admin', 'consultant')));

-- 8. FIX OFFERS RLS (STUDENT VIEW)
DROP POLICY IF EXISTS "Users can view their own offers" ON admission_offers;
CREATE POLICY "Users can view their own offers" ON admission_offers FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admission_applications WHERE admission_applications.id = admission_offers.application_id AND admission_applications.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('admin', 'consultant')));

DROP POLICY IF EXISTS "Users can update their own offers" ON admission_offers;
CREATE POLICY "Users can update their own offers" ON admission_offers FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admission_applications WHERE admission_applications.id = admission_offers.application_id AND admission_applications.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('admin', 'consultant')));
-- 6. ENABLE REALTIME
-- Try to add tables to the realtime publication
BEGIN;
  DO $$
  BEGIN
    -- Check if we are in a Supabase environment with the publication
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'admission_messages'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admission_messages;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'admission_offers'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admission_offers;
      END IF;
    ELSE
      -- Fallback if publication doesn't exist yet (creates it)
      CREATE PUBLICATION supabase_realtime FOR TABLE public.admission_messages, public.admission_offers;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not enable Realtime: %', SQLERRM;
  END $$;
COMMIT;
-- 1. Ensure columns exist (Idempotent)
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS meeting_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.admission_applications ADD COLUMN IF NOT EXISTS meeting_info TEXT;

-- 2. reset RLS for updates to be safe
DROP POLICY IF EXISTS "Consultants can update applications" ON public.admission_applications;

CREATE POLICY "Consultants can update applications"
ON public.admission_applications FOR UPDATE TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('consultant', 'admin')
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('consultant', 'admin')
);

-- 3. Ensure students can also see these columns (Select policy)
-- Existing select policy should cover it ("Users can view own applications"), assuming it selects *
