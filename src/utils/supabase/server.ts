import { createClient } from '@supabase/supabase-js';

export function createSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  
  return createClient(supabaseUrl, supabaseKey);
}
