import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('conversationId');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (chatId) {
      query = query.eq('chat_id', chatId);
    }

    const { data: messages, error } = await query;

    if (error) throw error;

    // Convert to AI SDK UIMessage format
    const formattedMessages = (messages || []).map(m => ({
      id: m.id,
      role: m.role,
      parts: [{ type: 'text', text: m.content }],
      createdAt: new Date(m.created_at),
    }));

    return NextResponse.json(formattedMessages);
  } catch (error: any) {
    console.error('Chat History Error:', error.message || error);
    return NextResponse.json({ error: 'Failed to retrieve history' }, { status: 500 });
  }
}
