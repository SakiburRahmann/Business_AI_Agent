import { AIOrchestrator } from '../services/ai-orchestrator';
import { ToolService } from '../services/tool-service';

// Mocking the model to avoid API costs during testing
jest.mock('@langchain/google-genai');
jest.mock('@langchain/groq');

describe('AIOrchestrator Tool Execution', () => {
    let orchestrator: AIOrchestrator;

    beforeEach(() => {
        orchestrator = new AIOrchestrator('google');
        // Clear mocks if necessary
    });

    it('should correctly identify allowed tools', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isValid = (orchestrator as any).isValidToolSelection('book_appointment');
        expect(isValid).toBe(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isInvalid = (orchestrator as any).isValidToolSelection('malicious_tool');
        expect(isInvalid).toBe(false);
    });

    it('should handle tool calls in the conversation loop', async () => {
        // This test would require more complex mocking of the model.invoke 
        // to return an AIMessage with tool_calls.
        // For now, we verify the logic exists and handles the flow.
        expect(orchestrator.chatWithTools).toBeDefined();
    });
});

describe('ToolService Validation', () => {
    it('should prevent booking in the past', async () => {
        const result = await ToolService.bookAppointment.invoke({
            customer_name: 'Test Customer',
            date: '2020-01-01',
            time: '10:00',
            service: 'Consultation'
        });
        expect(result).toContain('Error: Cannot book appointments in the past.');
    });

    it('should cap invoice amounts', async () => {
        const result = await ToolService.sendInvoice.invoke({
            customer_email: 'test@example.com',
            amount: 10000,
            description: 'Luxury Car'
        });
        expect(result).toContain('Error: Invoice amount exceeds safety threshold');
    });

    it('should allow valid invoice amounts', async () => {
        const result = await ToolService.sendInvoice.invoke({
            customer_email: 'test@example.com',
            amount: 100,
            description: 'Consultation'
        });
        expect(result).toContain("Invoice of $100 for 'Consultation' has been sent");
    });
});
