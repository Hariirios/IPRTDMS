import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wrench, Server, Microscope, Monitor, Mail, Phone, Building, Briefcase } from 'lucide-react';
import { teamStore } from '../lib/teamStore';

export default function Technicians() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Team');

  useEffect(() => {
    // Load technicians from database
    const loadTechnicians = async () => {
      setLoading(true);
      try {
        const members = await teamStore.getByType('Technician');
        setTechnicians(members);
      } catch (error) {
        console.error('Error loading technicians:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTechnicians();
  }, []);

  // Filter technicians based on active filter and role
  const filteredTechnicians = technicians.filter((technician) => {
    if (activeFilter === 'All Team') {
      return true; // Show all technicians
    }
    
    // Filter by role - check if role contains the filter keyword
    const role = technician.role.toLowerCase();
    const filter = activeFilter.toLowerCase();
    
    if (activeFilter === 'Leadership') {
      // Match roles like: Director, Manager, Lead, Chief, Head, Supervisor
      return role.includes('director') || 
             role.includes('manager') || 
             role.includes('lead') || 
             role.includes('chief') || 
             role.includes('head') || 
             role.includes('supervisor');
    }
    
    if (activeFilter === 'Developers') {
      // Match roles like: Developer, Engineer, Programmer, Coder
      return role.includes('developer') || 
             role.includes('engineer') || 
             role.includes('programmer') || 
             role.includes('coder') ||
             role.includes('software') ||
             role.includes('web') ||
             role.includes('frontend') ||
             role.includes('backend') ||
             role.includes('fullstack') ||
             role.includes('full stack');
    }
    
    return false;
  });

  const services = [
    {
      icon: Server,
      title: "IT Infrastructure",
      description: "Network setup, maintenance, and security management"
    },
    {
      icon: Microscope,
      title: "Lab Equipment",
      description: "Equipment maintenance, calibration, and safety protocols"
    },
    {
      icon: Monitor,
      title: "AV Systems",
      description: "Multimedia setup, recording, and technical support"
    },
    {
      icon: Wrench,
      title: "Technical Training",
      description: "Equipment operation training and troubleshooting support"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-950">
      {/* Hero Section with Image and Text */}
      <section className="relative py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
                  alt="Technician working"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] dark:text-white mb-6">
                We Value Our Skilled Technicians
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                At Institute for Practical Research Training, our dedicated technicians are the driving force behind the development and smooth operation of our system. Their expertise and commitment ensure seamless functionality, enabling us to provide effective solutions that support the organization. We deeply appreciate their hard work in creating and maintaining systems that empower our mission.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet Our Technicians Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#1e3a8a] dark:text-white mb-4">
              Meet Our Technicians
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
              Meet the talented professionals who work tirelessly to maintain and improve our technological infrastructure.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4 mb-12"
          >
            {['All Team', 'Leadership', 'Developers'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-[#3B5BDB] text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Technicians Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading technicians...</p>
            </div>
          ) : technicians.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No technicians added yet. Please check back later.
              </p>
            </div>
          ) : filteredTechnicians.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No technicians found in the "{activeFilter}" category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {filteredTechnicians.map((technician, index) => (
                <motion.div
                  key={technician.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  {/* Avatar with Red Border */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-sm"></div>
                      {technician.image ? (
                        <img
                          src={technician.image}
                          alt={technician.name}
                          className="relative w-32 h-32 rounded-full object-cover border-4 border-red-500 shadow-xl"
                        />
                      ) : (
                        <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-red-500 shadow-xl">
                          <span className="text-white text-3xl font-bold">
                            {technician.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                      {technician.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {technician.role}
                    </p>
                    <div className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {technician.department}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Provided */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-[#3B0764] dark:text-[#8B5CF6] mb-4">
              Technical Services Provided
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive technical support for all your training and research needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3B0764] to-[#8B5CF6] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
