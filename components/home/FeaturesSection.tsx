import React from 'react';
import { motion } from 'motion/react';
import { Database, BarChart3, Users } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      number: '01',
      icon: Database,
      title: 'Resource Tracking',
      description: 'Real-time monitoring of project resources and allocations',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      number: '02',
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Advanced analytics and reporting for project insights',
      gradient: 'from-green-600 to-blue-600'
    },
    {
      number: '03',
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless team coordination and communication tools',
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Key Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Powerful tools to manage your training programs and research projects
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full">
                  {/* Number badge */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                    <span className="text-white text-2xl font-bold">{feature.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <Icon className={`h-12 w-12 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
