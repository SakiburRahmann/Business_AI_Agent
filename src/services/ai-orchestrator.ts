import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
import { ToolService } from './tool-service';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BaseMessage, SystemMessage, AIMessage, ToolMessage } from '@langchain/core/messages';

/**
 * AIOrchestrator: The central reasoning engine for the Business AI Agent platform.
 * Supports multiple LLM providers and autonomous tool-use.
 */
export class AIOrchestrator {
    private model: BaseChatModel;

    constructor(provider: 'google' | 'groq' = 'google') {
        if (provider === 'google') {
            this.model = new ChatGoogleGenerativeAI({
                model: 'gemini-1.5-flash',
                maxOutputTokens: 2048,
                apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
            }).bindTools(ToolService.getTools()) as unknown as BaseChatModel;
        } else {
            this.model = new ChatGroq({
                model: 'llama-3.1-70b-versatile',
                apiKey: process.env.GROQ_API_KEY,
            }).bindTools(ToolService.getTools()) as unknown as BaseChatModel;
        }
    }

    /**
     * Processes a conversation turn with autonomous tool execution.
     * @param systemPrompt - Instructions for the agent.
     * @param history - Conversation history.
     */
    async chatWithTools(systemPrompt: string, history: BaseMessage[]): Promise<string> {
        try {
            const messages: BaseMessage[] = [
                new SystemMessage(systemPrompt),
                ...history
            ];

            // Initial call to the LLM
            let response = await this.model.invoke(messages);
            messages.push(response);

            // Loop to handle tool calls (max 5 iterations to prevent infinite loops)
            let iterations = 0;
            while (response instanceof AIMessage && response.tool_calls && response.tool_calls.length > 0 && iterations < 5) {
                console.log(`[AI] Tool calls detected:`, response.tool_calls);

                for (const toolCall of response.tool_calls) {
                    const tool = ToolService.getTools().find(t => t.name === toolCall.name);
                    if (tool) {
                        const toolResult = await tool.invoke(toolCall.args);
                        messages.push(new ToolMessage({
                            content: toolResult as string,
                            tool_call_id: toolCall.id!,
                        }));
                    }
                }

                // Get a new response from the LLM after providing tool results
                response = await this.model.invoke(messages);
                messages.push(response);
                iterations++;
            }

            return response.content as string;

        } catch (error) {
            console.error('AI Chat Error:', error);
            throw new Error('Failed to generate AI response.');
        }
    }

    /**
     * Main chat entry point.
     */
    async chat(systemPrompt: string, history: BaseMessage[]): Promise<string> {
        return this.chatWithTools(systemPrompt, history);
    }

    /**
     * Placeholder for complex workflow.
     */
    async processWithTools(systemPrompt: string, history: BaseMessage[]) {
        const workflow = new StateGraph(MessagesAnnotation)
            .addNode('agent', async (state) => {
                const response = await this.model.invoke([
                    new SystemMessage(systemPrompt),
                    ...state.messages,
                ]);
                return { messages: [response] };
            })
            .addEdge('__start__', 'agent')
            .addEdge('agent', '__end__');

        const app = workflow.compile();
        const result = await app.invoke({ messages: history });
        return result.messages[result.messages.length - 1].content;
    }
}
