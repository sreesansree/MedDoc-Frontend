import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const NotificationComponent = ({ userType, setShowNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { currentDoctor } = useSelector((state) => state.doctor);

  const id = userType === "user" ? currentUser._id : currentDoctor._id;

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { userId: id },
    });

    socket.on("appointmentReminder", (notification) => {
      console.log("Received notification:", notification);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    return () => {
      socket.off("appointmentReminder");
      socket.disconnect();
    };
  }, [id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 w">
      <div className="bg-white rounded-lg shadow-lg w-100 max-h-[80vh] overflow-y-auto">
        <div className="p-3 font-semibold flex justify-between items-cente border-b border-gray-200">
          <span>Notifications</span>
          <button
            onClick={() => setShowNotifications(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>
        <div className="p-3">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="p-3 hover:bg-gray-100 cursor-pointer">
                {notification.message}
              </div>
            ))
          ) : (
            <div className="p-3 mb-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer">No notifications</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;
