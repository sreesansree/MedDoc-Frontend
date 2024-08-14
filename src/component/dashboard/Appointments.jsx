import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import { AiOutlineCalendar } from "react-icons/ai";

const Appointment = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Adjust this route to your actual dashboard or home page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        My Appointment
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppointmentCard />
        <AppointmentCard />
      </div>
      <div className="text-center mt-8">
        <Button gradientDuoTone="purpleToBlue" onClick={handleBack}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

const AppointmentCard = () => {
  return (
    <Card className="shadow-lg p-4">
      <div className="flex items-center mb-4">
        <AiOutlineCalendar className="text-2xl text-gray-600" />
        <div className="ml-4">
          <h3 className="text-xl font-semibold">
            Consultation with Dr. John Doe
          </h3>
          <p className="text-gray-600">Date: August 20, 2024</p>
          <p className="text-gray-600">Time: 10:00 AM - 11:00 AM</p>
        </div>
      </div>
      <p className="text-gray-800 mb-4">Location: Clinic Name, Address</p>
      <Button gradientDuoTone="purpleToBlue" className="w-full">
        View Details
      </Button>
    </Card>
  );
};

export default Appointment;
