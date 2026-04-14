import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use regular Supabase client for Database operations (bypasses Auth service DNS hangs)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return [];
    return data || [];
}

export async function saveUser(user: any) {
    const { error } = await supabase.from('users').insert([user]);
    if (error) {
        console.error('Database write failure:', error.message);
        throw new Error('Database write failure');
    }
}

export async function findUserByEmail(email: string) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error) return null;
    return data;
}
