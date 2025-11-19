import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';

export default function Staff() {
  const staffMembers = [
    {
      name: "Dr. Sarah Johnson",
      title: "Director",
      expertise: "Research Management",
      initials: "SJ",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Prof. Michael Chen",
      title: "Head of Research",
      expertise: "Data Science",
      initials: "MC",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      name: "Dr. Emily Rodriguez",
      title: "Training Coordinator",
      expertise: "Curriculum Development",
      initials: "ER",
      gradient: "from-green-600 to-blue-600"
    },
    {
      name: "Mr. David Kim",
      title: "Operations Manager",
      expertise: "Project Management",
      initials: "DK",
      gradient: "from-orange-600 to-red-600"
    },
    {
      name: "Ms. Rachel Adams",
      title: "Finance Manager",
      expertise: "Budget Planning",
      initials: "RA",
      gradient: "from-teal-600 to-green-600"
    },
    {
      name: "Mr. Thomas Brown",
      title: "HR Manager",
      expertise: "Staff Development",
      initials: "TB",
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      name: "Dr. Linda Martinez",
      title: "Quality Assurance",
      expertise: "Standards Compliance",
      initials: "LM",
      gradient: "from-pink-600 to-rose-600"
    },
    {
      name: "Mr. Kevin White",
      title: "IT Manager",
      expertise: "Systems Administration",
      initials: "KW",
      gradient: "from-cyan-600 to-blue-600"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {staffMembers.map((member, index) => (
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
                  <div className={`w-24 h-24 bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-2xl font-bold">
                      {member.initials}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                    {member.name}
                  </h3>
                  <p className="text-[#3B0764] dark:text-[#8B5CF6] font-medium">
                    {member.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.expertise}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
