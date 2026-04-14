'use client';

import { useChat } from '@ai-sdk/react';
import type { UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Loader2, Sparkles, User, Bot, Command, ArrowDownCircle, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

/**
 * OmniiChat 1.0 - The Masterpiece Interface
 * Optimized for Mobile + AI Streaming.
 * Local Auth enabled.
 */
export default function OmniiChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const { messages, status, error, sendMessage, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: [
      {
        id: 'boot',
        role: 'assistant' as const,
        parts: [{ type: 'text' as const, text: 'OmniiChat 1.0 Systems Online. Pure Conversational Intelligence initialized. How can I help you architect your vision today?' }],
      },
    ],
  });

  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Smooth Scroll Persistence
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      const isAtBottom = scrollHeight - clientHeight - scrollTop < 100;
      
      if (isAtBottom) {
        scrollRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      } else {
        setShowScrollButton(true);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    setShowScrollButton(false);
  };

  const handleLogout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    } catch (err) {
        console.error('Termination failure');
    }
  };

  /**
   * Extracts displayable text from a UIMessage's parts array.
   */
  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('');
  };

  return (
    <div className="flex h-[100dvh] bg-[#020202] text-zinc-200 font-inter overflow-hidden">
      {/* Sidebar - Minimalism Focus */}
      <aside className="w-20 lg:w-72 border-r border-white/[0.03] bg-[#050505] flex flex-col items-center py-8 px-4 hidden md:flex">
         <div className="flex items-center gap-3 mb-12 self-start px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)] ring-1 ring-white/10">
                <Command className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-black tracking-[0.2em] uppercase hidden lg:inline font-outfit">OmniiChat</span>
         </div>
         
         <div className="space-y-3 w-full">
            <button className="w-full text-left px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="hidden lg:inline">Core Synthesis</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all flex items-center gap-3 group/logout"
            >
                <LogOut className="w-4 h-4 text-zinc-600 group-hover/logout:text-red-400 transition-colors" />
                <span className="hidden lg:inline">Terminate session</span>
            </button>
         </div>
         
         <div className="mt-auto w-full px-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10 shrink-0">
                    <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="hidden lg:block truncate">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">Verified Architect</p>
                    <p className="text-xs font-bold text-white truncate">Sakibur Rahman</p>
                </div>
            </div>
         </div>
      </aside>

      {/* Main Console */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#020202]">
        {/* Glossy Header */}
        <header className="h-16 md:h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/[0.02] backdrop-blur-3xl bg-black/40 z-20">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">Neural Link Stable</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold text-zinc-600 hidden sm:inline uppercase tracking-widest">Gemini 2.5 Flash</span>
            </div>
        </header>

        {/* Message Feed - High Fidelity Typography */}
        <div 
          ref={scrollRef} 
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            setShowScrollButton(target.scrollHeight - target.clientHeight - target.scrollTop > 500);
          }}
          className="flex-1 overflow-y-auto pt-8 pb-32 px-6 sm:px-12 space-y-10"
        >
            <div className="max-w-3xl mx-auto space-y-10">
                {messages.map((m: UIMessage) => (
                    <div key={m.id} className={cn(
                        "group flex gap-5 md:gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700",
                        m.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className={cn(
                            "w-9 h-9 md:w-11 md:h-11 rounded-2xl shrink-0 flex items-center justify-center border transition-all duration-500 shadow-xl",
                            m.role === 'user' 
                                ? "bg-purple-600/10 border-purple-500/20 shadow-purple-500/5 group-hover:bg-purple-600/20" 
                                : "bg-white/[0.04] border-white/10 group-hover:bg-white/[0.08]"
                        )}>
                            {m.role === 'user' ? <User className="w-5 h-5 text-purple-400" /> : <Bot className="w-5 h-5 text-blue-400" />}
                        </div>
                        
                        <div className={cn(
                          "flex flex-col gap-2.5 max-w-[85%] sm:max-w-[75%]",
                          m.role === 'user' ? "items-end text-right" : "items-start text-left"
                        )}>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 px-1 font-outfit">
                                {m.role === 'user' ? 'Transmission' : 'AI Architect'}
                            </p>
                            <div className={cn(
                                "prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-white/10 text-sm md:text-[15px] font-medium tracking-normal",
                                m.role === 'user' ? "text-purple-50" : "text-zinc-200"
                            )}>
                                {getMessageText(m)}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex gap-5 md:gap-8 items-center pl-1 animate-pulse">
                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-blue-400/50 animate-spin" />
                    </div>
                    <div className="h-4 w-32 bg-white/[0.05] rounded-full" />
                  </div>
                )}

                {/* Error Boundary - Premium Diagnostic UI */}
                {error && (
                  <div className="flex justify-center animate-in zoom-in-95 duration-500 pb-12">
                    <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 rounded-[2rem] p-6 text-center space-y-4 shadow-2xl backdrop-blur-md">
                      <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                        <AlertCircle className="text-red-400" size={24} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-red-100 font-outfit uppercase tracking-tighter">Neural Link Divergence</h3>
                        <p className="text-[10px] text-red-400/70 font-black leading-relaxed uppercase tracking-[0.2em]">
                          Infrastructure Anomaly Detected • Check Server Config
                        </p>
                      </div>
                      <button 
                        onClick={() => regenerate()}
                        className="w-full flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] bg-red-500/20 hover:bg-red-500/30 text-red-100 py-4 rounded-2xl border border-red-500/30 transition-all duration-300 active:scale-[0.98]"
                      >
                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                        <span>Re-Sync Transmission</span>
                      </button>
                    </div>
                  </div>
                )}
            </div>
        </div>

        {/* Scroll To Bottom Button */}
        {showScrollButton && (
          <button 
            onClick={scrollToBottom}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-zinc-400 hover:text-white hover:bg-white/10 transition-all z-40 animate-bounce"
          >
            <ArrowDownCircle className="w-5 h-5" />
          </button>
        )}

        {/* Floating Input Rail */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl lg:max-w-3xl px-4 md:px-6 z-30">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center bg-[#0C0C0C]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-1.5 md:p-2 shadow-2xl ring-1 ring-white/5">
                    <input
                        className="flex-1 bg-transparent px-6 py-4 md:py-5 outline-none text-sm md:text-base font-medium placeholder:text-zinc-600 tracking-wide"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Talk to OmniiChat..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 md:p-5 bg-white text-black rounded-[1.5rem] hover:bg-zinc-200 transition-all disabled:opacity-20 flex items-center justify-center shadow-2xl active:scale-95 shrink-0"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
            <p className="hidden sm:block text-center mt-4 text-[8px] text-zinc-700 font-black uppercase tracking-[0.6em] opacity-60">
                OmniiChat 1.0 • Neural Protocol 1.0 • Built by Sakibur Rahman
            </p>
        </div>
      </main>
    </div>
  );
}
