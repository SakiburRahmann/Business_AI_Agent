import { model } from '@/lib/ai/client';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const conversationId = body.conversationId || req.headers.get('x-conversation-id');

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: Missing message data.', { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized: Please log in to continue.', { status: 401 });
    }

    let currentChatId = conversationId;
    let history: any[] = [];

    // 1. Resolve Chat Session and Fetch History
    if (currentChatId) {
      // Check if chat exists and belongs to the user
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('id', currentChatId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingChat) {
        // Fetch previous messages for context
        const { data: previousMessages } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('chat_id', currentChatId)
          .order('created_at', { ascending: true });
        
        if (previousMessages) {
          history = previousMessages.map(m => ({
            role: m.role,
            content: m.content
          }));
        }
      } else {
        // Create new chat with provided ID
        const firstMsg = messages.find((m: any) => m.role === 'user');
        const topic = firstMsg?.content || firstMsg?.text || firstMsg?.parts?.[0]?.text || 'New Chat';
        
        await supabase
          .from('chats')
          .insert({
            id: currentChatId,
            user_id: user.id,
            topic: topic.substring(0, 80),
          });
      }
    } else {
      // Generate new session if none provided
      const firstMsg = messages.find((m: any) => m.role === 'user');
      const topic = firstMsg?.content || firstMsg?.text || firstMsg?.parts?.[0]?.text || 'New Chat';

      const { data: newChat, error: insertError } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          topic: topic.substring(0, 80),
        })
        .select('id')
        .single();

      if (insertError || !newChat) {
        throw new Error('Failed to create chat session');
      }
      currentChatId = newChat.id;
    }

    // 2. Resolve the new message content
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) throw new Error('No messages found in request');

    // Robustly extract user content from various possible formats
    const userContent = lastMessage.content || 
                       lastMessage.text ||
                       (lastMessage.parts && Array.isArray(lastMessage.parts) 
                          ? lastMessage.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n') 
                          : '') || 
                       '';

    if (userContent.trim()) {
      // Save to DB immediately
      await supabase
        .from('chat_messages')
        .insert({
          chat_id: currentChatId,
          user_id: user.id,
          role: 'user',
          content: userContent,
        });
    }

    // 3. Prepare full context for the AI
    const fullMessages = [
      ...history,
      { role: 'user', content: userContent }
    ].filter(m => m.content && typeof m.content === 'string' && m.content.trim().length > 0);

    // Deduplicate history (just in case)
    const deduplicatedMessages = fullMessages.filter((msg, idx, self) => {
      if (idx === 0) return true;
      const prev = self[idx - 1];
      return !(msg.role === prev.role && msg.content === prev.content);
    });

    if (deduplicatedMessages.length === 0) {
        throw new Error('No valid messages to send to AI');
    }

    const systemPrompt = `
      You are OmniiAi, an advanced AI assistant developed by Sakibur Rahman.
      
      GUIDELINES:
      1. Provide helpful, intelligent, and accurate responses.
      2. Use clean Markdown for formatting.
      3. Be professional and clear.
    `;

    const convertedMessages = await convertToModelMessages(deduplicatedMessages as any);

    const result = streamText({
      model: model,
      system: systemPrompt,
      messages: convertedMessages,
      onFinish: async ({ text }) => {
        // 4. Save Assistant Response
        await supabase
          .from('chat_messages')
          .insert({
            chat_id: currentChatId,
            user_id: user.id,
            role: 'assistant',
            content: text,
          });

        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentChatId);
      }
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'x-conversation-id': currentChatId || '',
      }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Chat Error', 
        message: error.message || 'Something went wrong. Please try again.',
        details: error.details || error.toString(),
        stack: error.stack // Add stack trace for debugging
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
