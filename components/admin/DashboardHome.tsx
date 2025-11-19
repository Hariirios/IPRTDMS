import React from 'react';
import { motion } from 'motion/react';
import { Users, FolderKanban, ClipboardCheck, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export function DashboardHome() {
  const stats = [
    {
      title: 'Total Students',
      value: '0',
      icon: Users,
      gradient: 'from-blue-600 to-cyan-600',
      change: '+0%'
    },
    {
      title: 'Active Projects',
      value: '0',
      icon: FolderKanban,
      gradient: 'from-purple-600 to-pink-600',
      change: '+0%'
    },
    {
      title: 'Attendance Rate',
      value: '0%',
      icon: ClipboardCheck,
      gradient: 'from-green-600 to-teal-600',
      change: '+0%'
    },
    {
      title: 'Pending Requisitions',
      value: '0',
      icon: FileText,
      gradient: 'from-orange-600 to-red-600',
      change: '0'
    }
  ];

  const recentActivity = [
    { action: 'No recent activity', time: 'Just now', type: 'info' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#3B0764] to-[#8B5CF6] rounded-xl p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">Welcome to IPRT Dashboard</h2>
        <p className="text-white/90">Manage your institute's operations efficiently</p>
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
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-900 dark:text-white">Add Student</p>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <FolderKanban className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-900 dark:text-white">New Project</p>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-900 dark:text-white">Mark Attendance</p>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <p className="text-sm text-gray-900 dark:text-white">New Requisition</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
