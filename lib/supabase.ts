import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create real client if valid credentials are provided
const isValidConfig = supabaseUrl && 
                      supabaseAnonKey && 
                      !supabaseUrl.includes('placeholder') && 
                      !supabaseAnonKey.includes('placeholder');

export const supabase = isValidConfig 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder');

// Database types (you can generate these from Supabase CLI)
export type Database = {
    public: {
        Tables: {
            events: {
                Row: {
                    id: string;
                    title: string;
                    title_so: string;
                    description: string;
                    description_so: string;
                    full_description: string;
                    full_description_so: string;
                    date: string;
                    location: string;
                    location_so: string;
                    speakers: string[];
                    image: string;
                    is_past: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['events']['Insert']>;
            };
            services: {
                Row: {
                    id: string;
                    title: string;
                    title_so: string;
                    description: string;
                    description_so: string;
                    full_description: string;
                    full_description_so: string;
                    icon: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['services']['Insert']>;
            };
            mentors: {
                Row: {
                    id: string;
                    service_id: string;
                    name: string;
                    role: string;
                    role_so: string;
                    bio: string;
                    bio_so: string;
                    image: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['mentors']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['mentors']['Insert']>;
            };
            testimonials: {
                Row: {
                    id: string;
                    name: string;
                    role: string;
                    role_so: string;
                    rating: number;
                    feedback: string;
                    feedback_so: string;
                    service_type: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
            };
        };
    };
};
