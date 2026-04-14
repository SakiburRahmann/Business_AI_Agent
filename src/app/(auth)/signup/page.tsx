'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, ArrowRight, Loader2, ShieldCheck, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Initialization failed.');
        
        router.push('/chat');
        router.refresh();
    } catch (err: any) {
        setError(err.message || 'Initialization failed. Please check credentials.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden text-zinc-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10 text-center">
            <Link href="/" className="mb-6 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 p-[1px] group-hover:scale-110 transition-transform">
                    <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                </div>
            </Link>
            <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter mb-2">Protocol Initialization</h1>
            <p className="text-zinc-500 text-sm tracking-tight">Establish your secure link to the Omnii Infrastructure.</p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/[0.05] rounded-[32px] p-8 shadow-2xl relative">
            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6 text-zinc-100">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Identity (Email)</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Mail className="w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-700"
                            placeholder="architect@infrastructure.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Access Cipher (Password)</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Lock className="w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-700"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>Establish Link <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/[0.02] text-center text-xs">
                <p className="text-zinc-600">
                    Already authenticated? <Link href="/login" className="text-white hover:text-purple-400 transition-colors">Decrypt session</Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
