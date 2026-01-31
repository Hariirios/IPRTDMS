import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Handshake } from 'lucide-react';

export default function Sponsors() {
  const sponsors = [
    {
      name: "Hormuud Telecom",
      type: "Technology Partner",
      initials: "HT",
      gradient: "from-blue-600 to-cyan-600",
      website: "#"
    },
    {
      name: "Dahabshiil Group",
      type: "Financial Partner",
      initials: "DG",
      gradient: "from-green-600 to-teal-600",
      website: "#"
    },
    {
      name: "Somali Chamber of Commerce",
      type: "Business Partner",
      initials: "SCC",
      gradient: "from-purple-600 to-pink-600",
      website: "#"
    },
    {
      name: "Mogadishu University",
      type: "Education Partner",
      initials: "MU",
      gradient: "from-orange-600 to-red-600",
      website: "#"
    },
    {
      name: "Salaam Somali Bank",
      type: "Financial Partner",
      initials: "SSB",
      gradient: "from-indigo-600 to-purple-600",
      website: "#"
    },
    {
      name: "Somali Development Fund",
      type: "Development Partner",
      initials: "SDF",
      gradient: "from-pink-600 to-rose-600",
      website: "#"
    },
    {
      name: "Golis Telecom Somalia",
      type: "Technology Partner",
      initials: "GTS",
      gradient: "from-cyan-600 to-blue-600",
      website: "#"
    },
    {
      name: "Somali Business Council",
      type: "Industry Partner",
      initials: "SBC",
      gradient: "from-teal-600 to-green-600",
      website: "#"
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <Handshake className="h-12 w-12 text-white" />
            </motion.div>
            <h1 className="text-white mb-6">
              Our Sponsors & Partners
            </h1>
            <p className="text-white/90 text-xl leading-relaxed">
              We are grateful for the support of our valued Somali partners who share our vision for practical vocational education and community development
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                {/* Glowing Background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3B0764] to-[#8B5CF6] rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500" />
                
                {/* Card Content */}
                <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  {/* Logo/Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className={`w-24 h-24 bg-gradient-to-br ${sponsor.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-xl font-bold">
                        {sponsor.initials}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-2">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                      {sponsor.name}
                    </h3>
                    <p className="text-[#3B0764] dark:text-[#8B5CF6] font-medium text-sm">
                      {sponsor.type}
                    </p>
                  </div>

                  {/* External Link Icon */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#3B0764] dark:bg-[#8B5CF6] rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                    >
                      <ExternalLink className="h-4 w-4 text-white" />
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
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
              Partnership Benefits
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center text-lg">
                Our Somali partners receive:
              </p>
              <ul className="space-y-4">
                {[
                  "Brand visibility across our vocational training programs and community events",
                  "Collaboration opportunities on skills development projects",
                  "Access to our network of skilled graduates and professionals",
                  "Joint community outreach and development activities",
                  "Priority access to our training facilities and resources",
                  "Partnership in addressing Somalia's skills development needs"
                ].map((benefit, index) => (
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
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-6">
              Become a Partner
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Join us in our mission to provide practical vocational education and skills development for the Somali community. Together, we can build a skilled workforce.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#3B0764] to-[#8B5CF6] text-white rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Handshake className="h-6 w-6 mr-2" />
              Partner With Us
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
