import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Select, Alert } from "flowbite-react";

const BookSlot = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null); // "success" or "error"

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get("/api/user/slots"); // Fetch available slots
        setSlots(response.data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, []);

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
  };

  const handleBookSlot = async () => {
    try {
      await axios.patch(`/api/users/slots/book/${selectedSlot}`); // Book the selected slot
      setBookingStatus("success");
    } catch (error) {
      console.error("Error booking slot:", error);
      setBookingStatus("error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book a Slot</h2>
      
      {bookingStatus === "success" && (
        <Alert color="success" className="mb-4">
          Slot booked successfully!
        </Alert>
      )}
      {bookingStatus === "error" && (
        <Alert color="failure" className="mb-4">
          Error booking slot. Please try again.
        </Alert>
      )}

      <div className="mb-4">
        <Select
          id="slotSelect"
          value={selectedSlot}
          onChange={handleSlotChange}
          required
          className="w-full"
        >
          <option value="">Select a slot</option>
          {slots.map((slot) => (
            <option key={slot._id} value={slot._id}>
              {new Date(slot.date).toDateString()} - {slot.startTime} to {slot.endTime}
            </option>
          ))}
        </Select>
      </div>

      <Button onClick={handleBookSlot} disabled={!selectedSlot} className="w-full">
        Book Slot
      </Button>
    </div>
  );
};

export default BookSlot;
