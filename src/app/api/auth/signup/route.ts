import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, saveUser } from '@/lib/db';
import { encrypt } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    if (findUserByEmail(email)) {
      return NextResponse.json({ error: 'Identity already established' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };
    saveUser(user);

    // Create session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({ user: { email }, expires });

    const response = NextResponse.json({ success: true });
    response.cookies.set('session', session, { expires, httpOnly: true });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Initialization failure' }, { status: 500 });
  }
}
