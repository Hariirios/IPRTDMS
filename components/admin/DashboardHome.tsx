import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, FolderKanban, ClipboardCheck, FileText, AlertCircle } from 'lucide-react';
import { studentStore } from '../../lib/studentStore';
import { projectStore } from '../../lib/projectStore';
import { attendanceStore } from '../../lib/attendanceStore';
import { requisitionStore } from '../../lib/requisitionStore';
import { useRealtimeSubscription } from '../../lib/useRealtimeSubscription';
import { MessageButton } from '../messaging/MessageButton';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardHomeProps {
  onTabChange?: (tab: string) => void;
}

export function DashboardHome({ onTabChange }: DashboardHomeProps) {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeProjects: 0,
    attendanceRate: 0,
    pendingRequisitions: 0
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [students, projects, attendance, requisitions] = await Promise.all([
        studentStore.getAll(),
        projectStore.getAll(),
        attendanceStore.getAll(),
        requisitionStore.getAll()
      ]);

      // Calculate stats
      const totalStudents = students.length;
      const activeProjects = projects.filter(p => p.status === 'Active').length;
      const pendingRequisitions = requisitions.filter(r => r.status === 'Pending').length;

      // Calculate attendance rate
      let attendanceRate = 0;
      if (attendance.length > 0) {
        const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
        attendanceRate = Math.round((presentCount / attendance.length) * 100);
      }

      setStats({
        totalStudents,
        activeProjects,
        attendanceRate,
        pendingRequisitions
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Real-time updates
  useRealtimeSubscription('students', loadDashboardData);
  useRealtimeSubscription('projects', loadDashboardData);
  useRealtimeSubscription('attendance', loadDashboardData);
  useRealtimeSubscription('requisitions', loadDashboardData);

  const statsDisplay = [
    {
      title: t.admin.dashboard.totalStudents,
      value: loading ? '...' : stats.totalStudents.toString(),
      icon: Users,
      gradient: 'from-blue-600 to-cyan-600',
      change: stats.totalStudents > 0 ? `${stats.totalStudents} ${t.admin.dashboard.enrolled}` : 'No students yet'
    },
    {
      title: t.admin.dashboard.activeProjects,
      value: loading ? '...' : stats.activeProjects.toString(),
      icon: FolderKanban,
      gradient: 'from-purple-600 to-pink-600',
      change: stats.activeProjects > 0 ? `${stats.activeProjects} ${t.admin.dashboard.ongoing}` : 'No active projects'
    },
    {
      title: t.admin.dashboard.attendanceRate,
      value: loading ? '...' : `${stats.attendanceRate}%`,
      icon: ClipboardCheck,
      gradient: 'from-green-600 to-teal-600',
      change: stats.attendanceRate >= 80 ? t.admin.dashboard.excellent : stats.attendanceRate >= 60 ? t.admin.dashboard.good : t.admin.dashboard.needsImprovement
    },
    {
      title: t.admin.dashboard.pendingRequisitions,
      value: loading ? '...' : stats.pendingRequisitions.toString(),
      icon: FileText,
      gradient: 'from-orange-600 to-red-600',
      change: stats.pendingRequisitions > 0 ? t.admin.dashboard.needsReview : t.admin.dashboard.allReviewed
    }
  ];

  const recentActivity = [
    { action: t.admin.dashboard.dataLoaded, time: 'Just now', type: 'info' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#3B0764] to-[#8B5CF6] rounded-xl p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">{t.admin.dashboard.welcome}</h2>
        <p className="text-white/90">{t.admin.dashboard.description}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.admin.dashboard.recentActivity}</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.admin.dashboard.quickActions}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onTabChange?.('students')}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-gray-900 dark:text-white">{t.admin.dashboard.addStudent}</p>
          </button>
          <button 
            onClick={() => onTabChange?.('projects')}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
          >
            <FolderKanban className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-gray-900 dark:text-white">{t.admin.dashboard.newProject}</p>
          </button>
          <button 
            onClick={() => onTabChange?.('attendance')}
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-gray-900 dark:text-white">{t.admin.dashboard.viewAttendance}</p>
          </button>
          <button 
            onClick={() => onTabChange?.('requisitions')}
            className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
          >
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-gray-900 dark:text-white">{t.admin.dashboard.reviewRequisitions}</p>
          </button>
        </div>
      </motion.div>

      {/* Message Button */}
      <MessageButton 
        userId="admin-1" 
        userType="admin" 
        userName="Admin" 
      />
    </div>
  );
}
