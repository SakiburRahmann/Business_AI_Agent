'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { DefaultChatMessages } from '@/lib/ai/client';
import { Loader2, Send, Plus, MessageSquare, LogOut, Trash2, Sparkles, User, Bot, ChevronRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const conversationIdRef = useRef<string | null>(null);
    const [historicalConversations, setHistoricalConversations] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Sync ref with state
    useEffect(() => {
        conversationIdRef.current = conversationId;
    }, [conversationId]);
    
    const { messages, setMessages, sendMessage, status, error } = useChat({
        transport: new DefaultChatTransport({ 
            api: '/api/chat',
            fetch: async (url, init) => {
                if (!init) return fetch(url, init);
                
                const currentId = conversationIdRef.current;
                if (currentId) {
                    // Send in headers
                    init.headers = {
                        ...init.headers,
                        'x-conversation-id': currentId
                    } as any;
                    
                    // Also send in body if possible
                    if (init.body) {
                        try {
                            const body = JSON.parse(init.body as string);
                            body.conversationId = currentId;
                            init.body = JSON.stringify(body);
                        } catch (e) {
                            console.error('Failed to inject conversationId to body:', e);
                        }
                    }
                }
                return fetch(url, init);
            }
        }),
        messages: DefaultChatMessages,
    });

    const isLoading = status === 'streaming' || status === 'submitted';

    useEffect(() => {
        loadConversationList();
    }, []);

    const loadConversationList = async () => {
        try {
            const res = await fetch('/api/chats');
            if (res.ok) {
                const data = await res.json();
                setHistoricalConversations(data);
            }
        } catch (err) {
            console.error('Failed to load history:', err);
        }
    };

    const loadConversation = async (id: string) => {
        setConversationId(id);
        try {
            const res = await fetch(`/api/chat/history?conversationId=${id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    };

    const deleteConversation = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this chat?')) return;

        try {
            const res = await fetch(`/api/chats/delete?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                if (conversationId === id) {
                    startNewChat();
                }
                loadConversationList();
            }
        } catch (err) {
            console.error('Failed to delete chat:', err);
        }
    };

    const startNewChat = () => {
        setConversationId(null);
        setMessages(DefaultChatMessages);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;
        
        const contentSnapshot = inputValue;
        setInputValue('');
        
        let currentId = conversationId;
        if (!currentId) {
            currentId = crypto.randomUUID();
            setConversationId(currentId);
            conversationIdRef.current = currentId; // Update ref immediately
        }

        try {
            // Now sendMessage will trigger our custom fetch which injects the ID
            await (sendMessage as any)({ 
                text: contentSnapshot,
                // We also pass it here just in case the SDK uses it directly
                conversationId: currentId
            });
            
            // Refresh list after a delay
            setTimeout(loadConversationList, 1500);
        } catch (err) {
            console.error('Connection Error:', err);
        }
    };

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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold uppercase text-xs tracking-widest text-white">OmniiAi</span>
                    </div>
                </div>

                <div className="p-4">
                    <button 
                        onClick={startNewChat}
                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">New Chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">History</p>
                    {historicalConversations.map((conv) => (
                        <div 
                            key={conv.id}
                            onClick={() => loadConversation(conv.id)}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all duration-300 border",
                                conversationId === conv.id 
                                    ? "bg-white/[0.05] border-white/[0.1] text-white" 
                                    : "bg-transparent border-transparent text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"
                            )}
                        >
                            <MessageSquare className={cn(
                                "w-4 h-4 shrink-0 transition-colors",
                                conversationId === conv.id ? "text-purple-400" : "text-zinc-500"
                            )} />
                            <span className="flex-1 text-sm font-medium truncate">
                                {conv.topic || 'Untitled Chat'}
                            </span>
                            
                            <button
                                onClick={(e) => deleteConversation(e, conv.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {historicalConversations.length === 0 && (
                        <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl">
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">No chats found</p>
                        </div>
                    )}
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
                <header className="h-20 border-b border-white/[0.05] flex items-center px-8 justify-between bg-black/20 backdrop-blur-xl z-40">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <ChevronRight className={cn("w-5 h-5 text-zinc-400 transition-transform duration-500", isSidebarOpen ? "rotate-180" : "rotate-0")} />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold text-white uppercase tracking-widest">OmniiAi</h2>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Gemma 4 · Assistant</p>
                        </div>
                    </div>
                </header>

                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-8 py-12 space-y-8 custom-scrollbar scroll-smooth"
                >
                    <div className="max-w-4xl mx-auto space-y-12">
                        {messages.map((m) => {
                            const messageText = m.parts
                                ?.filter(p => p.type === 'text')
                                .map(p => p.text)
                                .join('\n') || (m as any).content || '';

                            return (
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
                                            {m.role === 'user' ? 'You' : 'OmniiAi'}
                                        </span>
                                        <div className={cn(
                                            "p-6 rounded-2xl text-sm leading-relaxed prose prose-invert max-w-none",
                                            "prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl",
                                            m.role === 'user' 
                                                ? "bg-white text-black font-medium rounded-tr-none prose-p:text-black prose-strong:text-black" 
                                                : "bg-white/[0.03] border border-white/[0.05] text-zinc-300 rounded-tl-none"
                                        )}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {messageText}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
                                Error: {error.message || 'An unexpected error occurred.'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-gradient-to-t from-[#020202] to-transparent">
                    <form 
                        onSubmit={handleFormSubmit}
                        className="max-w-4xl mx-auto relative group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                        <div className="relative flex items-center bg-zinc-900 border border-white/[0.05] rounded-2xl p-2 pl-6 focus-within:border-cyan-500/50 transition-all shadow-2xl shadow-black/50">
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Message OmniiAi..."
                                className="flex-1 bg-transparent border-none py-4 text-sm focus:outline-none placeholder:text-zinc-600 text-zinc-100"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="w-12 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white group"
                            >
                                <Send className={cn("w-5 h-5 transition-transform", !isLoading && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                            </button>
                        </div>
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
