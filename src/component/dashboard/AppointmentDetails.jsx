// AppointmentDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Textarea, Alert } from "flowbite-react";
import { formatTime, formatDate } from "../../utils/dateUtils";

const AppointmentDetails = () => {
  const { id } = useParams(); // Appointment ID from the URL
  const [appointment, setAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refundStatus, setRefundStatus] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(`/api/users/user-appointments/${id}`);
        setAppointment(response.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  const handleCancelAppointment = async () => {
    try {
      // /appointments/:id/cancel
      const response = await axios.post(
        `/api/users/user-appointments/${id}/cancel`,
        {
          reason: cancelReason,
        }
      );
      const { refundSuccess } = response.data;
      setRefundStatus(
        refundSuccess ? "Refunded" : "Refund Failed or Not Applicable"
      );

      setShowModal(false);
      navigate("/dashboard?tab=appointments"); // Redirect after successful cancellation
    } catch (error) {
      setError("Error cancelling appointment");
      console.error(error);
    }
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold">Appointment Details</h2>
      <div className="bg-white w-max dark:bg-slate-600 p-6  rounded-lg shadow-md mt-4">
        <div className="flex flex-col justify-center items-center">
          <img
            src={appointment?.doctor?.profilePicture}
            alt={""}
            className="w-16 h-16 rounded-full object-cover"
          />
          <p>
            <strong>Doctor:</strong> Dr. {appointment?.doctor?.name}
          </p>

          <p>
            <strong>Consultation Time:</strong> {formatDate(appointment.date)}{" "}
            {formatTime(appointment.startTime)} -{" "}
            {formatTime(appointment.endTime)}
          </p>

          <Button color="red" pill onClick={() => setShowModal(true)}>
            Cancel Appointment
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
      <Modal show={showModal} onClose={() => setShowModal(false)}>
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
          <Button onClick={() => setShowModal(false)} color="gray">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentDetails;
