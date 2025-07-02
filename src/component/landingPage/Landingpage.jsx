import { Card, Button, Carousel } from "flowbite-react";
import HealthNewsSection from "../common/HealthNewsSection";
import { useNavigate } from "react-router-dom";
import BestPractices from "../user/BestPractices";
import TestimonialsSection from "../common/TestimonialsSection";
import SpecialtiesSection from "../common/SpecialtiesSection";
// import { useEffect, useRef, useState } from "react";
import AnimateOnScroll from "../common/Animation/AnimateOnScroll";
// import PropTypes from 'prop-types';

const bannerImage1 =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
const bannerImage2 =
  "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
const bannerImage3 =
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

function Landingpage() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-6">
      {/* Banner Carousel with Background Images */}
      <div className="h-64 sm:h-80 xl:h-[32rem] 2xl:h-120 mb-10 rounded-lg overflow-hidden">
        <Carousel slideInterval={5000}>
          <div
            className="flex h-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage1})`,
            }}
          >
            <div className="text-center p-4 text-white">
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
                Welcome to MedDoc
              </h1>
              <p className="text-xl mt-4 drop-shadow-md">
                Your Trusted Online Doctor Consultation Service
              </p>
              <Button
                className="mt-6"
                color="light"
                onClick={() => navigate("/user/doctors-list")}
              >
                Get Started
              </Button>
            </div>
          </div>

          <div
            className="flex h-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage2})`,
              backgroundPosition: "center top",
              backgroundRepeat: "cover",
            }}
          >
            <div className="text-center p-4 text-white">
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
                24/7 Medical Support
              </h1>
              <p className="text-xl mt-4 drop-shadow-md">
                Connect with doctors anytime, anywhere
              </p>
              <Button
                className="mt-6"
                color="light"
                onClick={() => navigate("/user/doctors-list")}
              >
                Book Now
              </Button>
            </div>
          </div>

          <div
            className="flex h-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage3})`,
            }}
          >
            <div className="text-center p-4 text-white">
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
                Health at Your Fingertips
              </h1>
              <p className="text-xl mt-4 drop-shadow-md">
                Book appointments in just a few clicks
              </p>
              <Button className="mt-6" color="light">
                Learn More
              </Button>
            </div>
          </div>
        </Carousel>
      </div>

      {/* How It Works Section */}
      {/* <AnimateOnScroll animation="slideUp"> */}
        <div className="text-center mb-16 bg-green-200 dark:bg-gray-800 p-10">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
            Simple steps to get medical help from the comfort of your home
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up and complete your health profile in minutes
              </p>
            </div>
            <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your specialist and preferred time slot
              </p>
            </div>
            <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Consult Online</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect via Chat and get medical advice
              </p>
            </div>
          </div>
        </div>
      {/* </AnimateOnScroll> */}

      {/* Specialties */}
      <AnimateOnScroll animation="fadeIn">
        <SpecialtiesSection />
      </AnimateOnScroll>

      {/* Health News */}
      <AnimateOnScroll animation="slideRight">
        <HealthNewsSection />
      </AnimateOnScroll>

      {/* Best Practices */}
      <AnimateOnScroll animation="slideRight">
        <BestPractices />
      </AnimateOnScroll>

      {/* Testimonials Section */}
      <AnimateOnScroll animation="slideRight">
        <TestimonialsSection />
      </AnimateOnScroll>

      {/* Call to Action */}
      <AnimateOnScroll animation="fadeIn">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Consult with a Doctor?
          </h2>
          <p className="text-xl mb-6">
            Join thousands of satisfied patients who trust MedDoc for their
            healthcare needs
          </p>
          <div className="flex justify-center gap-4">
            <Button color="light">Learn More</Button>
            <Button onClick={() => navigate("/user/doctors-list")}>
              Book an Appointment
            </Button>
          </div>
        </div>
      </AnimateOnScroll>
    </div>
  );
}

export default Landingpage;
