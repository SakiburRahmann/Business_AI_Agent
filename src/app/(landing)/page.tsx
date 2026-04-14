import Link from 'next/link';
import { ArrowRight, Zap, Target, Shield, Cpu, MessageSquare, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Neural Network (CSS-Based) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#020202]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/[0.03] backdrop-blur-md bg-black/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 p-[1px]">
              <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase font-outfit">OmniiChat</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Neural Core</a>
            <a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors px-4">Login</Link>
            <Link href="/signup" className="px-5 py-2.5 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Initialize
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-24 md:py-40 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 animate-fade-in">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Omnii Protocol 1.0 Active</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white max-w-5xl leading-[0.95] tracking-tighter mb-8 font-outfit">
            Next-Gen Neural <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-cyan-400">Conversational Web</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
            Architecture for the future of human-AI interaction. Experience sub-100ms 
            inference latencies with a design-first interface.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link href="/signup" className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(147,51,234,0.3)]">
              Begin Sequence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#demo" className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
              Watch Deployment <div className="w-6 h-6 rounded-full border border-zinc-800 flex items-center justify-center"><div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-current border-b-[3px] border-b-transparent ml-1" /></div>
            </Link>
          </div>
        </section>

        {/* Neural Visualization (Mock) */}
        <section className="px-6 py-12 flex justify-center">
            <div className="relative w-full max-w-4xl aspect-video rounded-3xl border border-white/[0.05] bg-zinc-900/40 backdrop-blur-xl overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="w-full h-full flex items-center justify-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-purple-500/20 blur-[60px] animate-pulse" />
                        <MessageSquare className="w-16 h-16 text-white/20 absolute inset-0 m-auto animate-bounce" />
                    </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-white font-bold opacity-80">Syncing with Gemini 2.5 Flash...</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-1 bg-white/10 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 py-32 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="w-5 h-5 text-yellow-400" />}
              title="Sonic Latency"
              description="Proprietary throughput optimizations deliver responses before you finish your thought."
            />
            <FeatureCard 
              icon={<Target className="w-5 h-5 text-cyan-400" />}
              title="Precision Context"
              description="High-fidelity long-term memory integration via Supabase vector indexing."
            />
            <FeatureCard 
              icon={<Shield className="w-5 h-5 text-green-400" />}
              title="Zero-Leak Security"
              description="Industrial-grade encryption at rest and in transit. Your data never leaves your link."
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-20 border-t border-white/[0.02] text-center">
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-600 mb-4">Neural Protocol v1.07</p>
           <p className="text-zinc-500 text-xs tracking-tighter">&copy; 2026 OmniiChat Infrastructure. Built by Sakibur Rahman.</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col gap-4 p-8 rounded-3xl bg-zinc-900/20 border border-white/[0.02] hover:bg-zinc-900/40 hover:border-white/[0.05] transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white font-outfit uppercase tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
