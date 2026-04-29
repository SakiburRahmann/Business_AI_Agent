import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('id');

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error, count } = await supabase
      .from('chats')
      .delete({ count: 'exact' })
      .eq('id', chatId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    if (count === 0) {
      return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete Chat Error:', error.message || error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}
