-- EMERGENCY FIX FOR VISIBILITY
-- This script relaxes permissions so you can test the flow completely.

-- 1. APPLICATIONS: Allow any logged-in user to see all "Submitted" applications
DROP POLICY IF EXISTS "Consultants can view submitted applications" ON public.admission_applications;
DROP POLICY IF EXISTS "Anyone can view submitted applications" ON public.admission_applications;

CREATE POLICY "Anyone can view submitted applications"
ON public.admission_applications
FOR SELECT
TO authenticated
USING (status = 'submitted' OR user_id = auth.uid());


-- 2. DOCUMENT METADATA: Allow viewing of document records
ALTER TABLE public.admission_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Consultants can view documents" ON public.admission_documents;
DROP POLICY IF EXISTS "Enable access to own documents" ON public.admission_documents;

CREATE POLICY "Anyone can view document metadata"
ON public.admission_documents
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage own documents"
ON public.admission_documents
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 3. STORAGE FILES: Allow any logged-in user to VIEW files in the bucket
-- (This ensures Consultants can actually open the student's PDF)
DROP POLICY IF EXISTS "Users can view their own admission docs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view admission docs" ON storage.objects;

CREATE POLICY "Authenticated users can view admission docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'admission-docs');

-- Ensure insert is still protected
DROP POLICY IF EXISTS "Users can upload their own admission docs" ON storage.objects;
CREATE POLICY "Users can upload their own admission docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'admission-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
