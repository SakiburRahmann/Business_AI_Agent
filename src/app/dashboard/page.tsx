import {
    Plus,
    TrendingUp,
    PhoneCall,
    MessageSquare,
    Clock
} from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-zinc-400 mt-1">Track your AI agents performance today.</p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create New Agent
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Conversations', value: '1,284', trend: '+12%', icon: MessageSquare, color: 'text-blue-400' },
                    { label: 'Voice Calls', value: '432', trend: '+5%', icon: PhoneCall, color: 'text-purple-400' },
                    { label: 'Avg Latency', value: '420ms', trend: '-10%', icon: Clock, color: 'text-green-400' },
                    { label: 'Conversion Rate', value: '18.2%', trend: '+3%', icon: TrendingUp, color: 'text-yellow-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-zinc-500">{stat.trend}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">{stat.value}</span>
                            <span className="text-sm text-zinc-400">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Active Conversations</h3>
                        <span className="text-xs text-zinc-500 underline cursor-pointer">View all</span>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold">
                                        JS
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">John Smith</p>
                                        <p className="text-xs text-zinc-500 truncate">Agent: Sales_Pro_01 • 2 mins ago</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/10">Active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-lg mb-6">Service Status</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Gemini Engine', status: 'Online', latency: '240ms' },
                            { name: 'Voice Interface', status: 'Online', latency: '410ms' },
                            { name: 'WhatsApp Meta', status: 'Online', latency: '120ms' },
                            { name: 'Database API', status: 'Stable', latency: '12ms' },
                        ].map((service, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{service.name}</span>
                                    <span className="text-[10px] text-zinc-500">Latency: {service.latency}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs text-green-400">{service.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
