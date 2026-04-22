const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.lwgziphajgqjkwqpfdop:OmniiAi_Production_DB_Ref_2026@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

async function runSchema() {
    const client = new Client({
        user: 'postgres.lwgziphajgqjkwqpfdop',
        host: 'aws-1-ap-south-1.pooler.supabase.com',
        database: 'postgres',
        password: 'OmniiAi_Production_DB_Ref_2026',
        port: 6543,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to Supabase PostgreSQL...');
        await client.connect();
        console.log('Connected successfully.');

        const schemaSql = fs.readFileSync(path.join(__dirname, 'data/schema.sql'), 'utf8');
        
        console.log('Executing schema script...');
        await client.query(schemaSql);
        console.log('Schema executed successfully!');

    } catch (err) {
        console.error('Error executing schema:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runSchema();
