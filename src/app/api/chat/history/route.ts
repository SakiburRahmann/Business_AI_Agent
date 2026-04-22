import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('conversationId');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let messages;
    if (chatId) {
        messages = await sql`
            SELECT * FROM public.messages 
            WHERE chat_id = ${chatId} AND user_id = ${user.id}
            ORDER BY created_at ASC
        `;
    } else {
        messages = await sql`
            SELECT * FROM public.messages 
            WHERE user_id = ${user.id}
            ORDER BY created_at ASC
        `;
    }

    // Convert to AI SDK format
    const formattedMessages = messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: new Date(m.created_at)
    }));

    return NextResponse.json(formattedMessages);
  } catch (error: any) {
    console.error('Chat History Error (Direct SQL):', error.message || error);
    return NextResponse.json({ error: 'Failed to retrieve history' }, { status: 500 });
  }
}
