import React, { useState } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateSlot = () => {
  const [doctorEmailOrName, setDoctorEmailOrName] = useState(""); // Updated state for doctor's email or name
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/doctor/slots", {
        doctorEmailOrName,
        date,
        startTime,
        endTime,
      });
      console.log("Slot created:", response.data);
      setDoctorEmailOrName("");
      setDate("");
      setStartTime("");
      setEndTime("");
      toast.success("Successfully slot created");
    } catch (error) {
      console.error("Error creating slot:", error);
      toast.error("Error : creating slot");
    }
  };

  return (
    <>
      <Card className="max-w-md mx-auto mt-4 p-4">
        <h2 className="text-2xl font-bold mb-4">Create Slot</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="doctorEmailOrName">Doctor Email or Name</Label>
            <TextInput
              type="text"
              id="doctorEmailOrName"
              value={doctorEmailOrName}
              onChange={(e) => setDoctorEmailOrName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <TextInput
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <TextInput
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <TextInput
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Create Slot</Button>
        </form>
      </Card>
      <ToastContainer />
    </>
  );
};

export default CreateSlot;
