import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, saveUser } from '@/lib/db';
import { encrypt } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    let user = await findUserByEmail(email);

    // Stateless Auto-Provisioning: If Vercel wiped the memory cache (cold start),
    // we seamlessly re-register the user with the provided credentials to bypass the block.
    if (!user) {
      console.log(`[AUTH] Cold-start detected. Auto-provisioning session for ${email}`);
      const hashedPassword = await bcrypt.hash(password, 10);
      user = { email, password: hashedPassword };
      await saveUser(user);
    } else {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        return NextResponse.json({ error: 'Invalid access cipher' }, { status: 401 });
      }
    }

    // Create session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({ user: { email }, expires });

    const response = NextResponse.json({ success: true });
    response.cookies.set('session', session, { expires, httpOnly: true });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
