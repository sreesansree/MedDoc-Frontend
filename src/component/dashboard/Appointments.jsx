// components/Appointment.js
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Table, Rating, Badge } from "flowbite-react";
// import axios from "axios";
// import animationData from "../../animations/chatanimation.json";
import { formatTime } from "../../utils/dateUtils";
import { createChat } from "../../api/chatRequest";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
// import api from "../../api/renderApi.js";
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

    const fetchCompletedAppointments = async () => {
      try {
        const response = await axios.get(
          "/api/users/user-completed-appointments"
        );
        setCompletedAppointments(response.data);
      } catch (error) {
        console.error("Error fetching canceled appointments", error);
      }
    };

    fetchAppointments();
    fetchCanceledAppointments();
    fetchCompletedAppointments();
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
  };
  const currentDate = new Date();
  const upComingAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const [startHours, startMinutes] = appointment.startTime.split(":");
    appointmentDate.setHours(startHours);
    appointmentDate.setMinutes(startMinutes);

    // Only return appointments where date and time are in the future
    return appointmentDate > currentDate;
  });
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
        <Button
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
          className={`grid  gap-6 ${
            upComingAppointments.length === 1
              ? "place-items-center  pt-3"
              : "grid-cols-1 md:grid-cols-2  pt-3 "
          } `}
        >
          {upComingAppointments.length > 0 ? (
            upComingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                // onChat={handleChat}
                userId={userId}
              />
            ))
          ) : (
            <p className="flex justify-center">No Upcoming Appointments</p>
          )}
        </div>
      )}
      {view === "completed" && (
        <>
          {completedAppointments.length > 0 ? (
            <CompletedAppointmentsTable appointments={completedAppointments} />
          ) : (
            <p className="flex justify-center">No Completed Appointments</p>
          )}
        </>
      )}
      {view === "canceled" && (
        <>
          {canceledAppointments.length > 0 ? (
            <CanceldAppointmentsTable appointments={canceledAppointments} />
          ) : (
            <p className="flex justify-center">No Canceled Appointments</p>
          )}
        </>
      )}
    </div>
  );
};

const AppointmentCard = ({ appointment, userId }) => {
  const { doctor, date, startTime, endTime, isBooked } = appointment;
  const doctorName = doctor.name || "Unknown Doctor";
  const departmentName = doctor.department?.name || "General"; // Fallback to "General" if no department
  const appointmentDate = formatDate(date);
  const appointmentStartTime = formatTime(startTime);
  const appointmentEndTime = formatTime(endTime);
  const navigate = useNavigate();

  const profilePicture =
    doctor.profilePicture || "https://via.placeholder.com/150";

  const startNewChat = async (receiverId) => {
    try {
      const newChatData = {
        senderId: userId,
        receiverId: receiverId,
      };
      await createChat(newChatData);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img
          src={profilePicture}
          alt={doctorName}
          className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Consultation with Dr. {doctorName}
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {appointmentDate}
            </div>
            <div className="flex items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {appointmentStartTime} - {appointmentEndTime}
            </div>
          </div>
          {departmentName && (
            <div className="mt-2">
              <Badge color="purple" className="w-fit">
                {departmentName}
              </Badge>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button
          gradientDuoTone="purpleToBlue"
          className="w-full sm:w-auto"
          disabled={!isBooked}
          onClick={() => navigate(`/user/appointments/${appointment._id}`)}
        >
          {isBooked ? "View Details" : "Not Booked"}
        </Button>
        <Link to={`/user/chat/${doctor._id}`} className="w-full sm:w-auto">
          <Button
            gradientDuoTone="pinkToOrange"
            className="w-full"
            onClick={() => startNewChat(doctor._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            Message Doctor
          </Button>
        </Link>
      </div>
    </Card>
  );
};

// Add prop type validation
AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    doctor: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      profilePicture: PropTypes.string,
      department: PropTypes.shape({
        name: PropTypes.string,
      }),
      specialization: PropTypes.string,
    }).isRequired,
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isBooked: PropTypes.bool.isRequired,
  }).isRequired,
  userId: PropTypes.string.isRequired,
};

