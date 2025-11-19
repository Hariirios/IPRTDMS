import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Event } from '../lib/data';
import { getEvents } from '../lib/storage';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Events() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return !event.isPast;
    if (filter === 'past') return event.isPast;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B0764] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading events...</p>
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
              {t.events.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              className={filter === 'all' ? 'bg-[#3B0764] hover:bg-[#3B0764]' : ''}
            >
              All Events
            </Button>
            <Button
              onClick={() => setFilter('upcoming')}
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              className={filter === 'upcoming' ? 'bg-[#3B0764] hover:bg-[#3B0764]' : ''}
            >
              {t.events.upcoming}
            </Button>
            <Button
              onClick={() => setFilter('past')}
              variant={filter === 'past' ? 'default' : 'outline'}
              className={filter === 'past' ? 'bg-[#3B0764] hover:bg-[#3B0764]' : ''}
            >
              {t.events.past}
            </Button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t.events.noEvents}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={event.image}
                        alt={language === 'en' ? event.title : language === 'so' ? event.titleSo : event.titleAr || event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      {event.isPast && (
                        <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-white text-sm">{t.events.past}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="text-gray-900 dark:text-white line-clamp-2">
                        {language === 'en' ? event.title : language === 'so' ? event.titleSo : event.titleAr || event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {language === 'en' ? event.description : language === 'so' ? event.descriptionSo : event.descriptionAr || event.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {language === 'en' ? event.location : language === 'so' ? event.locationSo : event.locationAr || event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {event.isFree ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold">Free Event</span>
                          ) : (
                            <span className="text-[#3B0764] dark:text-[#8B5CF6] font-semibold">
                              ${event.price?.toFixed(2)}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1 border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/${event.id}`);
                          }}
                        >
                          {t.events.viewDetails}
                        </Button>
                        {!event.isPast && (
                          <Button
                            className="flex-1 bg-[#3B0764] hover:bg-[#3B0764] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/booking?event=${event.id}`);
                            }}
                          >
                            {t.home.bookNow}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
