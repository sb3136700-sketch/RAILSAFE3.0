import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read configuration strictly from Vite environment variables (e.g. from .env.local)
const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const envKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

// Verify if credentials are valid (must be a valid URL and not a generic placeholder)
export const isSupabaseConfigured = Boolean(
  envUrl &&
    envUrl.startsWith('https://') &&
    !envUrl.includes('your-project') &&
    !envUrl.includes('placeholder') &&
    envKey &&
    !envKey.includes('your_key') &&
    !envKey.includes('placeholder')
);

// Fallback values prevent runtime initialization errors when credentials are not yet supplied
export const supabaseUrl = isSupabaseConfigured ? envUrl : 'https://placeholder.supabase.co';
export const supabasePublishableKey = isSupabaseConfigured ? envKey : 'placeholder-anon-key';

// Reusable Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper to test if database tables (schema migration) are reachable and ready
export async function checkSupabaseSchemaStatus(): Promise<{
  isReachable: boolean;
  tablesVerified: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return {
      isReachable: false,
      tablesVerified: false,
      error: 'Supabase credentials not configured in .env.local (VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY).',
    };
  }

  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (!error) {
      return { isReachable: true, tablesVerified: true };
    }
    // If table doesn't exist (42P01 or PGRST204/200), database is reachable but schema is pending
    if (
      error.code === '42P01' ||
      error.message?.includes('relation "public.profiles" does not exist') ||
      error.code === 'PGRST204'
    ) {
      return {
        isReachable: true,
        tablesVerified: false,
        error:
          'Database is reachable, but the "profiles" table is not found. Please run the SQL migration in your Supabase SQL Editor.',
      };
    }
    return { isReachable: true, tablesVerified: false, error: error.message };
  } catch (err: any) {
    return { isReachable: false, tablesVerified: false, error: err.message || 'Network unreachable' };
  }
}
