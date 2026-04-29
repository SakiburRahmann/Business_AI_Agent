import { model } from '@/lib/ai/client';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: Missing message data.', { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized: Please log in to continue.', { status: 401 });
    }

    let currentChatId = conversationId;

    // 1. Ensure chat exists
    if (currentChatId) {
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('id', currentChatId)
        .eq('user_id', user.id)
        .single();

      if (!existingChat) {
        // Extract topic from the last user message
        const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop();
        const topicText = lastUserMsg?.parts
          ?.filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join(' ') || lastUserMsg?.content || 'New Chat';

        await supabase
          .from('chats')
          .insert({
            id: currentChatId,
            user_id: user.id,
            topic: topicText.substring(0, 80),
          });
      }
    } else {
      const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop();
      const topicText = lastUserMsg?.parts
        ?.filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join(' ') || lastUserMsg?.content || 'New Chat';

      const { data: newChat } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          topic: topicText.substring(0, 80),
        })
        .select('id')
        .single();

      currentChatId = newChat?.id;
    }

    // 2. Save User Message
    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage.parts
      ?.filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('\n') || lastMessage.content || '';

    await supabase
      .from('chat_messages')
      .insert({
        chat_id: currentChatId,
        user_id: user.id,
        role: 'user',
        content: userContent,
      });

    const systemPrompt = `
      You are OmniiAi, an advanced AI assistant developed by Sakibur Rahman.
      
      GUIDELINES:
      1. Provide helpful, intelligent, and accurate responses.
      2. Use clean Markdown for formatting.
      3. Be professional and clear.
    `;

    const convertedMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: model,
      system: systemPrompt,
      messages: convertedMessages,
      onFinish: async ({ text }) => {
        // 3. Save Assistant Message on Finish
        await supabase
          .from('chat_messages')
          .insert({
            chat_id: currentChatId,
            user_id: user.id,
            role: 'assistant',
            content: text,
          });

        // Update chat's updated_at timestamp
        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentChatId);
      }
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'x-conversation-id': currentChatId
      }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error.message || error);
    return new Response(
      JSON.stringify({ 
        error: 'Chat Error', 
        message: 'Something went wrong. Please try again.',
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
