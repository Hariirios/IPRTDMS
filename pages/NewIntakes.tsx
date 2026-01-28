import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, BookOpen, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProgramApplicationForm } from '../components/forms/ProgramApplicationForm';

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Technology' | 'Business' | 'Design' | 'Research';
  startDate: string;
  applicationDeadline: string;
  price: string;
  features: string[];
  image?: string;
  popular?: boolean;
}

interface Intake {
  id: string;
  title: string;
  startDate: string;
  applicationDeadline: string;
  description: string;
  programs: Program[];
}

const intakeData: Intake[] = [
  {
    id: '1',
    title: 'March 2024 Intake',
    startDate: '2024-03-15',
    applicationDeadline: '2024-03-01',
    description: 'Join our comprehensive programs starting March 2024. Applications are now open with early bird discounts available.',
    programs: [
      {
        id: '1',
        title: 'Full Stack Web Development',
        description: 'Master modern web development with React, Node.js, and cloud technologies. Build real-world applications and deploy them to production.',
        duration: '6 months',
        level: 'Intermediate',
        category: 'Technology',
        startDate: '2024-03-15',
        applicationDeadline: '2024-03-01',
        price: '$800',
        features: [
          'React & Node.js Development',
          'Database Design & Management',
          'Cloud Deployment (AWS/Azure)',
          'Real-world Project Portfolio',
          'Job Placement Assistance'
        ],
        image: '/BG-1.png',
        popular: true
      },
      {
        id: '2',
        title: 'Cybersecurity Fundamentals',
        description: 'Learn essential cybersecurity skills including network security, ethical hacking, and security analysis.',
        duration: '4 months',
        level: 'Beginner',
        category: 'Technology',
        startDate: '2024-03-15',
        applicationDeadline: '2024-03-01',
        price: '$600',
        features: [
          'Network Security Basics',
          'Ethical Hacking Techniques',
          'Security Risk Assessment',
          'Industry Certifications Prep',
          'Hands-on Lab Experience'
        ],
        image: '/BG-2.png'
      },
      {
        id: '3',
        title: 'Digital Marketing & E-commerce',
        description: 'Comprehensive digital marketing program covering SEO, social media, content marketing, and e-commerce strategies.',
        duration: '3 months',
        level: 'Beginner',
        category: 'Business',
        startDate: '2024-03-15',
        applicationDeadline: '2024-03-01',
        price: '$450',
        features: [
          'SEO & Content Marketing',
          'Social Media Strategy',
          'Google Ads & Analytics',
          'E-commerce Platform Setup',
          'Campaign Management'
        ]
      },
      {
        id: '4',
        title: 'UI/UX Design Professional',
        description: 'Learn user interface and user experience design principles with hands-on projects using industry-standard tools.',
        duration: '4 months',
        level: 'Intermediate',
        category: 'Design',
        startDate: '2024-03-15',
        applicationDeadline: '2024-03-01',
        price: '$550',
        features: [
          'Design Thinking Process',
          'Figma & Adobe Creative Suite',
          'User Research & Testing',
          'Responsive Design Principles',
          'Portfolio Development'
        ],
        image: '/BG-3.png'
      }
    ]
  },
  {
    id: '2',
    title: 'June 2024 Intake',
    startDate: '2024-06-15',
    applicationDeadline: '2024-06-01',
    description: 'Upcoming intake for June 2024 with new programs and enhanced curriculum.',
    programs: [
      {
        id: '5',
        title: 'Data Science & Analytics',
        description: 'Comprehensive data science program covering Python, machine learning, and data visualization.',
        duration: '5 months',
        level: 'Advanced',
        category: 'Technology',
        startDate: '2024-06-15',
        applicationDeadline: '2024-06-01',
        price: '$750',
        features: [
          'Python Programming',
          'Machine Learning Algorithms',
          'Data Visualization',
          'Statistical Analysis',
          'Real-world Projects'
        ],
        image: '/BG-4.png'
      },
      {
        id: '6',
        title: 'Project Management Professional',
        description: 'Learn project management methodologies including Agile, Scrum, and traditional project management.',
        duration: '3 months',
        level: 'Intermediate',
        category: 'Business',
        startDate: '2024-06-15',
        applicationDeadline: '2024-06-01',
        price: '$500',
        features: [
          'Agile & Scrum Methodologies',
          'Project Planning & Execution',
          'Risk Management',
          'Team Leadership',
          'PMP Certification Prep'
        ]
      }
    ]
  }
];

export default function NewIntakes() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const handleApplyClick = (program: Program) => {
    setSelectedProgram(program);
    setIsApplicationOpen(true);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Business': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Design': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'Research': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
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
              New Program Intakes
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join our upcoming programs and advance your career with industry-relevant skills
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[#3B0764] hover:bg-white/90"
              onClick={() => handleApplyClick(intakeData[0]?.programs[0])}
            >
              Apply Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Current Intake */}
      <section className="py-16" data-section="programs">
        <div className="container mx-auto px-4">
          {intakeData.map((intake, intakeIndex) => (
            <div key={intake.id} className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: intakeIndex * 0.1 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {intake.title}
                </h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-5 w-5" />
                    <span>Starts: {formatDate(intake.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-5 w-5" />
                    <span>Apply by: {formatDate(intake.applicationDeadline)}</span>
                    {isDeadlineApproaching(intake.applicationDeadline) && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-semibold ml-2">
                        Deadline Soon!
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                  {intake.description}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {intake.programs.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (intakeIndex * 0.1) + (index * 0.1) }}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all relative ${
                      program.popular ? 'ring-2 ring-[#8B5CF6]' : ''
                    }`}
                  >
                    {program.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 bg-[#8B5CF6] text-white rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Popular
                        </span>
                      </div>
                    )}

                    {program.image && (
                      <div className="h-48 bg-gradient-to-br from-[#8B5CF6] to-[#3B0764] relative overflow-hidden">
                        <img 
                          src={program.image} 
                          alt={program.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(program.level)}`}>
                            {program.level}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(program.category)}`}>
                            {program.category}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {program.title}
                        </h3>
                        <span className="text-2xl font-bold text-[#3B0764] dark:text-[#8B5CF6]">
                          {program.price}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {program.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{program.level}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What You'll Learn:</h4>
                        <ul className="space-y-2">
                          {program.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-[#3B0764] hover:bg-[#2d0550] group"
                          onClick={() => handleApplyClick(program)}
                        >
                          Apply Now
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How to Apply
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Simple steps to join our programs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Program',
                description: 'Select the program that matches your career goals and interests.'
              },
              {
                step: '2',
                title: 'Submit Application',
                description: 'Fill out our online application form with your details and background.'
              },
              {
                step: '3',
                title: 'Interview & Assessment',
                description: 'Participate in a brief interview and skills assessment if required.'
              },
              {
                step: '4',
                title: 'Start Learning',
                description: 'Begin your journey with orientation and access to learning materials.'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#3B0764] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
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
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Don't miss out on our upcoming intakes. Apply now and take the first step towards your professional growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#3B0764] hover:bg-white/90"
                onClick={() => {
                  // Scroll to programs section
                  const programsSection = document.querySelector('[data-section="programs"]');
                  programsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Apply Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#3B0764]"
              >
                Download Brochure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Form Modal */}
      {selectedProgram && (
        <ProgramApplicationForm
          isOpen={isApplicationOpen}
          onClose={() => {
            setIsApplicationOpen(false);
            setSelectedProgram(null);
          }}
          programTitle={selectedProgram.title}
          intakeDate={formatDate(selectedProgram.startDate)}
          price={selectedProgram.price}
        />
      )}
    </div>
  );
}