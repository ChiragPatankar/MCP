# 🚀 Supabase Integration Guide

This guide will help you integrate Supabase (free tier) into your MCP Chat Support System.

## Step 1: Create Supabase Project

### 1.1 Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization
3. Fill in project details:
   - **Name**: `mcp-chat-support`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project"

### 1.3 Get API Keys
Once created, go to **Settings > API** and copy:
- **Project URL** (e.g., `https://your-project.supabase.co`)
- **anon public** key
- **service_role** key (keep this secret!)

## Step 2: Database Schema Setup

### 2.1 Create Tables
Run these SQL commands in the Supabase SQL Editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'agent')),
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenants table
CREATE TABLE public.tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  tenant_id UUID REFERENCES public.tenants(id),
  message TEXT NOT NULL,
  response TEXT,
  context JSONB,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge base table
CREATE TABLE public.knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tenants: Users can only see their tenant
CREATE POLICY "Users can view own tenant" ON public.tenants
  FOR SELECT USING (id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Chat messages: Users can see messages from their tenant
CREATE POLICY "Users can view tenant messages" ON public.chat_messages
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Knowledge base: Users can see their tenant's knowledge base
CREATE POLICY "Users can view tenant knowledge base" ON public.knowledge_base
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Analytics: Users can see their tenant's analytics
CREATE POLICY "Users can view tenant analytics" ON public.analytics
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));
```

## Step 3: Install Supabase Client

### 3.1 Frontend (React)
```bash
npm install @supabase/supabase-js
```

### 3.2 Backend (Node.js)
```bash
npm install @supabase/supabase-js
```

## Step 4: Environment Variables

### 4.1 Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4.2 Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 5: Free Tier Limits

### ✅ What's Included (Free)
- **Database**: 500MB storage
- **Bandwidth**: 2GB transfer
- **Auth**: 50,000 monthly active users
- **Storage**: 1GB storage
- **Edge Functions**: 500,000 invocations/month
- **Real-time**: Unlimited connections

### 📊 Usage Monitoring
- Monitor usage in Supabase Dashboard
- Set up alerts for approaching limits
- Consider paid plans if you exceed limits

## Step 6: Benefits for Your Project

### 🔄 Real-time Features
- Live chat updates without polling
- Real-time notifications
- Live user presence indicators

### 🔐 Better Authentication
- Built-in OAuth providers
- JWT token management
- Row Level Security

### 📊 Scalability
- PostgreSQL performance
- Automatic backups
- Built-in CDN for files

### 🛠️ Development
- Auto-generated TypeScript types
- Built-in API documentation
- Database migrations

## Next Steps

1. **Set up the project** following this guide
2. **Update your code** to use Supabase
3. **Test the integration**
4. **Deploy** with the new backend

Would you like me to help you implement the Supabase integration in your code? 