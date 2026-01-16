-- 1. DROP Existing Policies to avoid conflicts
DROP POLICY IF EXISTS "Users can delete their own applications" ON public.admission_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.admission_applications;
DROP POLICY IF EXISTS "Users can upload their own admission docs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own admission docs" ON storage.objects;

-- 2. Allow DELETE
CREATE POLICY "Users can delete their own applications"
ON public.admission_applications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. Allow UPDATE (Autosave/Submit)
CREATE POLICY "Users can update their own applications"
ON public.admission_applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Storage Bucket & RLS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('admission-docs', 'admission-docs', false) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own admission docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'admission-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own admission docs"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'admission-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
