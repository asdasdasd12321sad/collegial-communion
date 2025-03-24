
-- Enable Realtime on reaction_counts table
ALTER TABLE public.reaction_counts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reaction_counts;

-- Create new post type tables
CREATE TABLE IF NOT EXISTS public.posts_confession (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    topic TEXT,
    like_count INTEGER DEFAULT 0,
    heart_count INTEGER DEFAULT 0,
    laugh_count INTEGER DEFAULT 0,
    wow_count INTEGER DEFAULT 0,
    sad_count INTEGER DEFAULT 0,
    angry_count INTEGER DEFAULT 0,
    chatroom_id UUID REFERENCES public.chatrooms(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.posts_forum (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    topic TEXT,
    like_count INTEGER DEFAULT 0,
    heart_count INTEGER DEFAULT 0,
    laugh_count INTEGER DEFAULT 0,
    wow_count INTEGER DEFAULT 0,
    sad_count INTEGER DEFAULT 0,
    angry_count INTEGER DEFAULT 0,
    chatroom_id UUID REFERENCES public.chatrooms(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.posts_campus_community (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    topic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.posts_nationwide_community (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    topic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_posts_confession_author_id ON public.posts_confession(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_confession_topic ON public.posts_confession(topic);
CREATE INDEX IF NOT EXISTS idx_posts_confession_created_at ON public.posts_confession(created_at);

CREATE INDEX IF NOT EXISTS idx_posts_forum_author_id ON public.posts_forum(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_forum_topic ON public.posts_forum(topic);
CREATE INDEX IF NOT EXISTS idx_posts_forum_created_at ON public.posts_forum(created_at);

CREATE INDEX IF NOT EXISTS idx_posts_campus_community_author_id ON public.posts_campus_community(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_campus_community_topic ON public.posts_campus_community(topic);
CREATE INDEX IF NOT EXISTS idx_posts_campus_community_created_at ON public.posts_campus_community(created_at);

CREATE INDEX IF NOT EXISTS idx_posts_nationwide_community_author_id ON public.posts_nationwide_community(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_nationwide_community_topic ON public.posts_nationwide_community(topic);
CREATE INDEX IF NOT EXISTS idx_posts_nationwide_community_created_at ON public.posts_nationwide_community(created_at);

-- Enable RLS on new tables
ALTER TABLE public.posts_confession ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts_forum ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts_campus_community ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts_nationwide_community ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Anyone can view confession posts" 
ON public.posts_confession FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can create confession posts" 
ON public.posts_confession FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own confession posts" 
ON public.posts_confession FOR UPDATE 
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own confession posts" 
ON public.posts_confession FOR DELETE 
TO authenticated
USING (auth.uid() = author_id);

-- Forum post policies
CREATE POLICY "Anyone can view forum posts" 
ON public.posts_forum FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can create forum posts" 
ON public.posts_forum FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own forum posts" 
ON public.posts_forum FOR UPDATE 
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own forum posts" 
ON public.posts_forum FOR DELETE 
TO authenticated
USING (auth.uid() = author_id);

-- Campus community post policies
CREATE POLICY "Anyone can view campus community posts" 
ON public.posts_campus_community FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can create campus community posts" 
ON public.posts_campus_community FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own campus community posts" 
ON public.posts_campus_community FOR UPDATE 
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own campus community posts" 
ON public.posts_campus_community FOR DELETE 
TO authenticated
USING (auth.uid() = author_id);

-- Nationwide community post policies
CREATE POLICY "Anyone can view nationwide community posts" 
ON public.posts_nationwide_community FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can create nationwide community posts" 
ON public.posts_nationwide_community FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own nationwide community posts" 
ON public.posts_nationwide_community FOR UPDATE 
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own nationwide community posts" 
ON public.posts_nationwide_community FOR DELETE 
TO authenticated
USING (auth.uid() = author_id);

-- Modify post_reactions table to no longer reference community posts
ALTER TABLE public.post_reactions 
  DROP CONSTRAINT IF EXISTS post_reactions_community_post_id_fkey,
  DROP COLUMN IF EXISTS community_post_id;

-- Modify saved_posts table  
ALTER TABLE public.saved_posts
  DROP CONSTRAINT IF EXISTS saved_posts_community_post_id_fkey,
  DROP COLUMN IF EXISTS community_post_id;

-- Modify hidden_posts table
ALTER TABLE public.hidden_posts
  DROP CONSTRAINT IF EXISTS hidden_posts_community_post_id_fkey,
  DROP COLUMN IF EXISTS community_post_id;

-- Modify reported_posts table
ALTER TABLE public.reported_posts
  DROP CONSTRAINT IF EXISTS reported_posts_community_post_id_fkey,
  DROP COLUMN IF EXISTS community_post_id;

-- Modify reaction_counts table
ALTER TABLE public.reaction_counts
  DROP CONSTRAINT IF EXISTS reaction_counts_community_post_id_fkey,
  DROP COLUMN IF EXISTS community_post_id;

-- Add migration of data from old tables to new tables (if needed)
-- This would go here but we're creating fresh tables

-- Function to handle new user registration and update user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    display_name, 
    verification_status,
    login_email,
    auth_provider,
    created_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', 'User'),
    CASE
      WHEN NEW.email LIKE '%.edu' THEN 'verified'
      ELSE 'unverified'
    END,
    NEW.email,
    NEW.raw_user_meta_data->>'provider',
    NEW.created_at
  );
  
  RETURN NEW;
END;
$$;

-- Trigger to set last_login when a user logs in
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET last_login = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update last_login
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
EXECUTE FUNCTION public.update_last_login();
