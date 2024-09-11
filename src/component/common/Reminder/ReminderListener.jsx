import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReminder } from "../../../redux/reminder/reminderSlice.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

const ReminderListener = ({ userType }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentDoctor } = useSelector((state) => state.doctor);

  const dispatch = useDispatch();

  const userID = userType === "user" ? currentUser?._id : currentDoctor?._id;
  const socket = useRef();
  console.log("userId from reminderListner", userID);
  // Listen for the "appointmentReminder" event

  useEffect(() => {
    socket.current = io("http://localhost:5000", { query: { userId: userID } });

    socket.current.on("appointmentReminder", (data) => {
      dispatch(addReminder(data));
      toast.info(data.message, {
        position: "top-right",
        autoClose: 15000, // 15 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    // Clean up the event listener
    return () => {
      socket.current.off("appointmentReminder");
    };
  }, [dispatch, userID]);

  return  <ToastContainer />; // Include ToastContainer to render the toast notifications
};

export default ReminderListener;
