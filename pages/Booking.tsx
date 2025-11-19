import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { Event, Service } from '../lib/data';
import { getEvents, getServices } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { CheckCircle, Calendar, Users, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function Booking() {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const [eventsData, servicesData] = await Promise.all([
        getEvents(),
        getServices()
      ]);
      setEvents(eventsData);
      setServices(servicesData);
    };
    loadData();
  }, []);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const upcomingEvents = events.filter((event) => !event.isPast);

  // Pre-select service or event from URL parameters
  useEffect(() => {
    const serviceId = searchParams.get('service');
    const eventId = searchParams.get('event');

    if (serviceId) {
      setFormData(prev => ({ ...prev, service: `service-${serviceId}` }));
    } else if (eventId) {
      setFormData(prev => ({ ...prev, service: `event-${eventId}` }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse service selection
      const [serviceType, serviceId] = formData.service.split('-');
      let serviceName = '';

      if (serviceType === 'service') {
        const service = services.find(s => s.id === serviceId);
        serviceName = service?.title || 'Unknown Service';
      } else if (serviceType === 'event') {
        const event = events.find(e => e.id === serviceId);
        serviceName = event?.title || 'Unknown Event';
      }

      // Save to Supabase
      const { error } = await supabase.from('bookings').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_type: serviceType,
        service_id: serviceId,
        service_name: serviceName,
        booking_date: formData.date,
        booking_time: formData.time,
        message: formData.message || null,
        status: 'pending'
      });

      if (error) throw error;

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          date: '',
          time: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6"
            >
              <Calendar className="h-12 w-12 text-white" />
            </motion.div>
            <h1 className="text-white mb-6">
              {t.booking.title}
            </h1>
            <p className="text-white/90 text-xl">
              {t.booking.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl text-center shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-gray-900 dark:text-white mb-2">
                {language === 'en' ? 'Professional Care' : language === 'so' ? 'Daryeel Xirfad leh' : 'رعاية احترافية'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'en'
                  ? 'Expert mental health professionals ready to support you'
                  : language === 'so'
                    ? 'Xirfadayaal caafimaad maskaxeed oo diyaar ah inay ku taageeraan'
                    : 'متخصصون في الصحة النفسية جاهزون لدعمك'
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl text-center shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-gray-900 dark:text-white mb-2">
                {language === 'en' ? 'Flexible Sessions' : language === 'so' ? 'Kulan Dabacsan' : 'جلسات مرنة'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'en'
                  ? 'Individual, group, or family sessions available'
                  : language === 'so'
                    ? 'Kulan shakhsi ah, koox, ama qoys ayaa la heli karaa'
                    : 'جلسات فردية أو جماعية أو عائلية متاحة'
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl text-center shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-gray-900 dark:text-white mb-2">
                {language === 'en' ? 'Easy Booking' : language === 'so' ? 'Buukin Fudud' : 'حجز سهل'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'en'
                  ? 'Quick and simple appointment scheduling'
                  : language === 'so'
                    ? 'Jadwal ballanti oo degdeg ah oo fudud'
                    : 'جدولة مواعيد سريعة وبسيطة'
                }
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-3">
                  {t.booking.formTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'en'
                    ? 'Fill out the form below to book a session or register for an event'
                    : language === 'so'
                      ? 'Buuxi foomka hoose si aad u buuqdo kulan ama aad ugu diiwaangeliso dhacdada'
                      : 'املأ النموذج أدناه لحجز جلسة أو التسجيل في فعالية'
                  }
                </p>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white">
                    {language === 'en' ? 'Success!' : 'Guul!'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t.booking.success}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.booking.name}</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder={language === 'en' ? 'John Doe' : language === 'so' ? 'Magacaaga' : 'اسمك الكامل'}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.booking.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.booking.phone}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+252 63 8449327"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">{t.booking.service}</Label>
                    <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={language === 'en' ? 'Select a service or event' : language === 'so' ? 'Dooro adeeg ama dhacdada' : 'اختر خدمة أو فعالية'} />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                          {language === 'en' ? 'Services' : language === 'so' ? 'Adeegyada' : 'الخدمات'}
                        </div>
                        {services.map((service) => (
                          <SelectItem key={`service-${service.id}`} value={`service-${service.id}`}>
                            {language === 'en' ? service.title : language === 'so' ? service.titleSo : service.title}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400 border-t mt-2">
                          {language === 'en' ? 'Upcoming Events' : language === 'so' ? 'Dhacdooyinka Soo Socda' : 'الفعاليات القادمة'}
                        </div>
                        {upcomingEvents.map((event) => (
                          <SelectItem key={`event-${event.id}`} value={`event-${event.id}`}>
                            {language === 'en' ? event.title : language === 'so' ? event.titleSo : event.titleAr || event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">{t.booking.date}</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">{t.booking.time}</Label>
                      <Input
                        id="time"
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t.booking.message}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder={language === 'en' ? 'Tell us more about your needs...' : language === 'so' ? 'Noo sheeg baahiyahaaga...' : 'أخبرنا المزيد عن احتياجاتك...'}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#3B0764] hover:bg-[#3B0764] h-12"
                    size="lg"
                  >
                    {t.booking.submit}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
