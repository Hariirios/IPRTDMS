import React from 'react';
import { motion } from 'motion/react';
import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Terms() {
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
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-white mb-6">
              Terms and Conditions
            </h1>
            <p className="text-white/90 text-xl">
              Please read these terms carefully before using our services
            </p>
            <p className="text-white/80 text-sm mt-4">
              Last Updated: January 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Agreement to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                Agreement to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing and using Sirta Maanka's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </motion.div>

            {/* Services Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-[#8B5CF6]/30 dark:border-[#3B0764]/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-[#3B0764] dark:text-[#8B5CF6]" />
                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">
                  Services Provided
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Sirta Maanka provides mental health and wellness services to the Somali community, including but not limited to:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Individual counseling and therapy sessions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Group therapy and support programs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Community wellness workshops and events
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Culturally sensitive mental health education
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Client Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-[#3B0764] dark:text-[#8B5CF6]" />
                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">
                  Client Responsibilities
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                As a client of Sirta Maanka, you agree to:
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Provide accurate and complete information about your health and medical history
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Attend scheduled appointments or provide advance notice of cancellations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Treat staff and other clients with respect and dignity
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Follow treatment plans and recommendations provided by your mental health professional
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    Make timely payments for services rendered according to agreed-upon terms
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Confidentiality */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#3B0764]/10 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/20 rounded-2xl p-6 border border-[#3B0764]/30 dark:border-[#8B5CF6]/30"
            >
              <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                Confidentiality and Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We are committed to maintaining the confidentiality of your personal and health information. All information shared during sessions is protected under applicable privacy laws and professional ethics guidelines. However, confidentiality may be limited in the following circumstances:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    When there is a risk of harm to yourself or others
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    When required by law or court order
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                  <span>
                    In cases of suspected child or elder abuse
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Cancellation Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                Cancellation and No-Show Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We understand that circumstances may require you to cancel or reschedule appointments. We request at least 24 hours notice for cancellations. Late cancellations or no-shows may result in a fee. Repeated missed appointments without notice may result in termination of services.
              </p>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-[#8B5CF6]/30 dark:border-[#3B0764]/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="h-6 w-6 text-[#3B0764] dark:text-[#8B5CF6]" />
                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">
                  Limitation of Liability
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                While we strive to provide the highest quality mental health services, Sirta Maanka and its staff cannot guarantee specific outcomes. Mental health treatment is a collaborative process, and results may vary. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services.
              </p>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Sirta Maanka reserves the right to modify these Terms and Conditions at any time. We will notify clients of any significant changes. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-3xl p-8 text-white text-center"
            >
              <h2 className="text-2xl font-bold mb-4">
                Questions About These Terms?
              </h2>
              <p className="mb-6">
                If you have any questions or concerns about these Terms and Conditions, please contact us.
              </p>
              <a
                href="/contact"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block bg-white text-[#3B0764] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
