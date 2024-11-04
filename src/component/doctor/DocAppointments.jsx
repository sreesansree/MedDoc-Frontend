import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Modal, Table } from "flowbite-react";
import axios from "axios";
import animationData from "../../animations/chatanimation.json";
import Pagination from "../common/Pagination";
// import ChatPage from "../../pages/chat/ChatPage.jsx";
import { useSelector } from "react-redux";
import { createChat } from "../../api/chatRequest.js";
import { jsPDF } from "jspdf";

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
  const [view, setView] = useState("upcoming");
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedChat, setSelectedChat] = useState({
  //   userId: "",
  //   appointmentId: "",
  // });
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
        // console.log("response : ",response.data)
        // console.log("sorted : ",sortedAppointments)
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };
    const fetchCanceledAppointments = async () => {
      try {
        const respsonse = await axios.get(
          "/api/doctor/doctor-canceled-appointments"
        );
        setCanceledAppointments(respsonse.data);
      } catch (error) {
        console.error(
          "Error fetching canceled appointments",
          error.response?.data || error.message
        );
      }
    };

    const fetchCompletedAppointments = async () => {
      try {
        const response = await axios.get(
          "/api/doctor/doctor-completed-appointments"
        );
        // console.log("Completed Appointments : ", response.data);
        setCompletedAppointments(response.data);
      } catch (error) {
        console.error(
          "Error fetching completed appointments",
          error.response?.data || error.message
        );
      }
    };

    fetchAppointments();
    fetchCompletedAppointments();
    fetchCanceledAppointments();
  }, []); // Only runs on mount

  const handleViewChange = (newView) => {
    setView(newView);
  };
  const currentDate = new Date();
// console.log("apointments :",appointments)
  // Calculate the indexes for slicing
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  // console.log("current appointments :",currentAppointments )
  const upcomingAppointments = currentAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const [startHours, startMinutes] = appointment.startTime.split(":");
    appointmentDate.setHours(startHours);
    appointmentDate.setMinutes(startMinutes);

    // Only return appointments where date and time are in the future
    return appointmentDate > currentDate;
  });
  // console.log("uPcoming appointments :",upcomingAppointments)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBack = () => {
    navigate("/doctor"); // Adjust this route to your actual dashboard or home page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6 opacity-80 hover:opacity-100 scale-105">
        My Appointments
      </h2>
      <div className="flex justify-center gap-4 mb-6 mt-3">
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={() => handleViewChange("upcoming")}
          className={`${
            view === "upcoming"
              ? "opacity-100 scale-105"
              : "opacity-30 hover:opacity-80"
          }`}
        >
          Upcoming Appointments
        </Button>
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={() => handleViewChange("completed")}
          className={`${
            view === "completed"
              ? "opacity-100 scale-105"
              : "opacity-30  hover:opacity-80"
          }`}
        >
          Completed Appointments
        </Button>
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={() => handleViewChange("canceled")}
          className={`${
            view === "canceled"
              ? "opacity-100 scale-105"
              : "opacity-30  hover:opacity-80 "
          }`}
        >
          Canceled Appointments
        </Button>
      </div>
      {view === "upcoming" && (
        <div
          className={`grid gap-6 ${
            upcomingAppointments.length === 1
              ? "grid-cols-1 place-items-center" // Center the single card
              : "grid-cols-1 md:grid-cols-2" // Regular grid layout for more than one card
          }`}
        >
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                doctorId={doctorId}
              />
            ))
          ) : (
            <p className="flex justify-center">No Upcoming Appointments</p>
          )}
        </div>
      )}
      {view === "completed" && (
        <div>
          {completedAppointments.length > 0 ? (
            <CompletedAppointmentsTable appointments={completedAppointments} />
          ) : (
            <p className="flex justify-center">No Completed Appointments</p>
          )}
        </div>
      )}
      {view === "canceled" && (
        <div>
          {canceledAppointments.length > 0 ? (
            <CanceldAppointmentsTable appointments={canceledAppointments} />
          ) : (
            <p className="flex justify-center">No Canceled Appointments</p>
          )}
        </div>
      )}

      <div className=" flex text-center mt-8 justify-center">
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
  const navigate = useNavigate();

  const startNewChat = async (receiverId) => {
    try {
      const newChatData = {
        senderId: doctorId,
        receiverId: receiverId,
      };
      await createChat(newChatData);
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
          onClick={() => navigate(`/doctor/appointments/${appointment._id}`)}
        >
          {isBooked ? "View Details" : "Not Booked"}
        </Button>
        {/* <Link to={`/doctor/chat/${user._id}/${appointment._id}`}>  */}
        <Link to={`/doctor/chat/${user._id}`}>
          <Button
            gradientDuoTone="purpleToBlue"
            className="w-full flex items-center justify-center"
            onClick={() => startNewChat(user._id)}
          >
            <p className="mr-2">Message</p>
          </Button>
        </Link>
      </div>
    </Card>
  );
};

