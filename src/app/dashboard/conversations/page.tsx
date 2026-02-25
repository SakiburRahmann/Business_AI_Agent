
import {
    Search,
    MessageSquare,
    Phone,
    Instagram,
    Mail,
    Clock,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

export default function ConversationsPage() {
    const conversations = [
        {
            id: '1',
            name: '+1 (555) 123-4567',
            channel: 'whatsapp',
            lastMessage: "I'd like to book an appointment for Tuesday at 4 PM.",
            time: '2 mins ago',
            status: 'OPEN',
            agent: 'Sarah (Sales)',
            sentiment: 'POSITIVE'
        },
        {
            id: '2',
            name: 'Michael Chen',
            channel: 'voice',
            lastMessage: "Voice Call: Rescheduled to next Monday.",
            time: '15 mins ago',
            status: 'CLOSED',
            agent: 'Support_Bot',
            sentiment: 'NEUTRAL'
        },
        {
            id: '3',
            name: 'emma_design_22',
            channel: 'instagram',
            lastMessage: "How much is the premium package?",
            time: '1 hour ago',
            status: 'ESCALATED',
            agent: 'Sales_Lead',
            sentiment: 'NEGATIVE'
        },
    ];

    const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
        whatsapp: MessageSquare,
        voice: Phone,
        instagram: Instagram,
        email: Mail,
    };

    const channelColors: Record<string, string> = {
        whatsapp: 'text-green-400 bg-green-500/10',
        voice: 'text-purple-400 bg-purple-500/10',
        instagram: 'text-pink-400 bg-pink-500/10',
        email: 'text-blue-400 bg-blue-500/10',
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
                    <p className="text-zinc-400 mt-1">Real-time interaction logs of your AI agents.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="bg-[#111] border border-white/5 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-purple-500/50 text-sm w-full md:w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Channel</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Agent</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Last Interaction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {conversations.map((conv) => {
                                const Icon = channelIcons[conv.channel];
                                return (
                                    <tr key={conv.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">{conv.name}</span>
                                                <span className="text-xs text-zinc-500 truncate max-w-[200px] mt-0.5">{conv.lastMessage}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border border-white/5",
                                                channelColors[conv.channel]
                                            )}>
                                                <Icon className="w-3 h-3" />
                                                {conv.channel}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-zinc-300 font-medium">{conv.agent}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded border capitalize",
                                                conv.status === 'OPEN' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                    conv.status === 'CLOSED' ? "bg-zinc-800 text-zinc-500 border-zinc-700" :
                                                        "bg-red-500/10 text-red-400 border-red-500/20"
                                            )}>
                                                {conv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                    <Clock className="w-3 h-3" />
                                                    {conv.time}
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-purple-400 font-bold uppercase mt-1">
                                                    Details <ExternalLink className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-zinc-500 px-6">
                    <span>Showing 1-10 of {conversations.length} records</span>
                    <div className="flex items-center gap-4">
                        <button disabled className="opacity-50 cursor-not-allowed">Previous</button>
                        <button className="hover:text-white transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
