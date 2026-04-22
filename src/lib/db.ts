import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: 'require',
    prepare: false, // Important for Supabase pooler
});

export default sql;
