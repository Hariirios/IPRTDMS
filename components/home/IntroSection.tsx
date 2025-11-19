import { motion } from 'motion/react';
import { Heart, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function IntroSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Heart,
      title: t.home.supportIcon,
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Users,
      title: t.home.coachingIcon,
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: TrendingUp,
      title: t.home.empowermentIcon,
      gradient: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-4">
              {t.home.introTitle}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
              {t.home.introText}
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <div className="relative inline-block mb-4">
                  {/* Animated background */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-20 blur-xl`}
                  />
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