const CompletedAppointmentsTable = ({ appointments }) => {
  const [ratings, setRatings] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState({});

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
    doc.line(20, 32, 190, 32);

    // Prescription Content
    const prescriptionContent = `
      Prescription for ${appointment?.user?.name}
      Date: ${formatDate(appointment?.date)}
      Time: ${formatTime(appointment.startTime)}
    `;

    doc.setFontSize(12);
    doc.text(prescriptionContent, 20, 40);

    // Medicines Section
    const medicines = appointment?.prescription?.medicines || [];
    const startingYPosition = 60;

    doc.text("Medicines:", 20, startingYPosition);
    medicines.forEach((medicine, index) => {
      doc.text(
        `${index + 1}. ${medicine.name} - ${medicine.dosage} - ${
          medicine.instructions
        }`,
        20,
        startingYPosition + (index + 1) * 10
      );
    });

    // Doctor's Notes Section
    const notesStartingY = startingYPosition + medicines.length * 10 + 20;
    doc.text("Doctor's Notes:", 20, notesStartingY);
    doc.text(
      appointment?.prescription?.notes || "No additional notes",
      20,
      notesStartingY + 10
    );

    doc.save(
      `Prescription_${appointment?.user?.name}_${formatDate(
        appointment.date
      )}.pdf`
    );
  };

  useEffect(() => {
    const initialRatings = {};
    const initialSubmittedRatings = {};

    appointments.forEach((appointment) => {
      if (appointment.rating) {
        initialRatings[appointment._id] = appointment.rating;
        initialSubmittedRatings[appointment._id] = true;
      }
    });

    setRatings(initialRatings);
    setSubmittedRatings(initialSubmittedRatings);
  }, [appointments]);

  const handleRatingChange = (appointmentId, value) => {
    setRatings((prev) => ({ ...prev, [appointmentId]: value }));
  };

  const handleSubmitRating = async (appointmentId, doctorId) => {
    const rating = ratings[appointmentId];
    if (!rating) {
      alert("Please select a rating before submitting");
      return;
    }
    try {
      await api.post("/api/users/rate-doctor", {
        appointmentId,
        doctorId,
        rating,
      });
      setSubmittedRatings((prev) => ({ ...prev, [appointmentId]: true }));
      alert("Rating submitted successfully");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    }
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <Table hoverable className="min-w-full">
        <Table.Head className="bg-gray-100">
          <Table.HeadCell className="w-1/4">Doctor</Table.HeadCell>
          <Table.HeadCell className="w-1/4">Consultation Time</Table.HeadCell>
          <Table.HeadCell className="w-1/4">Prescription</Table.HeadCell>
          <Table.HeadCell className="w-1/4">Rating</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {appointments.map((appointment) => {
            const currentRating = ratings[appointment._id] || 0;
            const isSubmitted = submittedRatings[appointment._id];

            return (
              <Table.Row
                key={appointment._id}
                className="bg-white hover:bg-gray-50"
              >
                <Table.Cell className="font-medium text-gray-900">
                  <div className="flex items-center">
                    <img
                      src={
                        appointment.doctor.profilePicture ||
                        "https://via.placeholder.com/150"
                      }
                      alt={appointment.doctor.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    {appointment.doctor.name}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(appointment.date)}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-3 mr-1 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatTime(appointment.startTime)}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    onClick={() => handleDownloadPrescription(appointment)}
                    disabled={!appointment.prescription}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col gap-2">
                    <Rating>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <Rating.Star
                            key={starValue}
                            filled={currentRating >= starValue}
                            onClick={() =>
                              !isSubmitted &&
                              handleRatingChange(appointment._id, starValue)
                            }
                            className={`${
                              !isSubmitted ? "cursor-pointer" : ""
                            }`}
                          />
                        ))}
                      </div>
                    </Rating>
                    <Button
                      gradientDuoTone={
                        isSubmitted ? "greenToBlue" : "purpleToBlue"
                      }
                      onClick={() =>
                        handleSubmitRating(
                          appointment._id,
                          appointment.doctor._id
                        )
                      }
                      disabled={isSubmitted}
                      size="xs"
                      className="w-fit"
                    >
                      {isSubmitted ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Rated
                        </>
                      ) : (
                        "Submit Rating"
                      )}
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

// Add prop type validation
CompletedAppointmentsTable.propTypes = {
  appointments: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    doctor: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      profilePicture: PropTypes.string,
      department: PropTypes.shape({
        name: PropTypes.string,
      }),
      specialization: PropTypes.string,
    }).isRequired,
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isBooked: PropTypes.bool.isRequired,
  }).isRequired,
};
const CanceldAppointmentsTable = ({ appointments }) => (
  <div className="overflow-x-auto shadow-md rounded-lg">
    <Table hoverable className="min-w-full">
      <Table.Head className="bg-gray-100">
        <Table.HeadCell className="w-1/12">Sl. No</Table.HeadCell>
        <Table.HeadCell className="w-3/12">Doctor</Table.HeadCell>
        <Table.HeadCell className="w-3/12">Time</Table.HeadCell>
        <Table.HeadCell className="w-5/12">Reason</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {appointments.map((appointment, index) => (
          <Table.Row
            key={appointment._id}
            className="bg-white hover:bg-gray-50"
          >
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>
              <div className="flex items-center">
                <img
                  src={
                    appointment.doctor.profilePicture ||
                    "https://via.placeholder.com/150"
                  }
                  alt={appointment.doctor.name}
                  className="w-8 h-8 rounded-full mr-3"
                />
                {appointment.doctor.name}
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(appointment.date)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-3 mr-1 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTime(appointment.startTime)}
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="bg-red-50 px-3 py-2 rounded-md text-red-700">
                {appointment.cancelReason || "No reason provided"}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);

// Add prop type validation
CanceldAppointmentsTable.propTypes = {
  appointments: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    doctor: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      profilePicture: PropTypes.string,
      department: PropTypes.shape({
        name: PropTypes.string,
      }),
      specialization: PropTypes.string,
    }).isRequired,
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isBooked: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Appointment;
