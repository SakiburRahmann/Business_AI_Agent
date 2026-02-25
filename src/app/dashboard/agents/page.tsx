import {
    Bot,
    Settings,
    Plus,
    Search,
    MoreVertical,
    Power,
    Phone,
    MessageCircle,
    Instagram,
    Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentsPage() {
    const agents = [
        {
            id: '1',
            name: 'Customer Support Pro',
            status: 'ACTIVE',
            channels: ['whatsapp', 'voice', 'email'],
            conversations: 124,
            lastActive: '3 mins ago'
        },
        {
            id: '2',
            name: 'Sales Specialist',
            status: 'ACTIVE',
            channels: ['instagram', 'messenger'],
            conversations: 89,
            lastActive: '12 mins ago'
        },
        {
            id: '3',
            name: 'Appointment Scheduler',
            status: 'INACTIVE',
            channels: ['voice'],
            conversations: 45,
            lastActive: '2 days ago'
        },
    ];

    const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
        whatsapp: MessageCircle,
        voice: Phone,
        email: Mail,
        instagram: Instagram,
        messenger: MessageCircle, // Using MessageCircle for messenger too
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
                    <p className="text-zinc-400 mt-1">Manage and configure your autonomous business agents.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            className="bg-[#111] border border-white/5 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-purple-500/50 text-sm w-full md:w-64"
                        />
                    </div>
                    <button className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-zinc-200 transition-colors whitespace-nowrap">
                        <Plus className="w-4 h-4" />
                        New Agent
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                    <div key={agent.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-purple-400" />
                                </div>
                                <button className="text-zinc-500 hover:text-white transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold">{agent.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full shadow-[0_0_8px]",
                                        agent.status === 'ACTIVE' ? "bg-green-500 shadow-green-500/50" : "bg-zinc-600 shadow-zinc-600/50"
                                    )} />
                                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{agent.status}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                {agent.channels.map(channel => {
                                    const Icon = channelIcons[channel];
                                    return (
                                        <div key={channel} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-help" title={channel}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-500 uppercase font-semibold">Conversations</span>
                                    <span className="text-sm font-bold text-zinc-200">{agent.conversations}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-500 uppercase font-semibold">Last Active</span>
                                    <span className="text-sm font-bold text-zinc-200">{agent.lastActive}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button className="flex-1 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-300 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Configure
                                </button>
                                <button className={cn(
                                    "p-2 rounded-lg transition-all",
                                    agent.status === 'ACTIVE' ? "bg-zinc-900 text-zinc-500 hover:text-red-400" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                )}>
                                    <Power className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create Card Prompt */}
                <div className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 gap-4 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                        <Plus className="w-6 h-6 text-zinc-500 group-hover:text-purple-400" />
                    </div>
                    <p className="text-zinc-500 font-medium group-hover:text-zinc-300 transition-all text-center">
                        Hire another AI agent <br /> for your team
                    </p>
                </div>
            </div>
        </div>
    );
}
