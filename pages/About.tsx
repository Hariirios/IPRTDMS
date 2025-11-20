import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Target, Eye, Award } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

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
            <h1 className="text-white mb-6">
              {t.about.title}
            </h1>
            <p className="text-white/90 text-xl leading-relaxed">
              {t.about.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About IPRT Story */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <h2 className="text-[#3B0764] dark:text-[#8B5CF6]">
                  Who We Are
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  The Institute for Practical Research & Training (IPRT) is a leading educational institution dedicated to bridging the gap between theoretical knowledge and practical application. Founded with the vision of empowering individuals through hands-on learning experiences, we have become a trusted partner for students, professionals, and organizations seeking excellence in education and research.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  Our institute specializes in providing comprehensive training programs, conducting cutting-edge research, and fostering innovation across various disciplines. We believe in learning by doing, and our curriculum is designed to equip participants with real-world skills that make an immediate impact in their careers.
                </p>
              </div>
              <div>
                <ImageWithFallback
                  src="/about-1.png"
                  alt="IPRT Campus"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                What We Do
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Comprehensive programs designed to transform learning into practical expertise
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-4 text-xl font-semibold">
                  Professional Training
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Industry-aligned training programs that develop practical skills and professional competencies across diverse fields including technology, business, and research methodologies.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-4 text-xl font-semibold">
                  Applied Research
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Conducting practical research projects that address real-world challenges, collaborating with industry partners, and contributing to knowledge advancement in various domains.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-4 text-xl font-semibold">
                  Consultancy Services
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Providing expert consultancy and advisory services to organizations, helping them implement best practices, optimize processes, and achieve their strategic objectives.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <ImageWithFallback
                  src="/about-2.png"
                  alt="Our Impact"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-[#3B0764] dark:text-[#8B5CF6]">
                  Our Impact
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  Since our establishment, IPRT has trained thousands of professionals, conducted numerous impactful research projects, and partnered with leading organizations across various sectors. Our graduates have gone on to make significant contributions in their respective fields, applying the practical skills and knowledge gained at our institute.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  We take pride in our commitment to quality education, innovative research, and community development. Through our programs, we continue to shape the future of practical education and contribute to the advancement of knowledge and skills in our society.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Image */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-8">
              Our Team
            </h2>
            <ImageWithFallback
              src="/about-3.png"
              alt="Our Team"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-8">
              A dedicated team of professionals committed to excellence in education and research
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
