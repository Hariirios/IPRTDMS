import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, Users, Network, ArrowRight } from 'lucide-react';

export function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      id: 1,
      icon: BookOpen,
      title: t.services?.services?.[0]?.title || 'Training Programs',
      description: t.services?.services?.[0]?.description || 'Comprehensive hands-on training in various fields with certified instructors and practical workshops.',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 2,
      icon: Users,
      title: t.services?.services?.[2]?.title || 'Consulting Services',
      description: t.services?.services?.[2]?.description || 'Professional consulting for organizations including organizational development and training needs assessment.',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 3,
      icon: Network,
      title: t.services?.services?.[1]?.title || 'Research Services',
      description: t.services?.services?.[1]?.description || 'Innovative research solutions for real-world challenges including applied research projects and data analysis.',
      gradient: 'from-green-600 to-teal-600'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
            {t.services?.title || 'Our Services'}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3B0764] to-[#8B5CF6] mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t.services?.subtitle || 'Comprehensive training and research services tailored to your needs'}
          </p>
        </motion.div>

        {/* Services Grid - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {services.map((service, index) => {
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

        {/* View All Services Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link to="/services">
            <Button className="bg-[#3B0764] hover:bg-[#2d0550] text-white px-8 py-6 text-lg group">
              {t.home?.exploreAllServices || 'View All Services'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
