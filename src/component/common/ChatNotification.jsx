import React from "react";

export default function ChatNotification({ notifications, removeNotification }) {
  return (
    <div className="p-4 m-2">
      <h3 className="text-lg font-bold">Notifications</h3>
      <ul className="mt-2">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index} className="p-2 border-b flex justify-between">
              <span>{notification.message}</span>
              <button
                className="text-red-500 ml-2 font-bold"
                onClick={() => removeNotification(index)} // Call function correctly
              >
                X
              </button>
            </li>
          ))
        ) : (
          <li className="p-2">No notifications</li>
        )}
      </ul>
    </div>
  );
}
