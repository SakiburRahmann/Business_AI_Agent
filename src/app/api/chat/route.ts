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

    // 1. Ensure chat exists and belongs to the user
    if (currentChatId) {
      const { data: existingChat, error: fetchError } = await supabase
        .from('chats')
        .select('id, topic')
        .eq('id', currentChatId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingChat) {
        // If it doesn't exist, create it with the provided ID
        // Determine topic from current messages or default
        const lastUserMsg = messages.find((m: any) => m.role === 'user');
        const topicText = lastUserMsg?.content || lastUserMsg?.parts?.[0]?.text || 'New Chat';
        
        await supabase
          .from('chats')
          .insert({
            id: currentChatId,
            user_id: user.id,
            topic: topicText.substring(0, 80),
          });
      }
    } else {
      // No ID provided, create a new chat record
      const lastUserMsg = messages.find((m: any) => m.role === 'user');
      const topicText = lastUserMsg?.content || lastUserMsg?.parts?.[0]?.text || 'New Chat';

      const { data: newChat, error: insertError } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          topic: topicText.substring(0, 80),
        })
        .select('id')
        .single();

      if (insertError || !newChat) {
        throw new Error('Failed to create chat session');
      }
      currentChatId = newChat.id;
    }

    // 2. Save the incoming message
    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage.content || 
                       lastMessage.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n') || 
                       '';

    if (userContent) {
      await supabase
        .from('chat_messages')
        .insert({
          chat_id: currentChatId,
          user_id: user.id,
          role: 'user',
          content: userContent,
        });
    }

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
        // 3. Save Assistant Response
        await supabase
          .from('chat_messages')
          .insert({
            chat_id: currentChatId,
            user_id: user.id,
            role: 'assistant',
            content: text,
          });

        // Always update the updated_at timestamp to keep it at the top of history
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
