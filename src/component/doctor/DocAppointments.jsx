import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Table, Tooltip } from "flowbite-react";
import {
  FiDownload,
  FiFileText,
  FiUser,
  FiMessageSquare,
  FiCalendar,
  FiClock,
  FiAlertTriangle,
  FiArrowDown,
  FiArrowLeft,
  FiXCircle,
  FiCheckCircle,
} from "react-icons/fi";
// import animationData from "../../animations/chatanimation.json";
import Pagination from "../common/Pagination";
import { useSelector } from "react-redux";
import { createChat } from "../../api/chatRequest.js";
import { jsPDF } from "jspdf";
import axios from "axios";
import PropTypes from "prop-types";

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
  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);
  const [canceledCurrentPage, setCanceledCurrentPage] = useState(1);
  const [appointmentsPerTable] = useState(5);

  const { currentDoctor } = useSelector((state) => state.doctor);
  const doctorId = currentDoctor._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/doctor/doctor-appointments");
        // const sortedAppointments = response.data.sort((a, b) => {
        //   const dateTimeA = new Date(a.date + "T" + a.startTime);
        //   const dateTimeB = new Date(b.date + "T" + b.startTime);
        //   return dateTimeA - dateTimeB;
        // }); // from backend already sorted
        // console.log("Response Data", response.data);
        // console.log("Sorted Data", sortedAppointments);

        setAppointments(response.data);
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

        // Sort by date and time (newest first)
        const sortedData = response.data.sort((a, b) => {
          // Helper function to create date objects safely
          const createDate = (item) => {
            try {
              if (!item.date || !item.endTime) return new Date(0); // Default to epoch if missing

              // Combine date and time (assuming date is ISO format and time is HH:mm)
              const dateStr = `${item.date.split("T")[0]}T${item.endTime}`;
              const date = new Date(dateStr);

              // If date is invalid, return epoch
              return isNaN(date.getTime()) ? new Date(0) : date;
            } catch {
              return new Date(0);
            }
          };

          const dateA = createDate(a);
          const dateB = createDate(b);

          return dateB - dateA; // Descending order
        });
        setCompletedAppointments(sortedData);
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
  // Calculate the indexes for slicing
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
          My Appointments
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
          Manage your upcoming, completed, and canceled consultations
        </p>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => handleViewChange("upcoming")}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            view === "upcoming"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900 transform scale-105"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <FiCalendar className="w-5 h-5" />
            Upcoming
          </div>
        </button>

        <button
          onClick={() => handleViewChange("completed")}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            view === "completed"
              ? "bg-green-600 text-white shadow-lg shadow-green-100 dark:shadow-green-900 transform scale-105"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5" />
            Completed
          </div>
        </button>

        <button
          onClick={() => handleViewChange("canceled")}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            view === "canceled"
              ? "bg-red-600 text-white shadow-lg shadow-red-100 dark:shadow-red-900 transform scale-105"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <FiXCircle className="w-5 h-5" />
            Canceled
          </div>
        </button>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Upcoming Appointments */}
        {view === "upcoming" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <FiCalendar className="text-indigo-600 dark:text-indigo-400" />
                Upcoming Consultations
              </h3>
              {upcomingAppointments.length > 0 ? (
                <div
                  className={`mt-6 grid gap-6 ${
                    upcomingAppointments.length === 1
                      ? "max-w-md mx-auto"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      doctorId={doctorId}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center py-12">
                  <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    No upcoming appointments
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    You don't have any scheduled consultations yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completed Appointments */}
        {view === "completed" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <FiCheckCircle className="text-green-600 dark:text-green-400" />
                Completed Consultations
              </h3>
              {completedAppointments.length > 0 ? (
                <CompletedAppointmentsTable
                  appointments={completedAppointments}
                />
              ) : (
                <div className="mt-6 text-center py-12">
                  <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    No completed appointments
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Your completed consultations will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canceled Appointments */}
        {view === "canceled" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <FiXCircle className="text-red-600 dark:text-red-400" />
                Canceled Consultations
              </h3>
              {canceledAppointments.length > 0 ? (
                <CancelledAppointmentsTable
                  appointments={canceledAppointments}
                />
              ) : (
                <div className="mt-6 text-center py-12">
                  <FiXCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    No canceled appointments
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    No consultations have been canceled.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <FiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </div>
        </button>
      </div>

      {/* Pagination - Only show if needed */}
      {appointments.length > appointmentsPerPage && (
        <div className="mt-8 flex justify-center">
          <Pagination
            itemsPerPage={appointmentsPerPage}
            totalItems={appointments.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

// const AppointmentCard = ({ appointment, doctorId }) => {
//   const { user, date, startTime, endTime, isBooked } = appointment;

//   const patientName = user.name || "Unknown Patient";
//   const appointmentDate = formatDate(date);
//   const appointmentStartTime = formatTime(startTime);
//   const appointmentEndTime = formatTime(endTime);
//   const profilePicture =
//     user.profilePicture || "https://via.placeholder.com/150"; // Placeholder image if no profile picture

//   const navigate = useNavigate();

//   const startNewChat = async (receiverId) => {
//     try {
//       const newChatData = {
//         senderId: doctorId,
//         receiverId: receiverId,
//       };
//       await createChat(newChatData);
//     } catch (error) {
//       console.error("Error starting new chat:", error);
//     }
//   };

//   return (
//     <Card className="shadow-lg p-4">
//       <div className="flex items-center mb-4">
//         <img
//           src={profilePicture}
//           alt={patientName}
//           className="w-16 h-16 rounded-full object-cover"
//         />
//         <div className="ml-4">
//           <h3 className="text-xl font-semibold">
//             Consultation with {patientName}
//           </h3>
//           <p className="text-gray-600">Date: {appointmentDate}</p>
//           <p className="text-gray-600">
//             Time: {appointmentStartTime} - {appointmentEndTime}
//           </p>
//         </div>
//       </div>
//       <div className="flex justify-between gap-4">
//         <Button
//           gradientDuoTone="purpleToBlue"
//           className="w-full text-center"
//           disabled={!isBooked}
//           onClick={() => navigate(`/doctor/appointments/${appointment._id}`)}
//         >
//           {isBooked ? "View Details" : "Not Booked"}
//         </Button>
//         {/* <Link to={`/doctor/chat/${user._id}/${appointment._id}`}>  */}
//         <Link to={`/doctor/chat/${user._id}`}>
//           <Button
//             gradientDuoTone="purpleToBlue"
//             className="w-full flex items-center justify-center"
//             onClick={() => startNewChat(user._id)}
//           >
//             <p className="mr-2">Message</p>
//           </Button>
//         </Link>
//       </div>
//     </Card>
//   );
// };

const AppointmentCard = ({ appointment, doctorId }) => {
  const { user, date, startTime, endTime, isBooked, status } = appointment;

  const patientName = user.name || "Unknown Patient";
  const appointmentDate = formatDate(date);
  const appointmentStartTime = formatTime(startTime);
  const appointmentEndTime = formatTime(endTime);
  const profilePicture =
    user.profilePicture || "https://via.placeholder.com/150";

  const navigate = useNavigate();

  const startNewChat = async (receiverId) => {
    try {
      const newChatData = { senderId: doctorId, receiverId };
      await createChat(newChatData);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-start p-5">
        <div className="relative">
          <img
            src={profilePicture}
            alt={patientName}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
          />
          {isBooked && (
            <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Booked
            </span>
          )}
        </div>

        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800">{patientName}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                status === "upcoming"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center text-gray-600">
              <FiCalendar className="w-4 h-4 mr-2" />
              <span>{appointmentDate}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiClock className="w-4 h-4 mr-2" />
              <span>
                {appointmentStartTime} - {appointmentEndTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex space-x-3">
          <Button
            onClick={() => navigate(`/doctor/appointments/${appointment._id}`)}
            disabled={!isBooked}
            className={`flex-1 ${
              !isBooked
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } py-2 rounded-lg font-medium transition-colors`}
          >
            {isBooked ? "View Details" : "Unavailable"}
          </Button>

          <Link
            to={`/doctor/chat/${user._id}`}
            className="flex-1"
            onClick={() => startNewChat(user._id)}
          >
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
              <FiMessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      profilePicture: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isBooked: PropTypes.bool.isRequired,
    status: PropTypes.string,
    // Add other appointment properties you use
  }).isRequired,
  doctorId: PropTypes.string.isRequired,
};

// const CompletedAppointmentsTable = ({ appointments }) => {
//   const handleDownloadPrescription = (appointment) => {
//     const doc = new jsPDF();

//     if (!appointment?.prescription) {
//       alert("No prescription data found for this appointment");
//       return;
//     }

//     // Add Company Details on the Right Side
//     doc.setFontSize(16);
//     doc.text("MedDoc", 190, 20, { align: "right" });
//     doc.setFontSize(10);
//     doc.text("MedDoc@company.com | +123456789", 190, 26, { align: "right" });

//     // Add Doctor Details on the Left Side
//     doc.setFontSize(12);
//     doc.text(`Doctor: ${appointment?.doctor?.name}`, 20, 20);
//     doc.text(`Email: ${appointment?.doctor?.email}`, 20, 26);

//     // Draw a Horizontal Line under Header
//     doc.line(20, 32, 190, 32); // Line at Y = 32

//     // Prescription Content - Add Below Header
//     const prescriptionContent = `
//       Prescription for ${appointment?.user?.name}
//       Date: ${formatDate(appointment?.date)}
//       Time: ${formatTime(appointment.startTime)}
//     `;

//     // Adding the prescription content to the PDF
//     doc.setFontSize(12);
//     doc.text(prescriptionContent, 20, 40); // Start slightly below the line (Y = 40)

//     // Medicines Section
//     const medicines = appointment?.prescription?.medicines || [];
//     const startingYPosition = 60; // Start medicines list at Y = 60 for better spacing

//     // List each medicine with proper spacing
//     doc.text("Medicines:", 20, startingYPosition); // Label for Medicines
//     medicines.forEach((medicine, index) => {
//       doc.text(
//         `${index + 1}. ${medicine.name} - ${medicine.dosage} - ${
//           medicine.instructions
//         }`,
//         20,
//         startingYPosition + (index + 1) * 10 // Position each medicine below the label
//       );
//     });

//     // Doctor's Notes Section
//     const notesStartingY = startingYPosition + medicines.length * 10 + 20; // Adjust based on medicine list length
//     doc.text("Doctor's Notes:", 20, notesStartingY);
//     doc.text(
//       appointment?.prescription?.notes || "No additional notes",
//       20,
//       notesStartingY + 10
//     );

//     // Save the PDF with a descriptive file name
//     doc.save(
//       `Prescription_${appointment?.user?.name}_${formatDate(
//         appointment.date
//       )}.pdf`
//     );
//   };

//   return (
//     <>
//       <Table hoverable>
//         <Table.Head>
//           <Table.HeadCell>Patient</Table.HeadCell>
//           <Table.HeadCell>Consultation Date & Time</Table.HeadCell>
//           <Table.HeadCell>Prescription</Table.HeadCell>
//         </Table.Head>
//         <Table.Body>
//           {appointments.map((appointment) => (
//             <Table.Row key={appointment._id}>
//               <Table.Cell>{appointment?.user?.name}</Table.Cell>
//               <Table.Cell>{`${formatDate(appointment.date)} ${formatTime(
//                 appointment.startTime
//               )}`}</Table.Cell>
//               <Table.Cell>
//                 <Button
//                   gradientDuoTone="purpleToBlue"
//                   onClick={() => handleDownloadPrescription(appointment)}
//                 >
//                   Download Prescription{" "}
//                 </Button>
//               </Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table>
//     </>
//   );
// };

const CompletedAppointmentsTable = ({ appointments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  // Calculate pagination for completed appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const handleDownloadPrescription = (appointment) => {
    if (!appointment?.prescription) {
      alert("No prescription data found for this appointment");
      return;
    }

    const doc = new jsPDF();

    // Styling variables
    const primaryColor = "#4f46e5"; // indigo-600
    const secondaryColor = "#6b7280"; // gray-500
    const margin = 20;
    let yPosition = 20;

    // Add header with logo and details
    doc.setFillColor(239, 246, 255); // bg-indigo-50
    doc.rect(0, 0, 210, 40, "F");

    // Clinic/Hospital Logo (placeholder)
    // doc.addImage(logoImage, 'PNG', margin, 10, 30, 15);
    // MEDDOC text logo with styling
    doc.setFontSize(20);
    doc.setTextColor(primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("MEDDOC", margin, yPosition + 15);

    // Add decorative line under logo
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 18, margin + 40, yPosition + 18);

    // Clinic Details
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    doc.text("Quality Healthcare Services", margin, yPosition + 25);
    doc.text(
      "123 Medical Drive, Health City | +91 8593986355",
      margin + 35,
      yPosition + 16
    );

    // Doctor Details
    doc.setFontSize(11);
    doc.text(
      `Prescribed by: Dr. ${appointment?.doctor?.name}`,
      margin,
      yPosition + 30
    );
    doc.text(
      `License: ${appointment?.doctor?.license || "MD12345"}`,
      margin,
      yPosition + 36
    );

    // Patient Details
    doc.text(`Patient: ${appointment?.user?.name}`, 150, yPosition + 30);
    doc.text(
      `DOB: ${appointment?.user?.dob || "Not specified"}`,
      150,
      yPosition + 36
    );

    // Divider line
    doc.setDrawColor(primaryColor);
    doc.line(margin, yPosition + 42, 210 - margin, yPosition + 42);

    // Prescription Details
    yPosition += 50;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // black
    doc.text(
      `Consultation Date: ${formatDate(appointment.date)}`,
      margin,
      yPosition
    );
    doc.text(
      `Time: ${formatTime(appointment.startTime)} - ${formatTime(
        appointment.endTime
      )}`,
      margin,
      yPosition + 7
    );

    // Medicines Section
    yPosition += 20;
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text("PRESCRIPTION", margin, yPosition);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const medicines = appointment?.prescription?.medicines || [];
    medicines.forEach((medicine, index) => {
      yPosition += 10;
      doc.setFont("helvetica", "bold");
      doc.text(`${medicine.name}`, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(`Dosage: ${medicine.dosage}`, margin + 50, yPosition);
      // doc.text(`Duration: ${medicine.duration} `, margin + 100, yPosition);
      yPosition += 6;
      doc.text(`Instructions: ${medicine.instructions}`, margin, yPosition);
      if (index < medicines.length - 1) {
        yPosition += 4;
        doc.line(margin, yPosition + 2, 210 - margin, yPosition + 2);
        yPosition += 6;
      }
    });

    // Doctor's Notes
    if (appointment?.prescription?.notes) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.setTextColor(primaryColor);
      doc.text("DOCTOR NOTES", margin, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const splitNotes = doc.splitTextToSize(
        appointment.prescription.notes,
        170
      );
      splitNotes.forEach((line) => {
        yPosition += 7;
        doc.text(line, margin, yPosition);
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    doc.text("This is an electronically generated prescription", margin, 280);
    doc.text("Valid without signature", 150, 280);

    // Save PDF
    doc.save(
      `Prescription_${appointment.user.name}_${formatDate(
        appointment.date
      )}.pdf`
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table hoverable className="min-w-full divide-y divide-gray-200">
        <Table.Head className="bg-gray-50">
          <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              <FiUser className="mr-2" /> Patient
            </div>
          </Table.HeadCell>
          <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              <FiCalendar className="mr-2" />{" "}
              <span className="mr-1">Date & Time</span>
              <FiArrowDown className="text-blue-500" />
            </div>
          </Table.HeadCell>
          <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              <FiFileText className="mr-2" /> Prescription
            </div>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="bg-white divide-y divide-gray-200">
          {currentAppointments.map((appointment) => (
            <Table.Row key={appointment._id} className="hover:bg-gray-50">
              <Table.Cell className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={
                        appointment.user.profilePicture ||
                        "https://via.placeholder.com/150"
                      }
                      alt={appointment.user.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.user.email}
                    </div>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(appointment.date)}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <FiClock className="mr-1" />
                  {formatTime(appointment.startTime)} -{" "}
                  {formatTime(appointment.endTime)}
                </div>
              </Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">
                <Tooltip
                  content={
                    appointment.prescription
                      ? "Download prescription"
                      : "No prescription available"
                  }
                >
                  <Button
                    gradientDuoTone={
                      appointment.prescription ? "purpleToBlue" : "grayToGray"
                    }
                    onClick={() => handleDownloadPrescription(appointment)}
                    disabled={!appointment.prescription}
                    className="flex items-center"
                  >
                    <FiDownload className="mr-2" />
                    {appointment.prescription ? "Download" : "Not Available"}
                  </Button>
                </Tooltip>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {/* Pagination for this table */}
      {appointments.length > appointmentsPerPage && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstAppointment + 1} to{" "}
            {Math.min(indexOfLastAppointment, appointments.length)} of{" "}
            {appointments.length} entries
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="xs"
              color="light"
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              size="xs"
              color="light"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {appointments.length === 0 && (
        <div className="text-center py-8 bg-gray-50">
          <p className="text-gray-500">No completed appointments found</p>
        </div>
      )}
    </div>
  );
};
CompletedAppointmentsTable.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
        profilePicture: PropTypes.string,
        dob: PropTypes.string,
      }).isRequired,
      doctor: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
        license: PropTypes.string,
      }).isRequired,
      date: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      prescription: PropTypes.shape({
        medicines: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            dosage: PropTypes.string.isRequired,
            instructions: PropTypes.string.isRequired,
          })
        ),
        notes: PropTypes.string,
      }),
    })
  ).isRequired,
};

