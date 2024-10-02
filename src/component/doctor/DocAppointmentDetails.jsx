import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Textarea, Alert, Label } from "flowbite-react";
import { AiOutlineClose } from "react-icons/ai";
import { formatTime, formatDate } from "../../utils/dateUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { HiOutlineEllipsisVertical } from "react-icons/hi2";

const DocAppointmentDetails = () => {
  const { id } = useParams(); // Appointment ID from the URL
  const [appointment, setAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [refundStatus, setRefundStatus] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newSlots, setNewSlots] = useState([]);
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", instructions: "" },
  ]);

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  // Add more medicine input fields
  const handleAddMoreMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", instructions: "" }]);
  };
  // Remove a specific meidcine input field
  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1); // Remove the medicine at the specific index
    setMedicines(updatedMedicines);
  };

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(
          `/api/doctor/doctor-appointments/${id}`
        );
        setAppointment(response.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  const handleCancelAppointment = async () => {
    try {
      const response = await axios.post(
        `/api/doctor/doctor-appointments/${id}/cancel`,
        {
          reason: cancelReason,
        }
      );
      const { message } = response.data;
      setRefundStatus(
        refundStatus ? "Refunded" : "Refund Failed or Not Applicable"
      );
      toast.success(message);
      setShowCancelModal(false);
      navigate("/doctor/dashboard?tab=appointments");
    } catch (error) {
      setError("Error cancelling appointment");
      console.error(error);
    }
  };

  const handleCompleteConsultation = async () => {
    try {
      const response = await axios.post(
        `/api/doctor/doctor-appointments//${id}/complete`,
        {
          medicines,
          notes,
        }
      );
      const { message } = response.data;
      toast.success(message);
      setShowCompleteModal(false);
      navigate("/doctor/dashboard?tab=appointments");
    } catch (error) {
      setError("Error completing consultation");
      console.error(error);
    }
  };
  // Add new Slot to the array
  const addNewSlot = () => {
    setNewSlots([...newSlots, { date: "", startTime: "", endTime: "" }]);
  };
  // Update a specific slot in the array
  const updateSlot = (index, key, value) => {
    const updatedSlots = newSlots.map((slot, idx) =>
      idx === index ? { ...slot, [key]: value } : slot
    );
    setNewSlots(updatedSlots);
  };

  const handleRescheduleAppointment = async () => {
    try {
      const response = await axios.post(
        `/api/doctor/reshedule/${appointment._id}`,
        { newSlots }
      );
      const { message } = response.data;
      toast.success(message);
      setShowRescheduleModal(false);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold">Appointment Details</h2>
      <div className="bg-white w-max dark:bg-slate-600 p-6  rounded-lg shadow-md mt-4">
        <div className="flex flex-col justify-center items-center">
          {/* <div className="flex">
            <HiOutlineEllipsisVertical />
          </div> */}
          <img
            src={appointment?.user?.profilePicture}
            alt={""}
            className="w-16 h-16 rounded-full object-cover"
          />
          <p>
            <strong>Patient:</strong> {appointment?.user?.name}
          </p>

          <p>
            <strong>Consultation Time:</strong> {formatDate(appointment.date)}{" "}
            {formatTime(appointment.startTime)} -{" "}
            {formatTime(appointment.endTime)}
          </p>

          <Button
            className="m-2"
            gradientDuoTone="purpleToBlue"
            onClick={() => setShowCompleteModal(true)}
          >
            Complete Consultation
          </Button>
          <Button
            className="m-2"
            color="red"
            pill
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Appointment
          </Button>
          <Button
            color={"yellow"}
            size={"sm"}
            // onClick={() => handleReschuleClick(appointment)}
            onClick={() => setShowRescheduleModal(true)}
            className="m-2"
            pill
            disabled={appointment.rescheduled}
          >
            {appointment?.rescheduled
              ? "Already Rescheduled"
              : "Reschedule Appointment"}
          </Button>

          {/* Display refund status after cancellation */}
          {refundStatus && (
            <p className="mt-4 text-lg">
              Refund Status: <strong>{refundStatus}</strong>
            </p>
          )}

          <Button
            className="mt-2"
            gradientDuoTone="purpleToBlue"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </div>

      {/* Modal for Cancel Reason */}
      <Modal show={showCancelModal} onClose={() => setShowCancelModal(false)}>
        <Modal.Header>Cancel Appointment</Modal.Header>
        <Modal.Body>
          <Textarea
            placeholder="Reason for cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          {error && <Alert color="red">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCancelAppointment}>Submit</Button>
          <Button onClick={() => setShowCancelModal(false)} color="gray">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Completing Consultation */}
      <Modal
        show={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
      >
        <Modal.Header className="bg-yellow-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Prescription
          </h3>
        </Modal.Header>
        <Modal.Body className="bg-yellow-50">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Date
                </label>
                <input
                  type="text"
                  value={formatDate(appointment?.date)}
                  readOnly
                  className="input-text w-full bg-gray-100"
                />
              </div>

              <div className="w-1/2 pl-4">
                <label className="block text-sm font-medium text-gray-700">
                  Doctor's Name
                </label>
                <input
                  type="text"
                  value={`Dr.${appointment?.doctor?.name}`}
                  readOnly
                  className="input-text w-full bg-gray-100"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h4 className="text-lg font-semibold ">Medicine Details</h4>
              {medicines.map((medicine, index) => (
                <div className="flex">
                  <div key={index} className="grid grid-cols-3 gap-4 ">
                    <input
                      type="text"
                      className="input-text m-2"
                      placeholder="Medicine Name"
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="input-text m-2"
                      placeholder="Dosage"
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="input-text m-2"
                      placeholder="Instructions"
                      value={medicine.instructions}
                      onChange={(e) =>
                        handleMedicineChange(
                          index,
                          "instructions",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <button
                    className="mt-2 text-black hover:text-red-700"
                    onClick={() => handleRemoveMedicine(index)}
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </div>
              ))}

              <Button
                className="mt-2"
                color="gray"
                onClick={handleAddMoreMedicine}
              >
                Add More Medicines
              </Button>
            </div>
            <Label>Doctor's Notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-yellow-100 flex justify-end">
          <Button
            className="bg-red-500 text-white px-4 py-2"
            onClick={() => setShowCompleteModal(false)}
          >
            Cancel
          </Button>
          <p
            className="bg-green-500 text-white px-4 py-2 ml-2"
            onClick={handleCompleteConsultation}
          >
            Save
          </p>
        </Modal.Footer>
      </Modal>

      {/* Reschedule modal */}
      <Modal
        show={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
      >
        <Modal.Header>Reschedule Appointment</Modal.Header>
        <Modal.Body>
          {/* Display form for creating new slots */}
          {newSlots.map((slot, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={slot.date}
                  onChange={(e) => updateSlot(index, "date", e.target.value)}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    updateSlot(index, "startTime", e.target.value)
                  }
                  className="mt-1 block w-full"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                  className="mt-1 block w-full"
                />
              </div>
            </div>
          ))}

          {/* Button to add more slots */}
          <button
            onClick={addNewSlot}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add New Slot
          </button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleRescheduleAppointment}>Submit</Button>
          <Button onClick={() => setShowRescheduleModal(false)} color={"gray"}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default DocAppointmentDetails;
