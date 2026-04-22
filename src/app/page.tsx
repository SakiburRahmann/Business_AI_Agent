import { Cpu, MessageSquare, Zap, Shield, ArrowRight, BarChart3, Globe2, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * OmniiChat 1.0 - Professional Business Landing Page
 * Redesigned for standard business conventions and premium aesthetic.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black font-outfit uppercase tracking-tighter">OmniiChat</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="#solutions" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Solutions</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors px-4">Login</Link>
            <Link 
              href="/signup" 
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6 overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent blur-[120px] -z-10" />
          
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Enterprise-Grade AI Architecture</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white font-outfit uppercase tracking-tighter mb-8 leading-[0.9]">
              The Intelligence Layer for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Modern Business</span>
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed tracking-tight">
              OmniiChat delivers professional-grade conversational AI designed to streamline complex business workflows and enhance organizational productivity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/signup"
                className="group px-10 py-5 rounded-2xl bg-white text-black text-sm font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login"
                className="px-10 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm font-black uppercase tracking-widest hover:bg-white/[0.05] transition-all w-full sm:w-auto justify-center"
              >
                Documentation
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 border-t border-white/[0.03]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-yellow-400" />,
                  title: "High Performance",
                  desc: "Ultra-low latency inference powered by the latest Gemini 3.1 architecture."
                },
                {
                  icon: <Shield className="w-6 h-6 text-cyan-400" />,
                  title: "Secure Access",
                  desc: "Enterprise-standard authentication and data encryption protocols."
                },
                {
                  icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
                  title: "Conversational Context",
                  desc: "Advanced multi-session memory for consistent and relevant business results."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 font-outfit uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/[0.03] bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Cpu className="text-white w-5 h-5" />
            </div>
            <span className="text-sm font-black font-outfit uppercase tracking-widest">OmniiChat</span>
          </div>
          
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
            © 2026 Omnii Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
