import path from 'path';
import fs from 'fs';

// Manual env parsing
const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) env[key.trim()] = value.join('=').trim();
});

const SUPABASE_ACCESS_TOKEN = env.SUPABASE_ACCESS_TOKEN || 'sbp_dcde787059afd33c5ea7a26ae624785c75ff7b30';
const PROJECT_REF = 'lwgziphajgqjkwqpfdop';

async function runSQL(query: string) {
    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data;
}

async function main() {
    // Check all chats and messages
    console.log("=== CHATS ===");
    const chats = await runSQL(`
        SELECT id, user_id, topic, created_at, updated_at 
        FROM public.chats 
        ORDER BY created_at DESC 
        LIMIT 10
    `);
    console.log(JSON.stringify(chats, null, 2));

    console.log("\n=== MESSAGES ===");
    const messages = await runSQL(`
        SELECT id, chat_id, user_id, role, content, created_at 
        FROM public.chat_messages 
        ORDER BY created_at DESC 
        LIMIT 20
    `);
    console.log(JSON.stringify(messages, null, 2));

    process.exit(0);
}

main();
