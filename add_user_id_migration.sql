-- Migration: Add user_id column to knowledge_base table for user-specific document isolation
-- Run this in Supabase SQL Editor

-- Add user_id column to knowledge_base table
ALTER TABLE public.knowledge_base 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Create index for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_knowledge_base_user_id ON public.knowledge_base(user_id);

-- Update existing records to have a default user_id (optional - you may want to leave them as NULL)
-- UPDATE public.knowledge_base SET user_id = 'legacy_shared' WHERE user_id IS NULL;

-- Success message
SELECT 'Migration complete! user_id column added to knowledge_base table.' as status;



