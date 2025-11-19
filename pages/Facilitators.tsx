import React from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

export default function Facilitators() {
  const facilitators = [
    {
      name: "Ms. Aisha Mohammed",
      specialization: "Workshop Facilitation",
      experience: "8+ years",
      initials: "AM",
      gradient: "from-green-600 to-blue-600"
    },
    {
      name: "Mr. James Wilson",
      specialization: "Technical Training",
      experience: "10+ years",
      initials: "JW",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      name: "Dr. Lisa Wang",
      specialization: "Research Methodology",
      experience: "12+ years",
      initials: "LW",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      name: "Mr. Carlos Martinez",
      specialization: "Practical Skills",
      experience: "7+ years",
      initials: "CM",
      gradient: "from-orange-600 to-red-600"
    },
    {
      name: "Ms. Fatima Ali",
      specialization: "Data Analysis",
      experience: "9+ years",
      initials: "FA",
      gradient: "from-teal-600 to-cyan-600"
    },
    {
      name: "Dr. John Smith",
      specialization: "Project Management",
      experience: "15+ years",
      initials: "JS",
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      name: "Ms. Sarah Lee",
      specialization: "Communication Skills",
      experience: "6+ years",
      initials: "SL",
      gradient: "from-pink-600 to-rose-600"
    },
    {
      name: "Mr. Ahmed Ibrahim",
      specialization: "IT Training",
      experience: "11+ years",
      initials: "AI",
      gradient: "from-cyan-600 to-blue-600"
    }
  ];

  const qualifications = [
    "Industry-recognized certifications",
    "Minimum 5 years practical experience",
    "Proven track record in training delivery",
    "Continuous professional development",
    "Strong communication and mentoring skills"
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
            <h1 className="text-white mb-6">
              Our Facilitators
            </h1>
            <p className="text-white/90 text-xl leading-relaxed">
              Our experienced facilitators bring real-world expertise and practical knowledge to every training session
            </p>
          </motion.div>
        </div>
      </section>

      {/* Facilitators Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {facilitators.map((facilitator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className={`w-24 h-24 bg-gradient-to-br ${facilitator.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-2xl font-bold">
                      {facilitator.initials}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                    {facilitator.name}
                  </h3>
                  <p className="text-[#3B0764] dark:text-[#8B5CF6] font-medium">
                    {facilitator.specialization}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Award className="h-4 w-4" />
                    <span>{facilitator.experience}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-8 text-center">
              Facilitator Qualifications
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                All our facilitators meet rigorous standards to ensure quality training delivery:
              </p>
              <ul className="space-y-4">
                {qualifications.map((qual, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#3B0764] to-[#8B5CF6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg">
                      {qual}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
