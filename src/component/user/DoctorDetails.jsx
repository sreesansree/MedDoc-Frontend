import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card } from "flowbite-react";
import {
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineMedicineBox,
} from "react-icons/ai";
import {
  FaStar,
  FaBriefcase,
  FaUniversity,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { BiClinic } from "react-icons/bi";
import AlertModal from "../dashboard/AlertModal.jsx";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const DoctorDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const [doctorResponse, slotsResponse] = await Promise.all([
          axios.get(`/api/users/doctor/${id}`),
          axios.get(`/api/users/slots/${id}`),
        ]);

        setDoctor(doctorResponse.data);

        const now = new Date();
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
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hours24 = parseInt(hours, 10);
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  };

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    // Check if user is logged in
    if (!currentUser) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "You need to login to book an appointment. Would you like to login now?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, take me to login",
        cancelButtonText: "Cancel",
        background: theme === "dark" ? "#1f2937" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      });

      if (result.isConfirmed) {
        navigate("/signin", { state: { from: `/user/doctor-detail/${id}` } });
      }
      return;
    }
    if (!selectedSlot) {
      await Swal.fire({
        icon: "warning",
        title: "Slot Required",
        text: "Please select a time slot before booking.",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      if (selectedSlot.isBooked) {
        setModalMessage("Slot already booked");
        setShowModal(true);
        return;
      }

      navigate(`/user/payment/${selectedSlot._id}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {doctor && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Doctor Profile Card */}
              <div className="lg:col-span-1">
                <Card className="shadow-lg rounded-xl overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="relative h-80 bg-gray-100 dark:bg-gray-700">
                    <img
                      className="w-full h-full object-cover object-top"
                      src={doctor.profilePicture || "/default-avatar.png"}
                      alt={doctor.name}
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Dr. {doctor.name}
                        </h2>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {doctor?.department?.name || "General Practitioner"}
                        </p>
                      </div>

                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-full">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="ml-1 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          {doctor.averageRating
                            ? `${doctor.averageRating.toFixed(1)}/5`
                            : "4.5/5"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <AiOutlineMedicineBox className="mr-2 text-indigo-600 dark:text-indigo-400" />
                        <span>
                          Specializations:{" "}
                          {doctor?.department?.name || "General Medicine"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaBriefcase className="mr-2 text-indigo-600 dark:text-indigo-400" />
                        <span>
                          {doctor.experience || "10"} years of experience
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaUniversity className="mr-2 text-indigo-600 dark:text-indigo-400" />
                        <span>{doctor.qualification || "MD, MBBS"}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                        Contact Info
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <FaPhone className="mr-2 text-indigo-600 dark:text-indigo-400" />
                          <span>
                            <a href={`tel:${doctor.phone}`}>
                              {doctor.phone || "+91 9876543210"}
                            </a>
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <FaEnvelope className="mr-2 text-indigo-600 dark:text-indigo-400" />
                          <span>{doctor.email || "doctor@example.com"}</span>
                        </div>
                        <div className="flex items-start text-gray-600 dark:text-gray-300">
                          <FaMapMarkerAlt className="mr-2 mt-1 text-indigo-600 dark:text-indigo-400" />
                          <span>
                            {doctor.address ||
                              "123 Medical Center, Health City, 560001"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Doctor Details and Booking */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Doctor Section */}
                <Card>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    About Dr. {doctor.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {doctor.bio ||
                      `Dr. ${doctor.name} is a highly experienced ${
                        doctor?.department?.name || "General Practitioner"
                      } 
                with ${
                  doctor.experience || "10"
                } years of practice. Specializing in ${
                        doctor.specializations?.join(", ") || "general medicine"
                      }, 
                Dr. ${
                  doctor.name.split(" ")[0]
                } is committed to providing the highest quality care to all patients.`}
                  </p>
                </Card>

                {/* Clinic Information */}
                <Card>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    Clinic Information
                  </h3>
                  <div className="flex items-start">
                    <BiClinic className="text-3xl mr-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                        HealthPlus Medical Center
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {doctor.address ||
                          "123 Wellness Street, Bangalore, Karnataka 560001"}
                      </p>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <IoMdTime className="mr-1" />
                        <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Available Slots */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center dark:text-gray-100">
                    <AiOutlineCalendar className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    Available Slots
                  </h3>

                  {slots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {slots.map((slot) => (
                        <div
                          key={slot._id}
                          className={`border rounded-lg transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                            slot.isBooked
                              ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 cursor-not-allowed"
                              : selectedSlot?._id === slot._id
                              ? "border-indigo-300 dark:border-indigo-500 bg-indigo-50 dark:bg-gray-700 ring-2 ring-indigo-200 dark:ring-indigo-800"
                              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-400 cursor-pointer"
                          }`}
                          onClick={() =>
                            !slot.isBooked && handleSlotSelection(slot)
                          }
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium flex gap-4 text-gray-900 dark:text-gray-100">
                                  {/* <FaRegCalendarAlt />  */}
                                  {formatDate(slot.date)}
                                </p>

                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {formatTime(slot.startTime)} -{" "}
                                  {formatTime(slot.endTime)}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  slot.isBooked
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                }`}
                              >
                                {slot.isBooked ? "Booked" : "Available"}
                              </span>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                ₹{slot.price || "500"}
                              </p>
                              {!slot.isBooked &&
                                selectedSlot?._id === slot._id && (
                                  <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                                    <AiOutlineCheckCircle className="mr-1" />{" "}
                                    Selected
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className="text-center py-8">
                      <AiOutlineCalendar className="mx-auto text-3xl text-gray-400 dark:text-gray-500 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No available slots at this time
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Please check back later
                      </p>
                    </Card>
                  )}
                  <Button
                    gradientDuoTone="purpleToBlue"
                    className="mt-6 w-full sm:w-auto"
                    onClick={handleBookAppointment}
                    disabled={!selectedSlot}
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <AlertModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default DoctorDetails;
