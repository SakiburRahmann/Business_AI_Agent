import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/db';
import { encrypt } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return NextResponse.json({ error: 'Invalid access cipher' }, { status: 401 });
    }

    // Create session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({ user: { email }, expires });

    const response = NextResponse.json({ success: true });
    response.cookies.set('session', session, { expires, httpOnly: true });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Authentication failure' }, { status: 500 });
  }
}
