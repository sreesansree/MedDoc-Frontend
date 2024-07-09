import React from "react";
import { Card, Button } from "flowbite-react";

function Landingpage() {
  return (
    <div className="container mx-auto p-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-00 to-pink-600 text-white py-20 text-center rounded-lg mb-10">
        <h1 className="text-5xl font-bold">Welcome to MedDoc</h1>
        <p className="text-xl mt-4">
          Your Trusted Online Doctor Consultation Service
        </p>
      </div>

      {/* Specialization Departments */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Our Specializations</h2>
        <p className="text-lg mt-2">
          Explore our wide range of specialized departments
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900  dark:text-gray-100">
            Cardiology
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-100">
            Expert cardiology consultations and care for your heart health.
          </p>
          <Button>Learn More</Button>
        </Card>
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Dermatology
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-100">
            Comprehensive skin care and dermatology services.
          </p>
          <Button>Learn More</Button>
        </Card>
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Pediatrics
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-100">
            Dedicated care for infants, children, and adolescents.
          </p>
          <Button>Learn More</Button>
        </Card>
        {/* Add more cards as needed */}
      </div>
    </div>
  );
}

export default Landingpage;
