import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const content = {
        en: {
            title: '404',
            subtitle: 'Page Not Found',
            message: "Sorry, we couldn't find the page you're looking for.",
            backButton: 'Go Back',
            homeButton: 'Go Home',
        },
        so: {
            title: '404',
            subtitle: 'Bogga Lama Helin',
            message: 'Waan ka xunnahay, ma heli karno bogga aad raadineyso.',
            backButton: 'Dib u Noqo',
            homeButton: 'Aad Guriga',
        },
        ar: {
            title: '404',
            subtitle: 'الصفحة غير موجودة',
            message: 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.',
            backButton: 'العودة',
            homeButton: 'الصفحة الرئيسية',
        },
    };

    const t = content[language as keyof typeof content] || content.en;

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-[#8B5CF6]/20 dark:from-gray-950 dark:to-[#3B0764]/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <h1 className="text-[150px] sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3B0764] to-[#3B0764] dark:from-[#8B5CF6] dark:to-[#3B0764] leading-none">
                            {t.title}
                        </h1>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        {t.subtitle}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                    >
                        {t.message}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t.backButton}
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-[#3B0764] to-[#3B0764] hover:from-[#3B0764] hover:to-[#3B0764] text-white"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            {t.homeButton}
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
