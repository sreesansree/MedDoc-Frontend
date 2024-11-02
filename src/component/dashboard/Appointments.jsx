// components/Appointment.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Table, Rating, RatingStar } from "flowbite-react";
import axios from "axios";
import animationData from "../../animations/chatanimation.json";
import { formatTime } from "../../utils/dateUtils";
import { createChat } from "../../api/chatRequest";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";

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
              onClick={() => startNewChat(doctor._id)}
            >
              <p className="mr-2">Message </p>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

const CompletedAppointmentsTable = ({ appointments }) => {
  const [ratings, setRatings] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState({}); // Track submitted ratings

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

  //Fetch saved ratings from the backend if available
  // useEffect(() => {
  //   const intitialRatings = {};
  //   const initialSubmittedRatings = {};
  //   appointments.forEach((appointment) => {
  //     if (appointment.doctor?.averageRating) {
  //       intitialRatings[appointment._id] = appointment?.doctor?.averageRating;
  //       // Assume the rating is already submitted if averageRating exists
  //       initialSubmittedRatings[appointment._id] = true;
  //     }
  //   });
  //   setRatings(intitialRatings);
  //   setSubmittedRatings(initialSubmittedRatings);
  // }, [appointments]);
  
  useEffect(() => {
    const initialRatings = {};
    const initialSubmittedRatings = {};
  
    appointments.forEach((appointment) => {
      if (appointment.rating) {
        initialRatings[appointment._id] = appointment.rating;
        initialSubmittedRatings[appointment._id] = true; // Mark as submitted if rating exists
      }
    });
  
    setRatings(initialRatings);
    setSubmittedRatings(initialSubmittedRatings);
  }, [appointments]);


  // Update local rating state
  const handleRatingChange = (appointmentId, value) => {
    setRatings((prev) => ({ ...prev, [appointmentId]: value }));
  };

  // Submit the rating to the server
  const handleSubmitRating = async (appointmentId, doctorId) => {
    const rating = ratings[appointmentId];
    if (!rating) {
      alert("Please select a rating before submitting");
      return;
    }
    try {
      await axios.post("/api/users/rate-doctor", {
        appointmentId,
        doctorId,
        rating,
      });

      alert("Rating submitted successfully");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    }
  };

  return (
    <>
      <Table>
        <Table.Head>
          <Table.HeadCell>Doctor</Table.HeadCell>
          <Table.HeadCell>Consultation Time</Table.HeadCell>
          <Table.HeadCell>Prescription</Table.HeadCell>
          <Table.HeadCell>Rating</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {appointments.map((appointment) => {
            // Get the saved rating from the backend or local state
            const currentRating = ratings[appointment._id] || 0;
            // Check if the rating is already submitted for this appointment
            const isSubmitted = submittedRatings[appointment._id];

            return (
              <Table.Row key={appointment._id}>
                <Table.Cell>{appointment?.doctor?.name}</Table.Cell>
                <Table.Cell>{`${formatDate(appointment.date)} ${formatTime(
                  appointment.startTime
                )}`}</Table.Cell>
                <Table.Cell>
                  <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={() => handleDownloadPrescription(appointment)}
                  >
                    Download Prescription
                  </Button>
                </Table.Cell>
                <Table.Cell className="flex flex-col gap-2">
                  {/* Display doctor average rating */}
                  <div className="flex">
                    {/* Rating component for selecting feedback */}
                    <Rating>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <Rating.Star
                            key={starValue}
                            filled={currentRating >= starValue} // Fill stars based on saved rating
                            onClick={() =>
                              handleRatingChange(appointment._id, starValue)
                            }
                            className="cursor-pointer"
                          />
                        ))}
                      </div>
                    </Rating>
                    <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {appointment?.doctor?.averageRating
                        ? `${appointment.doctor.averageRating.toFixed(
                            1
                          )} out of 5`
                        : "Not rated yet"}
                    </p>
                  </div>

                  {/* Button to submit rating */}
                  <Button
                    gradientDuoTone={"purpleToBlue"}
                    onClick={() =>
                      handleSubmitRating(
                        appointment._id,
                        appointment.doctor._id
                      )
                    }
                    disabled={isSubmitted} // Disable button if rating is submitted
                    size={"sm"}
                  >
                    {isSubmitted ? "Rating Submitted" : "Submit Rating"}
                     
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};

const CanceldAppointmentsTable = ({ appointments }) => (
  <Table hoverable>
    <Table.Head>
      <Table.HeadCell>Sl .No</Table.HeadCell>
      <Table.HeadCell>Doctor</Table.HeadCell>
      <Table.HeadCell>Time</Table.HeadCell>
      <Table.HeadCell>Reason</Table.HeadCell>
    </Table.Head>
    <Table.Body>
      {appointments.map((appointment, index) => (
        <Table.Row key={appointment._id}>
          <Table.Cell>{index + 1}</Table.Cell>
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
