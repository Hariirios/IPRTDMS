import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Calendar, Users, Award, Briefcase, Star } from 'lucide-react';
import { Button } from '../components/ui/button';

interface Graduate {
  id: string;
  name: string;
  program: string;
  graduationDate: string;
  currentPosition?: string;
  company?: string;
  image?: string;
  achievement?: string;
  testimonial?: string;
}

interface GraduationBatch {
  id: string;
  title: string;
  date: string;
  totalGraduates: number;
  programs: string[];
  description: string;
  image?: string;
  graduates: Graduate[];
}

const graduationData: GraduationBatch[] = [
  {
    id: '1',
    title: 'December 2023 Graduation Ceremony',
    date: '2023-12-20',
    totalGraduates: 45,
    programs: ['Software Development', 'Digital Marketing', 'Project Management'],
    description: 'We are proud to celebrate the achievements of our December 2023 graduates who have successfully completed their programs and are ready to make their mark in their respective fields.',
    image: '/BG-3.png',
    graduates: [
      {
        id: '1',
        name: 'Ahmed Hassan Mohamed',
        program: 'Software Development',
        graduationDate: '2023-12-20',
        currentPosition: 'Full Stack Developer',
        company: 'TechSom Solutions',
        achievement: 'Best Project Award',
        testimonial: 'IPRT provided me with the practical skills I needed to excel in the tech industry.'
      },
      {
        id: '2',
        name: 'Fatima Ali Omar',
        program: 'Digital Marketing',
        graduationDate: '2023-12-20',
        currentPosition: 'Marketing Manager',
        company: 'Digital Somalia',
        achievement: 'Outstanding Performance',
        testimonial: 'The hands-on approach at IPRT helped me understand real-world marketing challenges.'
      },
      {
        id: '3',
        name: 'Mohamed Yusuf Ahmed',
        program: 'Project Management',
        graduationDate: '2023-12-20',
        currentPosition: 'Project Coordinator',
        company: 'Development Partners International',
        achievement: 'Leadership Excellence',
        testimonial: 'IPRT taught me not just theory, but practical project management skills.'
      }
    ]
  },
  {
    id: '2',
    title: 'September 2023 Graduation Ceremony',
    date: '2023-09-15',
    totalGraduates: 38,
    programs: ['Data Analysis', 'Web Development', 'Graphic Design'],
    description: 'Our September 2023 graduates have demonstrated exceptional dedication and skill development throughout their programs.',
    graduates: [
      {
        id: '4',
        name: 'Amina Hassan Ali',
        program: 'Data Analysis',
        graduationDate: '2023-09-15',
        currentPosition: 'Data Analyst',
        company: 'Somalia Statistics Bureau',
        achievement: 'Research Excellence Award'
      },
      {
        id: '5',
        name: 'Omar Mohamed Hassan',
        program: 'Web Development',
        graduationDate: '2023-09-15',
        currentPosition: 'Frontend Developer',
        company: 'Mogadishu Tech Hub'
      },
      {
        id: '6',
        name: 'Khadija Ahmed Omar',
        program: 'Graphic Design',
        graduationDate: '2023-09-15',
        currentPosition: 'Creative Designer',
        company: 'Brand Somalia Agency'
      }
    ]
  }
];

const successStories = [
  {
    name: 'Hassan Mohamed Ali',
    program: 'Software Development (2023)',
    achievement: 'Founded a successful tech startup',
    description: 'After graduating from IPRT, Hassan founded TechSom, a software development company that now employs 15+ developers.',
    image: '/about-1.png'
  },
  {
    name: 'Sahra Omar Ahmed',
    program: 'Digital Marketing (2022)',
    achievement: 'Marketing Director at leading NGO',
    description: 'Sahra now leads digital marketing strategies for one of Somalia\'s largest international NGOs.',
    image: '/about-2.png'
  },
  {
    name: 'Abdullahi Hassan Mohamed',
    program: 'Project Management (2022)',
    achievement: 'Managing multi-million dollar projects',
    description: 'Abdullahi oversees infrastructure development projects worth over $5M across East Africa.',
    image: '/about-3.png'
  }
];

export default function Graduates() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
              Our Graduates
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Celebrating the achievements and success stories of our talented graduates
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <GraduationCap className="h-12 w-12 text-[#3B0764] mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">500+</h3>
              <p className="text-gray-600 dark:text-gray-400">Total Graduates</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Briefcase className="h-12 w-12 text-[#8B5CF6] mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">85%</h3>
              <p className="text-gray-600 dark:text-gray-400">Employment Rate</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Award className="h-12 w-12 text-[#3B0764] mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">15+</h3>
              <p className="text-gray-600 dark:text-gray-400">Programs Offered</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Star className="h-12 w-12 text-[#8B5CF6] mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.8/5</h3>
              <p className="text-gray-600 dark:text-gray-400">Graduate Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Graduations */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Graduations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Celebrating our latest graduates and their achievements
            </p>
          </motion.div>

          <div className="space-y-12">
            {graduationData.map((batch, index) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Batch Info */}
                  <div className="lg:col-span-1">
                    {batch.image && (
                      <div className="h-48 bg-gradient-to-br from-[#8B5CF6] to-[#3B0764] rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={batch.image} 
                          alt={batch.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {batch.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(batch.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{batch.totalGraduates} Graduates</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {batch.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {batch.programs.map((program, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-[#8B5CF6]/20 text-[#3B0764] dark:text-[#8B5CF6] rounded-full text-xs font-semibold"
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Graduates */}
                  <div className="lg:col-span-2">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Featured Graduates
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {batch.graduates.slice(0, 4).map((graduate) => (
                        <div 
                          key={graduate.id}
                          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
                        >
                          <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {graduate.name}
                          </h5>
                          <p className="text-[#3B0764] dark:text-[#8B5CF6] font-semibold mb-2">
                            {graduate.program}
                          </p>
                          {graduate.currentPosition && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <strong>Current Role:</strong> {graduate.currentPosition}
                              {graduate.company && ` at ${graduate.company}`}
                            </p>
                          )}
                          {graduate.achievement && (
                            <div className="flex items-center gap-2 mb-3">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                {graduate.achievement}
                              </span>
                            </div>
                          )}
                          {graduate.testimonial && (
                            <blockquote className="text-sm italic text-gray-600 dark:text-gray-400 border-l-4 border-[#8B5CF6] pl-3">
                              "{graduate.testimonial}"
                            </blockquote>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Alumni making significant impact in their fields
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-[#8B5CF6] to-[#3B0764] relative overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {story.name}
                  </h3>
                  <p className="text-[#3B0764] dark:text-[#8B5CF6] font-semibold mb-3">
                    {story.program}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {story.achievement}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {story.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#3B0764] to-[#8B5CF6] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start your journey with IPRT and become part of our growing community of successful graduates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#3B0764] hover:bg-white/90"
              >
                Apply Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#3B0764]"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}