import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Database types for IPRT system
export type Database = {
    public: {
        Tables: {
            students: {
                Row: {
                    id: string;
                    full_name: string;
                    email: string;
                    phone: string;
                    enrollment_date: string;
                    status: 'Active' | 'Completed' | 'Dropped';
                    added_by: 'admin' | 'member';
                    added_by_email: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['students']['Insert']>;
            };
            projects: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    start_date: string;
                    end_date: string;
                    status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
                    created_by: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['projects']['Insert']>;
            };
            project_students: {
                Row: {
                    id: string;
                    project_id: string;
                    student_id: string;
                    assigned_date: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['project_students']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['project_students']['Insert']>;
            };
            attendance: {
                Row: {
                    id: string;
                    student_id: string;
                    project_id: string;
                    date: string;
                    status: 'Present' | 'Absent' | 'Absent with Reason';
                    comment: string | null;
                    marked_by: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['attendance']['Insert']>;
            };
            requisitions: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    category: 'Equipment' | 'Supplies' | 'Services' | 'Other';
                    quantity: number;
                    estimated_cost: string;
                    priority: 'Low' | 'Medium' | 'High';
                    status: 'Pending' | 'Approved' | 'Rejected';
                    submitted_by: string;
                    submitted_date: string;
                    reviewed_by: string | null;
                    reviewed_date: string | null;
                    review_notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['requisitions']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['requisitions']['Insert']>;
            };
            deletion_requests: {
                Row: {
                    id: string;
                    student_id: string;
                    student_name: string;
                    student_email: string;
                    requested_by: string;
                    requested_by_email: string;
                    reason: string;
                    request_date: string;
                    status: 'Pending' | 'Approved' | 'Rejected';
                    admin_response: string | null;
                    admin_email: string | null;
                    response_date: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['deletion_requests']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['deletion_requests']['Insert']>;
            };
            team_members: {
                Row: {
                    id: string;
                    name: string;
                    role: 'Staff' | 'Facilitator' | 'Technician';
                    email: string;
                    phone: string;
                    bio: string;
                    image_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
            };
            notifications: {
                Row: {
                    id: string;
                    type: 'deletion_request' | 'requisition' | 'project' | 'student' | 'attendance' | 'team' | 'general';
                    title: string;
                    message: string;
                    related_id: string | null;
                    is_read: boolean;
                    created_by: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
            };
        };
    };
};
