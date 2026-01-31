import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, Heart, Users, Lightbulb } from 'lucide-react';

export function AboutSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Heart,
      title: t.about?.values?.[0]?.title || 'Excellence',
      desc: t.about?.values?.[0]?.description || 'We are committed to the highest quality standards in all our training programs and research initiatives.',
    },
    {
      icon: Users,
      title: t.about?.values?.[4]?.title || 'Collaboration',
      desc: t.about?.values?.[4]?.description || 'We work together with industry partners, organizations, and communities to deliver relevant training.',
    },
    {
      icon: Lightbulb,
      title: t.about?.values?.[1]?.title || 'Innovation',
      desc: t.about?.values?.[1]?.description || 'We embrace new ideas, technologies, and methodologies to stay at the forefront of practical education.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white to-[#8B5CF6]/20 dark:from-gray-900 dark:to-[#3B0764]/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[#3B0764] dark:text-[#8B5CF6]"
            >
              {t.home.aboutTitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
            >
              {t.home.aboutDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/about">
                <Button className="bg-[#3B0764] hover:bg-[#3B0764] text-white group">
                  {t.home.seeMore}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Images and Features */}
          <div className="space-y-6">
            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="col-span-2 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src="/about-1.png"
                  alt="About us"
                  className="w-full h-48 object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src="/about-2.png"
                  alt="Our services"
                  className="w-full h-48 object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="col-span-3 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src="/about-3.png"
                  alt="Community support"
                  className="w-full h-64 object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Features */}
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-[#8B5CF6]/30 dark:border-[#3B0764]/30"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-xl">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
