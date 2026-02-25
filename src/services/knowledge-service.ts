import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { createClient } from '@supabase/supabase-js';

/**
 * KnowledgeService: Handles document embedding and vector search.
 * This is the "Long-term Memory" of the AI Agents.
 */
export class KnowledgeService {
    private vectorStore: SupabaseVectorStore | null = null;

    constructor(private businessId: string) { }

    /**
     * Initializes the vector store with Supabase and embeddings.
     */
    private async init() {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        });

        this.vectorStore = new SupabaseVectorStore(embeddings, {
            client: supabase,
            tableName: 'documents', // This table should have a vector column
            queryName: 'match_documents',
        });
    }

    /**
     * Searches the knowledge base for relevant context.
     * @param query - The customer's message or question.
     */
    async searchContext(query: string, limit = 3): Promise<string> {
        if (!this.vectorStore) await this.init();

        const results = await this.vectorStore!.similaritySearch(query, limit, {
            business_id: this.businessId,
        });

        return results.map(r => r.pageContent).join('\n\n');
    }

    /**
     * Adds text content to the knowledge base.
     * @param content - The text to embed and store.
     * @param metadata - Additional info (source, etc.)
     */
    async addDocument(content: string, metadata: Record<string, unknown>) {
        if (!this.vectorStore) await this.init();

        await this.vectorStore!.addDocuments([
            { pageContent: content, metadata: { ...metadata, business_id: this.businessId } }
        ]);
    }
}
