// import React from "react";
import { Card, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import HealthNewsSection from "../../component/common/HealthNewsSection";
import { useSelector } from "react-redux";

function DocHome() {
  const { currentDoctor } = useSelector((state) => state.doctor);
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Banner */}
      {/* <div className="bg-gradient-to-r from-blue-600 via-green-500 to-teal-500 text-white py-20 text-center rounded-lg mb-10">
        <h1 className="text-5xl font-bold">Welcome to MedDoc</h1>
        <p className="text-xl mt-4">
          Empowering Doctors with Seamless Online Consultations
        </p>
      </div> */}
      <div className="relative bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 text-white py-16 md:py-24 text-center rounded-xl mb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://img.icons8.com/ios/50/000000/stethoscope.png')] bg-repeat"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome Back, Dr. {currentDoctor?.name}
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            {currentDoctor?.department
              ? `Your expertise in "${currentDoctor?.department?.name}" is changing lives every day.`
              : "Your expertise is changing lives every day."}
          </p>
          <div className="flex justify-center gap-4">
            <Link to={`/doctor/slots/${currentDoctor._id}`}>
              <Button size="lg" gradientDuoTone="cyanToBlue">
                View Appointments
              </Button>
            </Link>
            <Link to="/doctor/dashboard?tab=appointments">
              <Button size="lg" outline color="light">
                Start Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Doctor Dashboard</h2>
        <p className="text-lg mt-2">
          Manage your appointments, track patient consultations, and more
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Manage Appointments
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-100">
            Easily view and manage your upcoming appointments with patients.
          </p>
          <Link to="/doctor/dashboard?tab=appointments">
            <Button>Go to Appointments</Button>
          </Link>
        </Card>
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Track Consultations
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-100">
            Keep track of patient consultations and medical records.
          </p>
          <Button>Go to Consultations</Button>
        </Card>
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Profile Management
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-100">
            Update your professional profile and credentials.
          </p>
          <Button>Update Profile</Button>
        </Card>
        {/* Add more cards as needed */}
      </div>
      <HealthNewsSection />
    </div>
  );
}

export default DocHome;
