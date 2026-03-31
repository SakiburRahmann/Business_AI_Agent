'use client';

import { useChat } from 'ai/react';
import { Send, Loader2, Sparkles, User, Bot, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

/**
 * OmniiChat 1.0 - The Masterpiece Interface
 * Designed to feel like Apple + Gemini.
 */
export default function OmniiChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      { id: 'boot', role: 'assistant', content: "OmniiChat 1.0 Systems Online. Pure Conversational Intelligence initialized. How can I help you architect your vision today?" }
    ]
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth Scroll Persistence
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-[#020202] text-zinc-200 font-sans selection:bg-purple-500/30 selection:text-white">
      {/* Sidebar - Minimalism Focus */}
      <div className="w-20 lg:w-72 border-r border-white/5 bg-[#050505] flex flex-col items-center py-8 px-4 hidden sm:flex">
         <div className="flex items-center gap-3 mb-12 self-start px-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <Command className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase hidden lg:inline">OmniiChat</span>
         </div>
         
         <div className="space-y-4 w-full">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="hidden lg:inline">New Synthesis</span>
            </button>
         </div>
         
         <div className="mt-auto w-full px-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                    <User className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="hidden lg:block">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Authorized User</p>
                    <p className="text-xs text-white truncate w-32">Sakibur Rahman</p>
                </div>
            </div>
         </div>
      </div>

      {/* Main Console */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#020202]">
        {/* Glossy Header */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-white/[0.02] backdrop-blur-3xl bg-black/40 z-20">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Gemini 2.0 Flash Integration Active</span>
            </div>
        </div>

        {/* Message Feed - High Fidelity Typography */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto pt-12 pb-32 px-6 sm:px-12 space-y-12">
            <div className="max-w-4xl mx-auto space-y-12">
                {messages.map((m) => (
                    <div key={m.id} className={cn(
                        "group flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
                        m.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className={cn(
                            "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border transition-all duration-500",
                            m.role === 'user' 
                                ? "bg-purple-600/10 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:scale-110" 
                                : "bg-white/[0.03] border-white/5 group-hover:scale-110"
                        )}>
                            {m.role === 'user' ? <User className="w-5 h-5 text-purple-400" /> : <Bot className="w-5 h-5 text-blue-400" />}
                        </div>
                        
                        <div className={cn(
                          "flex flex-col gap-3",
                          m.role === 'user' ? "items-end text-right" : "items-start text-left"
                        )}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 opacity-50 px-1">
                                {m.role === 'user' ? 'Transmission' : 'AI Architect'}
                            </p>
                            <div className={cn(
                                "max-w-[100%] prose prose-invert text-sm leading-[1.8] font-medium tracking-wide",
                                m.role === 'user' ? "text-purple-50" : "text-zinc-300"
                            )}>
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Floating Input Rail */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-30">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-600/20 rounded-3xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center bg-[#0C0C0C]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2.5 shadow-2xl">
                    <input
                        className="flex-1 bg-transparent px-6 py-4 outline-none text-sm font-medium placeholder:text-zinc-600 tracking-wide"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Talk to OmniiChat..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-30 flex items-center justify-center shadow-xl active:scale-95"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
            <p className="text-center mt-4 text-[9px] text-zinc-700 font-bold uppercase tracking-[0.4em] opacity-40">
                Processed via Hyper-Streaming Neural Link 1.0
            </p>
        </div>
      </div>
    </div>
  );
}
