import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";
import api from "../../api/renderApi.js";

const PaymentPage = () => {
  const { slotId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await api.post(`/api/users/book-slot/${slotId}`);
        const { orderId, amount, currency, key_id } = response.data;

        // Log the response data for debugging
        // console.log("Response data :", response.data);

        const options = {
          key: key_id,
          amount: amount,
          currency: currency,
          name: "MedDoc",
          description: "Book Appointment",
          order_id: orderId,
          handler: async (response) => {
            try {
              // Log the response from Razorpay for debugging
              console.log("Razorpay response:", response);

              const paymentResponse = await api.post(
                "/api/users/verify-payment",
                {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }
              );

              // Log payment verification response
              console.log(
                "Payment verification response:",
                paymentResponse.data
              );

              setModalMessage("Payment successful and appointment booked");
              setShowModal(true);

              // // Redirect to booked consultation page after 2 seconds
              setTimeout(() => {
                navigate("/dashboard?tab=appointments");
              }, 2000);
            } catch (error) {
              console.error("Payment verification failed:", error);
              setModalMessage("Transaction Failed try again later");
              setShowModal(true);
              setErrorMessage(
                error.response &&
                  error.response.data &&
                  error.response.data.message
                  ? error.response.data.message
                  : "Payment verification failed. Please try again."
              );
            }
          },
          modal: {
            ondismiss: () => {
              // Handle payment cancellation or when the payment window is closed
              console.log("Payment cancelled or closed by the user.");
              setErrorMessage(
                "Payment was canceled or closed. Please try again."
              );
              setTimeout(() => {
                navigate("/user/doctors-list"); // Redirect to appointments tab
              }, 2000);
            },
          },
          theme: {
            color: "#3399cc",
          },
        };

        // console.log("Razorpay options:", options);

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error("Error initializing payment:", error);
        setErrorMessage(
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error initializing payment"
        );
      }
    };

    initializePayment();
  }, [slotId]);

  const handleModalClose = () => {
    navigate("/dashboard?tab=appointments"); // Redirect to appointments tab
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center">
        Processing Payment...
      </h2>
      {errorMessage && (
        <div className="text-red-500 text-center mt-4">{errorMessage}</div>
      )}
      <ConfirmationModal
        showModal={showModal}
        onClose={handleModalClose}
        message={modalMessage}
      />
    </div>
  );
};

export default PaymentPage;
