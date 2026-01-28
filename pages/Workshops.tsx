import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Users, ArrowRight, Code, Database, Palette } from 'lucide-react';
import { Button } from '../components/ui/button';
import { WorkshopRegistrationForm } from '../components/forms/WorkshopRegistrationForm';

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  instructor?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Programming' | 'Design' | 'Data' | 'Business';
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  price?: string;
}

const workshopsData: Workshop[] = [
  {
    id: '1',
    title: 'Advanced Web Development Bootcamp',
    description: 'Intensive 3-day workshop covering modern web technologies including React, Node.js, and cloud deployment strategies. Perfect for developers looking to advance their skills.',
    date: '2024-02-25',
    time: '9:00 AM - 5:00 PM',
    location: 'Computer Lab 1',
    instructor: 'Eng. Hassan Mohamed - Senior Full Stack Developer',
    duration: '3 Days',
    level: 'Advanced',
    category: 'Programming',
    image: '/BG-2.png',
    status: 'upcoming',
    price: '$150'
  },
  {
    id: '2',
    title: 'Data Analysis with Python',
    description: 'Hands-on workshop teaching data analysis techniques using Python, pandas, and visualization libraries. Learn to extract insights from data.',
    date: '2024-03-05',
    time: '1:00 PM - 6:00 PM',
    location: 'Computer Lab 2',
    instructor: 'Dr. Amina Ali - Data Scientist',
    duration: '2 Days',
    level: 'Intermediate',
    category: 'Data',
    status: 'upcoming',
    price: '$120'
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design. Create beautiful and functional designs using modern tools.',
    date: '2024-03-12',
    time: '10:00 AM - 4:00 PM',
    location: 'Design Studio',
    instructor: 'Fatima Omar - Senior UX Designer',
    duration: '2 Days',
    level: 'Beginner',
    category: 'Design',
    image: '/BG-3.png',
    status: 'upcoming',
    price: '$100'
  },
  {
    id: '4',
    title: 'Digital Marketing Strategies',
    description: 'Master digital marketing techniques including social media marketing, SEO, and content creation for business growth.',
    date: '2024-01-20',
    time: '2:00 PM - 6:00 PM',
    location: 'Conference Room A',
    instructor: 'Ahmed Yusuf - Marketing Expert',
    duration: '1 Day',
    level: 'Beginner',
    category: 'Business',
    status: 'completed',
    price: '$80'
  },
  {
    id: '5',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native. Learn to deploy apps to both iOS and Android platforms.',
    date: '2024-01-15',
    time: '9:00 AM - 5:00 PM',
    location: 'Computer Lab 1',
    instructor: 'Mohamed Hassan - Mobile Developer',
    duration: '3 Days',
    level: 'Intermediate',
    category: 'Programming',
    image: '/BG-4.png',
    status: 'completed',
    price: '$180'
  }
];

export default function Workshops() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  
  const upcomingWorkshops = workshopsData.filter(w => w.status === 'upcoming');
  const completedWorkshops = workshopsData.filter(w => w.status === 'completed');

  const handleRegisterClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsRegistrationOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming': return <Code className="h-4 w-4" />;
      case 'Data': return <Database className="h-4 w-4" />;
      case 'Design': return <Palette className="h-4 w-4" />;
      case 'Business': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3B0764] via-[#8B5CF6] to-[#1E0A3C] text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Workshops & Training
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Hands-on learning experiences to develop practical skills and advance your career
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Workshops */}
      {upcomingWorkshops.length > 0 && (
        <section className="py-16" data-section="upcoming-workshops">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Upcoming Workshops
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Register now for these hands-on learning opportunities
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingWorkshops.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  {workshop.image && (
                    <div className="h-48 bg-gradient-to-br from-[#8B5CF6] to-[#3B0764] relative overflow-hidden">
                      <img 
                        src={workshop.image} 
                        alt={workshop.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(workshop.level)}`}>
                          {workshop.level}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white flex items-center gap-1">
                          {getCategoryIcon(workshop.category)}
                          {workshop.category}
                        </span>
                      </div>
                      {workshop.price && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500 text-white">
                            {workshop.price}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {workshop.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {workshop.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(workshop.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{workshop.time} ({workshop.duration})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{workshop.location}</span>
                      </div>
                      {workshop.instructor && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{workshop.instructor}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full bg-[#3B0764] hover:bg-[#2d0550] group"
                      onClick={() => handleRegisterClick(workshop)}
                    >
                      Register Now
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Workshops */}
      {completedWorkshops.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Past Workshops
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Explore our previous training sessions and success stories
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedWorkshops.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  {workshop.image && (
                    <div className="h-40 bg-gradient-to-br from-gray-400 to-gray-600 relative overflow-hidden">
                      <img 
                        src={workshop.image} 
                        alt={workshop.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-600 text-white">
                          Completed
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {workshop.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">
                      {workshop.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(workshop.level)}`}>
                        {workshop.level}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                        {getCategoryIcon(workshop.category)}
                        {workshop.category}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(workshop.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{workshop.duration}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#3B0764] to-[#8B5CF6] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Enhance Your Skills?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our upcoming workshops and take your career to the next level with hands-on training from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#3B0764] hover:bg-white/90"
                onClick={() => {
                  // Scroll to upcoming workshops section
                  const upcomingSection = document.querySelector('[data-section="upcoming-workshops"]');
                  upcomingSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View All Workshops
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#3B0764]"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Form Modal */}
      {selectedWorkshop && (
        <WorkshopRegistrationForm
          isOpen={isRegistrationOpen}
          onClose={() => {
            setIsRegistrationOpen(false);
            setSelectedWorkshop(null);
          }}
          workshopTitle={selectedWorkshop.title}
          workshopDate={formatDate(selectedWorkshop.date)}
          price={selectedWorkshop.price}
        />
      )}
    </div>
  );
}