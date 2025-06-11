import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Modal, Button, Textarea, Alert } from "flowbite-react";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  AiOutlineCalendar,
  AiOutlinePlus,
  AiOutlineCheck,
  AiOutlineCloseCircle,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorStats from "./DoctorStats";

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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundStatus, setRefundStatus] = useState(null);
  const [error, setError] = useState(null);
  const [newSlots, setNewSlots] = useState([]);
  const [updateForm, setUpdateForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    price: "",
  });

  const navigate = useNavigate();

  const fetchSlots = async () => {
    try {
      const slotsResponse = await axios.get(
        `/api/doctor/slots/${currentDoctor._id}`,
        { withCredentials: true }
      );
      const now = new Date();
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
          return slotStartDateTime >= now && slot.status !== "completed";
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

      setSlots(validSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Error fetching slot list");
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const response = await axios.post(
        `/api/doctor/doctor-appointments/${selectedSlot._id}/cancel`,
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
        `/api/doctor/reshedule/${selectedSlot._id}`,
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

  const handleCancelClick = (slot) => {
    setSelectedSlot(slot);
    setShowCancelModal(true);
  };
  const handleReschuleClick = (slot) => {
    setSelectedSlot(slot);
    setShowRescheduleModal(true);
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

  // return (
  //   <div className="container mx-auto p-4">
  //     <ToastContainer />
  //     <h2 className="text-2xl font-bold mb-4 flex">
  //       Available Slots
  //     </h2>

  //     {/* Centering the card grid */}
  // <div className="flex justify-center">
  //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  //     {slots.length === 0 ? (
  //       <p>No slots available.</p>
  //     ) : (
  //       slots.map((slot) => (
  //         <Card
  //           key={slot._id}
  //           className={`p-4 ${
  //             slot.isBooked
  //               ? "border-gray-400 bg-red-200 dark:bg-red-900"
  //               : "bg-white border-blue-500 dark:bg-green-800 "
  //           } border rounded-md shadow-md transition-colors relative`}
  //         >
  //           <h3 className="text-xl font-semibold">
  //             {new Date(slot.date).toDateString()}
  //           </h3>
  //           <p className="flex justify-center">
  //             {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
  //           </p>
  //           <p className="flex justify-center">₹ {slot.price}</p>
  //           <p className={slot.isBooked ? "text-red-600":"text-green-600 dark:text-green-50 shadow-lg flex justify-center"}>{slot.isBooked ? "Slot Booked" : "Available"}</p>
  //           <div className="absolute top-2 right-2 flex gap-2">
  //             <button
  //               onClick={() => handleUpdateClick(slot)}
  //               className="text-blue-500"
  //             >
  //               {slot.isBooked ? "" : <FaEdit />}
  //             </button>
  //             <button
  //               onClick={() => handleDeleteClick(slot)}
  //               className="text-red-500"
  //             >
  //               {slot.isBooked ? "" : <FaTrash />}
  //             </button>
  //           </div>
  //           {slot.isBooked ? (
  //             <>
  //               <Button
  //                 onClick={() => handleReschuleClick(slot)}
  //                 size={"sm"}
  //                 pill
  //                 disabled={slot?.rescheduled}
  //               >
  //                 {slot.rescheduled
  //                   ? "Already Rescheduled"
  //                   : " Reshedule appointment"}
  //               </Button>
  //               <Button
  //                 onClick={() => handleCancelClick(slot)}
  //                 pill
  //                 size={"sm"}
  //               >
  //                 Cancel appointment
  //               </Button>
  //             </>
  //           ) : (
  //             ""
  //           )}
  //         </Card>
  //       ))
  //     )}
  //   </div>
  // </div>

  //     {/* Display refund status after cancellation */}
  //     {refundStatus && (
  //       <p className="mt-4 text-lg">
  //         Refund Status: <strong>{refundStatus}</strong>
  //       </p>
  //     )}

  //     {/* Update Slot Modal */}
  //     <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
  //       <Modal.Header>Update Slot</Modal.Header>
  //       <Modal.Body>
  //         <form>
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">
  //               Date
  //             </label>
  //             <input
  //               type="date"
  //               value={updateForm.date}
  //               onChange={(e) =>
  //                 setUpdateForm({ ...updateForm, date: e.target.value })
  //               }
  //               className="mt-1 block w-full"
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">
  //               Start Time
  //             </label>
  //             <input
  //               type="time"
  //               value={updateForm.startTime}
  //               onChange={(e) =>
  //                 setUpdateForm({ ...updateForm, startTime: e.target.value })
  //               }
  //               className="mt-1 block w-full"
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">
  //               End Time
  //             </label>
  //             <input
  //               type="time"
  //               value={updateForm.endTime}
  //               onChange={(e) =>
  //                 setUpdateForm({ ...updateForm, endTime: e.target.value })
  //               }
  //               className="mt-1 block w-full"
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">
  //               Price
  //             </label>
  //             <input
  //               type="number"
  //               value={updateForm.price}
  //               onChange={(e) =>
  //                 setUpdateForm({ ...updateForm, price: e.target.value })
  //               }
  //               className="mt-1 block w-full"
  //             />
  //           </div>
  //         </form>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button onClick={handleUpdateSubmit}>Update Slot</Button>
  //         <Button onClick={() => setShowUpdateModal(false)}>Cancel</Button>
  //       </Modal.Footer>
  //     </Modal>

  //     {/* Modal for Cancel Reason */}
  //     <Modal show={showCancelModal} onClose={() => setShowCancelModal(false)}>
  //       <Modal.Header>Cancel Appointment</Modal.Header>
  //       <Modal.Body>
  //         <Textarea
  //           placeholder="Reason for cancellation"
  //           value={cancelReason}
  //           onChange={(e) => setCancelReason(e.target.value)}
  //         />
  //         {error && <Alert color="red">{error}</Alert>}
  //       </Modal.Body>
  //       <Modal.Footer>
  //         {slots._id}
  //         <Button onClick={handleCancelAppointment}>Submit</Button>
  //         <Button onClick={() => setShowCancelModal(false)} color="gray">
  //           Cancel
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>

  //     {/* Reschedule modal */}
  //     <Modal
  //       show={showRescheduleModal}
  //       onClose={() => setShowRescheduleModal(false)}
  //     >
  //       <Modal.Header>Reschedule Appointment</Modal.Header>
  //       <Modal.Body>
  //         {/* Display form for creating new slots */}
  //         {newSlots.map((slot, index) => (
  //           <div key={index} className="flex gap-4 mb-4">
  //             <div className="w-1/3">
  //               <label className="block text-sm font-medium text-gray-700">
  //                 Date
  //               </label>
  //               <input
  //                 type="date"
  //                 value={slot.date}
  //                 onChange={(e) => updateSlot(index, "date", e.target.value)}
  //                 className="mt-1 block w-full"
  //               />
  //             </div>
  //             <div className="w-1/3">
  //               <label className="block text-sm font-medium text-gray-700">
  //                 Start Time
  //               </label>
  //               <input
  //                 type="time"
  //                 value={slot.startTime}
  //                 onChange={(e) =>
  //                   updateSlot(index, "startTime", e.target.value)
  //                 }
  //                 className="mt-1 block w-full"
  //               />
  //             </div>
  //             <div className="w-1/3">
  //               <label className="block text-sm font-medium text-gray-700">
  //                 End Time
  //               </label>
  //               <input
  //                 type="time"
  //                 value={slot.endTime}
  //                 onChange={(e) => updateSlot(index, "endTime", e.target.value)}
  //                 className="mt-1 block w-full"
  //               />
  //             </div>
  //           </div>
  //         ))}

  //         {/* Button to add more slots */}
  //         <button
  //           onClick={addNewSlot}
  //           className="bg-blue-500 text-white px-4 py-2 rounded"
  //         >
  //           Add New Slot
  //         </button>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button onClick={handleRescheduleAppointment}>Submit</Button>
  //         <Button onClick={() => setShowRescheduleModal(false)} color={"gray"}>
  //           Cancel
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>

  //     {/* Delete Slot Modal */}
  //     <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
  //       <Modal.Header>Confirm Deletion</Modal.Header>
  //       <Modal.Body>
  //         <p>Are you sure you want to delete this slot?</p>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button onClick={handleDeleteConfirm}>Delete Slot</Button>
  //         <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
  //       </Modal.Footer>
  //     </Modal>
  //   </div>

  // );
  return (
    <div>
      <div className="container mx-auto p-4 max-w-7xl">
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <AiOutlineCalendar className="mr-2 text-blue-600 dark:text-blue-400" />
              Appointment Slots
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage available time slots
            </p>
          </div>
        </div>

        {/* Main Content */}
        {slots.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <AiOutlineCalendar className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No slots available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              There are currently no appointment slots scheduled.
            </p>
            <Button
              color="blue"
              onClick={() => setShowRescheduleModal(true)}
              className="mx-auto"
            >
              Create New Slot
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters/Search (can be added later) */}

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className={`relative rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden ${
                    slot.isBooked
                      ? "border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50/50 to-white dark:from-red-900/20 dark:to-gray-800"
                      : "border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/20 dark:to-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                          {new Date(slot.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          slot.isBooked
                            ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                        }`}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Price
                        </p>
                        <p className="text-xl font-bold text-gray-800 dark:text-white">
                          ₹{slot.price}
                        </p>
                      </div>
                      {!slot.isBooked && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateClick(slot);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label="Edit slot"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(slot);
                            }}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Delete slot"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {slot.isBooked && (
                      <div className="mt-4 flex justify-between space-x-2">
                        <Button
                          onClick={() => handleReschuleClick(slot)}
                          color="blue"
                          size="sm"
                          disabled={slot?.rescheduled}
                          className="flex-1 flex items-center justify-center"
                        >
                          {slot.rescheduled ? (
                            <>
                              <AiOutlineCheckCircle className="mr-1" />
                              Rescheduled
                            </>
                          ) : (
                            "Reschedule"
                          )}
                        </Button>
                        <Button
                          onClick={() => handleCancelClick(slot)}
                          color="red"
                          size="sm"
                          outline
                          className="flex-1 flex items-center justify-center"
                        >
                          <AiOutlineCloseCircle className="mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <DoctorStats slots={slots} />

        {/* All Modals (unchanged from your original) */}
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
            {slots._id}
            <Button onClick={handleCancelAppointment}>Submit</Button>
            <Button onClick={() => setShowCancelModal(false)} color="gray">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

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
                    onChange={(e) =>
                      updateSlot(index, "endTime", e.target.value)
                    }
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
            <Button
              onClick={() => setShowRescheduleModal(false)}
              color={"gray"}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

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

        {/* Refund Status Notification */}
        {refundStatus && (
          <div className="fixed bottom-4 right-4 z-50">
            <Alert
              color={refundStatus.includes("success") ? "green" : "red"}
              onDismiss={() => setRefundStatus(null)}
            >
              Refund Status:{" "}
              <span className="font-semibold">{refundStatus}</span>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotList;