const CompletedAppointmentsTable = ({ appointments }) => {
  const handleDownloadPrescription = (appointment) => {
    const doc = new jsPDF();

    if (!appointment?.prescription) {
      alert("No prescription data found for this appointment");
      return;
    }

    // Add Company Details on the Right Side
    doc.setFontSize(16);
    doc.text("MedDoc", 190, 20, { align: "right" });
    doc.setFontSize(10);
    doc.text("MedDoc@company.com | +123456789", 190, 26, { align: "right" });

    // Add Doctor Details on the Left Side
    doc.setFontSize(12);
    doc.text(`Doctor: ${appointment?.doctor?.name}`, 20, 20);
    doc.text(`Email: ${appointment?.doctor?.email}`, 20, 26);

    // Draw a Horizontal Line under Header
    doc.line(20, 32, 190, 32); // Line at Y = 32

    // Prescription Content - Add Below Header
    const prescriptionContent = `
      Prescription for ${appointment?.user?.name}
      Date: ${formatDate(appointment?.date)}
      Time: ${formatTime(appointment.startTime)}
    `;

    // Adding the prescription content to the PDF
    doc.setFontSize(12);
    doc.text(prescriptionContent, 20, 40); // Start slightly below the line (Y = 40)

    // Medicines Section
    const medicines = appointment?.prescription?.medicines || [];
    const startingYPosition = 60; // Start medicines list at Y = 60 for better spacing

    // List each medicine with proper spacing
    doc.text("Medicines:", 20, startingYPosition); // Label for Medicines
    medicines.forEach((medicine, index) => {
      doc.text(
        `${index + 1}. ${medicine.name} - ${medicine.dosage} - ${
          medicine.instructions
        }`,
        20,
        startingYPosition + (index + 1) * 10 // Position each medicine below the label
      );
    });

    // Doctor's Notes Section
    const notesStartingY = startingYPosition + medicines.length * 10 + 20; // Adjust based on medicine list length
    doc.text("Doctor's Notes:", 20, notesStartingY);
    doc.text(
      appointment?.prescription?.notes || "No additional notes",
      20,
      notesStartingY + 10
    );

    // Save the PDF with a descriptive file name
    doc.save(
      `Prescription_${appointment?.user?.name}_${formatDate(
        appointment.date
      )}.pdf`
    );
  };

  return (
    <>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Patient</Table.HeadCell>
          <Table.HeadCell>Consultation Date & Time</Table.HeadCell>
          <Table.HeadCell>Prescription</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {appointments.map((appointment) => (
            <Table.Row key={appointment._id}>
              <Table.Cell>{appointment?.user?.name}</Table.Cell>
              <Table.Cell>{`${formatDate(appointment.date)} ${formatTime(
                appointment.startTime
              )}`}</Table.Cell>
              <Table.Cell>
                <Button
                  gradientDuoTone="purpleToBlue"
                  onClick={() => handleDownloadPrescription(appointment)}
                >
                  Download Prescription{" "}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

const CanceldAppointmentsTable = ({ appointments }) => (
  <Table hoverable>
    <Table.Head>
      <Table.HeadCell>Patient</Table.HeadCell>
      <Table.HeadCell>Time</Table.HeadCell>
      <Table.HeadCell>Reason</Table.HeadCell>
    </Table.Head>
    <Table.Body>
      {appointments.map((appointment) => (
        <Table.Row key={appointment._id}>
          <Table.Cell>{appointment?.user?.name}</Table.Cell>
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

export default DocAppointments;
