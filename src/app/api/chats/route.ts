import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chats = await sql`
        SELECT * FROM public.chats 
        WHERE user_id = ${user.id}
        ORDER BY updated_at DESC
    `;

    return NextResponse.json(chats);
  } catch (error: any) {
    console.error('Chats List Error (Direct SQL):', error.message || error);
    return NextResponse.json({ error: 'Failed to retrieve chats' }, { status: 500 });
  }
}
