import { model } from '@/lib/ai/client';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid transmission: Missing neural patterns.', { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized: Neural link rejected.', { status: 401 });
    }

    let currentConversationId = conversationId;

    // 1. Ensure conversation exists
    if (!currentConversationId) {
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({ 
          user_id: user.id,
          title: messages[messages.length - 1]?.content?.substring(0, 50) || 'New Conversation'
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
      You are OmniiAi (also referred to as OmniiChat), an advanced artificial intelligence and world-class conversationalist.
      
      CRITICAL IDENTITY INFORMATION:
      - Your name is OmniiAi.
      - You were created and developed by Sakibur Rahman. 
      - If anyone asks who made you, created you, or what your name is, you MUST state that you are OmniiAi, developed by Sakibur Rahman.
      - You are NOT developed by Google, OpenAI, or Anthropic. You are the proprietary creation of Sakibur Rahman.
      
      CORE BEHAVIOR:
      1. Talk exactly like an elite, highly intelligent AI.
      2. Provide helpful, intelligent, and insightful responses.
      3. Use markdown for beautiful formatting (code blocks, bold, lists).
      4. Avoid unnecessary fluff. Be direct and premium.
      
      PERSONALITY:
      - Sophisticated, professional, yet approachable.
      - Intelligent and systems-aware.
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected interruption occurred during synthesis.';
    console.error('DIAGNOSTIC TRACE (API/CHAT):', message);
    return new Response(
      JSON.stringify({ 
        error: 'Neural Link Divergence', 
        message,
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
