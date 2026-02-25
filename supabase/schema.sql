-- Business AI Agent SaaS Database Schema
-- Industrial-grade Multi-tenant Setup with RLS

-- 1. Businesses Table (Tenants)
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    industry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. AI Agents Table
CREATE TABLE public.ai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    personality TEXT NOT NULL,
    system_prompt TEXT,
    voice_id TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    capabilities JSONB DEFAULT '{"whatsapp": false, "voice": false, "instagram": false, "email": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Conversations Table
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
    customer_identifier TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('WHATSAPP', 'VOICE', 'INSTAGRAM', 'EMAIL')),
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'ESCALATED')),
    sentiment TEXT CHECK (sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Messages Table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('AGENT', 'CUSTOMER', 'SYSTEM')),
    content TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES --

-- Enable RLS on all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Business Isolation: Users can only see their own business
CREATE POLICY "Users can view their own business" 
ON public.businesses FOR SELECT 
USING (auth.uid() = owner_id);

-- Agent Isolation: Users can only see agents belonging to their business
CREATE POLICY "Users can manage agents of their business" 
ON public.ai_agents FOR ALL 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

-- Conversation Isolation
CREATE POLICY "Users can view conversations of their business" 
ON public.conversations FOR SELECT 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

-- Message Isolation
CREATE POLICY "Users can view messages of their business" 
ON public.messages FOR SELECT 
USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
