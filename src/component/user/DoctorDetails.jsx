import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import { Button, Card } from "flowbite-react";
import { AiOutlineCalendar } from "react-icons/ai";
import AlertModal from "../dashboard/AlertModal.jsx"; // Import the AlertModal component
import api from "../../api/renderApi.js";

// // Function to format date to "dd/MM/yyyy"
// const formatDate = (date) => {
//   const d = new Date(date);
//   const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if necessary
//   const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//   const year = d.getFullYear();
//   return `${day}/${month}/${year}`;
// };

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Function to format date to "dd/MM/yyyy"
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if necessary
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorResponse = await api.get(`/api/users/doctor/${id}`);
        setDoctor(doctorResponse.data);

        const slotsResponse = await api.get(`/api/doctor/slots/${id}`);
        const now = new Date();

        // Combine date and time for sorting
        const validSlots = slotsResponse.data
          .filter((slot) => {
            const slotDate = new Date(slot.date);
            const slotStartTime = new Date(`1970-01-01T${slot.startTime}:00`);
            const slotStartDateTime = new Date(
              slotDate.setHours(
                slotStartTime.getHours(),
                slotStartTime.getMinutes()
              )
            );
            return slotStartDateTime >= now && slot.status !== "completed";
          })
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const timeA = new Date(`1970-01-01T${a.startTime}:00`);
            const dateTimeA = new Date(
              dateA.setHours(timeA.getHours(), timeA.getMinutes())
            );

            const dateB = new Date(b.date);
            const timeB = new Date(`1970-01-01T${b.startTime}:00`);
            const dateTimeB = new Date(
              dateB.setHours(timeB.getHours(), timeB.getMinutes())
            );

            return dateTimeA - dateTimeB;
          });

        setSlots(validSlots);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hours24 = parseInt(hours, 10);
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  };

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      alert("Please select a slot.");
      return;
    }

    try {
      if (selectedSlot.isBooked) {
        setModalMessage("Slot already booked");
        setShowModal(true);
        return;
      }

      navigate(`/user/payment/${selectedSlot._id}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100">
      {doctor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg dark:bg-gray-800 dark:text-gray-100">
            <img
              className="w-48 h-48 rounded-full mx-auto"
              src={doctor.profilePicture || "/default-avatar.png"}
              alt={doctor.name}
            />
            <h2 className="text-2xl font-semibold text-center mt-4">
              {doctor.name}
            </h2>
            <p className="text-gray-500 text-center dark:text-gray-400">
              Experience: {doctor.experience} years
            </p>
            <p className="text-gray-500 text-center dark:text-gray-400">
              Rating: {doctor.averageRating} / 5
            </p>
            <p className="text-gray-500 text-center dark:text-gray-400">
              Department: {doctor?.department?.name || "N/A"}
            </p>
          </Card>
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center dark:text-gray-100">
              <AiOutlineCalendar className="mr-2 text-gray-500 dark:text-gray-300" />
              Available Slots
            </h3>
            <div className="flex justify-start m-5 gap-3">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <div
                    key={slot._id}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      slot.isBooked
                        ? "bg-red-200 dark:bg-red-900  cursor-not-allowed"
                        : selectedSlot?._id === slot._id
                        ? "bg-gray-300 dark:bg-gray-600"
                        : "bg-white dark:bg-green-800"
                    }`}
                    onClick={() => !slot.isBooked && handleSlotSelection(slot)}
                  >
                    <p className="text-gray-800 dark:text-gray-300">
                      Date: {formatDate(slot.date)}
                    </p>
                    <p className="text-gray-800 dark:text-gray-300">
                      Time: {formatTime(slot.startTime)} -{" "}
                      {formatTime(slot.endTime)}
                    </p>
                    <p className="text-gray-800 dark:text-gray-300">
                      Price: ₹{slot.price}
                    </p>
                    <p
                      className={`text-gray-800 dark:text-gray-300 ${
                        slot.isBooked
                          ? "text-red-500 dark:text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {slot.isBooked ? "Booked" : "Available"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No Available Slots</p>
              )}
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              className="mt-4"
              onClick={handleBookAppointment}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      )}
      <AlertModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default DoctorDetails;
