import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
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
                                <Shield className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-white mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-white/90 text-xl">
                            Your privacy and confidentiality are our top priorities
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
                        {/* Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                                Introduction
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                At Sirta Maanka, we are committed to protecting your privacy and maintaining the confidentiality of your personal and health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mental health services.
                            </p>
                        </motion.div>

                        {/* Information We Collect */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-[#8B5CF6]/30 dark:border-[#3B0764]/30"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="h-6 w-6 text-[#3B0764] dark:text-[#8B5CF6]" />
                                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">
                                    Information We Collect
                                </h2>
                            </div>
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Personal Information:
                                    </h3>
                                    <p className="leading-relaxed">
                                        Name, contact information (email, phone number, address), date of birth, emergency contact information, and insurance details.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Health Information:
                                    </h3>
                                    <p className="leading-relaxed">
                                        Mental health history, treatment records, session notes, diagnoses, medications, and any other health-related information necessary for providing quality care.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Usage Information:
                                    </h3>
                                    <p className="leading-relaxed">
                                        Information about how you interact with our website and services, including appointment scheduling and communication preferences.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* How We Use Your Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="h-6 w-6 text-[#3B0764] dark:text-[#8B5CF6]" />
                                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">
                                    How We Use Your Information
                                </h2>
                            </div>
                            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        To provide mental health services and treatment
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        To communicate with you about appointments, services, and treatment plans
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        To process payments and insurance claims
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        To improve our services and develop new programs
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        To comply with legal and regulatory requirements
                                    </span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Information Security */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gradient-to-br from-[#3B0764]/10 to-[#3B0764]/10 dark:from-[#3B0764]/20 dark:to-[#3B0764]/20 rounded-2xl p-6 border border-[#3B0764]/30 dark:border-[#8B5CF6]/30"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="h-6 w-6 text-[#3B0764] dark:text-[#8B5CF6]" />
                                <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">
                                    Information Security
                                </h2>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                We implement appropriate technical and organizational measures to protect your personal and health information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                            </p>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        Encrypted data storage and transmission
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        Secure access controls and authentication
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        Regular security audits and updates
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        Staff training on confidentiality and data protection
                                    </span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Your Rights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                                Your Rights
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        Access and review your personal and health information
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        Request corrections to inaccurate information
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        Request restrictions on how we use or disclose your information
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        Receive a copy of your health records
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#3B0764] dark:text-[#8B5CF6] mt-1">•</span>
                                    <span>
                                        File a complaint if you believe your privacy rights have been violated
                                    </span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-[#8B5CF6]/30 dark:border-[#3B0764]/30"
                        >
                            <h2 className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                                Contact Us
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us through our Contact page or reach out to our Privacy Officer.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
