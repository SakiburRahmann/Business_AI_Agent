"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Loader2, Lock, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    // Auth State
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    // UI State
    const [error, setError] = React.useState<string | null>(null);
    const [isEmailUnconfirmed, setIsEmailUnconfirmed] = React.useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setIsEmailUnconfirmed(false);

        try {
            const supabase = createClient();

            console.log(`[Login] Attempting sign-in for ${email}`);

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                console.error('[Login Error]', authError);

                // Handle unconfirmed email
                if (authError.message.toLowerCase().includes('email not confirmed')) {
                    setIsEmailUnconfirmed(true);
                    setError('Please verify your email before signing in.');
                } else {
                    setError(authError.message);
                }
                return;
            }

            console.log('[Login Success] Session established');
            router.push('/dashboard');
        } catch (err: any) {
            setError('Account access failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_transparent_70%)] opacity-50" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600 mb-6 shadow-lg shadow-purple-500/20">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Sign into your account</h1>
                    <p className="text-zinc-400">Welcome back! Please enter your details.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500 transition-colors text-[15px]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-semibold text-zinc-400">Password</label>
                            <Link href="#" className="text-[11px] text-zinc-500 hover:text-white transition-colors">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500 transition-colors text-[15px]"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm animate-in fade-in slide-in-from-top-1 ${isEmailUnconfirmed
                                ? 'bg-amber-400/5 border-amber-400/10 text-amber-400'
                                : 'bg-red-400/5 border-red-400/10 text-red-400'
                            }`}>
                            {isEmailUnconfirmed ? <ShieldAlert className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            <div className="space-y-1">
                                <p className="font-semibold">{isEmailUnconfirmed ? 'Verification Required' : 'Login Failed'}</p>
                                <p className="text-xs opacity-80">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-lg shadow-purple-600/10"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>

                    {isEmailUnconfirmed && (
                        <div className="text-center">
                            <Link
                                href="/signup"
                                className="text-xs text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4"
                            >
                                Go to verification page
                            </Link>
                        </div>
                    )}
                </form>

                <p className="mt-8 text-center text-[15px] text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-white hover:underline transition-colors font-semibold">Create one</Link>
                </p>
            </div>

            <div className="mt-12 text-[11px] text-zinc-700 uppercase tracking-widest relative z-10 font-bold">
                OmniiAi Business Cloud
            </div>
        </div>
    );
}
