"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Loader2, User, Building2, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [step, setStep] = React.useState<'form' | 'otp'>('form');

    // Form State
    const [fullName, setFullName] = React.useState('');
    const [businessName, setBusinessName] = React.useState('');
    const [email, setEmail] = React.useState('');

    // OTP State
    const [otp, setOtp] = React.useState('');

    const [error, setError] = React.useState<{ message: string; details?: string } | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        console.log(`[Auth] Attempting OTP signup for: ${email}`);

        try {
            const supabase = createClient();

            const { error: authError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                    data: {
                        full_name: fullName,
                        business_name: businessName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                console.error('[Auth Error]:', authError);
                // Detailed error for debugging (e.g. rate limits)
                setError({
                    message: authError.message,
                    details: authError.status?.toString() === '429' ? 'Too many requests. Please wait a few minutes before trying again.' : undefined
                });
                return;
            }

            console.log('[Auth] OTP sent successfully');
            setStep('otp');
        } catch (err: any) {
            console.error('[Unexpected Error]:', err);
            setError({ message: 'An unexpected system error occurred.', details: err.message });
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

            setIsSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError({ message: 'Failed to verify code. Please try again.' });
            console.error('OTP error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="w-full max-w-[440px] relative z-10 bg-white/[0.02] border border-white/5 p-12 rounded-[32px] backdrop-blur-md text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Account Verified</h1>
                    <p className="text-zinc-400 leading-relaxed mb-8">
                        Welcome to OmniiAi, <span className="text-white font-medium">{fullName}</span>.
                        We&apos;re preparing your Command Center...
                    </p>
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Build Identifier (for visual sync verification) */}
            <div className="absolute top-4 right-4 text-[8px] text-zinc-800 pointer-events-none select-none">
                BUILD_ID: ff7d50d_OTP_V2
            </div>

            <div className="w-full max-w-[440px] relative z-10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {step === 'form' ? 'Start Free Trial' : 'Confirm Identity'}
                    </h1>
                    <p className="text-zinc-400 mt-2 text-sm">
                        {step === 'form'
                            ? 'Experience the power of autonomous business AI'
                            : `A 6-digit code has been sent to ${email}`}
                    </p>
                </div>

                {step === 'form' ? (
                    <form onSubmit={handleSignupSubmit} className="space-y-4 bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-md">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Sakibur Rahman"
                                    className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Business Name</label>
                            <div className="relative group">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="OmniiAi Solutions"
                                    className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error.message}</span>
                                </div>
                                {error.details && (
                                    <p className="text-[10px] text-zinc-500 ml-1">{error.details}</p>
                                )}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-white/5 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Get Verification Code
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-[10px] text-zinc-500 text-center px-4 leading-relaxed">
                            No password required. We&apos;ll send a secure single-use code to your email.
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-md">
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 block text-center">Enter 6-digit Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="w-full bg-[#111] border border-white/10 rounded-xl py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error.message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Start Trial"}
                        </button>

                        <div className="text-center space-y-2">
                            <button
                                type="button"
                                onClick={() => setStep('form')}
                                className="text-sm text-zinc-500 hover:text-white transition-colors"
                            >
                                Change email address
                            </button>
                        </div>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white font-medium hover:underline underline-offset-4">Log in</Link>
                </p>
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30 select-none">
                <span className="text-xs font-medium tracking-widest uppercase">Powered by Sakibur Rahman</span>
            </div>
        </div>
    );
}
// Sync Trigger: Thu Feb 26 03:41:55 AM +06 2026
