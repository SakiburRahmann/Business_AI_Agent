"use client";

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Eye, EyeOff, Loader2, User, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [fullName, setFullName] = React.useState('');
    const [businessName, setBusinessName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();

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
                setError(authError.message);
                return;
            }

            if (data.user) {
                setIsSuccess(true);
                // In a real scenario, we might wait for email confirmation or auto-login
                // For now, we show success and redirect after a delay
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        } catch (err: any) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Signup error:', err);
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
                    <h1 className="text-3xl font-bold mb-4">Check your email</h1>
                    <p className="text-zinc-400 leading-relaxed mb-8">
                        We&apos;ve sent a confirmation link to <span className="text-white font-medium">{email}</span>.
                        Please verify your account to continue.
                    </p>
                    <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                        Return to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[440px] relative z-10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                    <p className="text-zinc-400 mt-2 text-sm">Join the next generation of autonomous business</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-md">
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Create Password</label>
                        <div className="relative group">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors z-20"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm"
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

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Free Trial"}
                        </button>
                    </div>

                    <p className="text-[10px] text-zinc-500 text-center px-4 leading-relaxed">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                        No credit card required for the free tier.
                    </p>
                </form>

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
