"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Loader2, AlertCircle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [step, setStep] = React.useState<'email' | 'otp'>('email');
    const [email, setEmail] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            setStep('otp');
        } catch (err: any) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Login error:', err);
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
                setError(verifyError.message);
                return;
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError('Failed to verify code. Please try again.');
            console.error('OTP error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="w-full max-w-[400px] relative z-10 bg-white/[0.02] border border-white/5 p-12 rounded-[32px] backdrop-blur-md text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
                    <p className="text-zinc-400 leading-relaxed mb-4">
                        Identity verified successfully.
                    </p>
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[400px] relative z-10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Login to OmniiAi</h1>
                    <p className="text-zinc-400 mt-2 text-sm">
                        {step === 'email'
                            ? 'Enter your email to receive a secure login code'
                            : `Verification code sent to ${email}`}
                    </p>
                </div>

                {step === 'email' ? (
                    <form onSubmit={handleEmailSubmit} className="space-y-4 bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-md">
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
                            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Send Login Code
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
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
                                <label className="text-sm font-medium text-zinc-300 block text-center">Verification Code</label>
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
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm & Login"}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="text-sm text-zinc-500 hover:text-white transition-colors"
                            >
                                Back to email entry
                            </button>
                        </div>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-white font-medium hover:underline underline-offset-4">Create one</Link>
                </p>
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30 select-none">
                <span className="text-xs font-medium tracking-widest uppercase">Powered by Sakibur Rahman</span>
            </div>
        </div>
    );
}
