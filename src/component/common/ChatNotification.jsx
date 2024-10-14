import React from "react";
import { useDispatch } from "react-redux";

import { removeNotification } from "../../redux/notification/notificationSlice";

const ChatNotification = ({ notifications }) => {
  const dispatch = useDispatch();

  const handleRemove = (index) => {
    dispatch(removeNotification(index));
  };
  const limitedNotifications = notifications.slice(-8);
  return (
    <div className="overflow-y-auto rounded-md border border-gray-200 p-2">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No new notifications</p>
      ) : (
        limitedNotifications.map((notification, index) => (
          <div key={index} className="border-b border-gray-200 p-2">
            <p className="text-sm flex items-center">
              {/* <strong className="mr-2"> {notification.senderName}</strong> sent you a message:{" "} */}
              <span className="flex-grow">
                {notification.message || "No message"}
              </span>
            </p>
            <p className="text-xs text-gray-400">
              {new Date(notification.date).toLocaleString()}
            </p>
            <button
              className="text-blue-500 text-xs mt-1"
              onClick={() => handleRemove(index)}
            >
              Mark as Read
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatNotification;
