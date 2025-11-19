import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Service } from '../lib/data';
import { getServices } from '../lib/storage';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowLeft, Users, BookOpen, Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      const services = await getServices();
      const foundService = services.find((s) => s.id === id);
      setService(foundService || null);
      setLoading(false);
    };
    loadService();
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

  if (!service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-gray-900 dark:text-white">
            {language === 'en' ? 'Service Not Found' : language === 'so' ? 'Adeega Lama Helin' : 'الخدمة غير موجودة'}
          </h2>
          <Button onClick={() => navigate('/services')}>
            {language === 'en' ? 'Back to Services' : language === 'so' ? 'Ku Noqo Adeegyada' : 'العودة إلى الخدمات'}
          </Button>
        </div>
      </div>
    );
  }

  const serviceTitle = language === 'en' ? service.title : language === 'so' ? service.titleSo : service.title;
  const serviceDescription = language === 'en' ? service.description : language === 'so' ? service.descriptionSo : service.description;
  const serviceFullDescription = language === 'en' ? service.fullDescription : language === 'so' ? service.fullDescriptionSo : service.fullDescription;

  // Icon mapping
  const iconMap: { [key: string]: any } = {
    'heart': Heart,
    'users': Users,
    'book-open': BookOpen,
    'sparkles': Sparkles,
  };

  const IconComponent = iconMap[service.icon] || Heart;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#8B5CF6] via-white to-[#3B0764]/10 dark:from-[#3B0764] dark:via-gray-900 dark:to-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#3B0764] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3B0764] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/services')}
              className="border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:bg-[#8B5CF6] dark:hover:text-[#3B0764]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Back to Services' : language === 'so' ? 'Ku Noqo Adeegyada' : 'العودة إلى الخدمات'}
            </Button>
          </motion.div>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl"
            >
              <IconComponent className="h-12 w-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-900 dark:text-white mb-6"
            >
              {serviceTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
            >
              {serviceDescription}
            </motion.p>
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
                    {language === 'en' ? 'About This Service' : language === 'so' ? 'Ku Saabsan Adeegan' : 'حول هذه الخدمة'}
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {serviceFullDescription}
                    </p>
                  </div>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="pt-8 border-t border-gray-200 dark:border-gray-800"
                >
                  <h3 className="text-gray-900 dark:text-white mb-6">
                    {language === 'en' ? 'What to Expect' : language === 'so' ? 'Waxa Laga Filayo' : 'ماذا تتوقع'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: Heart,
                        title: language === 'en' ? 'Personalized Care' : language === 'so' ? 'Daryeel Gaarka ah' : 'رعاية مخصصة',
                        description: language === 'en' ? 'Tailored approach to your unique needs' : language === 'so' ? 'Hab u gaar ah baahiyahaaga gaarka ah' : 'نهج مخصص لاحتياجاتك الفريدة'
                      },
                      {
                        icon: Users,
                        title: language === 'en' ? 'Expert Team' : language === 'so' ? 'Koox Xirfadayaal ah' : 'فريق خبراء',
                        description: language === 'en' ? 'Experienced professionals dedicated to your wellness' : language === 'so' ? 'Xirfadayaal khibrad leh oo u heellan caafimaadkaaga' : 'محترفون ذوو خبرة مكرسون لعافيتك'
                      },
                      {
                        icon: BookOpen,
                        title: language === 'en' ? 'Evidence-Based' : language === 'so' ? 'Caddayn ku salaysan' : 'قائم على الأدلة',
                        description: language === 'en' ? 'Proven methods and best practices' : language === 'so' ? 'Hababka la caddayn karo iyo camalka ugu wanaagsan' : 'أساليب مثبتة وأفضل الممارسات'
                      },
                      {
                        icon: Sparkles,
                        title: language === 'en' ? 'Safe Space' : language === 'so' ? 'Meel Badbaado leh' : 'مساحة آمنة',
                        description: language === 'en' ? 'Confidential and supportive environment' : language === 'so' ? 'Jawi sir ah oo taageero leh' : 'بيئة سرية وداعمة'
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-4"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#3B0764] to-[#3B0764] rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white mb-1">
                            {feature.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Mentors Section */}
                {service.mentors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="pt-8 border-t border-gray-200 dark:border-gray-800"
                  >
                    <h3 className="text-gray-900 dark:text-white mb-6">
                      {language === 'en' ? 'Our Mentors & Coaches' : language === 'so' ? 'Tababareyaasheenna iyo La-taliyeyaasheenna' : 'مدربونا ومستشارونا'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {service.mentors.map((mentor, index) => (
                        <motion.div
                          key={mentor.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-start space-x-4">
                            <ImageWithFallback
                              src={mentor.image}
                              alt={mentor.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-[#3B0764] dark:border-[#8B5CF6]"
                            />
                            <div className="flex-1">
                              <h4 className="text-gray-900 dark:text-white mb-1">
                                {mentor.name}
                              </h4>
                              <p className="text-sm text-[#3B0764] dark:text-[#8B5CF6] mb-3">
                                {language === 'en' ? mentor.role : language === 'so' ? mentor.roleSo : mentor.role}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {language === 'en' ? mentor.bio : language === 'so' ? mentor.bioSo : mentor.bio}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-gradient-to-br from-[#8B5CF6] to-white dark:from-[#3B0764] dark:to-gray-800 rounded-2xl p-8 shadow-xl sticky top-24"
                >
                  <h3 className="text-gray-900 dark:text-white mb-6">
                    {language === 'en' ? 'Get Started' : language === 'so' ? 'Bilow' : 'ابدأ'}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {language === 'en'
                      ? 'Ready to take the next step? Book a session with our experienced team today.'
                      : language === 'so'
                        ? 'Ma diyaar u tahay inaad qaaddo tallaabada xigta? Maanta buuqi kulan kooxdeenna khibradda leh.'
                        : 'هل أنت مستعد لاتخاذ الخطوة التالية؟ احجز جلسة مع فريقنا ذي الخبرة اليوم.'
                    }
                  </p>

                  <Link to={`/booking?service=${service.id}`} className="block mb-4">
                    <Button className="w-full bg-[#3B0764] hover:bg-[#3B0764] text-white h-12">
                      {t.home.bookNow}
                    </Button>
                  </Link>

                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full border-[#3B0764] text-[#3B0764] hover:bg-[#3B0764] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#3B0764]">
                      {language === 'en' ? 'Contact Us' : language === 'so' ? 'Nala Soo Xiriir' : 'تواصل معنا'}
                    </Button>
                  </Link>

                  <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'en'
                        ? 'Have questions? Our team is here to help you find the right support for your wellness journey.'
                        : language === 'so'
                          ? 'Su\'aalo ma qabtaa? Kooxdeennu waxay halkan ku jirtaa si ay kaaga caawiso inaad hesho taageerada ku haboon safarka caafimaadkaaga.'
                          : 'هل لديك أسئلة؟ فريقنا هنا لمساعدتك في العثور على الدعم المناسب لرحلة عافيتك.'
                      }
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Section */}
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
              {language === 'en' ? 'Explore More Services' : language === 'so' ? 'Baadh Adeegyo Kale' : 'استكشف المزيد من الخدمات'}
            </h2>
          </motion.div>

          <div className="flex justify-center">
            <Link to="/services">
              <Button className="bg-[#3B0764] hover:bg-[#3B0764]">
                {language === 'en' ? 'View All Services' : language === 'so' ? 'Arag Dhammaan Adeegyada' : 'عرض جميع الخدمات'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
