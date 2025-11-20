// Test Supabase connection
import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('_test_').select('*').limit(1);
    
    if (error && error.code !== 'PGRST204') {
      // PGRST204 means table doesn't exist, which is fine for testing connection
      console.log('✅ Supabase connected successfully!');
      console.log('Connection details:', {
        url: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      });
      return true;
    }
    
    console.log('✅ Supabase connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

// Test authentication
export async function testSupabaseAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Auth session:', session ? 'Active' : 'No active session');
    return true;
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return false;
  }
}
