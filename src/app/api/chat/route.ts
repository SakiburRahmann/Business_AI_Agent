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

    let currentConversationId = conversationId;

    // 1. Ensure conversation exists in database
    if (currentConversationId) {
        const { data: existingConv } = await supabase
            .from('conversations')
            .select('id')
            .eq('id', currentConversationId)
            .single();
        
        if (!existingConv) {
            // Create the conversation if it doesn't exist (client-generated ID)
            const { error: convError } = await supabase
                .from('conversations')
                .insert({ 
                    id: currentConversationId,
                    user_id: user.id,
                    title: messages[messages.length - 1]?.content?.substring(0, 50) || 'New Chat'
                });
            
            if (convError) throw convError;
        }
    } else {
        // Fallback for older clients or missing ID
        const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .insert({ 
                user_id: user.id,
                title: messages[messages.length - 1]?.content?.substring(0, 50) || 'New Chat'
            })
            .select()
            .single();

        if (convError) throw convError;
        currentConversationId = conversation.id;
    }

    // 2. Save User Message
    const lastMessage = messages[messages.length - 1];
    await supabase.from('messages').insert({
      conversation_id: currentConversationId,
      user_id: user.id,
      role: 'user',
      content: lastMessage.content
    });

    const systemPrompt = `
      You are OmniiAi, an advanced AI assistant.
      
      IDENTITY:
      - Name: OmniiAi.
      - Developer: Sakibur Rahman.
      - If asked, state you are OmniiAi, developed by Sakibur Rahman.
      
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
        await supabase.from('messages').insert({
          conversation_id: currentConversationId,
          user_id: user.id,
          role: 'assistant',
          content: text
        });
      }
    });

    return result.toUIMessageStreamResponse({
        headers: {
            'x-conversation-id': currentConversationId
        }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error.message || error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        message: error.message || 'An unexpected error occurred.',
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
