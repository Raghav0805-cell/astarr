-- ====================================================================
-- ASTARR CHROME SYSTEM - DATABASE SCHEMA DECLARATION
-- Target Platform: Supabase / PostgreSQL
-- ====================================================================

-- 1. Create table for User Profiles (syncs with auth.users)
CREATE TABLE IF NOT EXISTS public.users_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Turn on Row Level Security (RLS) for privacy
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile" ON public.users_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.users_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 2. Create table for User Favorites / Hearted tracks
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  youtube_video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Prevent redundant favorite records for the same track per user
  UNIQUE(user_id, youtube_video_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorite links" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);


-- 3. Create table for Custom Playlists / Mixes
CREATE TABLE IF NOT EXISTS public.custom_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  playlist_name TEXT NOT NULL,
  track_ids_array TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE public.custom_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own customized playlists" ON public.custom_playlists
  FOR ALL USING (auth.uid() = user_id);


-- Try creating automatic trigger to insert profiles upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profiles (user_id, name, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email, 'Stallion Rider'),
    COALESCE(new.created_at, CURRENT_TIMESTAMP)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
