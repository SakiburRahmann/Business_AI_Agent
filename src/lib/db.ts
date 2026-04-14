import postgres from 'postgres';

/**
 * DB Engine - Professional PostgreSQL Adapter
 * Automatically detects environment and scales accordingly.
 */

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/omniichat';

// Minimalistic high-performance client
const sql = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});

export async function findUserByEmail(email: string) {
    try {
        const users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
        return users[0] || null;
    } catch (err) {
        console.error('DB Read Error:', err);
        return null;
    }
}

export async function saveUser(user: any) {
    try {
        await sql`
            INSERT INTO users (email, password)
            VALUES (${user.email}, ${user.password})
        `;
    } catch (err) {
        console.error('DB Write Error:', err);
        throw new Error('Database insertion failed. Ensure the "users" table exists.');
    }
}

// Initializer helper for the user to run once
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;
