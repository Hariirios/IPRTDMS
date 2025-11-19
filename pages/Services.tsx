import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, Network, FileText, TrendingUp, Award } from 'lucide-react';

export default function Services() {
  const iprtServices = [
    {
      id: 1,
      icon: BookOpen,
      title: 'Practical Skills Training',
      description: 'Providing hands-on training programs that equip students with real-world skills and practical knowledge for immediate career application.',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 2,
      icon: Users,
      title: 'Career Counseling & Support',
      description: 'Professional guidance and mentorship to help students navigate career paths and make informed educational decisions.',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 3,
      icon: Network,
      title: 'Industry Awareness Programs',
      description: 'Educational initiatives that connect students with industry trends and emerging opportunities in various sectors.',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      id: 4,
      icon: FileText,
      title: 'Research Project Support',
      description: 'Comprehensive assistance for student research projects, from conceptualization to implementation and analysis.',
      gradient: 'from-orange-600 to-red-600'
    },
    {
      id: 5,
      icon: TrendingUp,
      title: 'Progress Monitoring',
      description: 'Regular assessment and tracking of student progress to ensure continuous improvement and academic success.',
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      id: 6,
      icon: Award,
      title: 'Professional Development',
      description: 'Advanced training programs and workshops that enhance professional skills and build capacity for career advancement.',
      gradient: 'from-pink-600 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#8B5CF6] to-[#3B0764] dark:from-[#3B0764] dark:to-[#3B0764]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-5">
              We Provide Practical Education<br />For Career Success
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-5"></div>
            <p className="text-white/90 text-base">
              At <span className="font-semibold text-purple-300">IPRT</span>, we are dedicated to ensuring that everyone, regardless of their background, can access the education and training they need to build successful careers and improve their quality of life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {iprtServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
                >
                  <div className="mb-5">
                    <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg mb-3`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
