import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Briefcase, Building } from 'lucide-react';
import { teamStore } from '../lib/teamStore';

export default function Staff() {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);

  useEffect(() => {
    // Load staff members from store
    const members = teamStore.getByType('Staff');
    setStaffMembers(members);
  }, []);

  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-600 to-purple-600",
      "from-purple-600 to-pink-600",
      "from-green-600 to-blue-600",
      "from-orange-600 to-red-600",
      "from-teal-600 to-green-600",
      "from-indigo-600 to-purple-600"
    ];
    return gradients[index % gradients.length];
  };

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
              Our Staff
            </h1>
            <p className="text-white/90 text-xl leading-relaxed">
              Meet our dedicated administrative and management team who ensure the smooth operation of our institute
            </p>
          </motion.div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {staffMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No staff members added yet. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {staffMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className={`w-24 h-24 bg-gradient-to-br ${getGradient(index)} rounded-full flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-2xl font-bold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-2">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                      {member.name}
                    </h3>
                    <p className="text-[#3B0764] dark:text-[#8B5CF6] font-medium">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-1">
                      <Building className="h-4 w-4" />
                      {member.department}
                    </p>
                    <div className="pt-2 space-y-1">
                      <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-6">
              Get in Touch with Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Have questions or need assistance? Our staff is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@iprt.edu"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#3B0764] text-white rounded-lg hover:bg-[#2d0550] transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Us
              </a>
              <a
                href="tel:+252-XXX-XXXXXX"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#3B0764] text-[#3B0764] dark:border-[#8B5CF6] dark:text-[#8B5CF6] rounded-lg hover:bg-[#3B0764] hover:text-white dark:hover:bg-[#8B5CF6] dark:hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
