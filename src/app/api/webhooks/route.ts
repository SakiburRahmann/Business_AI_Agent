import { NextRequest, NextResponse } from 'next/server';
import { AIOrchestrator } from '@/services/ai-orchestrator';
import { KnowledgeService } from '@/services/knowledge-service';
import { NotificationService } from '@/services/notification-service';
import { HumanMessage } from '@langchain/core/messages';

/**
 * Unified Webhook Handler: The entry point for all external communications.
 * Handles WhatsApp, Voice (Vapi/Twilio), and Messenger webhooks with OmniiAi architecture.
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const source = req.headers.get('x-source') || 'whatsapp';

        // Vapi verification (Optional but industrial standard)
        // const authHeader = req.headers.get('Authorization');

        console.log(`[Webhook] Received ${source} event:`, payload);

        // 1. Identify Business (In a real app, this is derived from the payload)
        const businessId = 'demo-business-id';

        // 2. Initialize Services
        const orchestrator = new AIOrchestrator('google');
        const knowledge = new KnowledgeService(businessId);
        const notifications = new NotificationService();

        // 3. Extract Message & Customer Info
        let customerMessage = '';
        let customerId = '';
        let customerEmail = '';

        if (source === 'whatsapp') {
            customerMessage = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || '';
            customerId = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || '';
        } else if (source === 'voice') {
            // Vapi payload structure
            customerMessage = payload.message?.transcript || payload.message?.text || '';
            customerId = payload.message?.call?.customer?.number || '';
        } else if (payload.message?.type === 'transcript') {
            // Alternative Vapi event
            customerMessage = payload.message?.transcript || '';
        }

        if (!customerMessage) {
            return NextResponse.json({ status: 'ignored' });
        }

        // 4. Retrieve Context (RAG)
        const context = await knowledge.searchContext(customerMessage);

        // 5. Generate Response via upgraded Gemini 2.0 Flash
        const systemPrompt = `You are a helpful business assistant for a company powered by OmniiAi. 
        Use the following background knowledge to assist the user: \n\n${context}`;

        const aiResponse = await orchestrator.chat(systemPrompt, [
            new HumanMessage(customerMessage)
        ]);

        // 6. Action: Notification (If it's an urgent request, send email)
        if (customerMessage.toLowerCase().includes('urgent') || customerMessage.toLowerCase().includes('book')) {
            await notifications.sendEmail(
                'sakib20040113@gmail.com', // Admin notification
                `Urgent Action Required: ${source.toUpperCase()}`,
                `<p>A customer (${customerId}) sent an urgent message: <b>"${customerMessage}"</b></p>
                 <p>AI Response: ${aiResponse}</p>`
            );
        }

        // 7. Send Response back to Channel
        console.log(`[OmniiAi] Response dispatched to ${customerId}:`, aiResponse);

        return NextResponse.json({
            status: 'success',
            response: aiResponse,
            source
        });

    } catch (error) {
        console.error('[OmniiAi Webhook Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * Validation for Meta Webhooks
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
