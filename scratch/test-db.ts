import postgres from 'postgres';

async function testConnection() {
    console.log('Testing connection with port 5432 (Session Mode)...');
    const sql = postgres({
        host: 'aws-1-ap-south-1.pooler.supabase.com',
        port: 5432,
        database: 'postgres',
        username: 'postgres.lwgziphajgqjkwqpfdop',
        password: 'OmniiAi_2026_Secure_DB',
        ssl: 'require',
    });

    try {
        const result = await sql`SELECT 1 as connected`;
        console.log('Successfully connected:', result);
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await sql.end();
    }
}

testConnection();
