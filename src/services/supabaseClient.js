import { createClient } from '@supabase/supabase-js';

// Supabase Environment Credentials (Vite format)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhY2Nlc3NfdG9rZW4iOiJtb2NrLWtleSJ9';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
