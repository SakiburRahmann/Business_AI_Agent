"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    BrainCircuit,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Agents', href: '/dashboard/agents', icon: BrainCircuit },
    { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
    { name: 'Analytics', href: '/dashboard/analytics', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0A0A0A]">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                        <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">OmniiLearn AI</span>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                                pathname === item.href
                                    ? "bg-white/5 text-purple-400 border border-white/5"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5",
                                pathname === item.href ? "text-purple-400" : "group-hover:text-white"
                            )} />
                            <span className="font-medium">{item.name}</span>
                            {pathname === item.href && (
                                <ChevronRight className="w-4 h-4 ml-auto text-purple-400" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-3 py-2 w-full text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                        <span className="font-bold">OmniiLearn AI</span>
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-xs text-zinc-500">Business Plan</span>
                            <span className="text-sm font-medium">Acme Corp</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs">
                            AC
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <section className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>

                    {/* Subtle Background Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />
                </section>
            </main>
        </div>
    );
}
