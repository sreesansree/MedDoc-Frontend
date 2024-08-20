import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Modal } from "flowbite-react";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from "../../animations/chatanimation.json";
import Pagination from "../common/Pagination";
import ChatPage from "../../pages/chat/ChatPage.jsx";
import { useSelector } from "react-redux";
import { createChat } from "../../api/chatRequest.js";

// Function to format date to "dd/MM/yyyy"
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if necessary
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Function to format time to 12-hour format
const formatTime = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 24h to 12h format
  const formattedMinute = minute.toString().padStart(2, "0");
  return `${formattedHour}:${formattedMinute} ${ampm}`;
};

const DocAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5); // Number of appointments per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({
    userId: "",
    appointmentId: "",
  });
  const { currentDoctor } = useSelector((state) => state.doctor);
  const doctorId = currentDoctor._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/doctor/doctor-appointments");
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

  // Calculate the indexes for slicing
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBack = () => {
    navigate("/doctor"); // Adjust this route to your actual dashboard or home page
  };

  // const handleChat = (userId, appointmentId) => {
  //   setSelectedChat({ userId, appointmentId });
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedChat({ userId: "", appointmentId: "" });
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        My Appointments
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            doctorId={doctorId}
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <Button gradientDuoTone="purpleToBlue" onClick={handleBack}>
          Back to Dashboard
        </Button>
      </div>
      <div className="flex justify-center mt-6">
        <Pagination
          itemsPerPage={appointmentsPerPage}
          totalItems={appointments.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>

      {/* Chat Modal */}
      {/* <Modal show={isModalOpen} onClose={handleCloseModal}>
        <Modal.Body>
          <ChatPage
            receiverId={selectedChat.userId}
            appointmentId={selectedChat.appointmentId}
          />
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

const AppointmentCard = ({ appointment, doctorId }) => {
  const { user, date, startTime, endTime, isBooked } = appointment;
  const patientName = user.name || "Unknown Patient";
  const appointmentDate = formatDate(date);
  const appointmentStartTime = formatTime(startTime);
  const appointmentEndTime = formatTime(endTime);
  const profilePicture =
    user.profilePicture || "https://via.placeholder.com/150"; // Placeholder image if no profile picture
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const startNewChat = async (receiverId, appointmentId) => {
    console.log("receiverId from Appointment", receiverId);
    console.log("AppointmnetId from Appointment", appointmentId);
    try {
      const newChatData = {
        senderId: doctorId,
        receiverId: receiverId,
        appointmentId: appointmentId,
      };
      await createChat(newChatData);
      // const createdChat = await createChat(newChatData);
      // setChats((prevChats) => [...prevChats, createdChat]);
      // setCurrentChat(createdChat);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  return (
    <Card className="shadow-lg p-4">
      <div className="flex items-center mb-4">
        <img
          src={profilePicture}
          alt={patientName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="ml-4">
          <h3 className="text-xl font-semibold">
            Consultation with {patientName}
          </h3>
          <p className="text-gray-600">Date: {appointmentDate}</p>
          <p className="text-gray-600">
            Time: {appointmentStartTime} - {appointmentEndTime}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <Button
          gradientDuoTone="purpleToBlue"
          className="w-full text-center"
          disabled={!isBooked}
        >
          {isBooked ? "View Details" : "Not Booked"}
        </Button>
        <Link to={`/doctor/chat/${user._id}/${appointment._id}`}>
          <Button
            gradientDuoTone="purpleToBlue"
            className="w-full flex items-center justify-center"
            onClick={() => startNewChat(user._id, appointment._id)}
          >
            <p className="mr-2">Message</p>
            <Lottie
              options={defaultOptions}
              width={30}
              style={{ marginBottom: 10 }}
            />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default DocAppointments;
