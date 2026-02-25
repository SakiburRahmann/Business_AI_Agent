"use client";

import React from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  MessageSquare,
  Phone,
  Zap,
  ShieldCheck,
  ArrowRight,
  Calendar,
  FileText,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">OmniiAi</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Log In</Link>
            <Link href="/signup" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent -z-10 blur-[120px]" />

          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              v2.0 is now live with Voice Integration
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.1]">
              Your Business, <br className="hidden md:block" />
              Automated by Intelligence.
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
              Deploy autonomous AI agents that handle WhatsApp, Voice calls, and Email.
              24/7 customer service, scheduled bookings, and instant invoicing.
              Built for the modern enterprise.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2 group">
                Build Your Agent <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>

            {/* Platform Preview Placeholder */}
            <div className="mt-20 relative px-4">
              <div className="max-w-5xl mx-auto p-4 rounded-3xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="aspect-[16/10] bg-[#0A0A0A] rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 group-hover:opacity-100 transition-opacity" />
                  <BrainCircuit className="w-20 h-20 text-white/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Autonomous Capability.</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Our agents don&apos;t just talk; they act. Integrated directly with your business logic.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <MessageSquare className="w-6 h-6" />,
                  title: "Smart Messaging",
                  desc: "Native WhatsApp & Instagram integration with 100% human-like reasoning."
                },
                {
                  icon: <Phone className="w-6 h-6" />,
                  title: "HD Voice AI",
                  desc: "Crystal-clear voice calls with low latency. Handle inquiries while you sleep."
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  title: "Enterprise Security",
                  desc: "Multi-tenant data isolation and bank-grade encryption at every step."
                }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-purple-500/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:text-purple-400 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The "Limbs" Section */}
        <section className="py-32 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Equipped with <span className="text-purple-500">Limbs</span>.</h2>
              <p className="text-zinc-400 text-lg mb-12">
                OmniiAi agents are connected to tools that allow them to perform real-world tasks instantly.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Calendar />, title: "Automated Rescheduling", text: "Synced with Google Calendar & Outlook." },
                  { icon: <FileText />, title: "Dynamic Invoicing", text: "Instant generation and payment tracking." },
                  { icon: <Globe />, title: "Omnichannel Sync", text: "Consistent state across WhatsApp, Phone, and Email." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="text-purple-500 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-zinc-500">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full" />
              <div className="relative p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="text-xs text-zinc-600 ml-2 font-mono italic">live-agent-log.sh</span>
                </div>
                <div className="font-mono text-sm space-y-4">
                  <p className="text-blue-400"># Incoming customer query: &quot;Can I book for Monday?&quot;</p>
                  <p className="text-purple-400">[AI] Checking availability for 2026-03-02...</p>
                  <p className="text-green-400">[Tool] book_appointment(date: &quot;2026-03-02&quot;, time: &quot;10:00&quot;)</p>
                  <p className="text-white">Success: Appointment confirmed for Sarah Miller.</p>
                  <p className="text-zinc-500 animate-pulse">_</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-6 text-center">
          <div className="max-w-4xl mx-auto p-12 md:p-24 rounded-[40px] bg-gradient-to-b from-zinc-900 to-black border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-purple-600/20 blur-[100px] pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to evolve?</h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto">
              Join 500+ businesses automating their growth with industrial-grade AI agents.
            </p>
            <Link href="/signup" className="px-12 py-5 rounded-full bg-white text-black font-bold text-xl hover:bg-zinc-200 transition-all shadow-2xl shadow-white/10 inline-flex items-center gap-3 group">
              Start Building <Zap className="w-5 h-5 fill-current" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-bold tracking-tight">OmniiAi</span>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs text-center md:text-left">
              The world&apos;s most powerful autonomous agent platform for modern businesses.
            </p>
          </div>

          <div className="flex gap-12 text-sm text-zinc-500 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>

          <div className="text-xs font-mono text-zinc-700 tracking-widest uppercase">
            Built by Sakibur Rahman
          </div>
        </div>
      </footer>
    </div>
  );
}
