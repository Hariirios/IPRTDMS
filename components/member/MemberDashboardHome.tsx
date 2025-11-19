import React from 'react';
import { motion } from 'motion/react';
import { Users, FolderKanban, ClipboardCheck, FileText, TrendingUp, AlertCircle, UserPlus } from 'lucide-react';

export function MemberDashboardHome() {
  const stats = [
    {
      title: 'My Projects',
      value: '1',
      icon: FolderKanban,
      gradient: 'from-purple-600 to-pink-600',
      change: 'Active'
    },
    {
      title: 'Students Managed',
      value: '2',
      icon: Users,
      gradient: 'from-blue-600 to-cyan-600',
      change: 'Total'
    },
    {
      title: 'Attendance Records',
      value: '4',
      icon: ClipboardCheck,
      gradient: 'from-green-600 to-teal-600',
      change: 'This week'
    },
    {
      title: 'My Requisitions',
      value: '0',
      icon: FileText,
      gradient: 'from-orange-600 to-red-600',
      change: 'Pending'
    }
  ];

  const recentActivity = [
    { action: 'Welcome to IPRT Member Dashboard', time: 'Just now', type: 'info', icon: AlertCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#3B0764] to-[#8B5CF6] rounded-xl p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
        <p className="text-white/90">Manage your assigned projects and track student progress</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const ActivityIcon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <ActivityIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-900 dark:text-white">Add Student</p>
            </button>
            <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-900 dark:text-white">Take Attendance</p>
            </button>
            <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <FolderKanban className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-900 dark:text-white">View Projects</p>
            </button>
            <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <p className="text-sm text-gray-900 dark:text-white">New Requisition</p>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                View your assigned projects in the "My Projects" tab
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Add students to your projects from the Students tab
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Track attendance regularly in the Attendance tab
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Submit requisitions when you need resources
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
