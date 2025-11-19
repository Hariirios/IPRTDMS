import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Testimonial } from '../lib/data';
import { getTestimonials } from '../lib/storage';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Testimonials() {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B0764] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading testimonials...</p>
        </div>
      </div>
    );
  }

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
              {t.testimonials.title}
            </h1>
            <p className="text-white/90 text-xl">
              {t.testimonials.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonial Carousel */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
                {/* Quote Icon */}
                <div className="absolute top-8 left-8 opacity-10">
                  <Quote className="h-24 w-24 text-[#3B0764]" />
                </div>

                {/* Content */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  {/* Stars */}
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-[#3B0764] text-[#3B0764]" />
                    ))}
                  </div>

                  {/* Feedback */}
                  <p className="text-gray-700 dark:text-gray-300 text-xl md:text-2xl text-center mb-8 leading-relaxed italic">
                    "{language === 'en' ? testimonials[currentIndex].feedback : testimonials[currentIndex].feedbackSo}"
                  </p>

                  {/* Author */}
                  <div className="text-center">
                    <p className="text-gray-900 dark:text-white mb-1">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-[#3B0764] dark:text-[#8B5CF6] mb-2">
                      {language === 'en' ? testimonials[currentIndex].role : testimonials[currentIndex].roleSo}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {testimonials[currentIndex].serviceType}
                    </p>
                  </div>
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                          ? 'bg-[#3B0764] w-8'
                          : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Testimonials Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-[#3B0764] dark:text-[#8B5CF6]">
              {language === 'en' ? 'All Reviews' : 'Dhamaan Marag-furyada'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#3B0764] text-[#3B0764]" />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed italic">
                  "{language === 'en' ? testimonial.feedback : testimonial.feedbackSo}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[#3B0764] dark:text-[#8B5CF6]">
                    {language === 'en' ? testimonial.role : testimonial.roleSo}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
