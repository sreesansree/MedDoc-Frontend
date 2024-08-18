// components/Appointment.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from "../../animations/chatanimation.json";
import { formatTime } from "../../utils/dateUtils";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/users/user-appointments");
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

  // const handleChat = (doctorId, appointmentId) => {
  //   navigate(`/user/chat/${doctorId}/${appointmentId}`);
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        My Appointments
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            // onChat={handleChat}
          />
        ))}
      </div>
    </div>
  );
};

const AppointmentCard = ({ appointment }) => {
  const { doctor, date, startTime, endTime, isBooked } = appointment;
  const doctorName = doctor.name || "Unknown Doctor";
  const appointmentDate = new Date(date).toLocaleDateString();
  const appointmentStartTime = formatTime(startTime);
  const appointmentEndTime = formatTime(endTime);

  const profilePicture =
    doctor.profilePicture || "https://via.placeholder.com/150";
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
      <div className="flex justify-between gap-4">
        <div>
          <Button
            gradientDuoTone="purpleToBlue"
            className="w-full text-center"
            disabled={!isBooked}
          >
            {isBooked ? "View Details" : "Not Booked"}
          </Button>
        </div>
        <div className="flex justify-center items-center">
          <Link to={'/user/chat/'}>
            <Button
              gradientDuoTone="purpleToBlue"
              className="w-full text-center h-12"
              // onClick={() => onChat(doctor._id, appointment._id)}
            >
              <p className="mr-2">Message </p>
              <Lottie
                options={defaultOptions}
                width={30}
                style={{ marginBottom: 10 }}
              />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Appointment;
