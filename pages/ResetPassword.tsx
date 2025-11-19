import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { resetPasswordWithSupabase } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { checkPasswordStrength, type PasswordStrength } from '../lib/passwordValidator';

export default function ResetPassword() {
    const navigate = useNavigate();

    const [isValidSession, setIsValidSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

    // Hide navbar, footer, and WhatsApp button on this page
    useEffect(() => {
        const navbar = document.querySelector('nav');
        const footer = document.querySelector('footer');
        const whatsappButton = document.querySelector('[class*="whatsapp"]')?.parentElement;

        if (navbar) navbar.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (whatsappButton) whatsappButton.style.display = 'none';

        return () => {
            if (navbar) navbar.style.display = '';
            if (footer) footer.style.display = '';
            if (whatsappButton) whatsappButton.style.display = '';
        };
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            // Check if user came from password reset email
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                toast.error('Invalid or expired reset link. Please request a new one.');
                navigate('/admin');
                return;
            }

            setIsValidSession(true);
            setIsLoading(false);
        };

        checkSession();
    }, [navigate]);

    // Check password strength as user types
    useEffect(() => {
        if (newPassword) {
            const strength = checkPasswordStrength(newPassword);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(null);
        }
    }, [newPassword]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        // Check password strength
        if (passwordStrength && passwordStrength.score < 2) {
            toast.error('Password is too weak. Please create a stronger password.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match. Please try again.');
            return;
        }

        setIsResetting(true);

        try {
            const result = await resetPasswordWithSupabase(newPassword);

            if (result.success) {
                setResetSuccess(true);
                toast.success('✓ Password reset confirmed! Redirecting to login...');
                // Sign out after password reset
                await supabase.auth.signOut();
                setTimeout(() => {
                    navigate('/admin');
                }, 2500);
            } else {
                toast.error(result.error || 'Failed to reset password. Please try again.');
                setIsResetting(false);
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error('An error occurred. Please try again.');
            setIsResetting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] via-[#3B0764] to-[#3B0764]">
                <div className="text-white text-xl">Verifying reset link...</div>
            </div>
        );
    }

    if (!isValidSession) {
        return null;
    }

    if (resetSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] via-[#3B0764] to-[#3B0764] dark:from-[#3B0764] dark:via-[#3B0764] dark:to-[#8B5CF6] px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-900 border border-[#3B0764]/30 dark:border-[#8B5CF6]/30 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#3B0764] dark:text-[#8B5CF6]">
                            Password Reset Confirmed!
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                            Your password has been successfully updated.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Redirecting to login page...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] via-[#3B0764] to-[#3B0764] dark:from-[#3B0764] dark:via-[#3B0764] dark:to-[#8B5CF6] px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 border border-[#3B0764]/30 dark:border-[#8B5CF6]/30 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full flex items-center justify-center shadow-lg">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#3B0764] dark:text-[#8B5CF6]">
                        Set New Password
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-6">
                        Create a strong password for your account
                    </p>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <Label htmlFor="newPassword" className="text-[#3B0764] dark:text-[#8B5CF6]">
                                New Password
                            </Label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 8 characters)"
                                    className="pl-10 pr-10 border-[#3B0764]/30 dark:border-[#8B5CF6]/30 focus:border-[#3B0764] dark:focus:border-[#8B5CF6]"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3B0764] dark:hover:text-[#8B5CF6]"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {passwordStrength && newPassword && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength:</span>
                                        <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.score
                                                    ? passwordStrength.score === 0 || passwordStrength.score === 1
                                                        ? 'bg-red-500'
                                                        : passwordStrength.score === 2
                                                            ? 'bg-orange-500'
                                                            : passwordStrength.score === 3
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                    : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    {passwordStrength.suggestions.length > 0 && passwordStrength.score < 3 && (
                                        <div className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400">
                                            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                            <span>{passwordStrength.suggestions[0]}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-[#3B0764] dark:text-[#8B5CF6]">
                                Confirm Password
                            </Label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="pl-10 pr-10 border-[#3B0764]/30 dark:border-[#8B5CF6]/30 focus:border-[#3B0764] dark:focus:border-[#8B5CF6]"
                                    required
                                    minLength={8}
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
                            disabled={isResetting}
                            className="w-full bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white font-semibold py-5 sm:py-6 text-base sm:text-lg"
                        >
                            {isResetting ? 'Setting New Password...' : 'Set New Password'}
                        </Button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="w-full text-center text-sm text-[#3B0764] dark:text-[#8B5CF6] hover:underline"
                        >
                            Back to Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
