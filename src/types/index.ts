/**
 * Common Types for the Business AI Agent SaaS Platform.
 */

export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export type UserRole = 'OWNER' | 'MANAGER' | 'AGENT';

export interface Business {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    owner_id: string;
    industry?: string;
}

export interface AIAgent {
    id: string;
    business_id: string;
    name: string;
    personality: string;
    voice_id?: string;
    status: 'ACTIVE' | 'INACTIVE';
    capabilities: {
        whatsapp: boolean;
        voice: boolean;
        instagram: boolean;
        email: boolean;
    };
    created_at: string;
}

export interface Conversation {
    id: string;
    agent_id: string;
    business_id: string;
    customer_identifier: string; // Phone number or Email
    channel: 'WHATSAPP' | 'VOICE' | 'INSTAGRAM' | 'EMAIL';
    status: 'OPEN' | 'CLOSED' | 'ESCALATED';
    last_message_at: string;
    sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_type: 'AGENT' | 'CUSTOMER' | 'SYSTEM';
    content: string;
    payload?: JsonValue; // For structured data like invoices or JSON
    created_at: string;
}
