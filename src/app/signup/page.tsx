"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Loader2, User, Building2, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [step, setStep] = React.useState<'form' | 'verification'>('form');

    // Form State
    const [fullName, setFullName] = React.useState('');
    const [businessName, setBusinessName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    // UI State
    const [error, setError] = React.useState<{ message: string; details?: string } | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        console.log(`[Auth] Initiating professional signup for: ${email}`);

        try {
            const supabase = createClient();

            // Industrial Grade: Hybrid OTP + Password approach
            // Use standard signUp for password support
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        business_name: businessName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                setError({ message: authError.message });
                return;
            }

            // Check if user is already checked or needs verification
            if (data?.session) {
                setIsSuccess(true);
                setTimeout(() => router.push('/dashboard'), 1500);
            } else {
                setStep('verification');
            }
        } catch (err: any) {
            setError({ message: 'System unavailable. Please try again later.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="w-full max-w-[400px] relative z-20 bg-emerald-500/5 border border-emerald-500/20 p-12 rounded-[40px] backdrop-blur-3xl text-center shadow-2xl shadow-emerald-500/10">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 tracking-tight">Identity Secured</h1>
                    <p className="text-zinc-400 leading-relaxed mb-6 font-medium">
                        Welcome to the ecosystem, <span className="text-white underline decoration-emerald-500/50 underline-offset-4">{fullName}</span>.
                    </p>
                    <div className="flex justify-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative lg:p-12 overflow-hidden selection:bg-purple-500/30">
            {/* Professional Background Architecture */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_70%)] pointer-events-none z-0" />

            {/* Global Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Subtle Build Tracker for internal verification */}
            <div className="absolute top-6 right-8 text-[9px] font-mono text-zinc-800 tracking-tighter uppercase pointer-events-none select-none">
                OMNII_SEC_FLIGHT_V13_HYBRID
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                <div className="mb-10 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-400 flex items-center justify-center p-[1px] mb-6 shadow-2xl shadow-purple-500/20 group hover:scale-105 transition-transform duration-500 cursor-pointer">
                        <div className="w-full h-full bg-[#080808] rounded-[15px] flex items-center justify-center">
                            <BrainCircuit className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        {step === 'form' ? 'Join the Sovereign' : 'Verify Intelligence'}
                    </h1>
                    <p className="text-zinc-400 font-medium text-sm max-w-[280px]">
                        {step === 'form'
                            ? 'Scale your enterprise with autonomous AI agents.'
                            : `A security conduit has been opened to ${email}`}
                    </p>
                </div>

                {step === 'form' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <form onSubmit={handleSignupSubmit} className="space-y-4 bg-white/[0.015] border border-white/5 p-8 rounded-[40px] backdrop-blur-2xl shadow-3xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-600 group-focus-within:text-white transition-all duration-300" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-purple-500/40 focus:ring-8 focus:ring-purple-500/5 transition-all text-[15px] placeholder:text-zinc-800"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Company</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-600 group-focus-within:text-white transition-all duration-300" />
                                        <input
                                            type="text"
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            placeholder="OmniiAi"
                                            className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-purple-500/40 focus:ring-8 focus:ring-purple-500/5 transition-all text-[15px] placeholder:text-zinc-800"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Professional Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-600 group-focus-within:text-white transition-all duration-300" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ceo@enterprise.com"
                                        className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-purple-500/40 focus:ring-8 focus:ring-purple-500/5 transition-all text-[15px] placeholder:text-zinc-800"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-600 group-focus-within:text-white transition-all duration-300" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-2xl py-3.5 pl-11 pr-12 outline-none focus:border-purple-500/40 focus:ring-8 focus:ring-purple-500/5 transition-all text-[15px] placeholder:text-zinc-800"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 text-red-400 text-[13px] bg-red-400/5 p-4 rounded-2xl border border-red-400/10 animate-in shake duration-500">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span className="font-medium">{error.message}</span>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Begin Integration
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="animate-in fade-in scale-in-95 duration-500">
                        <div className="space-y-6 bg-white/[0.015] border border-white/5 p-10 rounded-[40px] backdrop-blur-3xl text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto ring-1 ring-indigo-500/20">
                                <ShieldCheck className="w-8 h-8 text-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold">Verify Intelligence</h2>
                                <p className="text-zinc-500 text-sm">We&apos;ve dispatched a validation conduit to your inbox. Please check your email to complete the handshake.</p>
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={() => setStep('form')}
                                    className="text-sm font-bold text-zinc-400 hover:text-white transition-colors underline decoration-zinc-800 underline-offset-8"
                                >
                                    Return to Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <p className="mt-10 text-center text-[15px] font-medium text-zinc-500">
                    Existing operative?{" "}
                    <Link href="/login" className="text-white hover:text-purple-400 transition-colors">Authorize Access</Link>
                </p>
            </div>

            {/* Premium Footer Branding */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity duration-1000 cursor-default select-none group">
                <div className="h-[1px] w-8 bg-gradient-to-l from-zinc-500 to-transparent group-hover:w-12 transition-all duration-1000" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-400">Sakibur Rahman Elite</span>
                <div className="h-[1px] w-8 bg-gradient-to-r from-zinc-500 to-transparent group-hover:w-12 transition-all duration-1000" />
            </div>
        </div>
    );
}
