import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Modal, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const hours24 = parseInt(hours, 10);
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
};

const SlotList = () => {
  const { currentDoctor } = useSelector((state) => state.doctor);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    price: "",
  });

  const fetchSlots = async () => {
    try {
      const slotsResponse = await axios.get(
        `/api/doctor/slots/${currentDoctor._id}`,
        { withCredentials: true }
      );
      const now = new Date();
      console.log("Slot REsponse ==>", slotsResponse);
      // Filter and sort slots
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
          return slotStartDateTime >= now;
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

      // Log the sorted slots for debugging
      console.log("Sorted Slots:", validSlots);

      setSlots(validSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Error fetching slot list");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [currentDoctor._id]);

  const handleUpdateClick = (slot) => {
    setSelectedSlot(slot);
    setUpdateForm({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
    });
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (slot) => {
    setSelectedSlot(slot);
    setShowDeleteModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`/api/doctor/slots/${selectedSlot._id}`, updateForm);
      setSlots(
        slots.map((slot) =>
          slot._id === selectedSlot._id ? { ...slot, ...updateForm } : slot
        )
      );
      toast.success("Slot updated successfully");
      setShowUpdateModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/doctor/slots/${selectedSlot._id}`);
      setSlots(slots.filter((slot) => slot._id !== selectedSlot._id));
      toast.success("Slot deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Slots</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {slots.length === 0 ? (
          <p>No slots available.</p>
        ) : (
          slots.map((slot) => (
            <Card
              key={slot._id}
              className={`p-4 ${
                slot.isBooked
                  ? "border-gray-400 bg-red-200 dark:bg-red-900"
                  : "bg-white border-blue-500 dark:bg-green-800"
              } border rounded-md shadow-md transition-colors relative`}
            >
              <h3 className="text-xl font-semibold">
                {new Date(slot.date).toDateString()}
              </h3>
              <p>
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </p>
              <p>₹{slot.price}</p>
              <p>{slot.isBooked ? "Booked" : "Available"}</p>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleUpdateClick(slot)}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteClick(slot)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </Card>
          ))
        )}
        <ToastContainer />
      </div>

      {/* Update Slot Modal */}
      <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <Modal.Header>Update Slot</Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={updateForm.date}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, date: e.target.value })
                }
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={updateForm.startTime}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, startTime: e.target.value })
                }
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                value={updateForm.endTime}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, endTime: e.target.value })
                }
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={updateForm.price}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, price: e.target.value })
                }
                className="mt-1 block w-full"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateSubmit}>Update Slot</Button>
          <Button onClick={() => setShowUpdateModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Slot Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this slot?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDeleteConfirm}>Delete Slot</Button>
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SlotList;
