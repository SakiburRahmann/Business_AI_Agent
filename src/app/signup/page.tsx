"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Loader2, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [step, setStep] = React.useState<'details' | 'verify'>('details');

    // Form State
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [businessName, setBusinessName] = React.useState('');
    const [password, setPassword] = React.useState('');

    // Verification State
    const [otp, setOtp] = React.useState('');
    const [verificationToken, setVerificationToken] = React.useState<string | null>(null);

    // UI State
    const [error, setError] = React.useState<string | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [resendStatus, setResendStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            console.log(`[Signup] Initializing Supabase registration for ${email}`);

            // 1. Register user in Supabase (with email confirmation disabled in dash)
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        business_name: businessName,
                        full_name: `${firstName} ${lastName}`.trim(),
                    },
                },
            });

            if (signupError) {
                console.error('[Supabase Error]', signupError);
                setError(signupError.message);
                setIsLoading(false);
                return;
            }

            console.log('[Supabase Success] User created. Now sending Resend OTP.');

            // 2. Send custom OTP via Resend API
            const response = await fetch('/api/auth/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, firstName }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Failed to send verification email');
                setIsLoading(false);
                return;
            }

            setVerificationToken(result.token);
            setStep('verify');
        } catch (err: any) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setResendStatus('sending');
        setError(null);
        try {
            const response = await fetch('/api/auth/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, firstName }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Failed to resend email');
                setResendStatus('idle');
            } else {
                setVerificationToken(result.token);
                setResendStatus('sent');
                setTimeout(() => setResendStatus('idle'), 5000);
            }
        } catch (err) {
            setError('Failed to resend code.');
            setResendStatus('idle');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Validate via our API using the signed token
            const response = await fetch('/api/auth/otp', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code: otp,
                    token: verificationToken
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Verification failed');
                setIsLoading(false);
                return;
            }

            // Verification successful!
            setIsSuccess(true);

            // Log in the user automatically
            const supabase = createClient();
            await supabase.auth.signInWithPassword({ email, password });

            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError('Verification process failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-10 rounded-3xl text-center shadow-xl">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Verification Complete</h1>
                    <p className="text-zinc-400 mb-8">
                        Welcome, {firstName}! We&apos;re preparing your workspace...
                    </p>
                    <div className="flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_transparent_70%)] opacity-50" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600 mb-6 shadow-lg shadow-purple-500/20">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {step === 'details' ? 'Create your account' : 'Check your inbox'}
                    </h1>
                    <p className="text-zinc-400">
                        {step === 'details'
                            ? 'Start your professional journey today.'
                            : `We've sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {step === 'details' ? (
                    <form onSubmit={handleSignup} className="space-y-4 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-400 ml-1">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Jane"
                                    className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-400 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Smith"
                                    className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400 ml-1">Work Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400 ml-1">Company</label>
                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Your Company Ltd"
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                required
                                minLength={8}
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 text-red-400 text-xs bg-red-400/5 p-3 rounded-xl border border-red-400/10">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-8 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 rounded-3xl bg-purple-600/10 flex items-center justify-center mx-auto ring-1 ring-purple-500/20">
                                <ShieldCheck className="w-10 h-10 text-purple-500" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-zinc-300 block">Enter Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="w-full bg-black border border-zinc-800 rounded-2xl py-5 text-center text-4xl font-bold tracking-[0.4em] outline-none focus:border-purple-500 transition-all placeholder:text-zinc-800"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 text-red-400 text-xs bg-red-400/5 p-3 rounded-xl border border-red-400/10">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Signup"}
                            </button>

                            <div className="flex flex-col items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendStatus !== 'idle'}
                                    className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-2 disabled:text-zinc-600"
                                >
                                    {resendStatus === 'sending' ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-3 h-3" />
                                    )}
                                    {resendStatus === 'sent' ? 'Code sent!' : 'Resend code via email'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('details')}
                                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                                >
                                    Back to details
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline transition-colors font-medium">Log In</Link>
                </p>
            </div>

            <div className="mt-12 text-[11px] text-zinc-700 uppercase tracking-widest relative z-10 font-bold">
                OmniiAi Business Cloud
            </div>
        </div>
    );
}
