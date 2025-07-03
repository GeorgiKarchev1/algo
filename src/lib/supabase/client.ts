import { createBrowserClient } from '@supabase/ssr';

// Temporary fallback type until Supabase types are generated
type Database = {
  public: {
    Tables: Record<string, any>;
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums: Record<string, any>;
  };
};

// Supabase Client Configuration
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Don't throw during SSR - return a mock client instead
    if (typeof window === 'undefined') {
      return null as any;
    }
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Export a singleton instance - will be null on server
export const supabase = createClient(); 