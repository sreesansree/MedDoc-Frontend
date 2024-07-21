import React from "react";
import { Card, Button } from "flowbite-react";

function DocHome() {
    return (
        <div className="container mx-auto p-6">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-green-500 to-teal-500 text-white py-20 text-center rounded-lg mb-10">
            <h1 className="text-5xl font-bold">Welcome to MedDoc</h1>
            <p className="text-xl mt-4">
              Empowering Doctors with Seamless Online Consultations
            </p>
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
              <Button>Go to Appointments</Button>
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
        </div>
      );
}

export default DocHome;
