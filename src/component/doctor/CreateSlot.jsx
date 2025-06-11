import { useState } from "react";
import { Button, Label, TextInput, Card, Select } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { HiCalendar, HiClock, HiCash } from "react-icons/hi";

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
  { startTime: "09:00", endTime: "09:30", label: "Morning" },
  { startTime: "10:00", endTime: "10:30", label: "Morning" },
  { startTime: "11:00", endTime: "11:30", label: "Late Morning" },
  { startTime: "13:00", endTime: "13:30", label: "Early Afternoon" },
  { startTime: "14:00", endTime: "14:30", label: "Afternoon" },
  { startTime: "15:00", endTime: "15:30", label: "Afternoon" },
  { startTime: "16:00", endTime: "16:30", label: "Late Afternoon" },
  { startTime: "18:00", endTime: "18:30", label: "Evening" },
];

const groupSlotsByLabel = () => {
  const grouped = {};
  fixedTimeSlots.forEach((slot) => {
    if (!grouped[slot.label]) {
      grouped[slot.label] = [];
    }
    grouped[slot.label].push(slot);
  });
  return grouped;
};

const groupedSlots = groupSlotsByLabel();

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
      toast.error("Please select a valid date (today or future)");
      return;
    }

    const [fixedStartTime, fixedEndTime] = fixedSlot
      ? selectedFixedSlot.split(" - ")
      : [startTime, endTime];

    const startMinutes = parseTime(fixedStartTime);
    const endMinutes = parseTime(fixedEndTime);

    if (endMinutes - startMinutes < 10) {
      toast.error("Time slots must be at least 10 minutes long");
      return;
    }

    try {
      const response = await axios.post(
        "/api/doctor/slots",
        {
          date,
          startTime: parseTime(fixedStartTime),
          endTime: parseTime(fixedEndTime),
          price,
          fixedSlot,
        },
        {
          withCredentials: true,
        }
      );

      setDate(null);
      setStartTime("");
      setEndTime("");
      setPrice(0);
      setFixedSlot(false);
      setSelectedFixedSlot("");
      const message = response?.data?.message || "Slot created successfully";
      toast.success(message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create slot";
      console.error("Error creating slot:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-800 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="rounded-xl shadow-lg border-2 border-dashed">
          <div className="text-center mb-8">
            <h2 className="text-2xl dark:text-gray-400 font-bold text-gray-800">
              Create Appointment Slot
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {fixedSlot
                ? "Select from predefined slots"
                : "Set custom availability"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <Label className="text-gray-700 font-medium">Slot Type</Label>
              <div className="flex items-center">
                <span
                  className={`mr-3 text-sm ${
                    !fixedSlot ? "font-medium text-blue-600" : "text-gray-500"
                  }`}
                >
                  Custom
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={fixedSlot}
                    onChange={(e) => setFixedSlot(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span
                  className={`ml-3 text-sm ${
                    fixedSlot ? "font-medium text-blue-600" : "text-gray-500"
                  }`}
                >
                  Fixed
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date) => setDate(date)}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select a date"
                    className="block w-full pl-10 p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              {fixedSlot ? (
                <div>
                  <Label
                    htmlFor="fixedSlot"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Time Slot
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiClock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Select
                      id="fixedSlot"
                      value={selectedFixedSlot}
                      onChange={(e) => setSelectedFixedSlot(e.target.value)}
                      className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      required
                    >
                      <option value="">Select a time slot</option>
                      {Object.entries(groupedSlots).map(([label, slots]) => (
                        <optgroup label={label} key={label}>
                          {slots.map((slot, index) => (
                            <option
                              key={index}
                              value={`${formatTime(
                                slot.startTime
                              )} - ${formatTime(slot.endTime)}`}
                            >
                              {formatTime(slot.startTime)} -{" "}
                              {formatTime(slot.endTime)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="startTime"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Time
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiClock className="h-5 w-5 text-gray-400" />
                      </div>
                      <TextInput
                        type="time"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="endTime"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Time
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiClock className="h-5 w-5 text-gray-400" />
                      </div>
                      <TextInput
                        type="time"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Consultation Fee
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiCash className="h-5 w-5 text-gray-400" />
                  </div>
                  <TextInput
                    type="number"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                    min="0"
                    step="50"
                    className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              pill
            >
              Create Slot
            </Button>
          </form>
        </Card>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default CreateSlot;
