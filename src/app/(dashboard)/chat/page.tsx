'use client';

import { useChat } from '@ai-sdk/react';
import type { UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Loader2, Sparkles, User, Bot, Command, ArrowDownCircle, AlertCircle, RefreshCw, LogOut, LayoutDashboard, History, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

/**
 * OmniiChat 1.0 - Professional AI Interface
 * Optimized for standard business conventions.
 */
export default function OmniiChatPage() {
  const router = useRouter();
  
  const { messages, status, error, sendMessage, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant' as const,
        parts: [{ type: 'text' as const, text: 'Welcome to OmniiChat. I am ready to assist you with your business objectives. How can I help you today?' }],
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
        console.error('Logout failure');
    }
  };

  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('');
  };

  return (
    <div className="flex h-[100dvh] bg-[#020202] text-zinc-200 font-inter overflow-hidden">
      {/* Sidebar - Professional Navigation */}
      <aside className="w-20 lg:w-72 border-r border-white/[0.03] bg-[#050505] flex flex-col items-center py-8 px-4 hidden md:flex">
         <div className="flex items-center gap-3 mb-12 self-start px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] ring-1 ring-white/10">
                <Command className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase hidden lg:inline font-outfit">OmniiChat</span>
         </div>
         
         <div className="space-y-2 w-full">
            <button className="w-full text-left px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span className="hidden lg:inline">Dashboard</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-2xl bg-transparent text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-white hover:bg-white/[0.03] transition-all flex items-center gap-3">
                <History className="w-4 h-4" />
                <span className="hidden lg:inline">Chat History</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-2xl bg-transparent text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-white hover:bg-white/[0.03] transition-all flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span className="hidden lg:inline">Settings</span>
            </button>
         </div>
         
         <div className="mt-auto w-full px-2 space-y-4">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-2xl bg-red-500/5 border border-red-500/10 text-[10px] font-black uppercase tracking-wider text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3 group/logout"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
            </button>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10 shrink-0">
                    <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="hidden lg:block truncate">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active User</p>
                    <p className="text-xs font-bold text-white truncate">Sakibur Rahman</p>
                </div>
            </div>
         </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#020202]">
        {/* Professional Header */}
        <header className="h-16 md:h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/[0.02] backdrop-blur-3xl bg-black/40 z-20">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Service Active</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold text-zinc-600 hidden sm:inline uppercase tracking-widest bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">Gemini 2.5 Flash</span>
            </div>
        </header>

        {/* Message Feed */}
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
                            "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border transition-all duration-300",
                            m.role === 'user' 
                                ? "bg-cyan-600/10 border-cyan-500/20 text-cyan-400" 
                                : "bg-white/[0.04] border-white/10 text-zinc-400"
                        )}>
                            {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        
                        <div className={cn(
                          "flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]",
                          m.role === 'user' ? "items-end text-right" : "items-start text-left"
                        )}>
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-1 font-outfit">
                                {m.role === 'user' ? 'You' : 'Omnii AI'}
                            </p>
                            <div className={cn(
                                "prose prose-invert prose-p:leading-relaxed text-sm md:text-[15px] font-medium tracking-tight",
                                m.role === 'user' ? "text-cyan-50" : "text-zinc-200"
                            )}>
                                {getMessageText(m)}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex gap-5 md:gap-8 items-center pl-1">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
                    </div>
                    <div className="h-3 w-24 bg-white/[0.03] rounded-full animate-pulse" />
                  </div>
                )}

                {error && (
                  <div className="flex justify-center animate-in zoom-in-95 duration-500 pb-12">
                    <div className="max-w-md w-full bg-red-500/5 border border-red-500/10 rounded-3xl p-6 text-center space-y-4 shadow-2xl backdrop-blur-md">
                      <div className="mx-auto w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="text-red-400" size={20} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-red-100 uppercase tracking-tight">Service Interruption</h3>
                        <p className="text-[10px] text-red-400/60 font-black uppercase tracking-widest">
                          Connection failed. Please re-sync.
                        </p>
                      </div>
                      <button 
                        onClick={() => regenerate()}
                        className="w-full flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 text-red-100 py-4 rounded-xl border border-red-500/20 transition-all font-inter"
                      >
                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                        <span>Try Again</span>
                      </button>
                    </div>
                  </div>
                )}
            </div>
        </div>

        {/* Scroll To Bottom */}
        {showScrollButton && (
          <button 
            onClick={scrollToBottom}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-zinc-500 hover:text-white hover:bg-white/10 transition-all z-40"
          >
            <ArrowDownCircle className="w-5 h-5" />
          </button>
        )}

        {/* Action Bar */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl lg:max-w-3xl px-4 md:px-6 z-30">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="relative flex items-center bg-[#0C0C0C]/90 backdrop-blur-3xl border border-white/5 rounded-3xl p-1.5 md:p-2 shadow-2xl">
                    <input
                        className="flex-1 bg-transparent px-6 py-4 md:py-5 outline-none text-sm md:text-base font-medium placeholder:text-zinc-700 tracking-tight"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Message Omnii AI..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 md:p-5 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-20 flex items-center justify-center shadow-xl shrink-0"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
            <p className="hidden sm:block text-center mt-4 text-[8px] text-zinc-700 font-bold uppercase tracking-[0.4em] opacity-40">
                Omnii Professional Intelligence • Built by Sakibur Rahman
            </p>
        </div>
      </main>
    </div>
  );
}
