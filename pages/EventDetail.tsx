import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Event } from '../lib/data';
import { getEvents } from '../lib/storage';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, MapPin, Users, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      const events = await getEvents();
      const foundEvent = events.find((e) => e.id === id);
      setEvent(foundEvent || null);
      setLoading(false);
    };
    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-gray-900 dark:text-white">
            {language === 'en' ? 'Event Not Found' : language === 'so' ? 'Dhacdo Lama Helin' : 'الفعالية غير موجودة'}
          </h2>
          <Button onClick={() => navigate('/events')}>
            {language === 'en' ? 'Back to Events' : language === 'so' ? 'Ku Noqo Dhacdooyinka' : 'العودة إلى الفعاليات'}
          </Button>
        </div>
      </div>
    );
  }

  const eventTitle = language === 'en' ? event.title : language === 'so' ? event.titleSo : event.titleAr || event.title;
  const eventDescription = language === 'en' ? event.description : language === 'so' ? event.descriptionSo : event.descriptionAr || event.description;
  const eventFullDescription = language === 'en' ? event.fullDescription : language === 'so' ? event.fullDescriptionSo : event.fullDescriptionAr || event.fullDescription;
  const eventLocation = language === 'en' ? event.location : language === 'so' ? event.locationSo : event.locationAr || event.location;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={event.image}
            alt={eventTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        {/* Back Button */}
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="outline"
              onClick={() => navigate('/events')}
              className="border-white/40 text-white hover:bg-white hover:text-[#3B0764] dark:border-white/40 dark:text-white dark:hover:bg-white dark:hover:text-[#3B0764] bg-white/10 backdrop-blur-md"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Back to Events' : language === 'so' ? 'Ku Noqo Dhacdooyinka' : 'العودة إلى الفعاليات'}
            </Button>
          </motion.div>
        </div>

        {/* Event Status Badge */}
        {event.isPast && (
          <div className="absolute top-8 right-4 md:right-8 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full"
            >
              <span className="text-white">{t.events.past}</span>
            </motion.div>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              <h1 className="text-white mb-4">
                {eventTitle}
              </h1>
              <p className="text-white/90 text-xl max-w-3xl">
                {eventDescription}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Info Cards */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t.events.date}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : (language === 'so' ? 'so-SO' : 'en-US'),
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t.events.location}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {eventLocation}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t.events.speakers}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {event.speakers.length} {language === 'en' ? 'Speakers' : language === 'so' ? 'Akhyaar' : 'متحدثين'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-6">
                    {language === 'en' ? 'About This Event' : language === 'so' ? 'Ku Saabsan Dhacadan' : 'حول هذه الفعالية'}
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {eventFullDescription}
                    </p>
                  </div>
                </motion.div>

                {/* Speakers Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="pt-8 border-t border-gray-200 dark:border-gray-800"
                >
                  <h3 className="text-gray-900 dark:text-white mb-6">
                    {t.events.speakers}
                  </h3>
                  <div className="space-y-4">
                    {event.speakers.map((speaker, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-4"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-lg">
                            {speaker.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white">
                            {speaker}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gradient-to-br from-[#8B5CF6] to-white dark:from-[#3B0764] dark:to-gray-800 rounded-2xl p-8 shadow-xl sticky top-24"
                >
                  <h3 className="text-gray-900 dark:text-white mb-6">
                    {language === 'en' ? 'Event Details' : language === 'so' ? 'Faahfaahinta Dhacada' : 'تفاصيل الفعالية'}
                  </h3>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-[#3B0764] dark:text-white mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {t.events.date}
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(event.date).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : (language === 'so' ? 'so-SO' : 'en-US'),
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-[#3B0764] dark:text-white mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {t.events.location}
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {eventLocation}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {language === 'en' ? 'Price' : language === 'so' ? 'Qiimaha' : 'السعر'}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {event.isFree ? (
                            <span className="text-green-600 dark:text-green-400">
                              {language === 'en' ? 'Free' : language === 'so' ? 'Bilaash' : 'مجاني'}
                            </span>
                          ) : (
                            <span className="text-[#3B0764] dark:text-[#8B5CF6]">
                              ${event.price?.toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!event.isPast && (
                    <Link to={`/booking?event=${event.id}`} className="block">
                      <Button className="w-full bg-[#3B0764] hover:bg-[#3B0764] text-white h-12">
                        {t.home.bookNow}
                      </Button>
                    </Link>
                  )}

                  {event.isPast && (
                    <div className="text-center py-4 px-6 bg-gray-100 dark:bg-gray-900 rounded-xl">
                      <p className="text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'This event has ended' : language === 'so' ? 'Dhacadani waa dhammaatay' : 'انتهت هذه الفعالية'}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events Section */}
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
              {language === 'en' ? 'More Events' : language === 'so' ? 'Dhacdooyin Kale' : 'المزيد من الفعاليات'}
            </h2>
          </motion.div>

          <div className="flex justify-center">
            <Link to="/events">
              <Button className="bg-[#3B0764] hover:bg-[#3B0764]">
                {language === 'en' ? 'View All Events' : language === 'so' ? 'Arag Dhammaan Dhacdooyinka' : 'عرض جميع الفعاليات'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