const CancelledAppointmentsTable = ({ appointments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  // Calculate pagination for canceled appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table hoverable className="min-w-full divide-y divide-gray-200">
        <Table.Head className="bg-gray-50">
          <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              <FiUser className="mr-2" /> Patient
            </div>
          </Table.HeadCell>
          <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              <FiClock className="mr-2" /> Date & Time
            </div>
          </Table.HeadCell>
          <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              <FiAlertTriangle className="mr-2" /> Cancellation Details
            </div>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="bg-white divide-y divide-gray-200">
          {currentAppointments.map((appointment) => (
            <Table.Row key={appointment._id} className="hover:bg-red-50">
              <Table.Cell className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={
                        appointment.user.profilePicture ||
                        "https://via.placeholder.com/150"
                      }
                      alt={appointment.user.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.user.email}
                    </div>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(appointment.date)}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <FiClock className="mr-1" />
                  {formatTime(appointment.startTime)}
                </div>
              </Table.Cell>
              <Table.Cell className="px-6 py-4">
                <Tooltip
                  content={appointment.cancelReason || "No reason provided"}
                >
                  <div
                    className={`text-sm ${
                      appointment.cancelReason
                        ? "text-red-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {appointment.cancelReason
                      ? appointment.cancelReason.length > 30
                        ? `${appointment.cancelReason.substring(0, 30)}...`
                        : appointment.cancelReason
                      : "No reason provided"}
                  </div>
                </Tooltip>
                {appointment.cancelledBy && (
                  <div className="text-xs text-gray-500 mt-1">
                    Cancelled by: {appointment.cancelledBy}
                  </div>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {/* Pagination for this table */}
      {appointments.length > appointmentsPerPage && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstAppointment + 1} to{" "}
            {Math.min(indexOfLastAppointment, appointments.length)} of{" "}
            {appointments.length} entries
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="xs"
              color="light"
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              size="xs"
              color="light"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {appointments.length === 0 && (
        <div className="text-center py-8 bg-gray-50">
          <p className="text-gray-500">No cancelled appointments found</p>
        </div>
      )}
    </div>
  );
};

CancelledAppointmentsTable.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
        profilePicture: PropTypes.string,
      }).isRequired,
      date: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      cancelReason: PropTypes.string,
      cancelledBy: PropTypes.oneOf(["patient", "doctor", "system"]),
    })
  ).isRequired,
};

export default DocAppointments;
