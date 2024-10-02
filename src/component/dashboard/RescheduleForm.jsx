import axios from "axios";
import { Card } from "flowbite-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RescheduleForm = ({ appointmentId, availableSlots }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  // Helper function to convert time to AM/PM format
  const formatTime = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      // alert("please Select a slot.");
      toast.info("Please Select a slot.");
      return;
    }
    try {
      await axios.put(`/api/users/select-slot/${appointmentId}`, {
        selectedSlot,
      });
      toast.success("Appointment resheduled successfully!");
      navigate("/dashboard?tab=appointments");
    } catch (error) {
      console.error("Error rescheduling slot:", error);
      toast.error(error.message);
    }
  };

  return (
    <Card className=" w-full max-w-md p-6 bg-white rounded-lg shadow-md shadow-blue-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 shadow-lg text-center shadow-blue-200">
          Select a New Slot
        </h3>

        {availableSlots.map((slot, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`slot${index}`}
              name="slot"
              value={index}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              onChange={() => setSelectedSlot(slot)}
            />
            <label
              htmlFor={`slot${index}`}
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {slot.date} - {formatTime(slot.startTime)} to{" "}
              {formatTime(slot.endTime)}
            </label>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg "
        >
          Reschedule
        </button>
      </form>
    </Card>
  );
};

export default RescheduleForm;
