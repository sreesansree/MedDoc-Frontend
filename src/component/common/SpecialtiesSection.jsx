import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Button } from 'flowbite-react';
import { FaHeartbeat, FaBrain, FaBaby, FaBone, FaTooth, FaLungs } from 'react-icons/fa';
import { GiPsychicWaves, GiEyeShield } from 'react-icons/gi';

const specialties = [
  {
    id: 1,
    name: "Cardiology",
    description: "Expert heart care with advanced diagnostic technologies",
    icon: <FaHeartbeat className="text-4xl text-red-500" />,
    color: "bg-red-50 dark:bg-red-900/20"
  },
  {
    id: 2,
    name: "Neurology",
    description: "Comprehensive care for brain and nervous system disorders",
    icon: <FaBrain className="text-4xl text-blue-500" />,
    color: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    id: 3,
    name: "Pediatrics",
    description: "Dedicated care for infants, children, and adolescents",
    icon: <FaBaby className="text-4xl text-green-500" />,
    color: "bg-green-50 dark:bg-green-900/20"
  },
  {
    id: 4,
    name: "Orthopedics",
    description: "Advanced treatments for bones and joints",
    icon: <FaBone className="text-4xl text-purple-500" />,
    color: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    id: 5,
    name: "Dentistry",
    description: "Complete oral health and cosmetic dentistry",
    icon: <FaTooth className="text-4xl text-teal-500" />,
    color: "bg-teal-50 dark:bg-teal-900/20"
  },
  {
    id: 6,
    name: "Pulmonology",
    description: "Specialized care for respiratory conditions",
    icon: <FaLungs className="text-4xl text-orange-500" />,
    color: "bg-orange-50 dark:bg-orange-900/20"
  },
  {
    id: 7,
    name: "Psychiatry",
    description: "Mental health support and counseling services",
    icon: <GiPsychicWaves className="text-4xl text-indigo-500" />,
    color: "bg-indigo-50 dark:bg-indigo-900/20"
  },
  {
    id: 8,
    name: "Ophthalmology",
    description: "Vision care and eye disease treatment",
    icon: <GiEyeShield className="text-4xl text-yellow-500" />,
    color: "bg-yellow-50 dark:bg-yellow-900/20"
  }
];

const SpecialtiesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate specialties
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % specialties.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <section className=" py-12 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Medical Specialties
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive healthcare services across all major medical disciplines
          </p>
        </motion.div>

        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <motion.div
                key={specialty.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: index === activeIndex ? 1 : 0.7,
                  scale: index === activeIndex ? 1.05 : 0.95,
                  zIndex: index === activeIndex ? 10 : 1
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className={`${specialty.color} rounded-xl p-6 shadow-lg transition-all duration-300 cursor-pointer`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="mb-4">{specialty.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {specialty.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    {specialty.description}
                  </p>
                  <Button
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    className="mt-auto"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {specialties.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-indigo-600 w-6'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to specialty ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;