import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeNotification } from "../../redux/notification/notificationSlice";

const ChatNotification = React.memo(({ notifications, userType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Remove a notification by index
  const handleRemove = (notificationId) => {
    dispatch(removeNotification(notificationId));
  };

  // Navigate to chat based on the user type (doctor or user)
  const handleNavigateToChat = (senderId) => {
    if (userType === "doctor") {
      navigate(`/doctor/chat/${senderId}`);
    } else if (userType === "user") {
      navigate(`/user/chat/${senderId}`);
    } else {
      console.warn("Invalid user type:", userType);
    }
  };

  // Limit notifications to the last 8 notifications
  const limitedNotifications = notifications.slice(-8);

  return (
    <div className="overflow-y-auto rounded-md border border-gray-200 p-2">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No new notifications</p>
      ) : (
        limitedNotifications.map((notification) => (
          <div
            key={notification.id}  // Use a unique identifier for key
            className="border-b border-gray-200 p-2 cursor-pointer"
            onClick={() => handleNavigateToChat(notification?.senderId)} // Navigate on click
          >
            <p className="text-sm flex items-center">
              <span className="flex-grow">
                {notification.message || "No message"}
              </span>
            </p>
            <p className="text-xs text-gray-400">
              {new Date(notification.date).toLocaleString()}
            </p>
            <button
              className="text-blue-500 text-xs mt-1"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click from triggering
                handleRemove(notification.id);  // Use notification's id
              }}
            >
              Mark as Read
            </button>
          </div>
        ))
      )}
    </div>
  );
});

export default ChatNotification;
