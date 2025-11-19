import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../../lib/data';
import { getTestimonials } from '../../lib/storage';

export function TestimonialsSection() {
  const { t, language } = useLanguage();
  const [displayTestimonials, setDisplayTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getTestimonials();
        // Duplicate testimonials many times for seamless infinite scroll
        const duplicated = [...data, ...data, ...data, ...data, ...data, ...data];
        setDisplayTestimonials(duplicated);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-4">
            {t.home.whatClientsSay}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3B0764] to-[#3B0764] mx-auto rounded-full" />
        </motion.div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B0764] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading testimonials...</p>
        </div>
      )}

      {/* Testimonials Carousel - Auto-scrolling - Full Width */}
      {!loading && displayTestimonials.length > 0 && (
        <div className="relative overflow-hidden w-full">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -(286 * displayTestimonials.length / 6)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: (displayTestimonials.length / 6) * 2.5, // 2.5 seconds per original card
                ease: "linear",
              },
            }}
          >
            {displayTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-[280px]"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gradient-to-br from-white to-[#8B5CF6]/10 dark:from-gray-800 dark:to-[#3B0764]/10 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#8B5CF6]/30 dark:border-[#3B0764]/30 h-full">
                  {/* Quote Icon */}
                  <div className="absolute -top-3 left-5 bg-gradient-to-br from-[#3B0764] to-[#3B0764] p-2 rounded-full">
                    <Quote className="h-4 w-4 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3 mt-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#3B0764] text-[#3B0764] dark:fill-[#8B5CF6] dark:text-[#8B5CF6]"
                      />
                    ))}
                  </div>

                  {/* Feedback */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic line-clamp-3 text-sm">
                    "{language === 'en' ? testimonial.feedback : testimonial.feedbackSo}"
                  </p>

                  {/* Client Info */}
                  <div className="border-t border-[#8B5CF6]/30 dark:border-[#3B0764]/30 pt-3">
                    <h4 className="text-gray-900 dark:text-white font-semibold text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {language === 'en' ? testimonial.role : testimonial.roleSo}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}
