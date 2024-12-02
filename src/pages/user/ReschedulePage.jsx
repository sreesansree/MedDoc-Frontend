import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RescheduleForm from "../../component/dashboard/RescheduleForm";

const ReschedulePage = () => {
  const { appointmentId } = useParams();
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // Fetch available slots for the given appointment
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(
          `/api/users/reschedule-slots/${appointmentId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log("Available slots : ", response.data);
        setAvailableSlots(response.data);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [appointmentId]);

  return (
    <div className="flex flex-col justify-center items-center m-2 mb-4">
      <h2 className="m-6 font-bold text-lg shadow-sm p-3 text-center shadow-blue-200 rounded-lg">
        Reschedule Appointment
      </h2>
      {availableSlots.length > 0 ? (
        <RescheduleForm
          appointmentId={appointmentId}
          availableSlots={availableSlots}
        />
      ) : (
        <p>No available slots to choose from.</p>
      )}
    </div>
  );
};

export default ReschedulePage;
