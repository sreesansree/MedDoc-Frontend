import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SlotList = () => {
  const { currentDoctor } = useSelector((state) => state.doctor);
  // console.log(currentDoctor._id, "iddddddd"); 
  const [slots, setSlots] = useState([]);
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        // Fetch the slots for the specified doctor
        const response = await axios.get(`/api/doctor/slots/${currentDoctor._id}`);
        console.log(response.data)
        setSlots(response.data);
      } catch (error) {
        console.error("Error fetching slots:", error);
        toast.error("Error in fetching slot-list")
      }
    };

    fetchSlots();
  }, [currentDoctor._id]);
// console.log(slots,'slotsss')
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Slots</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.length === 0 ? (
          <p>No slots available.</p>
        ) : (
          slots.map((slot) => (
            <Card key={slot._id} className="p-4">
              <h3 className="text-xl font-semibold">
                {new Date(slot.date).toDateString()}
              </h3>
              <p>
                {slot.startTime} - {slot.endTime}
              </p>
              <p>{slot.isBooked ? "Booked" : "Available"}</p>
            </Card>
          ))
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default SlotList;
