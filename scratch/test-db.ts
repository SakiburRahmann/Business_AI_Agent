import postgres from 'postgres';

async function testConnection() {
    console.log('Testing connection with simple password...');
    const sql = postgres({
        host: 'aws-1-ap-south-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        username: 'postgres.lwgziphajgqjkwqpfdop',
        password: 'omnii12345678',
        ssl: 'require',
        prepare: false,
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
