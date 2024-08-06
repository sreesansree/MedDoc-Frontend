// components/DoctorDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card } from "flowbite-react";
import { AiOutlineCalendar } from "react-icons/ai";

const DoctorDetails = () => {
  const { id } = useParams();
  //   console.log(id, "useParams id");
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  console.log(selectedSlot, "selectedSlottt");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorResponse = await axios.get(`/api/admin/doctors/${id}`);
        setDoctor(doctorResponse.data);
        console.log("response data : ", doctorResponse.data);

        const slotsResponse = await axios.get(`/api/doctor/slots/${id}`);
        setSlots(slotsResponse.data);
        console.log('SlotResponse : ',slotsResponse.data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      alert("Please select a slot.");
      return;
    }
    try {
      // Redirect to payment page with selected slot
      navigate(`/user/payment/${selectedSlot._id}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {doctor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <img
              className="w-48 h-48 rounded-full mx-auto"
              src={doctor.profilePicture || "/default-avatar.png"}
              alt={doctor.name}
            />
            <h2 className="text-2xl font-semibold text-center mt-4">
              {doctor.name}
            </h2>
            <p className="text-gray-500 text-center">
              Experience: {doctor.experience} years
            </p>
            <p className="text-gray-500 text-center">
              Rating: {doctor.starRating} / 5
            </p>
            <p className="text-gray-500 text-center">
              Department: {doctor?.department?.name}
            </p>
          </Card>
          <div>
            <h3 className="text-xl font-semibold mb-4">Available Slots</h3>
            <div className="space-y-4">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className={`border p-4 rounded-lg cursor-pointer ${
                    selectedSlot?._id === slot._id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleSlotSelection(slot)}
                >
                  <p className="text-gray-800">
                    Date: {new Date(slot.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-800">
                    Time: {slot.startTime} - {slot.endTime}
                  </p>
                  <p className="text-gray-800">Price: ₹{slot.price}</p>
                </div>
              ))}
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
    </div>
  );
};

export default DoctorDetails;
