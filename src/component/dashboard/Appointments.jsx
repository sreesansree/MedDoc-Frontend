// components/Appointment.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Table } from "flowbite-react";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from "../../animations/chatanimation.json";
import { formatTime } from "../../utils/dateUtils";
import { createChat } from "../../api/chatRequest";
import { useSelector } from "react-redux";

// Function to format date to "dd/MM/yyyy"
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if necessary
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);
  const [view, setView] = useState("upcoming");

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const userId = currentUser._id;

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

    const fetchCanceledAppointments = async () => {
      try {
        const respsonse = await axios.get(
          "/api/users/user-canceled-appointments"
        );
        setCanceledAppointments(respsonse.data);
      } catch (error) {
        console.error("Error fetching canceled appointments", error);
      }
    };

    fetchAppointments();
    fetchCanceledAppointments();
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        My Appointments
      </h2>
      <Button
        gradientDuoTone="purpleToBlue"
        onClick={() => navigate("/user/calender")}
      >
        View Calendar
      </Button>
      <div className="flex justify-center gap-4 mb-6 mt-3">
        <Button onClick={() => handleViewChange("upcoming")}>
          Upcoming Appointments
        </Button>
        <Button onClick={() => handleViewChange("completed")}>
          Completed Appointments
        </Button>
        <Button onClick={() => handleViewChange("canceled")}>
          Canceled Appointments
        </Button>
      </div>
      {view === "upcoming" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              // onChat={handleChat}
              userId={userId}
            />
          ))}
        </div>
      )}
      {view === "completed" && (
        <CompletedAppointmentsTable appointments={completedAppointments} />
      )}
      {view === "canceled" && (
        <CanceldAppointmentsTable appointments={canceledAppointments} />
      )}
    </div>
  );
};

const AppointmentCard = ({ appointment, userId }) => {
  const { doctor, date, startTime, endTime, isBooked } = appointment;
  const doctorName = doctor.name || "Unknown Doctor";
  const appointmentDate = formatDate(date);
  const appointmentStartTime = formatTime(startTime);
  const appointmentEndTime = formatTime(endTime);
  const navigate = useNavigate();

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
  const startNewChat = async (receiverId) => {
    console.log("receiverId from Appointment", receiverId);
    // console.log("AppointmnetId from Appointment", appointmentId);
    try {
      const newChatData = {
        senderId: userId,
        receiverId: receiverId,
        // appointmentId: appointmentId,
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
    <Card className="shadow-lg  p-4">
      <div className="flex flex-wrap items-center mb-4">
        <img
          src={profilePicture}
          alt={doctorName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="ml-4 mt-2 md:mt-0">
          <h3 className="text-xl font-semibold">
            Consultation with Dr. {doctorName}
          </h3>
          <p className="text-gray-600">Date: {appointmentDate}</p>
          <p className="text-gray-600">
            Time: {appointmentStartTime} - {appointmentEndTime}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2 ">
        <div className="w-full md:w-auto">
          <Button
            gradientDuoTone="purpleToBlue"
            className="w-full text-center"
            disabled={!isBooked}
            onClick={() => navigate(`/user/appointments/${appointment._id}`)}
          >
            {isBooked ? "View Details" : "Not Booked"}
          </Button>
        </div>
        <div className="w-full md:w-auto flex justify-center items-center">
          {/* <Link to={`/user/chat/${doctor._id}/${appointment._id}`}> */}
          <Link to={`/user/chat/${doctor._id}`}>
            <Button
              gradientDuoTone="purpleToBlue"
              className="w-full text-center h-12 flex items-center justify-center pt-5"
              // onClick={() => startNewChat(doctor._id, appointment._id)}
              onClick={() => startNewChat(doctor._id)}
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

const CompletedAppointmentsTable = ({ appointments }) => (
  <Table hoverable>
    <Table.Head>
      <Table.HeadCell>Doctor</Table.HeadCell>
      <Table.HeadCell>Consultation Time</Table.HeadCell>
      <Table.HeadCell>Prescription</Table.HeadCell>
      <Table.HeadCell>Rating</Table.HeadCell>
    </Table.Head>
    <Table.Body>
      {appointments.map((appointment) => (
        <Table.Row key={appointment._id}>
          <Table.Cell>{appointment?.doctor?.name}</Table.Cell>
          <Table.Cell>{`${formatDate(appointment.date)} ${formatTime(
            appointment.startTime
          )}`}</Table.Cell>
          <Table.Cell>
            <Button gradientDuoTone="purpleToBlue">
              Download Prescription
            </Button>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const CanceldAppointmentsTable = ({ appointments }) => (
  <Table hoverable>
    <Table.Head>
      <Table.HeadCell>Doctor</Table.HeadCell>
      <Table.HeadCell>Time</Table.HeadCell>
      <Table.HeadCell>Reason</Table.HeadCell>
    </Table.Head>
    <Table.Body>
      {appointments.map((appointment) => (
        <Table.Row key={appointment._id}>
          <Table.Cell>{appointment?.doctor?.name}</Table.Cell>
          <Table.Cell>{`${formatDate(appointment.date)} ${formatTime(
            appointment.startTime
          )}`}</Table.Cell>
          <Table.Cell>
            {appointment.cancelReason || "No reason provided"}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

export default Appointment;
