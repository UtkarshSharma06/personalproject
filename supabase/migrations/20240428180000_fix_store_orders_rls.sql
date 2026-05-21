-- Allow users to update their own orders (required for client-side payment finalization)
DROP POLICY IF EXISTS "Users can update own orders" ON public.store_orders;
CREATE POLICY "Users can update own orders" ON public.store_orders
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
