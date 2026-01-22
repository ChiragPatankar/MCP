-- FIXED SUPABASE SCHEMA - Resolves "owner_id does not exist" error
-- Run this in Supabase SQL Editor

-- Enable required extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.knowledge_base CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create tables in correct order (no forward references)

-- 1. Profiles table (references auth.users which already exists)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'agent')),
  tenant_id UUID, -- Will be linked after tenants table is created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tenants table (references auth.users)
CREATE TABLE public.tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id), -- This is the column that was missing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add foreign key constraint to profiles.tenant_id now that tenants exists
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_tenant_id 
FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);

-- 4. Knowledge base table
CREATE TABLE public.knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'website', 'text')),
  source TEXT NOT NULL,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'error')),
  size NUMERIC DEFAULT 0,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Chat messages table
CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Analytics table
CREATE TABLE public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_before_update_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_before_update_tenants
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_before_update_knowledge_base
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Tenants policies
CREATE POLICY "Users can view own tenants" ON public.tenants
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create tenants" ON public.tenants
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own tenants" ON public.tenants
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Knowledge base policies
CREATE POLICY "Users can view tenant knowledge base" ON public.knowledge_base
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE id = knowledge_base.tenant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create knowledge base entries" ON public.knowledge_base
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE id = knowledge_base.tenant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tenant knowledge base" ON public.knowledge_base
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE id = knowledge_base.tenant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tenant knowledge base" ON public.knowledge_base
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE id = knowledge_base.tenant_id AND owner_id = auth.uid()
    )
  );

-- Chat messages policies
CREATE POLICY "Users can view tenant chat messages" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE id = chat_messages.tenant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat messages" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE id = chat_messages.tenant_id AND owner_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Users can view tenant analytics" ON public.analytics
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE id = analytics.tenant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analytics" ON public.analytics
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE id = analytics.tenant_id AND owner_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_tenants_owner_id ON public.tenants(owner_id);
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_knowledge_base_tenant_id ON public.knowledge_base(tenant_id);
CREATE INDEX idx_knowledge_base_status ON public.knowledge_base(status);
CREATE INDEX idx_chat_messages_tenant_id ON public.chat_messages(tenant_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_analytics_tenant_id ON public.analytics(tenant_id);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);

-- Insert a default tenant for testing (optional)
-- Uncomment and replace with a real user ID if needed
-- INSERT INTO public.tenants (name, domain, owner_id) 
-- VALUES ('Default Tenant', 'default.local', 'YOUR_USER_ID_HERE');

-- Success message
SELECT 'Database schema created successfully! All tables and policies are in place.' as status;


