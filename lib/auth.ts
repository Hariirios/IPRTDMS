import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

// Note: Admin user creation has been moved to Supabase Dashboard
// Service role key should NEVER be used in frontend code
// This file now only handles authentication, not user creation

export interface AdminUser {
    id: string;
    email: string;
    username: string;
    role: 'super_admin' | 'admin';
    is_active: boolean;
    last_login?: string;
    created_at?: string;
    created_by?: string;
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

// Login admin user using Supabase Auth
export const loginAdmin = async (emailOrUsername: string, password: string): Promise<AdminUser | null> => {
    try {
        // First, get the email if username was provided
        let email = emailOrUsername;
        if (!emailOrUsername.includes('@')) {
            // It's a username, look up the email
            const { data: userData } = await supabase
                .from('admin_users')
                .select('email')
                .eq('username', emailOrUsername)
                .eq('is_active', true)
                .maybeSingle();

            if (!userData) {
                console.error('Admin user not found');
                return null;
            }
            email = userData.email;
        }

        // Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError || !authData.user) {
            console.error('Login failed:', authError);
            return null;
        }

        // Get admin user details from admin_users table
        const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('id, email, username, role, is_active, last_login')
            .eq('email', email)
            .eq('is_active', true)
            .maybeSingle();

        if (adminError || !adminData) {
            console.error('Admin user not found in admin_users table:', adminError);
            // Sign out if admin record doesn't exist
            await supabase.auth.signOut();
            return null;
        }

        // Update last login timestamp
        await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminData.id);

