import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DashboardHome } from '../components/admin/DashboardHome';
import { ProjectsAdmin } from '../components/admin/ProjectsAdmin';
import { StudentsAdmin } from '../components/admin/StudentsAdmin';
import { AttendanceAdmin } from '../components/admin/AttendanceAdmin';
import { RequisitionsAdmin } from '../components/admin/RequisitionsAdmin';
import { TeamMembersAdmin } from '../components/admin/TeamMembersAdmin';
import { DeletionRequestsAdmin } from '../components/admin/DeletionRequestsAdmin';
import { MembersAdmin } from '../components/admin/MembersAdmin';
import { NotificationBell } from '../components/admin/NotificationBell';
import { Notification } from '../lib/notificationStore';
import { deletionRequestStore } from '../lib/deletionRequestStore';
import { memberStore } from '../lib/memberStore';
import { MemberProjects } from '../components/member/MemberProjects';
import { MemberAttendance } from '../components/member/MemberAttendance';
import { MemberStudents } from '../components/member/MemberStudents';
import { MemberDashboardHome } from '../components/member/MemberDashboardHome';
import { MemberProfile } from '../components/member/MemberProfile';
import { Lock, Eye, EyeOff, LogOut, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'admin' | 'member'>('admin');
  const [authenticatedUserType, setAuthenticatedUserType] = useState<'admin' | 'member'>('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingDeletionsCount, setPendingDeletionsCount] = useState(0);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'so', name: 'Somali', flag: '🇸🇴' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Hide navbar/footer when on admin page
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

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsLangMenuOpen(false);
    };
    if (isLangMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isLangMenuOpen]);

  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (userType === 'admin') {
      if ((email === adminEmail || email === adminUsername) && password === adminPassword) {
        setIsAuthenticated(true);
        setAuthenticatedUserType('admin');
        toast.success('Welcome to IPRT Admin Dashboard!');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      // Authenticate member from database
      try {
        const member = await memberStore.authenticate(email, password);
        if (member) {
          setIsAuthenticated(true);
          setAuthenticatedUserType('member');
          localStorage.setItem('currentMemberId', member.id);
          localStorage.setItem('currentMemberEmail', member.email);
          toast.success(`Welcome ${member.name}!`);
        } else {
          setError('Invalid member credentials or account is inactive');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setError('');
    setAuthenticatedUserType('admin');
    toast.success('Logged out successfully');
  };

  const handleNotificationClick = (notification: Notification) => {
    // Redirect to appropriate tab based on notification type
    switch (notification.type) {
      case 'deletion_request':
        setActiveTab('deletions');
        toast.info('Viewing deletion request');
        break;
      case 'requisition':
        setActiveTab('requisitions');
        toast.info('Viewing requisition');
        break;
      case 'project':
        setActiveTab('projects');
        toast.info('Viewing project');
        break;
      case 'student':
        setActiveTab('students');
        toast.info('Viewing students');
        break;
      case 'attendance':
        setActiveTab('attendance');
        toast.info('Viewing attendance');
        break;
      case 'team':
        setActiveTab('team');
        toast.info('Viewing team members');
        break;
      default:
        setActiveTab('dashboard');
        break;
    }
  };

  // Update pending deletions count
  useEffect(() => {
    if (authenticatedUserType === 'admin' && isAuthenticated) {
      const updateCount = async () => {
        const pending = await deletionRequestStore.getPending();
        setPendingDeletionsCount(pending.length);
      };
      
      updateCount();
      const interval = setInterval(updateCount, 3000);
      return () => clearInterval(interval);
    }
  }, [authenticatedUserType, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/30 p-4 relative overflow-hidden">
        {/* Animated Background Circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />

        {/* Theme Toggle Button - Fixed at top right corner */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed top-6 right-6 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group overflow-hidden border border-gray-200 dark:border-gray-700 transition-all"
          >
            {/* Animated Background Glow */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute inset-0 ${isDark ? 'bg-yellow-400/30' : 'bg-purple-600/30'} rounded-full blur-md`}
            />
            
            {/* Icon */}
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Sun className="h-5 w-5 text-yellow-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Moon className="h-5 w-5 text-purple-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex max-w-5xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden relative z-10"
        >
        
        {/* Left Side - Purple */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] p-8 flex-col justify-between text-white">
          <div>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center mb-6"
            >
              {/* Logo Container with Glow Effect */}
              <div className="relative mb-3">
                {/* Animated Glow Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full blur-md"
                />
                
                {/* Logo Circle */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 overflow-hidden"
                >
                  <motion.img
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    src="/assets/main_logo.png"
                    alt="IPRT Logo"
                    className="w-20 h-20 object-cover rounded-full"
                  />
                </motion.div>
              </div>

              {/* Text with Gradient */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent mb-1"
              >
                IPRT
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-white/90 text-center font-medium"
              >
                Institute for Practical Research & Training
              </motion.p>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl font-bold mb-2">IPRT</h2>
              <p className="text-sm text-white/90">Secure access to your personalized management portal</p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Lock, text: 'Enterprise security', delay: 0.7 },
                { icon: null, text: 'Real-time analytics', delay: 0.8, svg: true },
                { icon: null, text: 'Role-based access', delay: 0.9, svg: true },
                { icon: null, text: 'Responsive interface', delay: 1.0, svg: true }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: feature.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center cursor-pointer"
                >
                  {index === 0 && <Lock className="h-6 w-6 mx-auto mb-2" />}
                  {index === 1 && (
                    <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  <p className="text-xs">{feature.text}</p>
                </motion.div>
              ))}
            </div>
            {/* Old feature cards removed */}
            <div className="hidden">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-xs">Real-time analytics</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-xs">Role-based access</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">Responsive interface</p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <a href="/" className="flex items-center text-white/80 hover:text-white transition-colors text-sm mt-4">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/assets/main_logo.png" alt="IPRT Logo" className="w-20 h-20 object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-[#3B0764]">IPRT</h1>
            </div>

            {/* User Type Toggle */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-2 mb-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType('admin')}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all text-sm ${
                  userType === 'admin'
                    ? 'bg-[#7C3AED] text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Lock className="h-4 w-4 inline mr-2" />
                Admin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType('member')}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all text-sm ${
                  userType === 'member'
                    ? 'bg-[#7C3AED] text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Member
              </motion.button>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {userType === 'admin' ? 'Admin Portal' : 'Member Portal'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">System administration and management</p>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 text-sm">Email Address</Label>
                  <div className="relative mt-1">
                    <Input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cabdaleaxmed85@gmail.com"
                      className="pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      required
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-4 pr-20 py-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#7C3AED] border-gray-300 rounded focus:ring-[#7C3AED]"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-[#7C3AED] hover:text-[#6D28D9]">
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 text-base font-semibold rounded-xl">
                    → Login as {userType === 'admin' ? 'Admin' : 'Member'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  if (authenticatedUserType === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IPRT Admin Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Institute for Practical Research & Training</p>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell 
                  userRole="admin" 
                  userEmail="admin@iprt.edu"
                  onNotificationClick={handleNotificationClick} 
                />
                
                {/* Language Selector */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLangMenuOpen(!isLangMenuOpen);
                    }}
                    title="Change Language"
                  >
                    <Globe className="h-4 w-4" />
                  </Button>

                  <AnimatePresence>
                    {isLangMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code as 'en' | 'so' | 'ar');
                              setIsLangMenuOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-[#8B5CF6]/10 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                              language === lang.code
                                ? 'bg-[#8B5CF6]/20 dark:bg-[#3B0764] text-[#3B0764] dark:text-white font-semibold'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="text-2xl">{lang.flag}</span>
                            <span>{lang.name}</span>
                            {language === lang.code && (
                              <span className="ml-auto text-[#3B0764] dark:text-[#8B5CF6]">✓</span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
              <TabsTrigger value="deletions" className="relative">
                Deletion Requests
                {pendingDeletionsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {pendingDeletionsCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="team">Team Members</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardHome />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsAdmin />
            </TabsContent>

            <TabsContent value="students">
              <StudentsAdmin />
            </TabsContent>

            <TabsContent value="members">
              <MembersAdmin />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceAdmin />
            </TabsContent>

            <TabsContent value="requisitions">
              <RequisitionsAdmin />
            </TabsContent>

            <TabsContent value="deletions">
              <DeletionRequestsAdmin onRequestProcessed={async () => {
                const pending = await deletionRequestStore.getPending();
                setPendingDeletionsCount(pending.length);
              }} />
            </TabsContent>

            <TabsContent value="team">
              <TeamMembersAdmin />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Member Dashboard
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IPRT Member Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Institute for Practical Research & Training</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification Bell for Members */}
              <NotificationBell 
                userRole="member" 
                userEmail={localStorage.getItem('currentMemberEmail') || 'member@iprt.edu'}
                onNotificationClick={handleNotificationClick} 
              />
              
              {/* Language Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLangMenuOpen(!isLangMenuOpen);
                  }}
                  title="Change Language"
                >
                  <Globe className="h-4 w-4" />
                </Button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as 'en' | 'so' | 'ar');
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-[#8B5CF6]/10 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                            language === lang.code
                              ? 'bg-[#8B5CF6]/20 dark:bg-[#3B0764] text-[#3B0764] dark:text-white font-semibold'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <span>{lang.name}</span>
                          {language === lang.code && (
                            <span className="ml-auto text-[#3B0764] dark:text-[#8B5CF6]">✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <MemberDashboardHome />
          </TabsContent>

          <TabsContent value="projects">
            <MemberProjects />
          </TabsContent>

          <TabsContent value="students">
            <MemberStudents />
          </TabsContent>

          <TabsContent value="attendance">
            <MemberAttendance />
          </TabsContent>

          <TabsContent value="requisitions">
            <RequisitionsAdmin userRole="member" />
          </TabsContent>

          <TabsContent value="profile">
            <MemberProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
