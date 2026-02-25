import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
import { ToolService } from './tool-service';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BaseMessage, SystemMessage, AIMessage, ToolMessage } from '@langchain/core/messages';

/**
 * AIOrchestrator: The central reasoning engine for the OmniiAi platform.
 * Supports multiple LLM providers and autonomous tool-use.
 */
export class AIOrchestrator {
    private model: BaseChatModel;

    constructor(provider: 'google' | 'groq' = 'google') {
        if (provider === 'google') {
            this.model = new ChatGoogleGenerativeAI({
                model: 'gemini-2.0-flash',
                maxOutputTokens: 2048,
                apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
            }).bindTools(ToolService.getTools()) as unknown as BaseChatModel;
        } else {
            this.model = new ChatGroq({
                model: 'llama-3.3-70b-versatile',
                apiKey: process.env.GROQ_API_KEY,
            }).bindTools(ToolService.getTools()) as unknown as BaseChatModel;
        }
    }

    /**
     * Processes a conversation turn with autonomous tool execution.
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
                    const toolName = toolCall.name;
                    if (!this.isValidToolSelection(toolName)) {
                        console.warn(`[Security] Blocked unauthorized tool call: ${toolName}`);
                        messages.push(new ToolMessage({
                            content: "Error: Unauthorized tool access.",
                            tool_call_id: toolCall.id!,
                        }));
                        continue;
                    }

                    const tool = ToolService.getTools().find(t => t.name === toolName);
                    if (tool) {
                        try {
                            const toolResult = await (tool as any).invoke(toolCall.args);
                            messages.push(new ToolMessage({
                                content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
                                tool_call_id: toolCall.id!,
                            }));
                        } catch (error) {
                            console.error(`[Tool Error] ${toolName}:`, error);
                            messages.push(new ToolMessage({
                                content: `Error executing ${toolName}.`,
                                tool_call_id: toolCall.id!,
                            }));
                        }
                    }
                }

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

    private isValidToolSelection(toolName: string): boolean {
        const allowedTools = ToolService.getTools().map(t => t.name);
        return allowedTools.includes(toolName as any);
    }

    async chat(systemPrompt: string, history: BaseMessage[]): Promise<string> {
        return this.chatWithTools(systemPrompt, history);
    }

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
