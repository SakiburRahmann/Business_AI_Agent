import { model } from '@/lib/ai/client';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from '@/lib/supabase/server';
import sql from '@/lib/db';

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

    // 1. Ensure chat exists (Direct SQL)
    if (currentChatId) {
        const [existingChat] = await sql`
            SELECT id FROM public.chats 
            WHERE id = ${currentChatId} AND user_id = ${user.id}
        `;
        
        if (!existingChat) {
            await sql`
                INSERT INTO public.chats (id, user_id, topic)
                VALUES (${currentChatId}, ${user.id}, ${messages[messages.length - 1]?.content?.substring(0, 50) || 'New Chat'})
            `;
        }
    } else {
        const [chat] = await sql`
            INSERT INTO public.chats (user_id, topic)
            VALUES (${user.id}, ${messages[messages.length - 1]?.content?.substring(0, 50) || 'New Chat'})
            RETURNING id
        `;
        currentChatId = chat.id;
    }

    // 2. Save User Message (Direct SQL)
    const lastMessage = messages[messages.length - 1];
    await sql`
        INSERT INTO public.messages (chat_id, user_id, role, content)
        VALUES (${currentChatId}, ${user.id}, 'user', ${lastMessage.content})
    `;

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
        // 3. Save Assistant Message on Finish (Direct SQL)
        await sql`
            INSERT INTO public.messages (chat_id, user_id, role, content)
            VALUES (${currentChatId}, ${user.id}, 'assistant', ${text})
        `;
      }
    });

    return result.toUIMessageStreamResponse({
        headers: {
            'x-conversation-id': currentChatId
        }
    });
  } catch (error: any) {
    console.error('Chat API Error (Direct SQL):', error.message || error);
    return new Response(
      JSON.stringify({ 
        error: 'Database Error', 
        message: 'A direct database connection issue occurred. Please try again.',
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
