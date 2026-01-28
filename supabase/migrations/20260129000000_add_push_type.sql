-- Add push_type column to site_notifications table
ALTER TABLE public.site_notifications ADD COLUMN IF NOT EXISTS push_type TEXT DEFAULT 'announcement';

-- Add comment explaining the values
COMMENT ON COLUMN public.site_notifications.push_type IS 'Category of the push notification: announcement, deal, or warning';
