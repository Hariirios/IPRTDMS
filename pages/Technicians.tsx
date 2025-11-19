import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wrench, Server, Microscope, Monitor, Mail, Phone, Building, Briefcase } from 'lucide-react';
import { teamStore } from '../lib/teamStore';

export default function Technicians() {
  const [technicians, setTechnicians] = useState<any[]>([]);

  useEffect(() => {
    // Load technicians from store
    const members = teamStore.getByType('Technician');
    setTechnicians(members);
  }, []);

  const getGradient = (index: number) => {
    const gradients = [
      "from-purple-600 to-pink-600",
      "from-pink-600 to-rose-600",
      "from-blue-600 to-purple-600",
      "from-cyan-600 to-blue-600",
      "from-indigo-600 to-purple-600",
      "from-teal-600 to-green-600"
    ];
    return gradients[index % gradients.length];
  };

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
            <h1 className="text-white mb-6">
              Our Technicians
            </h1>
            <p className="text-white/90 text-xl leading-relaxed">
              Our technical team ensures all equipment and systems run smoothly to support our research and training activities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Technicians Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {technicians.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No technicians added yet. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {technicians.map((technician, index) => (
                <motion.div
                  key={technician.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    {technician.image ? (
                      <img
                        src={technician.image}
                        alt={technician.name}
                        className="w-24 h-24 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className={`w-24 h-24 bg-gradient-to-br ${getGradient(index)} rounded-full flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-2xl font-bold">
                          {technician.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-2">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                      {technician.name}
                    </h3>
                    <p className="text-[#3B0764] dark:text-[#8B5CF6] font-medium">
                      {technician.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-1">
                      <Building className="h-4 w-4" />
                      {technician.department}
                    </p>
                    <div className="pt-2 space-y-1">
                      <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
                        <Mail className="h-3 w-3" />
                        {technician.email}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
                        <Phone className="h-3 w-3" />
                        {technician.phone}
                      </p>
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
