import { NextRequest, NextResponse } from 'next/server';
import { AIOrchestrator } from '@/services/ai-orchestrator';
import { KnowledgeService } from '@/services/knowledge-service';
import { HumanMessage } from '@langchain/core/messages';

/**
 * Unified Webhook Handler: The entry point for all external communications.
 * Handles WhatsApp, Voice (Vapi/Twilio), and custom Messenger webhooks.
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const source = req.headers.get('x-source') || 'whatsapp'; // Default for demo

        console.log(`[Webhook] Received ${source} event:`, payload);

        // 1. Identify Business (In a real app, this is derived from the phone number/ID)
        const businessId = 'demo-business-id';

        // 2. Initialize Services
        const orchestrator = new AIOrchestrator('google');
        const knowledge = new KnowledgeService(businessId);

        // 3. Extract Message
        let customerMessage = '';
        let customerId = '';

        if (source === 'whatsapp') {
            customerMessage = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || '';
            customerId = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || '';
        } else if (source === 'voice') {
            customerMessage = payload.message?.transcript || '';
            customerId = payload.call?.customer?.number || '';
        }

        if (!customerMessage) {
            return NextResponse.json({ status: 'ignored' });
        }

        // 4. Retrieve Context (RAG)
        const context = await knowledge.searchContext(customerMessage);

        // 5. Generate Response
        const systemPrompt = `You are a helpful business assistant. Use the following context to answer questions: \n\n${context}`;
        const aiResponse = await orchestrator.chat(systemPrompt, [
            new HumanMessage(customerMessage)
        ]);

        // 6. Send Response back to Channel (Placeholder logic)
        console.log(`[AI Response] Sending to ${customerId}:`, aiResponse);

        return NextResponse.json({
            status: 'success',
            response: aiResponse
        });

    } catch (error) {
        console.error('[Webhook Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * Validation for Meta Webhooks (WhatsApp/Messenger)
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === 'sakibur-rahman-v1') {
        return new Response(challenge, { status: 200 });
    }

    return new Response('Forbidden', { status: 403 });
}
