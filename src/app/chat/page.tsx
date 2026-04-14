'use client';

import { useChat } from '@ai-sdk/react';
import { type UIMessage } from 'ai';
import { DefaultChatMessages } from '@/lib/ai/client';
import { Send, Loader2, Sparkles, User, Bot, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * OmniiChat 1.0 - Professional AI Dashboard
 * Premium business interface with high-fidelity interactions.
 */
export default function ChatPage() {
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        api: '/api/chat',
        initialMessages: DefaultChatMessages,
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-[#020202] text-zinc-100 selection:bg-cyan-500/30 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={cn(
                "h-full border-r border-white/[0.05] bg-black/40 backdrop-blur-3xl transition-all duration-500 flex flex-col z-50",
                isSidebarOpen ? "w-80" : "w-0 -ml-80"
            )}>
                <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold tracking-tight uppercase text-xs tracking-[0.2em] text-white">OmniiChat</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    <button className="w-full text-left p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all group">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Session</p>
                        <p className="text-sm font-medium text-zinc-300 truncate">Professional AI Strategy</p>
                    </button>
                    {/* Add more history items here */}
                </div>

                <div className="p-4 border-t border-white/[0.05]">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group"
                    >
                        <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
                        <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative bg-gradient-to-b from-zinc-900/10 to-[#020202]">
                {/* Header */}
                <header className="h-20 border-b border-white/[0.05] flex items-center px-8 justify-between bg-black/20 backdrop-blur-xl z-40">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <ChevronRight className={cn("w-5 h-5 text-zinc-400 transition-transform duration-500", isSidebarOpen ? "rotate-180" : "rotate-0")} />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Innovation Interface</h2>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Standard Enterprise Protocol</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Status: Operational</span>
                    </div>
                </header>

                {/* Chat Container */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-8 py-12 space-y-8 custom-scrollbar scroll-smooth"
                >
                    <div className="max-w-4xl mx-auto space-y-12">
                        {messages.map((m) => (
                            <div 
                                key={m.id} 
                                className={cn(
                                    "flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500",
                                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl",
                                    m.role === 'user' ? "bg-white/[0.05] border border-white/[0.1] order-2" : "bg-gradient-to-br from-cyan-500 to-blue-600 order-1"
                                )}>
                                    {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                </div>
                                <div className={cn(
                                    "flex flex-col space-y-2 max-w-[80%]",
                                    m.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        {m.role === 'user' ? 'Executive Identity' : 'Omnii Intelligence'}
                                    </span>
                                    <div className={cn(
                                        "p-6 rounded-2xl text-sm leading-relaxed",
                                        m.role === 'user' 
                                            ? "bg-white text-black font-medium rounded-tr-none" 
                                            : "bg-white/[0.03] border border-white/[0.05] text-zinc-300 rounded-tl-none"
                                    )}>
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-6 animate-pulse">
                                <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 text-zinc-700 animate-spin" />
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="h-2 w-48 bg-white/[0.03] rounded-full" />
                                    <div className="h-2 w-64 bg-white/[0.03] rounded-full" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-8 bg-gradient-to-t from-[#020202] to-transparent">
                    <form 
                        onSubmit={handleSubmit}
                        className="max-w-4xl mx-auto relative group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                        <div className="relative flex items-center bg-zinc-900 border border-white/[0.05] rounded-2xl p-2 pl-6 focus-within:border-cyan-500/50 transition-all shadow-2xl shadow-black/50">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Message OmniiChat..."
                                className="flex-1 bg-transparent border-none py-4 text-sm focus:outline-none placeholder:text-zinc-600 text-zinc-100"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-12 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white group"
                            >
                                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                        <p className="mt-4 text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
                            Proprietary Intelligence Architecture &copy; 2026
                        </p>
                    </form>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
