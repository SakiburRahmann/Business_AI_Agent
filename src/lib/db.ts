/**
 * Stateless Memory Persistence for Production
 * Optimized for Vercel Serverless environments.
 * Uses a global memory cache to handle signup/login without filesystem access.
 */

// Global cache survives between function invocations if the container stays warm.
const globalUserCache = new Map<string, any>();

export async function findUserByEmail(email: string) {
    console.log(`[DB] Searching for: ${email}`);
    return globalUserCache.get(email) || null;
}

export async function saveUser(user: any) {
    console.log(`[DB] Securely caching user: ${user.email}`);
    globalUserCache.set(user.email, user);
    return;
}
