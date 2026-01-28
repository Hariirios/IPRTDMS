import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Lock, Eye, EyeOff, Mail, Plus, Trash2, Shield, AlertCircle, Info, Calendar, Clock, UserCheck, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { AdminUser, updateAdminPassword, createAdmin, getAllAdmins, deleteAdmin, updateAdmin } from '../../lib/auth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { canCreateUsers, canDeleteUsers } from '../../lib/permissions';
import { EmailJSTest } from '../EmailJSTest';

interface SettingsAdminProps {
    currentAdmin: AdminUser | null;
}

export function SettingsAdmin({ currentAdmin }: SettingsAdminProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Admin management
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminUsername, setNewAdminUsername] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [newAdminRole, setNewAdminRole] = useState<'super_admin' | 'admin'>('admin');
    const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

    // View user details
    const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // Edit user
    const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editEmail, setEditEmail] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editRole, setEditRole] = useState<'super_admin' | 'admin'>('admin');
    const [editIsActive, setEditIsActive] = useState(true);
    const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false);

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        console.log('Loading admins...');
        const data = await getAllAdmins();
        console.log('Admins loaded:', data);
        setAdmins(data);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isChangingPassword) return;
        setIsChangingPassword(true);

        try {
            // Validate new password
            if (newPassword.length < 6) {
                toast.error('New password must be at least 6 characters');
                setIsChangingPassword(false);
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error('New passwords do not match');
                setIsChangingPassword(false);
                return;
            }

            if (!currentAdmin || currentAdmin.id === 'env-admin') {
                toast.error('Cannot change password for environment-based admin. Please create a database admin user.');
                setIsChangingPassword(false);
                return;
            }

            // Update password in database
            const success = await updateAdminPassword(currentAdmin.id, currentPassword, newPassword);

            if (success) {
                toast.success('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error('Current password is incorrect');
            }
        } catch (error) {
            toast.error('Failed to change password');
            console.error('Error changing password:', error);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isCreatingAdmin) return;

        // Check if current user is super admin
        if (currentAdmin?.role !== 'super_admin') {
            toast.error('Only Super Admins can create new users');
            return;
        }

        setIsCreatingAdmin(true);

        try {
            if (newAdminPassword.length < 6) {
                toast.error('Password must be at least 6 characters');
                setIsCreatingAdmin(false);
                return;
            }

            const result = await createAdmin(
                newAdminEmail,
                newAdminUsername,
                newAdminPassword,
                newAdminRole,
                currentAdmin?.role,
                currentAdmin?.username
            );

            if (result.success) {
                toast.success(`${newAdminRole === 'super_admin' ? 'Super Admin' : 'Admin'} user created successfully!`);
                setNewAdminEmail('');
                setNewAdminUsername('');
                setNewAdminPassword('');
                setNewAdminRole('admin');
                setIsDialogOpen(false);
                await loadAdmins();
            } else {
                toast.error(result.error || 'Failed to create admin. Email or username may already exist.');
            }
        } catch (error) {
            toast.error('Failed to create admin user');
            console.error('Error creating admin:', error);
        } finally {
            setIsCreatingAdmin(false);
        }
    };

    const handleDeleteAdmin = async (adminId: string) => {
        // Check if current user is super admin
        if (currentAdmin?.role !== 'super_admin') {
            toast.error('Only Super Admins can delete users');
            return;
        }

        try {
            const result = await deleteAdmin(adminId, currentAdmin?.role);
            if (result.success) {
                toast.success('Admin deleted successfully');
                await loadAdmins();
            } else {
                toast.error(result.error || 'Failed to delete admin');
            }
        } catch (error) {
            toast.error('Failed to delete admin');
            console.error('Error deleting admin:', error);
        }
    };

    const handleViewUser = (admin: AdminUser) => {
        setSelectedUser(admin);
        setViewUserDialogOpen(true);
    };

    const handleEditUser = (admin: AdminUser) => {
        setEditingUser(admin);
        setEditEmail(admin.email);
        setEditUsername(admin.username);
        setEditRole(admin.role);
        setEditIsActive(admin.is_active);
        setEditUserDialogOpen(true);
    };

    const handleUpdateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUser) return;

        // Check if current user is super admin
        if (currentAdmin?.role !== 'super_admin') {
            toast.error('Only Super Admins can edit users');
            return;
        }

        setIsUpdatingAdmin(true);

        try {
            const result = await updateAdmin(
                editingUser.id,
                {
                    email: editEmail,
                    username: editUsername,
                    role: editRole,
                    is_active: editIsActive,
                },
                currentAdmin?.role
            );

            if (result.success) {
                toast.success('Admin user updated successfully!');
                setEditUserDialogOpen(false);
                await loadAdmins();
            } else {
                toast.error(result.error || 'Failed to update admin');
            }
        } catch (error) {
            toast.error('Failed to update admin user');
            console.error('Error updating admin:', error);
        } finally {
            setIsUpdatingAdmin(false);
        }
    };

    const getPermissionsList = (role: 'super_admin' | 'admin') => {
        const basePermissions = [
            'Login to admin panel',
            'Change own password',
            'View admin users',
            'Manage Events',
            'Manage Services',
            'Manage Videos',
            'Manage Bookings',
            'Manage Testimonials',
            'Manage Contacts',
            'Manage Partners',
        ];

        if (role === 'super_admin') {
            return ['Create new users', 'Delete users', ...basePermissions];
        }

        return basePermissions;
    };

    return (
        <div className="space-y-6">
            {/* Account Information and Change Password Cards - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Information Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[#8B5CF6]/30 dark:border-[#3B0764]/30 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#3B0764] dark:text-[#8B5CF6]">Account Information</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your admin account details</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="text-gray-700 dark:text-gray-300">Email Address</Label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    value={currentAdmin?.email || 'Not logged in'}
                                    disabled
                                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-gray-700 dark:text-gray-300">Username</Label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    value={currentAdmin?.username || 'Not logged in'}
                                    disabled
                                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-gray-700 dark:text-gray-300">Role</Label>
                            <div className="relative mt-1">
                                <Input
                                    value={currentAdmin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                    disabled
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                />
                            </div>
                        </div>

                        {currentAdmin?.last_login && (
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300">Last Login</Label>
                                <div className="relative mt-1">
                                    <Input
                                        value={new Date(currentAdmin.last_login).toLocaleString()}
                                        disabled
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[#8B5CF6]/30 dark:border-[#3B0764]/30 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full flex items-center justify-center">
                            <Lock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#3B0764] dark:text-[#8B5CF6]">Change Password</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Update your admin password</p>
                        </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">
                                Current Password
                            </Label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="pl-10 pr-10 border-[#3B0764]/30 dark:border-[#8B5CF6]/30"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3B0764] dark:hover:text-[#8B5CF6]"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                                New Password
                            </Label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 characters)"
                                    className="pl-10 pr-10 border-[#3B0764]/30 dark:border-[#8B5CF6]/30"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3B0764] dark:hover:text-[#8B5CF6]"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                                Confirm New Password
                            </Label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="pl-10 pr-10 border-[#3B0764]/30 dark:border-[#8B5CF6]/30"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3B0764] dark:hover:text-[#8B5CF6]"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isChangingPassword}
                            className="w-full bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                        >
                            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Permission Notice for Regular Admins */}
            {currentAdmin?.role === 'admin' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Admin Role Permissions</h3>
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                                As an Admin, you can <strong>view all users and their details</strong>, and manage all content (Events, Services, Videos, Bookings, Testimonials, Contacts, Partners).
                                You can also change your own password. However, only <strong>Super Admins can add or delete user accounts</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Users Management Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[#8B5CF6]/30 dark:border-[#3B0764]/30 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#3B0764] dark:text-[#8B5CF6]">Admin Users</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {currentAdmin?.role === 'super_admin' ? 'Manage admin accounts' : 'View admin accounts (Super Admin only can create/delete)'}
                            </p>
                        </div>
                    </div>

                    {currentAdmin?.role === 'super_admin' && canCreateUsers(currentAdmin.role) && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Admin
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Admin User</DialogTitle>
                                    <DialogDescription>Add a new admin user and assign their role</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <div>
                                        <Label htmlFor="newEmail">Email</Label>
                                        <Input
                                            id="newEmail"
                                            type="email"
                                            value={newAdminEmail}
                                            onChange={(e) => setNewAdminEmail(e.target.value)}
                                            placeholder="admin@example.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="newUsername">Username</Label>
                                        <Input
                                            id="newUsername"
                                            type="text"
                                            value={newAdminUsername}
                                            onChange={(e) => setNewAdminUsername(e.target.value)}
                                            placeholder="admin"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="newPassword">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showNewAdminPassword ? 'text' : 'password'}
                                                value={newAdminPassword}
                                                onChange={(e) => setNewAdminPassword(e.target.value)}
                                                placeholder="Min 6 characters"
                                                className="pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showNewAdminPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="newRole">Role</Label>
                                        <Select value={newAdminRole} onValueChange={(value: 'super_admin' | 'admin') => setNewAdminRole(value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        <div>
                                                            <p className="font-medium">Admin</p>
                                                            <p className="text-xs text-gray-500">Can manage content, view users only</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="super_admin">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4" />
                                                        <div>
                                                            <p className="font-medium">Super Admin</p>
                                                            <p className="text-xs text-gray-500">Full access + create/delete users</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isCreatingAdmin}
                                            className="flex-1 bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                                        >
                                            {isCreatingAdmin ? 'Creating...' : 'Create Admin'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <div className="space-y-3">
                    {admins.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No admin users found in database</p>
                    ) : (
                        admins.map((admin) => (
                            <div
                                key={admin.id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900 dark:text-white">{admin.username}</p>
                                            {admin.role === 'super_admin' && (
                                                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded">
                                                    Super Admin
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{admin.email}</p>
                                        {admin.last_login && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                Last login: {new Date(admin.last_login).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {admin.is_active ? (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                                            Inactive
                                        </span>
                                    )}

                                    {/* View User Details Button - Available to ALL admins */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleViewUser(admin)}
                                        className="text-[#3B0764] hover:text-[#3B0764] hover:bg-[#8B5CF6]/20 dark:text-[#8B5CF6] dark:hover:text-[#3B0764]"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>

                                    {/* Edit Button - Only Super Admins */}
                                    {currentAdmin?.role === 'super_admin' && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEditUser(admin)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    )}

                                    {/* Delete Button - Only Super Admins (not for self) */}
                                    {currentAdmin?.role === 'super_admin' && canDeleteUsers(currentAdmin.role) && currentAdmin?.id !== admin.id && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Admin User</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete {admin.username}? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Admin User</DialogTitle>
                        <DialogDescription>Update admin user information and permissions</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateAdmin} className="space-y-4">
                        <div>
                            <Label htmlFor="editEmail">Email</Label>
                            <Input
                                id="editEmail"
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="editUsername">Username</Label>
                            <Input
                                id="editUsername"
                                type="text"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                placeholder="admin"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="editRole">Role</Label>
                            <Select value={editRole} onValueChange={(value: 'super_admin' | 'admin') => setEditRole(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <div>
                                                <p className="font-medium">Admin</p>
                                                <p className="text-xs text-gray-500">Can manage content, view users only</p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="super_admin">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            <div>
                                                <p className="font-medium">Super Admin</p>
                                                <p className="text-xs text-gray-500">Full access + create/delete users</p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="editIsActive"
                                checked={editIsActive}
                                onChange={(e) => setEditIsActive(e.target.checked)}
                                className="w-4 h-4 text-[#3B0764] border-gray-300 rounded focus:ring-[#3B0764]"
                            />
                            <Label htmlFor="editIsActive" className="cursor-pointer">
                                Active (user can login)
                            </Label>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditUserDialogOpen(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isUpdatingAdmin}
                                className="flex-1 bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                            >
                                {isUpdatingAdmin ? 'Updating...' : 'Update Admin'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View User Details Dialog */}
            <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            User Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information about this admin user
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-6 py-4">
                            {/* Basic Information Card */}
                            <div className="bg-gradient-to-br from-[#8B5CF6]/20 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/10 rounded-xl p-4 border border-[#3B0764]/20">
                                <h3 className="font-semibold text-[#3B0764] dark:text-[#8B5CF6] mb-3 flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-gray-600 dark:text-gray-400">Username</Label>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedUser.username}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-600 dark:text-gray-400">Email</Label>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-600 dark:text-gray-400">Role</Label>
                                        <div className="flex items-center gap-2">
                                            {selectedUser.role === 'super_admin' ? (
                                                <>
                                                    <Shield className="h-4 w-4 text-purple-600" />
                                                    <span className="font-medium text-purple-700 dark:text-purple-400">Super Admin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <User className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-blue-700 dark:text-blue-400">Admin</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-600 dark:text-gray-400">Status</Label>
                                        <div className="flex items-center gap-2">
                                            {selectedUser.is_active ? (
                                                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Information Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Activity Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-blue-700 dark:text-blue-400">Last Login</Label>
                                        <p className="font-medium text-blue-900 dark:text-blue-200">
                                            {selectedUser.last_login
                                                ? new Date(selectedUser.last_login).toLocaleString('en-US', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })
                                                : 'Never logged in'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-blue-700 dark:text-blue-400">Account Created</Label>
                                        <p className="font-medium text-blue-900 dark:text-blue-200">
                                            {selectedUser.created_at
                                                ? new Date(selectedUser.created_at).toLocaleString('en-US', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })
                                                : 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                                {selectedUser.created_by && (
                                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                                        <Label className="text-xs text-blue-700 dark:text-blue-400">Created By</Label>
                                        <p className="font-medium text-blue-900 dark:text-blue-200 flex items-center gap-2">
                                            <UserCheck className="h-4 w-4" />
                                            {selectedUser.created_by}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Permissions Card */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Access Permissions
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {getPermissionsList(selectedUser.role).map((permission, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-300"
                                        >
                                            <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                                            {permission}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* User ID (for technical reference) */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                <Label className="text-xs text-gray-600 dark:text-gray-400">User ID (Technical Reference)</Label>
                                <p className="font-mono text-xs text-gray-700 dark:text-gray-300 mt-1 break-all">
                                    {selectedUser.id}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            onClick={() => setViewUserDialogOpen(false)}
                            className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* EmailJS Configuration Test - Only for Super Admins */}
            {currentAdmin?.role === 'super_admin' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[#8B5CF6]/30 dark:border-[#3B0764]/30 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full flex items-center justify-center">
                            <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#3B0764] dark:text-[#8B5CF6]">EmailJS Configuration</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Test external registration email system</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">EmailJS Integration</h3>
                                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                                    This system sends registration emails from external users (seminars, workshops, program applications) 
                                    directly to <strong>iprt.hrg@gmail.com</strong> using EmailJS service.
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-400">
                                    Use the test buttons below to verify the email configuration is working properly.
                                </p>
                            </div>
                        </div>
                    </div>

                    <EmailJSTest />
                </div>
            )}
        </div>
    );
}
