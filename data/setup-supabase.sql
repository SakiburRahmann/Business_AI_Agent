-- OmniiAi 2.0 - Database Schema Setup
-- Reference Script (Created April 2026)

-- Note: This is for reference only. 
-- The project has been migrated to native Supabase Auth.
-- You can use this schema if you want to store additional business data.

CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID, -- Links to auth.users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
