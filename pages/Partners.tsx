import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface Partner {
    id: string;
    name: string;
    logo: string;
    website_url: string | null;
    display_order: number;
}

export default function Partners() {
    const { t } = useLanguage();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const { data, error } = await supabase
                .from('partners')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;
            setPartners(data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };

    // Duplicate partners for infinite scroll effect
    const duplicatedPartners = partners.length > 0 ? [...partners, ...partners, ...partners] : [];

    return (
        <div className="min-h-screen pt-20 pb-16 overflow-hidden">
            {/* Hero Section with Animated Background */}
            <section className="relative bg-gradient-to-br from-[#8B5CF6] via-[#3B0764] to-[#1E0A3C] dark:from-[#1E0A3C] dark:via-[#3B0764] dark:to-[#8B5CF6] py-20 overflow-hidden">
                {/* Animated Background Shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [90, 0, 90],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full blur-3xl"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center justify-center mb-6"
                        >
                            <Sparkles className="h-12 w-12 text-white animate-pulse" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Meet Our Partners
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-white/90 max-w-3xl mx-auto"
                        >
                            We collaborate with amazing organizations to promote mental wellness and growth for everyone.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Infinite Scrolling Partners Section */}
            {loading ? (
                <div className="text-center py-20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                    >
                        <div className="w-16 h-16 border-4 border-[#3B0764] border-t-transparent rounded-full"></div>
                    </motion.div>
                </div>
            ) : partners.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No partners to display at the moment.
                    </p>
                </div>
            ) : (
                <>
                    {/* Infinite Scroll Row 1 - Left to Right */}
                    <section className="py-12 bg-white dark:bg-gray-950">
                        <div className="relative">
                            <div className="overflow-hidden">
                                <motion.div
                                    animate={{
                                        x: [0, -1920],
                                    }}
                                    transition={{
                                        x: {
                                            duration: 30,
                                            repeat: Infinity,
                                            ease: "linear",
                                        },
                                    }}
                                    className="flex gap-8"
                                >
                                    {duplicatedPartners.map((partner, index) => (
                                        <PartnerCard
                                            key={`row1-${partner.id}-${index}`}
                                            partner={partner}
                                            index={index}
                                        />
                                    ))}
                                </motion.div>
                            </div>
                            {/* Gradient Overlays */}
                            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent pointer-events-none z-10" />
                            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none z-10" />
                        </div>
                    </section>

                    {/* Static Grid Section with Staggered Animation */}
                    <section className="py-16 bg-gray-50 dark:bg-gray-900">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-[#3B0764] dark:text-[#8B5CF6] mb-4">
                                    Meet Our Partners
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    Click on any partner to learn more about their amazing work
                                </p>
                            </motion.div>

                            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                                {partners.map((partner, index) => (
                                    <motion.div
                                        key={partner.id}
                                        initial={{ opacity: 0, x: -50, rotateY: -15 }}
                                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.8,
                                            delay: index * 0.1,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }}
                                        className="group perspective-1000 w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.5rem)] xl:w-[calc(20%-1.6rem)] max-w-[200px]"
                                    >
                                        {partner.website_url ? (
                                            <a
                                                href={partner.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <EnhancedPartnerCard partner={partner} />
                                            </a>
                                        ) : (
                                            <EnhancedPartnerCard partner={partner} />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Infinite Scroll Row 2 - Right to Left (Reverse) */}
                    <section className="py-12 bg-white dark:bg-gray-950">
                        <div className="relative">
                            <div className="overflow-hidden">
                                <motion.div
                                    animate={{
                                        x: [-1920, 0],
                                    }}
                                    transition={{
                                        x: {
                                            duration: 30,
                                            repeat: Infinity,
                                            ease: "linear",
                                        },
                                    }}
                                    className="flex gap-8"
                                >
                                    {duplicatedPartners.map((partner, index) => (
                                        <PartnerCard
                                            key={`row2-${partner.id}-${index}`}
                                            partner={partner}
                                            index={index}
                                        />
                                    ))}
                                </motion.div>
                            </div>
                            {/* Gradient Overlays */}
                            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent pointer-events-none z-10" />
                            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none z-10" />
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

// Infinite Scroll Card Component
function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 w-48 h-48 relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B0764]/20 via-[#3B0764]/20 to-[#8B5CF6]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex items-center justify-center border-2 border-transparent group-hover:border-[#3B0764]/30">
                <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
            </div>
        </motion.div>
    );
}

// Enhanced Static Card Component
function EnhancedPartnerCard({ partner }: { partner: Partner }) {
    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                z: 50,
            }}
            transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="relative h-full"
        >
            {/* Glowing Background */}
            <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-[#3B0764] via-[#3B0764] to-[#8B5CF6] rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500"
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Card Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 group-hover:border-[#3B0764]/50 overflow-hidden">
                {/* Animated Corner Accent */}
                <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#3B0764]/20 to-transparent rounded-bl-full"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Logo Container */}
                <div className="relative aspect-square w-full flex items-center justify-center mb-4">
                    <motion.img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Partner Name */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#3B0764] dark:group-hover:text-[#8B5CF6] transition-colors duration-300 text-sm md:text-base">
                        {partner.name}
                    </h3>
                </motion.div>

                {/* External Link Icon */}
                {partner.website_url && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4"
                    >
                        <div className="bg-[#3B0764] rounded-full p-2 shadow-lg">
                            <ExternalLink className="h-4 w-4 text-white" />
                        </div>
                    </motion.div>
                )}

                {/* Hover Shine Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{
                        x: [-200, 200],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                    }}
                />
            </div>
        </motion.div>
    );
}
