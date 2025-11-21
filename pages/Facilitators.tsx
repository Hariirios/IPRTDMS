import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Mail, Phone, Building, Briefcase } from 'lucide-react';
import { teamStore } from '../lib/teamStore';

export default function Facilitators() {
  const [facilitators, setFacilitators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load facilitators from database
    const loadFacilitators = async () => {
      setLoading(true);
      try {
        const members = await teamStore.getByType('Facilitator');
        setFacilitators(members);
      } catch (error) {
        console.error('Error loading facilitators:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFacilitators();
  }, []);

  const getGradient = (index: number) => {
    const gradients = [
      "from-green-600 to-blue-600",
      "from-blue-600 to-indigo-600",
      "from-purple-600 to-pink-600",
      "from-orange-600 to-red-600",
      "from-teal-600 to-cyan-600",
      "from-pink-600 to-rose-600"
    ];
    return gradients[index % gradients.length];
  };

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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading facilitators...</p>
            </div>
          ) : facilitators.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No facilitators added yet. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {facilitators.map((facilitator, index) => (
                <motion.div
                  key={facilitator.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    {facilitator.image ? (
                      <img
                        src={facilitator.image}
                        alt={facilitator.name}
                        className="w-24 h-24 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className={`w-24 h-24 bg-gradient-to-br ${getGradient(index)} rounded-full flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-2xl font-bold">
                          {facilitator.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-2">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                      {facilitator.name}
                    </h3>
                    <p className="text-[#3B0764] dark:text-[#8B5CF6] font-medium">
                      {facilitator.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-1">
                      <Building className="h-4 w-4" />
                      {facilitator.department}
                    </p>
                    <div className="pt-2 space-y-1">
                      <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
                        <Mail className="h-3 w-3" />
                        {facilitator.email}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
                        <Phone className="h-3 w-3" />
                        {facilitator.phone}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