        return {
            id: adminData.id,
            email: adminData.email,
            username: adminData.username,
            role: adminData.role,
            is_active: adminData.is_active,
            last_login: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};

// Create admin user - DEPRECATED: Use Supabase Dashboard instead
// Admin users should be created manually in Supabase Dashboard > Authentication
// This prevents exposing service role key in frontend
export const createAdmin = async (
    email: string,
    username: string,
    password: string,
    role: 'super_admin' | 'admin' = 'admin',
    requestingAdminRole?: 'super_admin' | 'admin',
    createdByUsername?: string
): Promise<{ success: boolean; error?: string }> => {
    return {
        success: false,
        error: 'Admin creation must be done through Supabase Dashboard. Please contact a system administrator.'
    };
};

// Update admin password
export const updateAdminPassword = async (
    adminId: string,
    currentPassword: string,
    newPassword: string
): Promise<boolean> => {
    try {
        // Get current admin data
        const { data, error } = await supabase
            .from('admin_users')
            .select('password_hash')
            .eq('id', adminId)
            .single();

        if (error || !data) {
            console.error('Admin not found:', error);
            return false;
        }

        // Verify current password
        const isValid = await verifyPassword(currentPassword, data.password_hash);
        if (!isValid) {
            console.error('Current password is incorrect');
            return false;
        }

        // Hash new password
        const newPasswordHash = await hashPassword(newPassword);

        // Update password
        const { error: updateError } = await supabase
            .from('admin_users')
            .update({ password_hash: newPasswordHash, updated_at: new Date().toISOString() })
            .eq('id', adminId);

        if (updateError) {
            console.error('Error updating password:', updateError);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Update password error:', error);
        return false;
    }
};

// Get all admin users
export const getAllAdmins = async (): Promise<AdminUser[]> => {
    try {
        console.log('Fetching admin users from database...');

        // Try with all fields first
        let { data, error } = await supabase
            .from('admin_users')
            .select('id, email, username, role, is_active, last_login, created_at, created_by')
            .order('created_at', { ascending: false });

        // If error (columns might not exist), try with basic fields only
        if (error) {
            console.log('Trying with basic fields only...');
            const result = await supabase
                .from('admin_users')
                .select('id, email, username, role, is_active, last_login')
                .order('id', { ascending: false });

            // Map the data to include optional fields
            data = result.data?.map(user => ({
                ...user,
                created_at: undefined,
                created_by: undefined
            })) || null;
            error = result.error;
        }

        if (error) {
            console.error('Error fetching admins:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return [];
        }

        console.log('Admin users fetched successfully:', data?.length || 0, 'users');
        return data || [];
    } catch (error) {
        console.error('Get admins error:', error);
        return [];
    }
};

// Update admin user (only super_admin can update)
export const updateAdmin = async (
    adminId: string,
    updates: {
        email?: string;
        username?: string;
        role?: 'super_admin' | 'admin';
        is_active?: boolean;
    },
    requestingAdminRole?: 'super_admin' | 'admin'
): Promise<{ success: boolean; error?: string }> => {
    try {
        // Check if requesting admin has permission
        if (requestingAdminRole !== 'super_admin') {
            return { success: false, error: 'Only Super Admins can update users' };
        }

        const { error } = await supabase
            .from('admin_users')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', adminId);

        if (error) {
            console.error('Error updating admin:', error);
            return { success: false, error: 'Failed to update admin user. Email or username may already exist.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Update admin error:', error);
        return { success: false, error: 'An error occurred while updating admin' };
    }
};

// Delete admin user - DEPRECATED: Use Supabase Dashboard instead
// Admin users should be managed manually in Supabase Dashboard
export const deleteAdmin = async (
    adminId: string,
    requestingAdminRole?: 'super_admin' | 'admin'
): Promise<{ success: boolean; error?: string }> => {
    return {
        success: false,
        error: 'Admin deletion must be done through Supabase Dashboard. Please contact a system administrator.'
    };
};

// Send password reset email using Supabase Auth
export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
        // Check if admin user exists and is active
        const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('id, email, is_active')
            .eq('email', email)
            .maybeSingle();

        if (adminError || !adminData) {
            console.error('Admin user not found:', adminError);
            return { success: false, error: 'No account found with this email address' };
        }

        if (!adminData.is_active) {
            return { success: false, error: 'This account is inactive. Please contact an administrator.' };
        }

        // Send password reset email using Supabase Auth
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/admin/reset-password`,
        });

        if (resetError) {
            console.error('Error sending reset email:', resetError);
            return { success: false, error: 'Failed to send password reset email' };
        }

        return { success: true };
    } catch (error) {
        console.error('Send password reset email error:', error);
        return { success: false, error: 'An error occurred while sending reset email' };
    }
};

// Legacy function - kept for backward compatibility
export const generateResetToken = async (email: string): Promise<string | null> => {
    const result = await sendPasswordResetEmail(email);
    return result.success ? 'email-sent' : null;
};

// Verify reset token
export const verifyResetToken = async (token: string): Promise<{ valid: boolean; email?: string }> => {
    try {
        const { data, error } = await supabase
            .from('password_reset_tokens')
            .select('email, expires_at, used')
            .eq('token', token)
            .single();

        if (error || !data) {
            return { valid: false };
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(data.expires_at);

        if (now > expiresAt || data.used) {
            return { valid: false };
        }

        return { valid: true, email: data.email };
    } catch (error) {
        console.error('Verify reset token error:', error);
        return { valid: false };
    }
};

// Reset password using Supabase Auth (called from reset password page)
export const resetPasswordWithSupabase = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
        // Update password in Supabase Auth
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) {
            console.error('Error updating password:', updateError);
            return { success: false, error: 'Failed to update password' };
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Update password hash in admin_users table for backward compatibility
            const newPasswordHash = await hashPassword(newPassword);
            await supabase
                .from('admin_users')
                .update({
                    password_hash: newPasswordHash,
                    updated_at: new Date().toISOString()
                })
                .eq('email', user.email);
        }

        return { success: true };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: 'An error occurred' };
    }
};

// Legacy function - kept for backward compatibility
export const resetPasswordWithToken = async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    // This is now handled by Supabase Auth's magic link flow
    return { success: false, error: 'Please use the password reset link sent to your email' };
};
