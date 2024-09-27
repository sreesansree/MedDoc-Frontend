import React, { useState } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const parseTime = (time) => {
  const [timePart, period] = time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  let hours24 = hours;
  if (period === "PM" && hours !== 12) {
    hours24 += 12;
  } else if (period === "AM" && hours === 12) {
    hours24 = 0;
  }
  return `${hours24.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const fixedTimeSlots = [
  { startTime: "09:00", endTime: "09:30" },
  { startTime: "10:00", endTime: "10:30" },
  { startTime: "11:00", endTime: "11:30" },
  { startTime: "13:00", endTime: "13:30" },
  { startTime: "14:00", endTime: "14:30" },
  { startTime: "15:00", endTime: "15:30" },
  { startTime: "16:00", endTime: "16:30" },
  { startTime: "18:00", endTime: "18:30" },
];

const CreateSlot = () => {
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState(0);
  const [fixedSlot, setFixedSlot] = useState(false);
  const [selectedFixedSlot, setSelectedFixedSlot] = useState("");

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setPrice(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || date < new Date().setHours(0, 0, 0, 0)) {
      toast.error("Date must be today or in the future.");
      return;
    }
    const formattedDate = date.toISOString().split("T")[0];

    try {
      const [fixedStartTime, fixedEndTime] = fixedSlot
        ? selectedFixedSlot.split(" - ")
        : [startTime, endTime];
      console.log(date, " : Date");
      const response = await axios.post("/api/doctor/slots", {
        date,
        startTime: parseTime(fixedStartTime),
        endTime: parseTime(fixedEndTime),
        price,
        fixedSlot,
      });
      
      setDate(null);
      setStartTime("");
      setEndTime("");
      setPrice(0);
      setFixedSlot(false);
      setSelectedFixedSlot("");
      const message = response?.data?.message || "Successfully slot created";
      toast.success(message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      console.error("Error creating slot:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Card className="max-w-lg mx-auto mt-6 mb-6 p-6 shadow-lg border rounded-lg">
        <h2 className="flex justify-center opacity-90 hover:opacity-100 text-2xl font-semibold mb-6">Create a New Slot</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="flex justify-end items-center space-x-4">
            <span className="text-sm font-medium">Fixed Slot</span>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={fixedSlot}
              onChange={(e) => setFixedSlot(e.target.checked)}
            />
          </label>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-lg font-medium">
              Date
            </Label>
            <DatePicker
              id="date"
              selected={date}
              onChange={(date) => setDate(date)}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200 dark:bg-gray-700"
              required
            />
          </div>

          {fixedSlot ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="fixedSlot" className="text-lg font-medium">
                Fixed Time Slot
              </Label>
              <select
                id="fixedSlot"
                value={selectedFixedSlot}
                onChange={(e) => setSelectedFixedSlot(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200 dark:bg-gray-600"
                required
              >
                <option value="">Select a fixed slot</option>
                {fixedTimeSlots.map((slot, index) => (
                  <option
                    key={index}
                    value={`${formatTime(slot.startTime)} - ${formatTime(
                      slot.endTime
                    )}`}
                  >
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="startTime" className="text-lg font-medium">
                  Start Time
                </Label>
                <TextInput
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="endTime" className="text-lg font-medium">
                  End Time
                </Label>
                <TextInput
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="price" className="text-lg font-medium">
              Amount
            </Label>
            <TextInput
              type="number"
              id="price"
              value={price}
              onChange={handlePriceChange}
              className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Create Slot
          </Button>
        </form>
      </Card>
      <ToastContainer />
    </>
  );
};

export default CreateSlot;
