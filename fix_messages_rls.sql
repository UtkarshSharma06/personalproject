-- Enable RLS for consultants to access messages linked to their claimed applications

-- 1. Consultants can VIEW messages if they are assigned to the application
CREATE POLICY "Consultants can view messages for their assigned applications"
ON public.admission_messages FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admission_applications
        WHERE id = public.admission_messages.application_id 
        AND consultant_id = auth.uid()
    )
);

-- 2. Consultants can SEND messages if they are assigned to the application
CREATE POLICY "Consultants can send messages to their assigned applications"
ON public.admission_messages FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admission_applications
        WHERE id = public.admission_messages.application_id 
        AND consultant_id = auth.uid()
    )
);
