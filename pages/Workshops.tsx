import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, ChefHat, Scissors, Shirt, Car, Zap } from 'lucide-react';
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
    title: 'Basic Cooking Techniques Workshop',
    description: 'Intensive 3-day workshop covering fundamental cooking methods, knife skills, and food preparation. Perfect for beginners wanting to start their culinary journey.',
    date: '2024-02-25',
    time: '9:00 AM - 5:00 PM',
    location: 'Culinary Training Kitchen',
    instructor: 'Chef Amina Hassan - Professional Chef',
    duration: '3 Days',
    level: 'Beginner',
    category: 'Culinary',
    image: '/BG-2.png',
    status: 'upcoming',
    price: undefined
  },
  {
    id: '2',
    title: 'Hair Cutting & Styling Basics',
    description: 'Hands-on workshop teaching basic hair cutting techniques, styling methods, and customer service skills for aspiring barbers.',
    date: '2024-03-05',
    time: '1:00 PM - 6:00 PM',
    location: 'Beauty Training Salon',
    instructor: 'Master Barber Omar Ali - 15 Years Experience',
    duration: '2 Days',
    level: 'Beginner',
    category: 'Beauty',
    status: 'upcoming',
    price: undefined
  },
  {
    id: '3',
    title: 'Basic Sewing & Pattern Making',
    description: 'Learn fundamental sewing techniques, pattern reading, and garment construction. Perfect introduction to tailoring and fashion design.',
    date: '2024-03-12',
    time: '10:00 AM - 4:00 PM',
    location: 'Fashion Design Studio',
    instructor: 'Fatima Omar - Master Tailor',
    duration: '2 Days',
    level: 'Beginner',
    category: 'Fashion',
    image: '/BG-3.png',
    status: 'upcoming',
    price: undefined
  },
  {
    id: '4',
    title: 'Basic Car Maintenance Workshop',
    description: 'Learn essential car maintenance skills including oil changes, tire care, and basic troubleshooting for vehicle owners.',
    date: '2024-01-20',
    time: '2:00 PM - 6:00 PM',
    location: 'Automotive Workshop',
    instructor: 'Ahmed Yusuf - Certified Mechanic',
    duration: '1 Day',
    level: 'Beginner',
    category: 'Automotive',
    status: 'completed',
    price: undefined
  },
  {
    id: '5',
    title: 'Basic Electrical Wiring Safety',
    description: 'Learn safe electrical practices, basic wiring techniques, and home electrical maintenance for beginners.',
    date: '2024-01-15',
    time: '9:00 AM - 5:00 PM',
    location: 'Electrical Training Lab',
    instructor: 'Mohamed Hassan - Licensed Electrician',
    duration: '2 Days',
    level: 'Intermediate',
    category: 'Electrical',
    image: '/BG-4.png',
    status: 'completed',
    price: undefined
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
      case 'Culinary': return <ChefHat className="h-4 w-4" />;
      case 'Beauty': return <Scissors className="h-4 w-4" />;
      case 'Fashion': return <Shirt className="h-4 w-4" />;
      case 'Automotive': return <Car className="h-4 w-4" />;
      case 'Electrical': return <Zap className="h-4 w-4" />;
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
              Free hands-on learning experiences to develop practical skills and advance your career
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
                Register now for these free hands-on learning opportunities
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
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-[#3B0764] w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </Link>
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