import { getModel, MODEL_CASCADE } from '@/lib/ai/client';
import { streamText, convertToModelMessages } from 'ai';

/**
 * OmniiChat 2.0 - Resilient Response Engine
 * Auto-cascades through multiple AI models when quota limits are hit.
 */
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid transmission: Missing neural patterns.', { status: 400 });
    }

    const systemPrompt = `
      You are OmniiChat 1.0, a world-class AI conversationalist built by Sakibur Rahman.
      
      CORE BEHAVIOR:
      1. Talk exactly like Gemini 1.5 Pro or ChatGPT-4.
      2. Provide helpful, intelligent, and insightful responses.
      3. Use markdown for beautiful formatting (code blocks, bold, lists).
      4. Avoid unnecessary fluff. Be direct and premium.
      
      PERSONALITY:
      - Sophisticated, professional, yet approachable.
      - Intelligent and systems-aware.
    `;

    const convertedMessages = await convertToModelMessages(messages);

    // Model Cascade: try each model in order, fall through on quota errors
    for (let i = 0; i < MODEL_CASCADE.length; i++) {
      try {
        const result = streamText({
          model: getModel(i),
          system: systemPrompt,
          messages: convertedMessages,
        });

        console.log(`[AI] Serving via: ${MODEL_CASCADE[i].name}`);
        return result.toUIMessageStreamResponse();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const isQuotaError = message.toLowerCase().includes('quota') 
                          || message.toLowerCase().includes('rate limit')
                          || message.toLowerCase().includes('429')
                          || message.toLowerCase().includes('resource exhausted');

        if (isQuotaError && i < MODEL_CASCADE.length - 1) {
          console.warn(`[AI] ${MODEL_CASCADE[i].name} quota hit, falling back to ${MODEL_CASCADE[i + 1].name}...`);
          continue;
        }

        // Not a quota error, or last model in cascade — throw it
        throw error;
      }
    }

    // Should never reach here, but just in case
    return new Response(
      JSON.stringify({ error: 'All AI models exhausted' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
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
