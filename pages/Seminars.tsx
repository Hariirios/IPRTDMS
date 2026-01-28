import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SeminarRegistrationForm } from '../components/forms/SeminarRegistrationForm';

interface Seminar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  speaker?: string;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const seminarsData: Seminar[] = [
  {
    id: '1',
    title: 'Digital Innovation in Somalia: Opportunities and Challenges',
    description: 'Join us for an insightful seminar exploring the digital transformation landscape in Somalia, featuring industry experts and thought leaders discussing the latest trends, opportunities, and challenges in the tech sector.',
    date: '2024-02-15',
    time: '2:00 PM - 4:00 PM',
    location: 'IPRT Main Auditorium',
    speaker: 'Dr. Ahmed Hassan - Tech Innovation Expert',
    image: '/BG-1.png',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Sustainable Development Goals: A Practical Approach',
    description: 'Learn about implementing SDGs in local communities with practical examples and case studies from successful projects across East Africa.',
    date: '2024-02-20',
    time: '10:00 AM - 12:00 PM',
    location: 'Conference Room A',
    speaker: 'Prof. Fatima Ali - Development Studies',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Entrepreneurship in the Digital Age',
    description: 'Discover how to build successful startups in Somalia\'s growing digital economy with insights from successful entrepreneurs.',
    date: '2024-01-25',
    time: '3:00 PM - 5:00 PM',
    location: 'IPRT Main Auditorium',
    speaker: 'Mohamed Omar - Serial Entrepreneur',
    image: '/BG-2.png',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Women in Technology: Breaking Barriers',
    description: 'Empowering women in the tech industry through mentorship, networking, and skill development opportunities.',
    date: '2024-01-18',
    time: '1:00 PM - 3:00 PM',
    location: 'Conference Room B',
    speaker: 'Amina Yusuf - Tech Leader',
    status: 'completed'
  }
];

export default function Seminars() {
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const upcomingSeminars = seminarsData.filter(s => s.status === 'upcoming');
  const completedSeminars = seminarsData.filter(s => s.status === 'completed');

  const handleRegister = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
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
              Seminars & Talks
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join our educational seminars featuring industry experts and thought leaders
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Seminars */}
      {upcomingSeminars.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Upcoming Seminars
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Don't miss these upcoming educational opportunities
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingSeminars.map((seminar, index) => (
                <motion.div
                  key={seminar.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  {seminar.image && (
                    <div className="h-48 bg-gradient-to-br from-[#8B5CF6] to-[#3B0764] relative overflow-hidden">
                      <img 
                        src={seminar.image} 
                        alt={seminar.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(seminar.status)}`}>
                          {seminar.status.charAt(0).toUpperCase() + seminar.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {seminar.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {seminar.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(seminar.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{seminar.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{seminar.location}</span>
                      </div>
                      {seminar.speaker && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{seminar.speaker}</span>
                        </div>
                      )}
                    </div>

                    <Button className="w-full bg-[#3B0764] hover:bg-[#2d0550] group" onClick={() => handleRegister(seminar)}>
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

      {/* Past Seminars */}
      {completedSeminars.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Past Seminars
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Explore our previous educational sessions and insights
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedSeminars.map((seminar, index) => (
                <motion.div
                  key={seminar.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  {seminar.image && (
                    <div className="h-40 bg-gradient-to-br from-gray-400 to-gray-600 relative overflow-hidden">
                      <img 
                        src={seminar.image} 
                        alt={seminar.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(seminar.status)}`}>
                          Completed
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {seminar.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">
                      {seminar.description}
                    </p>
                    
                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(seminar.date)}</span>
                      </div>
                      {seminar.speaker && (
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{seminar.speaker}</span>
                        </div>
                      )}
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
              Want to Speak at Our Seminars?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We're always looking for industry experts and thought leaders to share their knowledge with our community.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[#3B0764] hover:bg-white/90"
            >
              Become a Speaker
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      {selectedSeminar && (
        <SeminarRegistrationForm
          isOpen={isRegistrationOpen}
          onClose={() => {
            setIsRegistrationOpen(false);
            setSelectedSeminar(null);
          }}
          seminarTitle={selectedSeminar.title}
          seminarDate={formatDate(selectedSeminar.date)}
        />
      )}
    </div>
  );
}