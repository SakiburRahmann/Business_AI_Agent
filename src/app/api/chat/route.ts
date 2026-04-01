import { model } from '@/lib/ai/client';
import { streamText, convertToCoreMessages } from 'ai';

/**
 * OmniiChat 1.0 - Unified Response Engine
 * Priority: Instant character-by-character delivery.
 * Hardened with Error Resilience 1.0.
 */
export const maxDuration = 60; // Max edge runtime duration

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid transmission: Missing neural patterns.', { status: 400 });
    }

    // Verify critical infrastructure
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('CRITICAL: GOOGLE_GENERATIVE_AI_API_KEY is not configured in the host environment.');
      return new Response(JSON.stringify({ 
        error: 'Neural Link Authentication Failure', 
        message: 'The AI server key is missing from the production environment.' 
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const result = await streamText({
      model,
      system: `
        You are OmniiChat 1.0, a world-class AI conversationalist built by Sakibur Rahman.
        
        CORE BEHAVIOR:
        1. Talk exactly like Gemini 1.5 Pro or ChatGPT-4.
        2. Provide helpful, intelligent, and insightful responses.
        3. Use markdown for beautiful formatting (code blocks, bold, lists).
        4. Avoid unnecessary fluff. Be direct and premium.
        
        PERSONALITY:
        - Sophisticated, professional, yet approachable.
        - Intelligent and systems-aware.
      `,
      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("DIAGNOSTIC TRACE (API/CHAT):", error.message);
    return new Response(
      JSON.stringify({ 
        error: "Neural Link Divergence", 
        message: error.message || "An unexpected interruption occurred during synthesis." 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
