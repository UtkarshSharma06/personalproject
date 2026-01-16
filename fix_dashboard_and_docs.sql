-- 1. Fix Document Persistence (So they don't disappear)
ALTER TABLE public.admission_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable access to own documents" ON public.admission_documents;
CREATE POLICY "Enable access to own documents" ON public.admission_documents
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 2. Allow Consultants to view Docs
DROP POLICY IF EXISTS "Consultants can view documents" ON public.admission_documents;
CREATE POLICY "Consultants can view documents" ON public.admission_documents
FOR SELECT 
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'consultant')
);

-- 3. Fix Consultant Dashboard (Allow seeing submitted apps)
DROP POLICY IF EXISTS "Consultants can view submitted applications" ON public.admission_applications;
CREATE POLICY "Consultants can view submitted applications" ON public.admission_applications
FOR SELECT 
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'consultant')
);
