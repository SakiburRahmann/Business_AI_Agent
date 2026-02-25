"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Loader2, User, Building2, AlertCircle, CheckCircle2, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
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

    // OTP State
    const [otp, setOtp] = React.useState('');

    // UI State
    const [error, setError] = React.useState<string | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            // Sign up with email and password
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
                    // The redirect URL for the confirmation link (if used)
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signupError) {
                setError(signupError.message);
                return;
            }

            // If auto-confirm is off, data.user is returned but session is null
            // We move to the verification step where the user enters the code
            setStep('verify');
        } catch (err: any) {
            setError('An unexpected error occurred. Please try again.');
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
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'signup', // Verification type for email confirmation
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
            setError('Verification failed. Please check the code and try again.');
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
                    <h1 className="text-3xl font-bold mb-4">Account Created</h1>
                    <p className="text-zinc-400 mb-8">
                        Welcome, {firstName}! Your account has been successfully verified.
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
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_transparent_70%)] opacity-50" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600 mb-6 shadow-lg shadow-purple-500/20">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {step === 'details' ? 'Create your account' : 'Verify your email'}
                    </h1>
                    <p className="text-zinc-400">
                        {step === 'details'
                            ? 'Get started with OmniiAi today.'
                            : `We've sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {step === 'details' ? (
                    <form onSubmit={handleSignup} className="space-y-4 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="First Name"
                                    className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                    className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Work Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Business Name</label>
                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Your Company Name"
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-colors text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Password</label>
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
                            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-purple-600/10 flex items-center justify-center mx-auto ring-1 ring-purple-500/20">
                                <ShieldCheck className="w-8 h-8 text-purple-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 block">Verification Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-purple-500 transition-all"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Account"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('details')}
                            className="w-full text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                            Wrong email? Go back
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline">Log In</Link>
                </p>
            </div>

            {/* Simple footer */}
            <div className="mt-12 text-[10px] text-zinc-600 uppercase tracking-widest relative z-10">
                OmniiAi Business Systems
            </div>
        </div>
    );
}
