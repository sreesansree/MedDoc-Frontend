import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import { AiOutlineCalendar } from "react-icons/ai";
import axios from "axios"; // Ensure you have axios installed
import Lottie from "react-lottie";
import animationData from "../../animations/chatanimation.json";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch appointments from the API
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/users/user-appointments");
        // Sort appointments by date and time
        const sortedAppointments = response.data.sort((a, b) => {
          const dateTimeA = new Date(a.date + "T" + a.startTime);
          const dateTimeB = new Date(b.date + "T" + b.startTime);
          return dateTimeA - dateTimeB;
        });
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleBack = () => {
    navigate("/"); // Adjust this route to your actual dashboard or home page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        My Appointments
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment._id} appointment={appointment} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Button gradientDuoTone="purpleToBlue" onClick={handleBack}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

const formatTime = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 24h to 12h format
  const formattedMinute = minute.toString().padStart(2, "0");
  return `${formattedHour}:${formattedMinute} ${ampm}`;
};

const AppointmentCard = ({ appointment }) => {
  const { doctor, date, startTime, endTime, isBooked } = appointment;
  const doctorName = doctor.name || "Unknown Doctor";
  const appointmentDate = new Date(date).toLocaleDateString();
  const appointmentStartTime = formatTime(startTime);
  const appointmentEndTime = formatTime(endTime);
  const profilePicture =
    doctor.profilePicture || "https://via.placeholder.com/150"; // Placeholder image if no profile picture
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Card className="shadow-lg p-4">
      <div className="flex items-center mb-4">
        <img
          src={profilePicture}
          alt={doctorName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="ml-4">
          <h3 className="text-xl font-semibold">
            Consultation with Dr. {doctorName}
          </h3>
          <p className="text-gray-600">Date: {appointmentDate}</p>
          <p className="text-gray-600">
            Time: {appointmentStartTime} - {appointmentEndTime}
          </p>
        </div>
      </div>
      <div className="flex justify-between  gap-4">
        <Button
          gradientDuoTone="purpleToBlue"
          className="w-full text-center"
          disabled={!isBooked}
        >
          {isBooked ? "View Details" : "Not Booked"}
        </Button>
        <Button  gradientDuoTone="purpleToBlue"
          className="w-full">
            <p className="mt-3 p-">Chat with doctor</p>
          <Lottie
            options={defaultOptions}
            width={30}
            style={{ marginBottom: 15, marginLeft: 0 }}
           
          />
        </Button>
      </div>
    </Card>
  );
};

export default Appointment;
