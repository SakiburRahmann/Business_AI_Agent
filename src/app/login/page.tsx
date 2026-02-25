"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Loader2, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [method, setMethod] = React.useState<'password' | 'otp'>('password');
    const [step, setStep] = React.useState<'entry' | 'verification'>('entry');

    // Auth State
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    // UI State
    const [error, setError] = React.useState<{ message: string } | null>(null);

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError({ message: authError.message });
                return;
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError({ message: 'Authentication failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (authError) {
                setError({ message: authError.message });
                return;
            }

            setStep('verification');
        } catch (err: any) {
            setError({ message: 'Request failed. Use password login instead.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            });

            if (verifyError) {
                setError({ message: verifyError.message });
                return;
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError({ message: 'Verification code expired or invalid.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative lg:p-12 overflow-hidden selection:bg-blue-500/30">
            {/* Professional Background Architecture */}
            <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none opacity-40" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none opacity-40" />

            {/* Global Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="w-full max-w-[420px] relative z-10">
                <div className="mb-10 text-center flex flex-col items-center animate-in fade-in duration-1000">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center p-[1px] mb-8 shadow-3xl shadow-blue-500/20 group">
                        <div className="w-full h-full bg-[#050505] rounded-[15px] flex items-center justify-center">
                            <BrainCircuit className="w-9 h-9 text-white opacity-90 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-3">Authorize Access</h1>
                    <p className="text-zinc-500 font-medium text-sm">Secure entry to the OmniiAi Command Center.</p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-white/[0.01] border border-white/[0.05] p-1 shadow-2xl rounded-[44px] backdrop-blur-3xl overflow-hidden">
                        {/* Tab Switcher */}
                        {step === 'entry' && (
                            <div className="flex p-2 gap-1 bg-white/[0.02] m-2 rounded-[32px] border border-white/[0.02]">
                                <button
                                    onClick={() => setMethod('password')}
                                    className={`flex-1 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${method === 'password' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Password
                                </button>
                                <button
                                    onClick={() => setMethod('otp')}
                                    className={`flex-1 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${method === 'otp' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Login Code
                                </button>
                            </div>
                        )}

                        <div className="p-8 pt-6">
                            {step === 'entry' ? (
                                <form onSubmit={method === 'password' ? handlePasswordLogin : handleOtpRequest} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Secure Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="operative@omnii.ai"
                                                className="w-full bg-[#080808] border border-white/[0.07] rounded-3xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 transition-all text-[15px] placeholder:text-zinc-800"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {method === 'password' && (
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center px-2">
                                                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Keyphrase</label>
                                                <Link href="#" className="text-[11px] text-zinc-600 hover:text-white transition-colors font-bold uppercase tracking-widest">Forgot?</Link>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full bg-[#080808] border border-white/[0.07] rounded-3xl py-4 pl-12 pr-12 outline-none focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 transition-all text-[15px] placeholder:text-zinc-800"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-400 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="flex items-center gap-3 text-red-400 text-xs bg-red-400/5 p-4 rounded-3xl border border-red-400/10 animate-in shake duration-500">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span className="font-bold tracking-tight">{error.message}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-black font-black py-4.5 rounded-3xl hover:bg-zinc-200 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group tracking-tight"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                {method === 'password' ? 'Authenticate' : 'Request Access Code'}
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-500" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in zoom-in-95 duration-500">
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 rounded-[32px] bg-blue-500/5 flex items-center justify-center ring-1 ring-blue-500/20 shadow-2xl shadow-blue-500/10">
                                            <Fingerprint className="w-10 h-10 text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-center">
                                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] block">Handshake Code</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            placeholder="000000"
                                            className="w-full bg-[#080808] border border-white/[0.07] rounded-3xl py-5 text-center text-3xl font-black tracking-[0.6em] outline-none focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all"
                                            required
                                            autoFocus
                                        />
                                        <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest">Code dispatched to encrypted mail.</p>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-3 text-red-400 text-xs bg-red-400/5 p-4 rounded-3xl border border-red-400/10">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span className="font-bold">{error.message}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading || otp.length !== 6}
                                        className="w-full bg-white text-black font-black py-4.5 rounded-3xl hover:bg-zinc-200 active:scale-[0.98] transition-all duration-300 disabled:opacity-20"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep('entry')}
                                        className="w-full text-[11px] text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-[0.2em]"
                                    >
                                        Back to Entry
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center animate-in fade-in duration-1000 delay-500">
                    <p className="text-[14px] font-medium text-zinc-500">
                        Newoperative?{" "}
                        <Link href="/signup" className="text-white hover:text-blue-400 transition-colors underline-offset-8 hover:underline">Register Conduit</Link>
                    </p>
                </div>
            </div>

            {/* Premium Branding Footer */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-15 select-none pointer-events-none">
                <span className="text-[9px] font-black tracking-[0.5em] uppercase text-zinc-500 whitespace-nowrap">Authorized Intelligence Ops</span>
            </div>
        </div>
    );
}
