import React from "react";
import { Card, Avatar } from "flowbite-react";

export default function About() {
  return (
    <div className="container mx-auto p-6">
      {/* Introduction */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          About{" "}
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400
    via-purple-500 to-pink-500 font-bold"
          >
            Med
          </span>
          Doc
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-400">
          MedDoc is your trusted online doctor consultation service, offering
          expert medical advice and care at your fingertips.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-3xl font-bold text-center mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 dark:text-gray-400 text-center">
          Our mission is to provide accessible, reliable, and high-quality
          medical consultations to everyone, regardless of location.
        </p>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex flex-col items-center">
              <Avatar img="/tovino.jpg" rounded={true} />
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-4">
                Dr. John Doe
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
                Chief Medical Officer with over 20 years of experience in
                cardiology.
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col items-center">
              <Avatar img="doctor2.jpeg" rounded={true} />
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-4">
                Dr. Jane Smith
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
                Lead Dermatologist with a passion for skincare and patient
                wellness.
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col items-center">
              <Avatar img="doctor2.jpeg" rounded={true} />
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-4">
                Dr. Emily Johnson
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
                Pediatric Specialist dedicated to providing top-notch care for
                children.
              </p>
            </div>
          </Card>
          {/* Add more team members as needed */}
        </div>
      </div>
    </div>
  );
}
