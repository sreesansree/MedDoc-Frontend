import React from "react";
import { Card } from "flowbite-react";
import {
  FaShieldAlt,
  FaFileMedical,
  FaLaptopMedical,
  FaPercent,
  FaRupeeSign,
} from "react-icons/fa";

const BestPractices = () => {
  const practices = [
    {
      id: 1,
      icon: <FaShieldAlt className="text-3xl text-blue-600" />,
      title: "100% Safe & Secure",
      description:
        "We take all safety and hygiene measures to keep our customers safe",
    },
    {
      id: 2,
      icon: <FaFileMedical className="text-3xl text-green-600" />,
      title: "Online Health Records",
      description:
        "You can access your health records online and download them all at one place",
    },
    {
      id: 3,
      icon: <FaLaptopMedical className="text-3xl text-purple-600" />,
      title: "Online",
      description:
        "Experienced doctors now available for Online consultations",
    },
    {
      id: 4,
      icon: <FaPercent className="text-3xl text-orange-600" />,
      title: "MedDoc Advantage",
      description: "Enjoy upto 20% discount on Doctor Consultations",
    },
    {
      id: 5,
      icon: <FaRupeeSign className="text-3xl text-teal-600" />,
      title: "Competitive Prices",
      description:
        "Our prices for doctor consultations and diagnostics are the best in the business",
    },
  ];

  return (
    <section className="py-16 bg-blue-200 bottom-3 mb-2 rounded dark:bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Best Practices We Offer
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Quality healthcare services designed for your safety and convenience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practices.map((practice) => (
            <Card
              key={practice.id}
              className="h-full transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-700 rounded-full">
                  {practice.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {practice.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {practice.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestPractices;
