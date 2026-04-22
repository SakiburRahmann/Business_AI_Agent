import { model } from '@/lib/ai/client';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid transmission: Missing neural patterns.', { status: 400 });
    }

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
    });

    return result.toUIMessageStreamResponse();
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
