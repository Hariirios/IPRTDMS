// Role-based permission system
export type UserRole = 'super_admin' | 'admin';

export interface Permission {
    canCreateUsers: boolean;
    canDeleteUsers: boolean;
    canManageContent: boolean;
    canChangeOwnPassword: boolean;
    canViewUsers: boolean;
}

// Get permissions based on role
export const getPermissions = (role: UserRole): Permission => {
    switch (role) {
        case 'super_admin':
            return {
                canCreateUsers: true,
                canDeleteUsers: true,
                canManageContent: true,
                canChangeOwnPassword: true,
                canViewUsers: true,
            };
        case 'admin':
            return {
                canCreateUsers: false,
                canDeleteUsers: false,
                canManageContent: true,
                canChangeOwnPassword: true,
                canViewUsers: true,
            };
        default:
            return {
                canCreateUsers: false,
                canDeleteUsers: false,
                canManageContent: false,
                canChangeOwnPassword: false,
                canViewUsers: false,
            };
    }
};

// Check if user has specific permission
export const hasPermission = (role: UserRole, permission: keyof Permission): boolean => {
    const permissions = getPermissions(role);
    return permissions[permission];
};

// Content management permissions (both admin and super_admin can manage)
export const canManageEvents = (role: UserRole): boolean => hasPermission(role, 'canManageContent');
export const canManageServices = (role: UserRole): boolean => hasPermission(role, 'canManageContent');
export const canManageVideos = (role: UserRole): boolean => hasPermission(role, 'canManageContent');
export const canManageBookings = (role: UserRole): boolean => hasPermission(role, 'canManageContent');
export const canManageTestimonials = (role: UserRole): boolean => hasPermission(role, 'canManageContent');
export const canManageContacts = (role: UserRole): boolean => hasPermission(role, 'canManageContent');
export const canManagePartners = (role: UserRole): boolean => hasPermission(role, 'canManageContent');

// User management permissions (only super_admin)
export const canCreateUsers = (role: UserRole): boolean => hasPermission(role, 'canCreateUsers');
export const canDeleteUsers = (role: UserRole): boolean => hasPermission(role, 'canDeleteUsers');
