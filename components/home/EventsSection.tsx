import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Event } from '../../lib/data';
import { getEvents } from '../../lib/storage';

export function EventsSection() {
  const { t, language } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await getEvents();
        // Get only upcoming events, limited to 3
        const upcoming = allEvents.filter(event => !event.isPast).slice(0, 3);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-4">
            {t.home.upcomingEvents}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3B0764] to-[#3B0764] mx-auto rounded-full" />
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B0764] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading events...</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white to-[#8B5CF6]/10 dark:from-gray-800 dark:to-[#3B0764]/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#8B5CF6]/30 dark:border-[#3B0764]/30">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      src={event.image}
                      alt={language === 'en' ? event.title : language === 'so' ? event.titleSo : event.titleAr || event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white line-clamp-2">
                        {language === 'en' ? event.title : language === 'so' ? event.titleSo : event.titleAr || event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6 space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {language === 'en' ? event.description : language === 'so' ? event.descriptionSo : event.descriptionAr || event.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-[#3B0764] dark:text-[#8B5CF6]" />
                        <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-[#3B0764] dark:text-[#8B5CF6]" />
                        <span className="text-sm">{language === 'en' ? event.location : language === 'so' ? event.locationSo : event.locationAr || event.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/events/${event.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]">
                          {t.events.viewDetails}
                        </Button>
                      </Link>
                      <Link to={`/booking?event=${event.id}`} className="flex-1">
                        <Button className="w-full bg-[#3B0764] hover:bg-[#3B0764] text-white">
                          {t.home.bookNow}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View More Button */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link to="/events">
              <Button className="bg-[#3B0764] hover:bg-[#3B0764] text-white group">
                {t.home.viewMoreEvents}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
