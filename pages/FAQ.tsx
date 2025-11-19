import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: 'What services does Sirta Maanka provide?',
            answer: 'Sirta Maanka provides comprehensive mental health services including individual counseling, group therapy, wellness programs, and community support. We offer culturally sensitive care tailored to the Somali community.',
        },
        {
            question: 'How can I book an appointment?',
            answer: 'You can book an appointment by contacting us through WhatsApp, phone, or email. Our team will help you schedule a convenient time and match you with the right mental health professional.',
        },
        {
            question: 'Are your services confidential?',
            answer: 'Yes, absolutely. All our services are completely confidential. We follow strict privacy protocols to protect your personal information and ensure a safe, judgment-free environment.',
        },
        {
            question: 'Do you offer services in Somali language?',
            answer: 'Yes! We provide services in both English and Somali. Our team includes bilingual professionals who understand the cultural context and can communicate effectively in your preferred language.',
        },
        {
            question: 'What is the cost of your services?',
            answer: 'Our pricing varies depending on the type of service. We offer affordable rates and work with various insurance providers. Please contact us for specific pricing information and to discuss payment options.',
        },
        {
            question: 'How long does a typical session last?',
            answer: 'A typical counseling session lasts 45-60 minutes. However, the duration may vary depending on the type of service and your specific needs. We can discuss the best schedule for you during your initial consultation.',
        },
        {
            question: 'Do you provide emergency mental health services?',
            answer: 'For mental health emergencies, please call emergency services (911) or go to your nearest emergency room. We provide ongoing support and crisis intervention during regular business hours. Contact us to learn more about our crisis support services.',
        },
        {
            question: 'Can family members attend sessions?',
            answer: 'Yes, we offer family therapy and can include family members in sessions when appropriate and beneficial. We believe in a holistic approach that considers the family and community context.',
        },
        {
            question: 'What should I expect in my first session?',
            answer: 'Your first session is an opportunity to get to know your counselor and discuss your concerns in a safe, supportive environment. We\'ll review your background, discuss your goals, and create a personalized treatment plan together.',
        },
        {
            question: 'How do I know if I need mental health support?',
            answer: 'If you\'re experiencing persistent sadness, anxiety, stress, relationship difficulties, or changes in sleep or appetite, it may be helpful to seek support. Remember, seeking help is a sign of strength, not weakness.',
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
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
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <HelpCircle className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-white mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-white/90 text-xl">
                            Find answers to common questions about our mental health services
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-[#8B5CF6]/30 dark:border-[#3B0764]/30 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="h-6 w-6 text-[#3B0764] dark:text-[#8B5CF6] flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-6 w-6 text-[#3B0764] dark:text-[#8B5CF6] flex-shrink-0" />
                                    )}
                                </button>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-5"
                                    >
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-16 text-center max-w-2xl mx-auto"
                    >
                        <div className="bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-3xl p-8 text-white">
                            <h2 className="text-2xl font-bold mb-4">
                                Still Have Questions?
                            </h2>
                            <p className="mb-6">
                                Our team is here to help. Contact us for more information about our services.
                            </p>
                            <a
                                href="/contact"
                                onClick={() => window.scrollTo(0, 0)}
                                className="inline-block bg-white text-[#3B0764] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Contact Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
