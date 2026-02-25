# Business AI Agent SaaS Platform

An industrial-grade, multi-tenant SaaS platform for deploying autonomous AI agents across WhatsApp, Voice, Email, and Instagram. Built with a "Zero-Cost" architectural philosophy using FAANG+ engineering standards.

## 🚀 Core Features

-   **Omni-channel Gateway:** Unified webhook handler for WhatsApp, Voice (Vapi.ai), and Email.
-   **Autonomous "Limbs" (Tool Use):** Agents can book appointments, send invoices, and check inventory autonomously.
-   **RAG Knowledge Base:** Long-term memory system using Supabase Vector Store and Google Gemini Embeddings.
-   **Industrial-Grade Security:**
    -   **Multi-tenancy:** Strict data isolation using PostgreSQL Row Level Security (RLS).
    -   **Pre-Execution Policies:** Tool calls are validated against security caps and allowed lists.
    -   **Zero-Defect Code:** 100% test coverage for core reasoning loops.
-   **Premium Dashboard:** Sleek, dark-themed UI for agent management, conversation monitoring, and real-time analytics.

## 🛠️ Technical Stack

-   **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn/UI, Lucide Icons.
-   **Backend:** Next.js Serverless Functions, Supabase (Auth, DB, Vector).
-   **AI Orchestration:** LangGraph, LangChain, Google Gemini 1.5 Flash, Groq (Llama 3).
-   **Integrations:** Resend (Email), Vapi.ai (Voice), Meta Graph API (WhatsApp/IG).
-   **Testing:** Jest, ts-jest.

## 🏗️ Project Structure

```text
src/
├── app/                  # Next.js App Router (Dashboard, API Webhooks)
├── components/           # Premium UI Components
├── lib/                  # Utilities (Supabase, Formatting)
├── services/             # Core Logic (AI Orchestrator, Knowledge, Tools)
├── tests/                # Unit Tests (Jest)
└── types/                # Strict TypeScript Definitions
supabase/
└── schema.sql            # Multi-tenant DB Schema & RLS Policies
```

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone git@github.com:SakiburRahmann/Business_AI_Agent.git
cd Business_AI_Agent
npm install --legacy-peer-deps
```

### 2. Environment Variables
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
RESEND_API_KEY=your_resend_key
VAPI_API_KEY=your_vapi_key
```

### 3. Database Setup
Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor to enable RLS and create tables.

### 4. Run Locally
```bash
npm run dev
```

## 🚢 Deployment Guide

### Vercel (Frontend & API)
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Add the environment variables listed above in the Vercel Project Settings.
3. Deploy! Vercel will automatically detect the Next.js project.

### Supabase (Database & Auth)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to **Settings > API** to get your URL and Service Role Key.
3. Apply the `supabase/schema.sql` to your production database.

## 🧪 Verification
Run the industrial-grade test suite to verify system integrity:
```bash
npm test
```

---
**Maintained by Sakibur Rahman**  
*Principal Full-Stack Engineer & Systems Architect*
