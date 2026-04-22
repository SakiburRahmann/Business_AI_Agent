import { createClient } from '@supabase/supabase-js'

const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return { url, key }
}

export const supabase = createClient(
  getSupabaseConfig().url,
  getSupabaseConfig().key
)
