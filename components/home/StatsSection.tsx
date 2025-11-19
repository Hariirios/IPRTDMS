import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Users, Award, TrendingUp } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: GraduationCap,
      number: '50+',
      label: 'Training Programs',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Users,
      number: '2,500+',
      label: 'Graduates',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Award,
      number: '15+',
      label: 'Industry Partners',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Success Rate',
      gradient: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                {/* Glowing background */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500`} />
                
                {/* Card content */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
