-- 1. Update existing users to use Google avatars if they don't have one
UPDATE public.profiles p
SET avatar_url = u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
WHERE p.id = u.id
  AND (p.avatar_url IS NULL OR p.avatar_url = '')
  AND u.raw_user_meta_data->>'avatar_url' IS NOT NULL;

-- 2. Update handle_new_user function to capture avatar_url
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', 'Student'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;
