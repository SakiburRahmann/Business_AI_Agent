import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const supabase = await createClient();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/api/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Asynchronous Handshake: Send Welcome Email
    try {
        const { resend } = await import('@/lib/resend');
        await resend.emails.send({
            from: 'OmniiChat <onboarding@resend.dev>',
            to: email,
            subject: 'System Access Granted | OmniiChat 1.0',
            html: `
                <div style="font-family: sans-serif; background: #020202; color: #fff; padding: 40px; border-radius: 20px;">
                    <h1 style="color: #06b6d4; text-transform: uppercase; letter-spacing: 2px;">Welcome to OmniiChat 1.0</h1>
                    <p style="color: #a1a1aa; line-height: 1.6;">Your professional AI conversational interface is now ready. You have been granted access to the executive intelligence layer.</p>
                    <div style="margin-top: 30px; border-top: 1px solid #18181b; pt: 20px;">
                        <p style="font-size: 10px; color: #52525b; text-transform: uppercase; letter-spacing: 3px;">Omnii Systems | 2026</p>
                    </div>
                </div>
            `
        });
    } catch (emailErr) {
        console.error('[SIGNUP] Email delivery failed:', emailErr);
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: 'Account creation failed' }, { status: 500 });
  }
}
